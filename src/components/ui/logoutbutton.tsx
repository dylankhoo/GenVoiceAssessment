"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "./button";
import { toast } from "sonner";
import { logOutAction } from "@/actions/users";
import { useRouter } from "next/navigation";
function LogOutButton() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleLogOut = async () => {
    setLoading(true);

    const { errorMessage } = await logOutAction();

    if (!errorMessage) {
      router.push(`/login`);
    } else {
      toast.error(`Error: ${errorMessage}`);
    }

    setLoading(false);
  };

  return (
    <Button onClick={handleLogOut} disabled={loading}>
      {loading ? <Loader2 className="animate-spin" /> : "Log Out"}
    </Button>
  );
}

export default LogOutButton;
