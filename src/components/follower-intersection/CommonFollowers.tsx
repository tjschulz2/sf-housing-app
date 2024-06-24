import React, { useEffect, useState } from 'react';
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
    return <div className="common-followers-text not-followed">{error}</div>;
  }

  return (
    <div className="common-followers-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="common-followers-avatars">
        {commonFollowers.slice(0, 2).map((follower, index) => (
          <img key={index} src={follower.profile_image_url} alt={follower.screen_name} className="follower-avatar" />
        ))}
      </div>
      <div className={`common-followers-text ${commonFollowers.length === 0 ? 'not-followed' : ''}`}>
        {commonFollowers.length > 0 ? (
          <>
            Followed by {commonFollowers.length} people you know
          </>
        ) : (
          "Not followed by anyone you're following"
        )}
      </div>
      {isHovered && commonFollowers.length > 0 && (
        <div className="common-followers-hover-list">
          {commonFollowers.map((follower, index) => (
            <a key={index} href={`https://x.com/${follower.screen_name}`} target="_blank" rel="noopener noreferrer" className="follower-handle">
              @{follower.screen_name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommonFollowers;
