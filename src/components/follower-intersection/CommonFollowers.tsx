import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import './CommonFollowers.css';

interface CommonFollowersProps {
  userID1: string;
  userID2: string;
}

interface Follower {
  screen_name: string;
  profile_image_url: string;
}

const CommonFollowers: React.FC<CommonFollowersProps> = ({ userID1, userID2 }) => {
  const [commonFollowers, setCommonFollowers] = useState<Follower[]>([]);
  const [twitterHandle, setTwitterHandle] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommonFollowers = async () => {
      try {
        const response = await fetch('/api/compute-follow-intersection', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userID1, userID2 }),
        });

        const data = await response.json();
        if (response.ok) {
          setCommonFollowers(data.intersectionDetails);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError('Failed to fetch common followers');
      }
    };

    fetchCommonFollowers();
  }, [userID1, userID2]);

  useEffect(() => {
    const fetchTwitterHandle = async () => {
      try {
        const response = await fetch('/api/get-twitter-handle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userID: userID2 }),
        });

        const data = await response.json();
        if (response.ok) {
          setTwitterHandle(data.twitterHandle);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError('Failed to fetch Twitter handle');
      }
    };

    fetchTwitterHandle();
  }, [userID2]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="common-followers-container">
      <div className="common-followers-avatars">
        {commonFollowers.slice(0, 2).map((follower, index) => (
          <Image key={index} src={follower.profile_image_url} alt={follower.screen_name} className="follower-avatar" width={30} height={30} />
        ))}
      </div>
      <div className="common-followers-text">
        {commonFollowers.length > 0 ? (
          <a href={`https://x.com/${twitterHandle}/followers_you_follow`} target="_blank" rel="noopener noreferrer">
            Followed by {commonFollowers.length} people you know
          </a>
        ) : (
          "Not followed by anyone you're following"
        )}
      </div>
    </div>
  );
};

export default CommonFollowers;
