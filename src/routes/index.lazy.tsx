import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import arrowImage from "@/assets/imgs/arrow.avif";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  const handleLoadVideo = () => {
    if (!url || !URL.canParse(url)) return;

    const videoId = new URL(url).searchParams.get("v");
    if (!videoId) return;

    navigate({
      to: "/editor/$videoId",
      params: {
        videoId,
      },
    });
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-full flex justify-center">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
          youtube clips
        </h1>
      </div>
      <div className="w-full flex flex-col justify-center text-center items-center p-12">
        <p className="font-bold text-2xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
          Clip and Share
        </p>
        <p className="text-zinc-600 text-xl max-w-md">
          Youtube clips is a free online tool to cut youtube videos with ease
          and quickly.
        </p>
      </div>
      <div className="flex flex-col gap-4 w-1/3 justify-center relative">
        <div className="hidden md:block">
          <img
            src={arrowImage}
            className="absolute w-[165px] top-[-100px] -right-[9rem] rotate-180 scale-x-[-1]"
          />
          <div className="flex absolute top-[-60px] -right-[11rem] z-10">
            <Button
              size="lg"
              variant="outline"
              className="rotate-[-10deg] -translate-y-5 text-xl px-4"
            >
              ⌘
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rotate-[10deg] -translate-x-3 px-4"
            >
              V
            </Button>
          </div>
        </div>
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        />
        <Button onClick={handleLoadVideo}>Load video</Button>
      </div>
    </div>
  );
}
