"use client";
import { toast } from "sonner";
import { CardContent, CardFooter } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useTransition } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

import { updateUserAction } from "@/actions/users";

function SettingsForm() {
  const [isPending, startTransition] = useTransition();
  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const password = formData.get("password") as string;

      const errorMessage = (await updateUserAction(password)).errorMessage;
      if (errorMessage) {
        toast.error(`Error: ${errorMessage}`);
      }
    });
  };

  return (
    <form action={handleSubmit}>
      <CardContent className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            placeholder="Enter new password"
            type="password"
            required
            disabled={isPending}
          />
        </div>
      </CardContent>
      <CardFooter className="mt-4 flex flex-col gap-6">
        <Button className="w-full">
          {isPending ? <Loader2 className="animate-spin" /> : "Update"}
        </Button>
      </CardFooter>
    </form>
  );
}

export default SettingsForm;
