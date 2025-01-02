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
import { genReferralLink } from "@/dal";

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
        <DialogTrigger asChild>
          <Button className="rounded-3xl text-xs sm:text-base">
            <UserPlus className="mr-1 sm:mr-2 size-4" /> Invite
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
