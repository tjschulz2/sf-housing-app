import { useEffect, useState } from "react";

const defaultAvatar = "/images/default-avatar.jpeg";

const UserProfileImage = ({
  src,
  size,
  className,
}: {
  src?: string | null;
  size: "small" | "medium" | "large";
  className?: string;
}) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  const imgSizeClass = (() => {
    if (size === "large") {
      return "w-28 h-28 lg:w-36 lg:h-36";
    } else if (size === "medium") {
      return "w-14 h-14";
    } else {
      return "w-6 h-6";
    }
  })();

  return (
    <img
      className={`rounded-full ${imgSizeClass} ${className}`}
      alt="User profile image"
      onError={() => {
        setError(true);
      }}
      src={!src || error ? defaultAvatar : src}
    />
  );
};

export default UserProfileImage;
