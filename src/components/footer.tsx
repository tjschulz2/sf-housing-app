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
      <a href="https://github.com/tjschulz2/sf-housing-app" target="_blank">
        <Button variant="ghost" size="icon">
          <Github color="grey" className="" />
        </Button>
      </a>
    </div>
  );
}
