import UserProfileImage from "@/components/user-profile-image";

export default function ReferralBadge({
  handle,
  imageURL,
  name,
}: {
  handle: string;
  imageURL: string;
  name: string;
}) {
  if (!handle || !imageURL || !name) {
    return;
  }

  return (
    <a
      href={`https://x.com/${handle}`}
      className="flex items-center no-underline"
    >
      <span className="mx-1">
        <UserProfileImage size="small" src={imageURL} />
      </span>
      <span className="text-blue-500 hover:text-blue-400">{name}</span>
    </a>
  );
}
