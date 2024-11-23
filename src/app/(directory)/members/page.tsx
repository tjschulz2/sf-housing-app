import { getUsers, getTotalUserCount } from "@/lib/utils/data";
import UserProfileImage from "@/components/user-profile-image";
import ReferralBadge from "@/components/referral-badge";
import { Card, CardTop, CardBottom } from "@/components/cards/card";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type MemberUserType = {
  user_id: string;
  name: string | null;
  twitter_avatar_url: string | null;
  twitter_handle: string | null;
  created_at: string | null;
};

const BATCH_SIZE = 2;

const MemberCard = ({ member }: { member: MemberUserType }) => {
  if (!member.name || !member.twitter_handle) {
    return null;
  }
  return (
    <Card className="shadow">
      <div className="flex items-center gap-4">
        <UserProfileImage src={member.twitter_avatar_url} size="medium" />
        <div className="flex flex-col">
          <div className="text-lg font-semibold">{member.name}</div>
          <div className="text-sm">@{member.twitter_handle}</div>
        </div>
        <ReferralBadge userID={member.user_id} />
      </div>
    </Card>
  );
};

export default async function MembersPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const pageNumber = searchParams.page
    ? parseInt(searchParams.page as string)
    : 0;
  console.log(searchParams.page);
  const members = await getUsers(pageNumber, BATCH_SIZE);
  const totalUsers = (await getTotalUserCount())?.data;

  if (!members.success || !totalUsers) {
    return <div>Failed to load members</div>;
  }

  const maxPageNum = Math.ceil(totalUsers / BATCH_SIZE);
  return (
    <div className="flex flex-col gap-4 mb-6">
      {members.data?.map((member) => (
        <MemberCard key={member.user_id} member={member} />
      ))}

      <Pagination>
        <PaginationContent>
          {pageNumber > 0 ? (
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
          ) : null}{" "}
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          {/* <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem> */}
          {pageNumber < maxPageNum ? (
            <PaginationItem>
              <PaginationNext href={`/members?page=${pageNumber + 1}`} />
            </PaginationItem>
          ) : null}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
