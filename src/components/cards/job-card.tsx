import UserProfileImage from "@/components/user-profile-image";
import ReferralBadge from "@/components/referral-badge";
import { Card, CardTop, CardBottom } from "@/components/cards/card";
import TwitterLogo from "@/images/twitter-logo.svg";
import Link from "next/link";
import { formatDateMonthYear } from "@/lib/utils/general";
import { CalendarDays } from "lucide-react";

export default function JobCard() {
  return (
    <Card>
      <div className="flex items-center justify-between gap-4">
        JOBBY
        <div className="flex flex-col gap-2 basis-1/3"></div>
        <div className="flex flex-col gap-2 grow">
          <div className="flex gap-2 text-sm">
            <span className="text-xs text-gray-600">Referred by</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
