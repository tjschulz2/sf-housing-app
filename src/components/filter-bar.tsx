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

export default function FilterBar({
  onFilterChange,
  filterState,
}: {
  onFilterChange: (filterData: SearcherProfilesFilterType) => void;
  filterState: SearcherProfilesFilterType;
}) {
  const { housemateCount, leaseLength, movingTime } = filterState;
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <div id="pref-filter-group" className="flex flex-col gap-2 grow">
        <Label htmlFor="Preferences">Preference Filters</Label>
        <div className="flex flex-row gap-2">
          <Select
            value={leaseLength}
            onValueChange={(val) => onFilterChange({ leaseLength: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Lease length" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1-year Lease</SelectItem>
              <SelectItem value="2">Short-term Lease</SelectItem>
              <SelectSeparator />
              <SelectItem value="">Any lease</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={housemateCount}
            onValueChange={(val) => onFilterChange({ housemateCount: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Housemate Count" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1-2 housemates</SelectItem>
              <SelectItem value="2">3-5 housemates</SelectItem>
              <SelectItem value="3">6-12 housemates</SelectItem>
              <SelectItem value="4">12+ housemates</SelectItem>
              <SelectSeparator />
              <SelectItem value="">Any count</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator orientation="vertical" className="hidden sm:inline h-auto" />
      <div id="timeline-filter-group" className="flex flex-col gap-2 grow">
        <Label htmlFor="Timeline">Timeline Filter</Label>
        <Select
          value={movingTime}
          onValueChange={(val) => onFilterChange({ movingTime: val })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Moving in..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">ASAP</SelectItem>
            <SelectItem value="2">{`< 3 months`}</SelectItem>
            <SelectItem value="3">{`3+ months`}</SelectItem>
            <SelectSeparator />
            <SelectItem value="">Any timeline</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* <Separator className="inline sm:hidden" /> */}
    </div>
  );
}
