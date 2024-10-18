import { useCreateClip } from "@/api/clips.api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { hmsStringToSeconds, hmsToStr, secondsToHms } from "@/lib/format";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface ClipApplyButtonProps {
  videoId: string;
  range: [string, string];
}

export function ClipApplyButton({ videoId, range }: ClipApplyButtonProps) {
  const { mutateAsync: createClip, isLoading } = useCreateClip();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleApply = () => {
    const [start, end] = range;
    const startSeconds = hmsStringToSeconds(start);
    const endSeconds = hmsStringToSeconds(end);
    const duration = endSeconds - startSeconds;
    createClip({
      videoId,
      start: start,
      duration: hmsToStr(secondsToHms(duration)),
    }).then(() => {
      setIsDialogOpen(true);
    });
  };

  return (
    <>
      <div className="flex justify-center items-center gap-2">
        <Button
          size="lg"
          className="w-full"
          disabled={isLoading}
          onClick={handleApply}
        >
          Apply
        </Button>
        {isLoading && <Loader2 className="size-8 animate-spin" />}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Clip created</DialogTitle>
            <DialogDescription>
              Your clip has been created. You can now share it with others.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input
                id="link"
                readOnly
                value={"http://194.87.26.15:3000/clips/" + videoId + ".mp4"}
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
