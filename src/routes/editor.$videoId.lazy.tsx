import { Button } from "@/components/ui/button";
import { DurationInput } from "@/components/ui/duration-input";
import { DualRangeSlider } from "@/components/ui/range-slider";
import { Separator } from "@/components/ui/separator";
import { hmsStringToSeconds, hmsToStr, secondsToHms } from "@/lib/format";
import { ClipApplyButton } from "@/widgets/clip-apply-button";
import { createLazyFileRoute, useRouter } from "@tanstack/react-router";
import { SquareChevronLeft } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import YouTubePlayer from "youtube-player";

type Player = ReturnType<typeof YouTubePlayer>;

export const Route = createLazyFileRoute("/editor/$videoId")({
  component: Editor,
});

function Editor() {
  const { videoId } = Route.useParams();
  const playerRef = useRef<Player | null>(null);
  const [videoTitle, setVideoTitle] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | undefined>(undefined);
  const [range, setRange] = useState<[string, string]>([
    "00:00:00",
    "00:00:00",
  ]);
  const { history } = useRouter();

  useEffect(() => {
    if (!videoId || !playerRef.current) return;
    const ref = playerRef.current;

    ref.cueVideoById(videoId);
    ref.on("stateChange", (event) => {
      const playerData = event.target as any;
      if (event.data === -1 && playerData) {
        const videoDuration = playerData.getDuration();
        setVideoTitle(playerData.videoTitle);
        setDuration(videoDuration);

        const durationObj = secondsToHms(videoDuration);
        setRange([
          "00:00:00",
          `${durationObj.hours.toString().padStart(2, "0")}:${durationObj.minutes.toString().padStart(2, "0")}:${durationObj.seconds.toString().padStart(2, "0")}`,
        ]);
      }
    });
  }, [videoId]);

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const start = hmsStringToSeconds(e.target.value);
    if (start > endSeconds || (duration && start > duration)) {
      setRange(["00:00:00", range[1]]);
      return;
    }

    setRange([e.target.value, range[1]]);
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const end = hmsStringToSeconds(e.target.value);
    if (end < startSeconds || (duration && end > duration)) {
      setRange([range[0], hmsToStr(secondsToHms(duration ?? 0))]);
      return;
    }

    setRange([range[0], e.target.value]);
  };

  const playerRefSetter = useCallback(
    (divRef: HTMLDivElement) => {
      if (divRef) {
        playerRef.current = YouTubePlayer(divRef, {
          host: "https://www.youtube.com",
          height: undefined,
          playerVars: {
            autoplay: 0,
          },
        });
      }
    },
    [videoId]
  );

  const [start, end] = range;
  const startSeconds = hmsStringToSeconds(start);
  const endSeconds = hmsStringToSeconds(end);

  if (!videoId) return <div>No video id</div>;

  return (
    <div className="w-full h-full flex p-10 items-center">
      <div className="w-full flex justify-center gap-10">
        <Button
          variant="outline"
          size="lg"
          className="hidden md:flex w-fit py-6"
          onClick={() => history.back()}
        >
          <SquareChevronLeft className="!size-6" />
          Back
        </Button>
        <div className="w-full h-full lg:max-w-[60%] flex flex-col gap-4">
          <div
            ref={playerRefSetter}
            id="youtube-player"
            className="w-full aspect-video rounded-lg overflow-hidden"
          />
          <div className="text-2xl font-bold">{videoTitle}</div>
          <Separator className="my-2" />
          <div className="flex flex-col gap-2">
            <span className="text-md text-white">Duration:</span>
            <div className="flex gap-2">
              <DurationInput value={start} onInput={handleStartChange} />
              <DurationInput value={end} onInput={handleEndChange} />
            </div>
          </div>
          <DualRangeSlider
            className="py-4"
            value={[startSeconds, endSeconds]}
            onValueChange={(e) => {
              const [start, end] = e;
              setRange([
                hmsToStr(secondsToHms(start)),
                hmsToStr(secondsToHms(end)),
              ]);
            }}
            min={0}
            max={duration}
          />
          <ClipApplyButton videoId={videoId} range={range} />
        </div>
      </div>
    </div>
  );
}
