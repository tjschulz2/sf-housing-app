"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { getUserSession } from "../../lib/utils/auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, UserPlus, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

const referralBaseLink = "https://directorysf.com/?referralCode=";

function ReferralLink({ link }: { link: string }) {
  const { toast } = useToast();

  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast({
        title: "Referral link copied to clipboard",
      });
      await new Promise(() => {
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      });
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast({
        title: "Failed to copy referral link",
      });
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {link ? (
        <div className="grid flex-1 gap-2">
          <Label htmlFor="link" className="sr-only">
            Link
          </Label>
          <Input id="link" value={link} readOnly />
        </div>
      ) : (
        <Skeleton className="w-full h-[20px] rounded-full" />
      )}
      <Button
        type="submit"
        size="sm"
        className="px-3"
        onClick={copyToClipboard}
        disabled={copied || !link}
      >
        <span className="sr-only">Copy</span>
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
}

const InviteButton = () => {
  const [referralLink, setReferralLink] = useState("");

  const genReferralLink = async () => {
    let newLink = "";
    const session = await getUserSession();
    if (session && session.userID) {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", session.userID);

      if (error || !data?.length) {
        console.error("Error fetching user:", error);
        return;
      }

      const user = data[0];
      if (user.is_super) {
        const { data: referralsData, error: referralsError } = await supabase
          .from("referrals")
          .select("*")
          .eq("originator_id", session.userID)
          .eq("usage_limit", 500)
          .not("usage_count", "gte", 500);

        if (referralsError) {
          console.error("Error fetching user:", referralsError);
          return;
        }

        if (referralsData?.length > 0) {
          const referralCode = referralsData[0].referral_id;
          newLink = `${referralBaseLink}${referralCode}`;
        } else {
          const referralCode = Math.floor(Math.random() * 1000000000000000);
          newLink = `${referralBaseLink}${referralCode}`;
          const { error: insertError } = await supabase
            .from("referrals")
            .insert([
              {
                referral_id: referralCode,
                originator_id: session.userID,
                usage_limit: 500,
                usage_count: 0,
              },
            ]);

          if (insertError) throw insertError;
        }
      } else {
        const referralCode = Math.floor(Math.random() * 1000000000000000);
        newLink = `${referralBaseLink}${referralCode}`;
        const { error: insertError } = await supabase.from("referrals").insert([
          {
            referral_id: referralCode,
            originator_id: session.userID,
            usage_limit: 1,
            usage_count: 0,
          },
        ]);

        if (insertError) throw insertError;
      }
    }
    return newLink;
  };

  async function handleDialogOpen(isOpen: boolean) {
    if (isOpen) {
      const referralLink = await genReferralLink();
      if (referralLink) {
        setReferralLink(referralLink);
      }
    } else {
      setReferralLink("");
    }
  }

  return (
    <>
      <Dialog onOpenChange={handleDialogOpen}>
        <DialogTrigger>
          <Button className="rounded-3xl p-6">
            <UserPlus className="mr-2 h-4 w-4" /> Invite a friend
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite a friend</DialogTitle>
            <DialogDescription>
              Only refer people you know, trust, and would be willing to live
              with yourself.
            </DialogDescription>
          </DialogHeader>
          <ReferralLink link={referralLink} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InviteButton;
