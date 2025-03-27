"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { WriteUp } from "@/components/ui/writeup";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [surveys, setSurveys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAudio, setLoadingAudio] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const res = await fetch("/api/surveys");
        const data = await res.json();
        setSurveys(data);
      } catch (error) {
        toast.error(`${error}`);
      } finally {
        setLoading(false);
      }
    };
    fetchSurveys();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this survey?")) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/surveys/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Delete failed");

      setSurveys(surveys.filter((survey) => survey.id !== id));
      toast.success("Survey deleted successfully");
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/edit/${id}`);
  };

  if (loading) return <div>Loading surveys...</div>;

  return (
    <div className="container mx-auto py-8">
      <WriteUp />
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Respondent</th>
            <th className="py-2 px-4 border-b">Favourite Drink</th>
            <th className="py-2 px-4 border-b">Favourite Food</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {surveys.map((survey) => (
            <tr key={survey.id}>
              <td className="py-2 px-4 border-b text-center">{survey.title}</td>

              {/* Audio 1 */}
              <td className="py-2 px-4 border-b">
                <div className="flex justify-center items-center gap-2">
                  {loadingAudio[`${survey.id}-1`] && <span>Loading...</span>}
                  {survey.questionAudio1URL ? (
                    <>
                      <audio
                        controls
                        src={survey.questionAudio1URL.split("?")[0]}
                        className="h-8"
                        onError={() => toast.error("Failed to load audio 1")}
                        onLoadStart={() =>
                          setLoadingAudio((p) => ({
                            ...p,
                            [`${survey.id}-1`]: true,
                          }))
                        }
                        onCanPlay={() =>
                          setLoadingAudio((p) => ({
                            ...p,
                            [`${survey.id}-1`]: false,
                          }))
                        }
                      />
                    </>
                  ) : (
                    <span className="text-gray-400">No audio</span>
                  )}
                </div>
              </td>

              {/* Audio 2 */}
              <td className="py-2 px-4 border-b">
                <div className="flex justify-center items-center gap-2">
                  {loadingAudio[`${survey.id}-2`] && <span>Loading...</span>}
                  {survey.questionAudio2URL ? (
                    <>
                      <audio
                        controls
                        src={survey.questionAudio2URL.split("?")[0]}
                        className="h-8"
                        onError={() => toast.error("Failed to load audio 2")}
                        onLoadStart={() =>
                          setLoadingAudio((p) => ({
                            ...p,
                            [`${survey.id}-2`]: true,
                          }))
                        }
                        onCanPlay={() =>
                          setLoadingAudio((p) => ({
                            ...p,
                            [`${survey.id}-2`]: false,
                          }))
                        }
                      />
                    </>
                  ) : (
                    <span className="text-gray-400">No audio</span>
                  )}
                </div>
              </td>

              <td className="py-2 px-4 border-b space-x-2 text-center">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(survey.id)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleDelete(survey.id)}
                  disabled={deletingId === survey.id}
                >
                  {deletingId === survey.id ? "Deleting..." : "Delete"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
