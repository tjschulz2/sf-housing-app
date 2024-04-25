import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

function GithubLink() {
  return <div></div>;
}

export default function Footer() {
  return (
    <div>
      <Separator className="mb-2" />
      <div className="flex justify-between">
        <a href="https://github.com/tjschulz2/sf-housing-app" target="_blank">
          <Button variant="ghost" size="icon">
            <Github color="grey" className="" />
          </Button>
        </a>
        <p className="text-neutral-500 p-2">
          Have ideas? DM{" "}
          <a
            className="underline underline-offset-4"
            target="_blank"
            href="https://twitter.com/neallseth"
          >
            Neall
          </a>{" "}
          or{" "}
          <a
            className="underline underline-offset-4"
            target="_blank"
            href="https://twitter.com/thomasschulzz"
          >
            Tom
          </a>
        </p>
      </div>
    </div>
  );
}
