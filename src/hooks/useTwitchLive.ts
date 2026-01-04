import { useState, useEffect } from 'react';

interface TwitchLiveStatus {
  [username: string]: boolean;
}

// Simple mock for Twitch live status
// In production, you would call the Twitch API via an edge function
export const useTwitchLive = (usernames: string[]) => {
  const [liveStatus, setLiveStatus] = useState<TwitchLiveStatus>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock implementation - randomly sets some channels as live
    // In production, this would call your backend which checks Twitch API
    const checkLiveStatus = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const status: TwitchLiveStatus = {};
      usernames.forEach(username => {
        // For demo purposes, randomly mark some channels as live
        // In production, replace with actual Twitch API call
        status[username.toLowerCase()] = Math.random() > 0.5;
      });
      
      setLiveStatus(status);
      setIsLoading(false);
    };

    if (usernames.length > 0) {
      checkLiveStatus();
      
      // Poll every 60 seconds
      const interval = setInterval(checkLiveStatus, 60000);
      return () => clearInterval(interval);
    }
  }, [usernames.join(',')]);

  return { liveStatus, isLoading };
};

export default useTwitchLive;
