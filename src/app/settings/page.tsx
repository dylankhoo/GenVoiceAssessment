import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import SettingsForm from "@/components/SettingsForm";

export default async function Settings() {
  return (
    <div className="mt-20 flex flex-1 flex-col items-center">
      <Card className="w-full max-w-md">
        <CardHeader className="mb-4">
          <CardTitle className="text-center text-3xl">
            Edit Account Details
          </CardTitle>
        </CardHeader>
        <SettingsForm />
      </Card>
    </div>
  );
}
