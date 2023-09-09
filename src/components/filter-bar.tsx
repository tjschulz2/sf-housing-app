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

export default function FilterBar() {
  return (
    <div className="flex flex-col sm:flex-row h-fit sm:items-center gap-4 mb-4">
      <div id="pref-filter-group" className="flex flex-col gap-2 grow">
        <Label htmlFor="Preferences">Preference Filters</Label>
        <div className="flex flex-row gap-2">
          <Select onValueChange={(val) => console.log(val)}>
            <SelectTrigger>
              <SelectValue placeholder="Lease length" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">Short-term Lease</SelectItem>
              <SelectItem value="long">1-year Lease</SelectItem>
              <SelectSeparator />
              <SelectItem value="any">Any lease</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={(val) => console.log(val)}>
            <SelectTrigger>
              <SelectValue placeholder="Housemate Count" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-2">1-2 housemates</SelectItem>
              <SelectItem value="3-5">3-5 housemates</SelectItem>
              <SelectItem value="6-12">6-12 housemates</SelectItem>
              <SelectItem value="12+">12+ housemates</SelectItem>
              <SelectSeparator />
              <SelectItem value="any">Any count</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator orientation="vertical" className="hidden sm:inline" />
      <div id="timeline-filter-group" className="flex flex-col gap-2 grow">
        <Label htmlFor="Timeline">Timeline Filter</Label>
        <Select onValueChange={(val) => console.log(val)}>
          <SelectTrigger>
            <SelectValue placeholder="Moving in..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asap">ASAP</SelectItem>
            <SelectItem value="<3">{`< 3 months`}</SelectItem>
            <SelectItem value="3+">{`3+ months`}</SelectItem>
            <SelectSeparator />
            <SelectItem value="any">Any timeline</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* <Separator className="inline sm:hidden" /> */}
    </div>
  );
}
