"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { CardContent, CardFooter } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import RecordRTC from "recordrtc";

function SurveyForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [recordings, setRecordings] = useState<{
    first: { blob: Blob | null; url: string | null };
    second: { blob: Blob | null; url: string | null };
  }>({
    first: { blob: null, url: null },
    second: { blob: null, url: null },
  });
  const [isRecording, setIsRecording] = useState<"first" | "second" | null>(
    null
  );
  const recorderRef = useRef<typeof RecordRTC | null>(null);

  const startRecording = async (recorderKey: "first" | "second") => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recorderRef.current = new RecordRTC(stream, {
        type: "audio",
        mimeType: "audio/webm",
      });
      recorderRef.current.startRecording();
      setIsRecording(recorderKey);
    } catch (error) {
      toast.error("Error accessing microphone");
      console.error(error);
    }
  };

  const stopRecording = (recorderKey: "first" | "second") => {
    if (!recorderRef.current) return;

    recorderRef.current.stopRecording(() => {
      const blob = recorderRef.current!.getBlob();
      const url = URL.createObjectURL(blob);

      setRecordings((prev) => ({
        ...prev,
        [recorderKey]: { blob, url },
      }));

      recorderRef.current = null;
      setIsRecording(null);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    try {
      const formData = new FormData();
      formData.append("title", title);

      if (recordings.first.blob) {
        formData.append(
          "firstRecording",
          new File([recordings.first.blob], "recording1.webm", {
            type: "audio/webm",
          })
        );
      }

      if (recordings.second.blob) {
        formData.append(
          "secondRecording",
          new File([recordings.second.blob], "recording2.webm", {
            type: "audio/webm",
          })
        );
      }

      const response = await fetch("/api/surveys", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to submit survey");

      await response.json();
      toast.success("Survey created successfully!");
      router.push("/view");
    } catch (error) {
      toast.error("Failed to submit survey");
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="title">Respondent Name</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your name"
            required
            disabled={isPending}
          />
        </div>

        <div className="flex flex-col space-y-1.5">
          <Label>What's your favourite drink?</Label>
          <div className="flex flex-col">
            {recordings.first.url && (
              <audio src={recordings.first.url} controls className="mt-2" />
            )}

            {isRecording !== "first" ? (
              <Button
                type="button"
                onClick={() => startRecording("first")}
                variant="outline"
                disabled={isPending}
              >
                {recordings.first.url ? "Re-record" : "Record"}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => stopRecording("first")}
                variant="destructive"
                disabled={isPending}
              >
                Stop Recording
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col space-y-1.5">
          <Label>What's your favourite food?</Label>
          <div className="flex flex-col">
            {recordings.second.url && (
              <audio src={recordings.second.url} controls className="mt-2" />
            )}

            {isRecording !== "second" ? (
              <Button
                type="button"
                onClick={() => startRecording("second")}
                variant="outline"
                disabled={isPending}
              >
                {recordings.second.url ? "Re-record" : "Record"}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => stopRecording("second")}
                variant="destructive"
                disabled={isPending}
              >
                Stop Recording
              </Button>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="mt-4 flex flex-col gap-6">
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin" /> : "Submit Survey"}
        </Button>
      </CardFooter>
    </form>
  );
}

export default SurveyForm;
