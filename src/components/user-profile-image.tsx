import { useEffect, useState } from "react";

const defaultAvatar = "/images/default-avatar.jpeg";

const UserProfileImage = ({
  src,
  size,
}: {
  src?: string | null;
  size: "small" | "medium" | "large";
}) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  const imgSizeClass = (() => {
    if (size === "large") {
      return "w-36";
    } else if (size === "medium") {
      return "w-14";
    } else {
      return "w-6";
    }
  })();

  return (
    <img
      className={`rounded-full ${imgSizeClass}`}
      alt="User profile image"
      onError={() => {
        setError(true);
      }}
      src={!src || error ? defaultAvatar : src}
    />
  );
};

export default UserProfileImage;
