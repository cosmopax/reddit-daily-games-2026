import { Devvit, useState, useAsync } from '@devvit/public-api';
import { EpisodeHeader, Theme, Leaderboard, LeaderboardUI, episodeSceneUrl, getTodayEpisode } from 'shared';
import { MemeQueue } from './MemeQueue';

Devvit.configure({
    redditAPI: true,
    http: {
        domains: ['api.replicate.com', 'router.huggingface.co']
    },
    redis: true,
    scheduler: {
        process_queue: async (event, context) => {
            const queue = new MemeQueue(context);
            await queue.processNextJob();
        }
    }
});

// App settings for API keys
Devvit.addSettings([
    {
        name: 'HUGGINGFACE_TOKEN',
        label: 'Hugging Face API Token',
        type: 'string',
        isSecret: false,
    },
    {
        name: 'NEON_IMAGE_MODE',
        label: 'Neon images (data-URI) mode',
        type: 'string',
        isSecret: false,
        helpText: 'Set to "none" if images fail to render on some clients (e.g. iOS).',
        defaultValue: 'data',
    },
]);

Devvit.addMenuItem({
    label: "Open/Create Today's Neon Forge Post",
    location: 'subreddit',
    onPress: async (_event, context) => {
        const episode = await getTodayEpisode(context);
        const subreddit = await context.reddit.getCurrentSubreddit();
        const postKey = `posts:v1:${subreddit.name}:meme-wars:${episode.id}`;
        const existingPostId = await context.redis.get(postKey);
        if (existingPostId) {
            try {
                const post = await context.reddit.getPostById(existingPostId);
                context.ui.navigateTo(post);
                context.ui.showToast("Opened today's post");
                return;
            } catch (e) {
                await context.redis.del(postKey);
            }
        }

        const post = await context.reddit.submitPost({
            title: `${episode.id} // Meme Wars: Neon Forge`,
            subredditName: subreddit.name,
            preview: (
                <vstack height="100%" width="100%" alignment="middle center">
                    <text>Loading NEON FORGE...</text>
                </vstack>
            ),
        });
        await context.redis.set(postKey, post.id);
        context.ui.navigateTo(post);
        context.ui.showToast("Created today's post");
    },
});

Devvit.addCustomPostType({
    name: 'Meme Wars',
    render: (context) => {
        const [caption, setCaption] = useState('');
        const [prompt, setPrompt] = useState('');
        const [status, setStatus] = useState<string>('Idle');
        const queue = new MemeQueue(context);

        const capHash = (episodeId: string) => `memeforge:v1:${episodeId}:data`;
        const capLb = (episodeId: string) => `memeforge:v1:${episodeId}:lb`;
        const capTime = (episodeId: string) => `memeforge:v1:${episodeId}:time`;

	        const { data, loading, refresh } = useAsync(async () => {
	            const episode = await getTodayEpisode(context);
	            // @ts-ignore runtime setting
	            const imgMode = (await context.settings?.get('NEON_IMAGE_MODE')) as string | undefined;
	            const showImage = (imgMode || 'data') !== 'none';

	            const captionIds = await context.redis.zRange(capLb(episode.id), 0, 9, { by: 'rank', reverse: true });
	            const captionPostsRaw = captionIds?.length
	                ? await context.redis.hMGet(capHash(episode.id), captionIds.map((id) => id.member))
	                : [];
	            const captions = (captionPostsRaw || []).filter(Boolean).map((p) => JSON.parse(p!));

	            const newestIds = await context.redis.zRange(capTime(episode.id), 0, 2, { by: 'rank', reverse: true });
	            const newestRaw = newestIds?.length
	                ? await context.redis.hMGet(capHash(episode.id), newestIds.map((id) => id.member))
	                : [];
	            const newestCaptions = (newestRaw || []).filter(Boolean).map((p) => JSON.parse(p!));

            const aiIds = await context.redis.zRange('meme:leaderboard', 0, 9, { by: 'rank', reverse: true });
            const aiPostsRaw = aiIds?.length ? await context.redis.hMGet('meme:data', aiIds.map((id) => id.member)) : [];
            const aiPosts = (aiPostsRaw || []).filter(Boolean).map((p) => JSON.parse(p!));

            let hasHf = false;
            try {
                // @ts-ignore Devvit runtime setting
                const hf = await context.settings?.get('HUGGINGFACE_TOKEN');
                hasHf = typeof hf === 'string' && hf.trim().length > 0;
            } catch { }

	            return { episode, captions, newestCaptions, aiPosts, hasHf, showImage };
	        });

        const onVote = async (memeId: string, delta: number) => {
            if (!data?.episode) return;
            const episodeId = data.episode.id;
            const voter = context.userId || 'anon';

            // Caption battle vote first
            const existing = await context.redis.hGet(capHash(episodeId), memeId);
            if (existing) {
                const voteKey = `memeforge:v1:${episodeId}:vote:${memeId}:${voter}`;
                const already = await context.redis.get(voteKey);
                if (already) {
                    context.ui.showToast('Already voted today.');
                    return;
                }
                await context.redis.zIncrBy(capLb(episodeId), memeId, delta);
                const parsed = JSON.parse(existing);
                parsed.votes = (parsed.votes || 0) + delta;
                await context.redis.hSet(capHash(episodeId), { [memeId]: JSON.stringify(parsed) });
                await context.redis.set(voteKey, String(delta));
                console.log(`[memeforge] vote_caption user=${voter} ep=${episodeId} caption=${memeId} delta=${delta}`);
                await refresh();
                return;
            }

            // AI meme vote (legacy)
            const aiVoteKey = `meme:v1:vote:${memeId}:${voter}`;
            const aiAlready = await context.redis.get(aiVoteKey);
            if (aiAlready) {
                context.ui.showToast('Already voted.');
                return;
            }
            await context.redis.zIncrBy('meme:leaderboard', memeId, delta);
            const raw = await context.redis.hGet('meme:data', memeId);
            if (raw) {
                const parsed = JSON.parse(raw);
                parsed.votes = (parsed.votes || 0) + delta;
                await context.redis.hSet('meme:data', { [memeId]: JSON.stringify(parsed) });
                const authorId = parsed.userId;
                if (authorId) {
                    const authorScoreKey = `user:${authorId}:meme_score`;
                    const newScore = await context.redis.incrBy(authorScoreKey, delta);
                    const lb = new Leaderboard(context, 'game3_meme');
                    let username = 'Meme Artist';
                    try {
                        const u = await context.reddit.getUserById(authorId);
                        if (u) username = u.username;
                    } catch { }
                    await lb.submitScore(authorId, username, newScore);
                }
            }
            await context.redis.set(aiVoteKey, String(delta));
            console.log(`[memeforge] vote_ai user=${voter} meme=${memeId} delta=${delta}`);
            await refresh();
        };

        const onSubmitCaption = async () => {
            if (!data?.episode) return;
            const episodeId = data.episode.id;
            if (!caption.trim()) return;

            const id = Math.random().toString(36).slice(2);
            const post = {
                id,
                userId: context.userId || 'anon',
                caption: caption.trim(),
                votes: 0,
                timestamp: Date.now(),
            };
            await context.redis.hSet(capHash(episodeId), { [id]: JSON.stringify(post) });
            await context.redis.zAdd(capLb(episodeId), { member: id, score: 0 });
            await context.redis.zAdd(capTime(episodeId), { member: id, score: post.timestamp });
            setCaption('');
            context.ui.showToast('Caption submitted.');
            console.log(`[memeforge] submit_caption user=${post.userId} ep=${episodeId} caption=${id}`);
            await refresh();
        };

        const onSubmitAi = async () => {
            if (!prompt) return;
            setStatus('Queueing...');
            const jobId = await queue.enqueueJob(context.userId || 'anon', prompt);
            setStatus(`Queued. ID: ${jobId} (refresh in a few seconds)`);
            setPrompt('');
            console.log(`[memeforge] queue_ai user=${context.userId || 'anon'} job=${jobId}`);
        };

        const [showLeaderboard, setShowLeaderboard] = useState(false);
        const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
        const [lbLoading, setLbLoading] = useState(false);

        const loadLeaderboard = async () => {
            setLbLoading(true);
            const lb = new Leaderboard(context, 'game3_meme');
            const data = await lb.getTop(10);
            setLeaderboardData(data);
            setLbLoading(false);
        };

        if (showLeaderboard) {
            return (
                <LeaderboardUI
                    title="MEME LORDS"
                    entries={leaderboardData}
                    isLoading={lbLoading}
                    onRefresh={loadLeaderboard}
                    onClose={() => setShowLeaderboard(false)}
                />
            );
        }

        if (loading || !data) {
            return (
                <vstack height="100%" width="100%" alignment="center middle" backgroundColor={Theme.colors.background}>
                    <text>Loading Neon Forge...</text>
                </vstack>
            );
        }

        const sceneUrl = episodeSceneUrl(data.episode, 'NEON FORGE');
        const showImage = (data as any).showImage as boolean | undefined;

        return (
            <vstack height="100%" width="100%" backgroundColor={Theme.colors.background} padding="medium">
                <EpisodeHeader
                    episode={data.episode}
                    title="MEME WARS: NEON FORGE"
                    subtitle="Keyless caption battles. Keys enhance image generation."
                    showImage={showImage}
                    rightActionLabel="🏆 Top Artists"
                    onRightAction={() => { setShowLeaderboard(true); loadLeaderboard(); }}
                />

                <spacer size="medium" />

                <vstack padding="medium" cornerRadius="medium" backgroundColor={Theme.colors.surface} border="thin" borderColor={Theme.colors.surfaceHighlight} gap="small">
                    <text color={Theme.colors.text} weight="bold">Caption Battle (always works)</text>
                    {showImage ? <image url={sceneUrl} imageHeight={160} imageWidth={280} resizeMode="cover" /> : null}
                    <textfield placeholder='Drop a caption (short, punchy)...' onChange={(v) => setCaption(v)} />
                    <button onPress={onSubmitCaption} appearance="primary" disabled={!caption.trim()}>
                        Submit Caption
                    </button>
                    <text size="small" color={Theme.colors.textDim}>
                        Share: {data.episode.id} | votes decide the canon.
                    </text>
                </vstack>

                <spacer size="medium" />

                <vstack padding="medium" cornerRadius="medium" backgroundColor={Theme.colors.surface} grow gap="small">
                    <hstack alignment="space-between middle">
                        <text color={Theme.colors.gold} weight="bold">Top Captions</text>
                        <button appearance="plain" size="small" onPress={() => refresh()}>🔄</button>
                    </hstack>

                    {(data.captions && data.captions.length > 0) ? (
                        data.captions.slice(0, 5).map((p: any) => (
                            <vstack key={p.id} backgroundColor={Theme.colors.background} padding="small" cornerRadius="small" border="thin" borderColor={Theme.colors.surfaceHighlight} gap="small">
                                <text size="medium" weight="bold" color={Theme.colors.text} wrap>{p.caption}</text>
                                <hstack alignment="center middle" gap="medium">
                                    <button appearance="plain" size="small" onPress={() => onVote(p.id, 1)}>⬆️</button>
                                    <text color={Theme.colors.gold} weight="bold">{p.votes || 0}</text>
                                    <button appearance="plain" size="small" onPress={() => onVote(p.id, -1)}>⬇️</button>
                                </hstack>
                            </vstack>
                        ))
                    ) : (
                        <vstack alignment="center middle" grow>
                            <text color={Theme.colors.textDim}>No captions yet. Be the first.</text>
                        </vstack>
                    )}
                </vstack>

                <spacer size="small" />

                <vstack padding="medium" cornerRadius="medium" backgroundColor={Theme.colors.surface} border="thin" borderColor={Theme.colors.surfaceHighlight} gap="small">
                    <text color={Theme.colors.text} weight="bold">Newest Captions</text>
                    {(data.newestCaptions && data.newestCaptions.length > 0) ? (
                        data.newestCaptions.slice(0, 3).map((p: any) => (
                            <vstack key={`new_${p.id}`} backgroundColor={Theme.colors.background} padding="small" cornerRadius="small" border="thin" borderColor={Theme.colors.surfaceHighlight} gap="small">
                                <text size="small" color={Theme.colors.text} wrap>{p.caption}</text>
                            </vstack>
                        ))
                    ) : (
                        <text size="small" color={Theme.colors.textDim}>Submit one to start the feed.</text>
                    )}
                </vstack>

                <spacer size="medium" />

                <vstack padding="medium" cornerRadius="medium" backgroundColor={Theme.colors.surface} border="thin" borderColor={Theme.colors.surfaceHighlight} gap="small">
                    <text color={Theme.colors.text} weight="bold">AI Image Forge (optional)</text>
                    {!data.hasHf ? (
                        <text size="small" color={Theme.colors.textDim}>
                            No token configured. Caption mode is the primary game.
                        </text>
                    ) : null}
                    <hstack>
                        <textfield placeholder="A neon cat in a trenchcoat..." onChange={(v) => setPrompt(v)} />
                        <button onPress={onSubmitAi} appearance="secondary" disabled={!prompt.trim()}>Queue</button>
                    </hstack>
                    <text color={Theme.colors.secondary} size="small">{status}</text>
                    {(data.aiPosts && data.aiPosts.length > 0) ? (
                        <vstack gap="small">
                            {data.aiPosts.slice(0, 2).map((meme: any) => (
                                <vstack key={meme.id} backgroundColor={Theme.colors.background} padding="small" cornerRadius="small" border="thin" borderColor={Theme.colors.surfaceHighlight} alignment="center middle" gap="small">
                                    {showImage ? <image url={meme.url} imageHeight={160} imageWidth={160} resizeMode="cover" /> : null}
                                    <text size="small" color={Theme.colors.textDim} wrap>{meme.prompt}</text>
                                    <hstack alignment="center middle" gap="medium">
                                        <button appearance="plain" size="small" onPress={() => onVote(meme.id, 1)}>⬆️</button>
                                        <text color={Theme.colors.gold} weight="bold">{meme.votes || 0}</text>
                                        <button appearance="plain" size="small" onPress={() => onVote(meme.id, -1)}>⬇️</button>
                                    </hstack>
                                </vstack>
                            ))}
                        </vstack>
                    ) : null}
                </vstack>

                {/* Brand Footer */}
                <hstack alignment="center middle" padding="small">
                    <text size="small" color={Theme.colors.textDim}>{Theme.brand.footer}</text>
                </hstack>
            </vstack>
        );
    },
});

export default Devvit;
