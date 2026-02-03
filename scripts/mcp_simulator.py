import sys
import time
import random
import threading
import json
# Basic MCP implementation over stdio or using a library if available.
# For this script we will simulate the behavior and print logs.

def simulate_traffic(game_id, user_count, duration):
    print(f"Starting simulation for {game_id} with {user_count} users for {duration}s")
    
    # Mock Redis State
    redis_mock = {}
    lock = threading.Lock()
    
    def user_behavior(uid):
        end_time = time.time() + duration
        while time.time() < end_time:
            action = random.choice(["vote", "buy", "move"])
            with lock:
                if game_id not in redis_mock:
                    redis_mock[game_id] = 0
                redis_mock[game_id] += 1
            time.sleep(random.uniform(0.1, 1.0))
            
    threads = []
    for i in range(min(user_count, 100)): # Cap threads for local python sim
        t = threading.Thread(target=user_behavior, args=(i,))
        t.start()
        threads.append(t)
        
    for t in threads:
        t.join()
        
    print(f"Simulation Complete. Total Actions: {redis_mock.get(game_id, 0)}")
    return {"status": "success", "actions": redis_mock.get(game_id, 0)}

if __name__ == "__main__":
    # fastmcp logic or simple arg parsing
    if len(sys.argv) > 1:
        cmd = sys.argv[1]
        if cmd == "simulate":
            simulate_traffic("game_test", int(sys.argv[2]), int(sys.argv[3]))
