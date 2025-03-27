import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const survey = await prisma.survey.findUnique({
      where: { id: id },
    });

    if (!survey) {
      return NextResponse.json({ error: "Survey not found" }, { status: 404 });
    }

    return NextResponse.json(survey);
  } catch (error) {
    console.error("Error fetching survey:", error);
    return NextResponse.json(
      { error: "Failed to fetch survey" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const survey = await prisma.survey.findUnique({ where: { id } });

    if (!survey) {
      return NextResponse.json({ error: "Survey not found" }, { status: 404 });
    }

    // Delete audio files from storage
    const deleteFile = async (url: string) => {
      const path = url.split("/surveys/")[1];
      if (path) {
        await supabaseAdmin.storage.from("surveys").remove([path]);
      }
    };

    await Promise.all([
      deleteFile(survey.questionAudio1URL),
      deleteFile(survey.questionAudio2URL),
    ]);

    await prisma.survey.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting survey:", error);
    return NextResponse.json(
      { error: "Failed to delete survey" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const audio1 = formData.get("firstRecording") as File | null;
    const audio2 = formData.get("secondRecording") as File | null;

    const existingSurvey = await prisma.survey.findUnique({ where: { id } });
    if (!existingSurvey) {
      return NextResponse.json({ error: "Survey not found" }, { status: 404 });
    }

    // Helper function to update audio files in storage
    const updateAudio = async (file: File | null, existingUrl: string) => {
      if (!file) return existingUrl;

      // Delete old file
      const oldPath = existingUrl.split("/surveys/")[1];
      if (oldPath) {
        await supabaseAdmin.storage.from("surveys").remove([oldPath]);
      }

      // Upload new file
      const timestamp = Date.now();
      const newPath = `surveys/${timestamp}.webm`;

      const { error } = await supabaseAdmin.storage
        .from("surveys")
        .upload(newPath, file);

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabaseAdmin.storage.from("surveys").getPublicUrl(newPath);

      return publicUrl;
    };

    // Update audio files if provided
    const audio1Url = audio1
      ? await updateAudio(audio1, existingSurvey.questionAudio1URL)
      : existingSurvey.questionAudio1URL;

    const audio2Url = audio2
      ? await updateAudio(audio2, existingSurvey.questionAudio2URL)
      : existingSurvey.questionAudio2URL;

    // Update survey
    const updatedSurvey = await prisma.survey.update({
      where: { id },
      data: {
        title,
        questionAudio1URL: audio1Url,
        questionAudio2URL: audio2Url,
      },
    });

    return NextResponse.json(updatedSurvey);
  } catch (error) {
    console.error("Error updating survey:", error);
    return NextResponse.json(
      { error: "Failed to update survey" },
      { status: 500 }
    );
  }
}
