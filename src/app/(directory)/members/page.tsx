"use client";

import { getUsers, getTotalUserCount } from "@/lib/utils/data";
import MemberCard from "@/components/cards/member-card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { useEffect, useState } from "react";

const BATCH_SIZE = 20;

export default function MembersPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const pageNumber = searchParams.page
    ? parseInt(searchParams.page as string)
    : 0;
  const [members, setMembers] = useState<MemberUserType[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);

  useEffect(() => {
    const fetchInScopeMembers = async () => {
      const inScopeMembers = await getUsers(pageNumber, BATCH_SIZE);
      if (inScopeMembers.success && inScopeMembers.data) {
        setMembers(inScopeMembers.data);
      }
    };
    fetchInScopeMembers();
  }, [pageNumber]);

  useEffect(() => {
    const fetchTotalUsers = async () => {
      const totalUsers = (await getTotalUserCount())?.data;
      if (totalUsers) {
        setTotalUsers(totalUsers);
      }
    };
    fetchTotalUsers();
  }, []);

  const maxPageNum = Math.ceil(totalUsers / BATCH_SIZE);
  return (
    <div className="flex flex-col gap-4 mb-6">
      <p className="text-solarisgreen">{totalUsers} members</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {members.map((member) => (
          <MemberCard key={member.user_id} member={member} />
        ))}
      </div>

      <Pagination>
        <PaginationContent>
          {pageNumber > 0 ? (
            <PaginationItem>
              <PaginationPrevious href={`/members?page=${pageNumber - 1}`} />
            </PaginationItem>
          ) : null}{" "}
          {pageNumber < maxPageNum - 1 ? (
            <PaginationItem>
              <PaginationNext href={`/members?page=${pageNumber + 1}`} />
            </PaginationItem>
          ) : null}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
