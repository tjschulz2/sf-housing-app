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
  const [isHovered, setIsHovered] = useState(false);
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

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="common-followers-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="common-followers-avatars">
        {commonFollowers.slice(0, 2).map((follower, index) => (
          <Image key={index} src={follower.profile_image_url} alt={follower.screen_name} className="follower-avatar" width={50} height={50} />
        ))}
      </div>
      <div className="common-followers-text">
        {commonFollowers.length > 0 ? (
          <a href={`https://x.com/${commonFollowers[0].screen_name}/followers_you_follow`} target="_blank" rel="noopener noreferrer">
            Followed by {commonFollowers.length} people you know
          </a>
        ) : (
          "Not followed by anyone you're following"
        )}
      </div>
      {isHovered && commonFollowers.length > 0 && (
        <div className="common-followers-hover-list">
          {commonFollowers.map((follower, index) => (
            <a key={index} href={`https://x.com/${follower.screen_name}`} target="_blank" rel="noopener noreferrer">
              <div className="follower-handle">@{follower.screen_name}</div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommonFollowers;
