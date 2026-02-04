# triggers

Source: https://developers.reddit.com/docs/capabilities/server/triggers

On this page

Triggers allow your app to automatically respond to specific events or actions within a Reddit community. Use triggers to build automation, moderation, and engagement features that react to user or moderator activity.

## What are triggers?​

A trigger is an action you can build into your app that will occur automatically when a specified condition is met. For example, you can set up a trigger to respond when a new post is submitted, a comment is created, or a moderator takes action.

## Supported trigger types​

Event triggers let your app automatically respond to a user's or moderator's action. The following trigger types are supported:

  * `onPostSubmit`
  * `onPostCreate`
  * `onPostUpdate`
  * `onPostReport`
  * `onPostDelete`
  * `onPostFlairUpdate`
  * `onCommentCreate`
  * `onCommentDelete`
  * `onCommentReport`
  * `onCommentSubmit`
  * `onCommentUpdate`
  * `onPostNsfwUpdate`
  * `onPostSpoilerUpdate`
  * `onAppInstall`
  * `onAppUpgrade`
  * `onModActions`
  * `onModMail`
  * `onAutomoderatorFilterPost`
  * `onAutomoderatorFilterComment`

A full list of events and their payloads can be found in the [EventTypes documentation](/docs/api/public-api/@devvit/namespaces/EventTypes). For more details on Mod specific actions, see [ModActions](/docs/api/redditapi/models/interfaces/ModAction) and [ModMail](/docs/api/public-api/type-aliases/ModMailDefinition).

## Setting up triggers​

### 1\. Add triggers and endpoints to `devvit.json`​

  * Devvit Web
  * Devvit Blocks / Mod Tools

Declare the triggers and their corresponding endpoints in your `devvit.json`:
    
    
    "triggers": {  
      "onAppUpgrade": "/internal/on-app-upgrade",  
      "onCommentCreate": "/internal/on-comment-create",  
      "onPostSubmit": "/internal/on-post-submit"  
    }  
    

Declare the triggers in your `devvit.json`:
    
    
    {  
      "name": "your-app-name",  
      "blocks": {  
        "entry": "src/main.tsx",  
        "triggers": ["onPostCreate"]  
      }  
    }  
    

### 2\. Handle trigger events in your server logic​

  * Devvit Web
  * Devvit Blocks / Mod Tools

Listen for the events in your server and access the data passed into the request:

server/index.ts
    
    
      const router = express.Router();  
      
      // ..  
      
      router.post('/internal/on-app-upgrade', async (req, res) => {  
        console.log(`Handle event for on-app-upgrade!`);  
        const installer = req.body.installer;  
        console.log('Installer:', JSON.stringify(installer, null, 2));  
        res.status(200).json({ status: 'ok' });  
      });  
      
      router.post('/internal/on-comment-create', async (req, res) => {  
        console.log(`Handle event for on-comment-create!`);  
        const comment = req.body.comment;  
        const author = req.body.author;  
        console.log('Comment:', JSON.stringify(comment, null, 2));  
        console.log('Author:', JSON.stringify(author, null, 2));  
        res.status(200).json({ status: 'ok' });  
      });  
      
      router.post('/internal/on-post-submit', async (req, res) => {  
        console.log(`Handle event for on-post-submit!`);  
        const post = req.body.post;  
        const author = req.body.author;  
        console.log('Post:', JSON.stringify(post, null, 2));  
        console.log('Author:', JSON.stringify(author, null, 2));  
        res.status(200).json({ status: 'ok' });  
      });  
    

Handle trigger events in your main file. Example (`src/main.tsx`):
    
    
    import { Devvit } from '@devvit/public-api';  
      
    // Handling a PostSubmit event  
    Devvit.addTrigger({  
      event: 'PostSubmit', // Event name from above  
      onEvent: async (event) => {  
        console.log(`Received OnPostSubmit event:\n${JSON.stringify(event)}`);  
      },  
    });  
      
    // Handling multiple events: PostUpdate and PostReport  
    Devvit.addTrigger({  
      events: ['PostUpdate', 'PostReport'], // An array of events  
      onEvent: async (event) => {  
        if (event.type == 'PostUpdate') {  
          console.log(`Received OnPostUpdate event:\n${JSON.stringify(request)}`);  
        } else if (event.type === 'PostReport') {  
          console.log(`Received OnPostReport event:\n${JSON.stringify(request)}`);  
        }  
      },  
    });  
      
    export default Devvit;  
    

## Best practices​

  * Avoid creating recursive triggers that could cause infinite loops or crashes (for example, a comment trigger that creates a comment).
  * Always check the event payload to ensure your app is not the source of the event before taking action.
  * Review the [EventTypes documentation](/docs/api/public-api/@devvit/namespaces/EventTypes) for details on event payloads.

  * What are triggers?
  * Supported trigger types
  * Setting up triggers
    * 1\. Add triggers and endpoints to `devvit.json`
    * 2\. Handle trigger events in your server logic
  * Best practices