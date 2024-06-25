import React, { useEffect, useState } from "react";
import "./CommonFollowers.css";

interface CommonFollowersProps {
    userID1: string;
    userID2: string;
}

const CommonFollowers: React.FC<CommonFollowersProps> = ({
    userID1,
    userID2,
}) => {
    const [commonFollowersCount, setCommonFollowersCount] = useState<number>(0);
    const [twitterHandle, setTwitterHandle] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [dataReady, setDataReady] = useState<boolean>(false);

    useEffect(() => {
        const fetchTwitterHandle = async () => {
            try {
                const response = await fetch("/api/get-twitter-handle", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
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
                setError("Failed to fetch Twitter handle");
            }
        };

        fetchTwitterHandle();
    }, [userID2]);

    useEffect(() => {
        const checkDataInRedis = async () => {
            try {
                const response = await fetch("/api/check-user-in-redis", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ uuid: userID1 }),
                });

                const data = await response.json();
                if (response.ok && data.message.includes("Data exists")) {
                    setDataReady(true);
                } else {
                    setDataReady(false);
                }
            } catch (error) {
                setError("Failed to check data in Redis");
            }
        };

        checkDataInRedis();
    }, [userID1]);

    useEffect(() => {
        if (dataReady) {
            const fetchCommonFollowersCount = async () => {
                try {
                    const response = await fetch(
                        "/api/compute-follow-intersection",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ userID1, userID2 }),
                        }
                    );

                    const data = await response.json();
                    if (response.ok) {
                        setCommonFollowersCount(data.count);
                    } else {
                        setError(data.message);
                    }
                } catch (error) {
                    setError("Failed to fetch common followers");
                }
            };

            fetchCommonFollowersCount();
        }
    }, [userID1, userID2, dataReady]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!dataReady) {
        return null; // Hide the component if data is not ready
    }

    return (
        <div className="common-followers-container">
            <div className="common-followers-text">
                {commonFollowersCount > 0 ? (
                    <a
                        href={`https://x.com/${twitterHandle}/followers_you_follow`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline-text"
                    >
                        Followed by {commonFollowersCount} people you know
                    </a>
                ) : (
                    "Not followed by anyone you're following"
                )}
            </div>
        </div>
    );
};

export default CommonFollowers;
