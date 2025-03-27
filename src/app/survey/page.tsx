"use client";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import dynamic from "next/dynamic";

const SurveyForm = dynamic(() => import("@/components/SurveyForm"), {
  ssr: false,
});

export default function Survey() {
  return (
    <div className="mt-20 flex flex-1 flex-col items-center">
      <Card className="w-full max-w-md">
        <CardHeader className="mb-4">
          <CardTitle className="text-center text-3xl">New Survey</CardTitle>
        </CardHeader>
        <SurveyForm />
      </Card>
    </div>
  );
}
