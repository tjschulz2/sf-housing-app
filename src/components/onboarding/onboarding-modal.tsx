import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const SearchNeedButon = ({ text, img }: { text: string; img?: string }) => {
  return (
    <div className="w-1/2 text-center cursor-pointer p-8 flex rounded-lg text-[#474747] border border-[#cccccc] hover:bg-[#f1efdf] font-bold hover:text-[#1d462f] border-2 hover:border-[#1d462f] hover:bg-[#e7e9d8] border-[#1d462f92]">
      {text}
    </div>
  );
};

export default function OnboardingModal() {
  return (
    <Dialog open={true}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome to DirectorySF!</DialogTitle>
          <DialogDescription>
            Just one, simple question: which of the below best describes you?
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2">
          <SearchNeedButon text="Looking for housing" />
          <SearchNeedButon text="Have an available room" />

          {/* <p>Neither of these describe me</p> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
