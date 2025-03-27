"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { toast } from "sonner";
import RecordRTC from "recordrtc";

export default function EditSurveyPage() {
  const router = useRouter();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const response = await fetch(`/api/surveys/${id}`);
        if (!response.ok) throw new Error("Failed to fetch survey");
        const data = await response.json();

        setTitle(data.title);
        setRecordings({
          first: { blob: null, url: data.questionAudio1URL },
          second: { blob: null, url: data.questionAudio2URL },
        });
      } catch (error) {
        toast.error(`${error}`);
        router.push("/surveys");
      } finally {
        setLoading(false);
      }
    };
    fetchSurvey();
  }, [id]);

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
      toast.error(`${error}`);
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

      const response = await fetch(`/api/surveys/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) throw new Error("Update failed");

      await response.json();
      toast.success("Survey updated successfully");
      router.push("/view");
    } catch (error) {
      toast.error("Failed to update survey");
      console.error(error);
    }
  };

  if (loading) return <div>Loading survey...</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Survey</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Survey Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium">Question 1 Audio</h2>
          <div className="flex items-center gap-4">
            {recordings.first.url && (
              <audio src={recordings.first.url} controls />
            )}

            {isRecording !== "first" ? (
              <Button
                type="button"
                onClick={() => startRecording("first")}
                variant="outline"
              >
                {recordings.first.url ? "Re-record" : "Record"}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => stopRecording("first")}
                variant="destructive"
              >
                Stop Recording
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium">Question 2 Audio</h2>
          <div className="flex items-center gap-4">
            {recordings.second.url && (
              <audio src={recordings.second.url} controls />
            )}

            {isRecording !== "second" ? (
              <Button
                type="button"
                onClick={() => startRecording("second")}
                variant="outline"
              >
                {recordings.second.url ? "Re-record" : "Record"}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => stopRecording("second")}
                variant="destructive"
              >
                Stop Recording
              </Button>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/surveys")}
          >
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  );
}
