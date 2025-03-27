import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const surveys = await prisma.survey.findMany({
      orderBy: { createdAt: "desc" },
    });

    const formattedSurveys = surveys.map((survey) => ({
      ...survey,
      questionAudio1URL: survey.questionAudio1URL,
      questionAudio2URL: survey.questionAudio2URL,
    }));

    return NextResponse.json(formattedSurveys);
  } catch (error) {
    console.error("Error fetching surveys:", error);
    return NextResponse.json(
      { error: "Failed to fetch surveys" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const audio1 = formData.get("firstRecording") as File;
    const audio2 = formData.get("secondRecording") as File;

    if (!audio1 || !audio2) {
      return NextResponse.json(
        { error: "Both audio recordings are required" },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const audio1Path = `surveys/audio1_${timestamp}.webm`;
    const audio2Path = `surveys/audio2_${timestamp}.webm`;

    const { error: audio1Error } = await supabaseAdmin.storage
      .from("surveys")
      .upload(audio1Path, audio1);

    if (audio1Error) throw audio1Error;

    const { error: audio2Error } = await supabaseAdmin.storage
      .from("surveys")
      .upload(audio2Path, audio2);

    if (audio2Error) throw audio2Error;

    const { data: audio1Url } = supabaseAdmin.storage
      .from("surveys")
      .getPublicUrl(audio1Path);

    const { data: audio2Url } = supabaseAdmin.storage
      .from("surveys")
      .getPublicUrl(audio2Path);

    const survey = await prisma.survey.create({
      data: {
        title,
        questionAudio1URL: audio1Url.publicUrl,
        questionAudio2URL: audio2Url.publicUrl,
      },
    });

    return NextResponse.json(survey);
  } catch {
    return NextResponse.json(
      { error: "Failed to create survey" },
      { status: 500 }
    );
  }
}
