import { useMutation } from "react-query";
import { api } from ".";

interface CreateClipParams {
  videoId: string;
  start: string;
  duration: string;
}

export const useCreateClip = () => {
  return useMutation({
    mutationFn: (data: CreateClipParams) => {
      return api.post("/clip", data);
    },
  });
};
