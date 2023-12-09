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

function LinkButton({
  link,
  children,
}: {
  link?: string | null;
  children: ReactNode;
}) {
  if (link) {
    return (
      <Link target="_blank" href={link}>
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
}: {
  phoneNum?: string | null;
  email?: string | null;
  twitter?: string | null;
}) {
  const { userData } = useAuthContext();
  const userFirstName = userData?.name ? userData.name.split(" ")[0] : "____";
  const textMessage = encodeURIComponent(
    `👋 Hey, this is ${userFirstName}!\nI saw your profile on DirectorySF, and wanted to reach out`
  );
  const phoneLink = phoneNum ? `sms:${phoneNum}&body=${textMessage}` : null;
  const emailLink = email ? `mailto:${email}` : null;
  const twitterLink = twitter ? `https://x.com/${twitter}` : null;

  return (
    <Popover>
      <PopoverTrigger className="inline-flex items-center justify-center ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2  border border-neutral-200 bg-white hover:bg-neutral-100 hover:text-neutral-900  h-10 px-4 py-2 rounded-3xl font-semibold max-w-fit text-md">
        Contact me
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex justify-around">
          <LinkButton link={phoneLink}>
            <MessageCircle className="h-4 w-4" />
          </LinkButton>
          <LinkButton link={emailLink}>
            <Mail className="h-4 w-4" />
          </LinkButton>
          <LinkButton link={twitterLink}>
            <Twitter className="h-4 w-4" />
          </LinkButton>
        </div>
      </PopoverContent>
    </Popover>
  );
}
