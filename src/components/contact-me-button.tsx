import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LucideIcon, Mail, MessageCircle, Twitter } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { useAuthContext } from "@/contexts/auth-context";
import { reportContactEvent } from "@/lib/googleAnalytics";
import { usePostHog } from "posthog-js/react";

function LinkButton({
  link,
  children,
  onClick,
}: {
  link?: string | null;
  children: ReactNode;
  onClick?: () => void;
}) {
  if (link) {
    return (
      <Link target="_blank" href={link} onClick={onClick}>
        <Button variant="outline" size="icon">
          {children}
        </Button>
      </Link>
    );
  } else {
    return (
      <Button disabled variant="secondary" size="icon">
        {children}
      </Button>
    );
  }
}

export default function ContactMeButton({
  phoneNum,
  email,
  twitter,
  recipientName,
  spaceSlug,
}: {
  phoneNum?: string | null;
  email?: string | null;
  twitter?: string | null;
  recipientName?: string | null;
  spaceSlug?: string | null;
}) {
  const { userData } = useAuthContext();
  const posthog = usePostHog();

  const baseURL = `${window.location.protocol}//${window.location.hostname}${
    window.location.port ? ":" + window.location.port : ""
  }`;

  console.log(baseURL);
  const userFirstName = userData?.name ? userData.name.split(" ")[0] : "____";
  let textMessage = `👋 Hey, this is ${userFirstName}!\nI saw your profile on DirectorySF, and wanted to reach out`;
  if (spaceSlug) {
    textMessage += `\n\n${baseURL}/s/${spaceSlug}`;
  }
  textMessage = encodeURIComponent(textMessage);

  const phoneLink = phoneNum ? `sms:${phoneNum}&body=${textMessage}` : null;
  const emailLink = email ? `mailto:${email}` : null;
  const twitterLink = twitter ? `https://x.com/${twitter}` : null;

  return (
    <Popover>
      <PopoverTrigger className="inline-flex items-center text-white justify-center ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2  border border-neutral-200 bg-[#1D462F] hover:bg-[#296141] hover:text-[#EAEFEC]  h-10 px-4 py-2 rounded-3xl font-semibold max-w-fit text-md">
        Contact me
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex justify-around">
          <LinkButton
            link={phoneLink}
            onClick={() => {
              reportContactEvent(
                "SMS",
                `${userData?.name} (@${userData?.twitter_handle})`,
                `${recipientName} @(${twitter})`
              );

              posthog.capture("contact_attempt", {
                channel: "sms",
                recipient_name: recipientName,
                recipient_handle: twitter,
              });
            }}
          >
            <MessageCircle className="h-4 w-4" />
          </LinkButton>
          <LinkButton
            link={emailLink}
            onClick={() => {
              reportContactEvent(
                "Email",
                `${userData?.name} (@${userData?.twitter_handle})`,
                `${recipientName} @(${twitter})`
              );

              posthog.capture("contact_attempt", {
                channel: "email",
                recipient_name: recipientName,
                recipient_handle: twitter,
              });
            }}
          >
            <Mail className="h-4 w-4" />
          </LinkButton>
          <LinkButton
            link={twitterLink}
            onClick={() => {
              reportContactEvent(
                "Twitter",
                `${userData?.name} (@${userData?.twitter_handle})`,
                `${recipientName} @(${twitter})`
              );

              posthog.capture("contact_attempt", {
                channel: "twitter",
                recipient_name: recipientName,
                recipient_handle: twitter,
              });
            }}
          >
            <Twitter className="h-4 w-4" />
          </LinkButton>
        </div>
      </PopoverContent>
    </Popover>
  );
}
