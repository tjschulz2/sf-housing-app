import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ActivityStatusDot({
  status,
  showTooltip = true,
}: {
  status: "high" | "med" | "low";
  showTooltip?: boolean;
}) {
  let colorClass;
  let tooltipContent = "";
  if (status === "high") {
    colorClass = "bg-green-600";
    tooltipContent = "Confirmed within the last week";
  } else if (status === "med") {
    colorClass = "bg-yellow-400";
    tooltipContent = "Confirmed within the last two weeks";
  } else {
    colorClass = "bg-red-500";
    tooltipContent = "Last confirmed over two weeks ago";
  }

  if (showTooltip) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>
            <span className="relative flex h-3 w-3">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colorClass} opacity-75`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-3 w-3 ${colorClass}`}
              ></span>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipContent}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <span className="relative flex h-3 w-3">
      <span
        className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colorClass} opacity-75`}
      ></span>
      <span
        className={`relative inline-flex rounded-full h-3 w-3 ${colorClass}`}
      ></span>
    </span>
  );
}
