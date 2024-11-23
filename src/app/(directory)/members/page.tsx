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
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import { Router } from "next/router";

const BATCH_SIZE = 20;

export type SortByOptions =
  | "joinDateAsc"
  | "joinDateDesc"
  | "alphaAsc"
  | "alphaDesc";

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
  const [sortBy, setSortBy] = useState<SortByOptions>("joinDateAsc");
  const router = useRouter();

  useEffect(() => {
    const fetchInScopeMembers = async () => {
      const inScopeMembers = await getUsers(pageNumber, BATCH_SIZE, sortBy);
      if (inScopeMembers.success && inScopeMembers.data) {
        setMembers(inScopeMembers.data);
      }
    };
    fetchInScopeMembers();
  }, [pageNumber, sortBy]);

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
      {/* <p className="text-solarisgreen">{totalUsers} members</p> */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4 max-w-64">
        <div id="pref-filter-group" className="flex flex-col gap-2 grow">
          <Label htmlFor="Preferences">Sort by</Label>
          <div className="flex flex-row gap-2">
            <Select
              value={sortBy}
              onValueChange={(val: SortByOptions) => {
                router.push(`/members`);
                setSortBy(val);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort members by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="joinDateAsc">
                  Join date - Ascending
                </SelectItem>
                <SelectItem value="joinDateDesc">
                  Join date - Descending
                </SelectItem>
                <SelectSeparator />
                <SelectItem value="alphaAsc">
                  Alphabetical - Ascending
                </SelectItem>
                <SelectItem value="alphaDesc">
                  Alphabetical - Descending
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
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
