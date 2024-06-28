// import React, { useEffect, useState } from "react";
// import "./CommonFollowers.css";

// interface CommonFollowersProps {
//   userID1: string;
//   userID2: string;
// }

// const CommonFollowers: React.FC<CommonFollowersProps> = ({ userID1, userID2 }) => {
//   const [commonFollowersCount, setCommonFollowersCount] = useState<number>(0);
//   const [twitterHandle, setTwitterHandle] = useState<string | null>(null);
//   const [visible, setVisible] = useState<boolean>(true);

//   useEffect(() => {
//     const fetchTwitterHandle = async () => {
//       try {
//         const response = await fetch("/api/get-twitter-handle", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ userID: userID2 }),
//         });

//         const data = await response.json();
//         if (response.ok) {
//           setTwitterHandle(data.twitterHandle);
//         } else {
//           throw new Error(data.message);
//         }
//       } catch (error) {
//         setVisible(false); // Hide component if there's an error
//       }
//     };

//     fetchTwitterHandle();
//   }, [userID2]);

//   useEffect(() => {
//     const fetchCommonFollowersCount = async () => {
//       try {
//         const response = await fetch("/api/compute-follow-intersection", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ userID1, userID2 }),
//         });

//         const data = await response.json();
//         if (response.ok) {
//           setCommonFollowersCount(data.count);
//         } else {
//           throw new Error(data.message);
//         }
//       } catch (error) {
//         setVisible(false); // Hide component if there's an error
//       }
//     };

//     fetchCommonFollowersCount();
//   }, [userID1, userID2]);

//   if (!visible) {
//     return null; // Do not render the component if it's not visible
//   }

//   return (
//     <div className="common-followers-container">
//       <div className="common-followers-text">
//         {commonFollowersCount > 0 ? (
//           <a
//             href={`https://x.com/${twitterHandle}/followers_you_follow`}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="underline-text"
//           >
//             Followed by {commonFollowersCount} people you know
//           </a>
//         ) : (
//           "Not followed by anyone you're following"
//         )}
//       </div>
//     </div>
//   );
// };

// export default CommonFollowers;



///////////////////////////////////////////////////////////////////////////////////////

import React, { useEffect, useState } from "react";
import "./CommonFollowers.css";

interface CommonFollowersProps {
  userID1: string;
  userID2: string;
}

const CommonFollowers: React.FC<CommonFollowersProps> = ({ userID1, userID2 }) => {
  const [commonFollowersCount, setCommonFollowersCount] = useState<number>(0);
  const [twitterHandle, setTwitterHandle] = useState<string | null>(null);
  const [visible, setVisible] = useState<boolean>(true);

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
          throw new Error(data.message);
        }
      } catch (error) {
        setVisible(false); // Hide component if there's an error
      }
    };

    fetchTwitterHandle();
  }, [userID2]);

  useEffect(() => {
    const fetchCommonFollowersCount = async () => {
      console.log("userID1: ", userID1);
      console.log("userID2: ", userID2);
      try {
        const response = await fetch("/api/compute-follow-intersection", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userID1, userID2 }),
        });

       

        if (response.status === 404) {
          setVisible(false); // Hide component if there's no intersection data
          return;
        }

        const data = await response.json();
        if (response.ok) {
          setCommonFollowersCount(data.count);
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error("Failed to fetch common followers count:", error);
        setVisible(false); // Hide component if there's an error
      }
    };

    fetchCommonFollowersCount();
  }, [userID1, userID2]);

  if (!visible) {
    return null; // Do not render the component if it's not visible
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








// import React, { useEffect, useState } from "react";
// import "./CommonFollowers.css";
// import { getFollowIntersectionWithCaching } from "@/lib/utils/data";

// interface CommonFollowersProps {
//   userID1: string;
//   userID2: string;
// }

// const CommonFollowers: React.FC<CommonFollowersProps> = ({ userID1, userID2 }) => {
//   const [commonFollowersCount, setCommonFollowersCount] = useState<number | null>(null);
//   const [twitterHandle, setTwitterHandle] = useState<string | null>(null);
//   const [visible, setVisible] = useState<boolean>(true);

//   useEffect(() => {
//     const fetchTwitterHandle = async () => {
//       try {
//         const response = await fetch("/api/get-twitter-handle", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ userID: userID2 }),
//         });

//         const data = await response.json();
//         if (response.ok) {
//           setTwitterHandle(data.twitterHandle);
//         } else {
//           throw new Error(data.message);
//         }
//       } catch (error) {
//         setVisible(false); // Hide component if there's an error
//       }
//     };

//     fetchTwitterHandle();
//   }, [userID2]);

//   useEffect(() => {
//     const fetchCommonFollowersCount = async () => {
//       try {
//         const result = await getFollowIntersectionWithCaching(userID1, userID2);

//         if (result.status === "success") {
//           setCommonFollowersCount(result.intersectionCount ?? 0);
//         } else {
//           if (typeof result.message === "string") {
//             throw new Error(result.message);
//           } else {
//             throw new Error("Failed to fetch common followers count");
//           }
//         }
//       } catch (error) {
//         console.error("Failed to fetch common followers count:", error);
//         setVisible(false); // Hide component if there's an error
//       }
//     };

//     fetchCommonFollowersCount();
//   }, [userID1, userID2]);

//   if (!visible || commonFollowersCount === null) {
//     return null; // Do not render the component if it's not visible or data is not loaded
//   }

//   return (
//     <div className="common-followers-container">
//       <div className="common-followers-text">
//         {commonFollowersCount > 0 ? (
//           <a
//             href={`https://x.com/${twitterHandle}/followers_you_follow`}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="underline-text"
//           >
//             Followed by {commonFollowersCount} people you know
//           </a>
//         ) : (
//           "Not followed by anyone you're following"
//         )}
//       </div>
//     </div>
//   );
// };

// export default CommonFollowers;






