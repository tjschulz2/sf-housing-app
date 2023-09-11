import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

export default function GithubLink() {
  return (
    <div>
      <a href="https://github.com/tjschulz2/sf-housing-app" target="_blank">
        <Button variant="ghost" size="icon">
          <Github color="grey" className="" />
        </Button>
      </a>
    </div>
  );
}
