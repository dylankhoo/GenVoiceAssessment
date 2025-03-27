import Link from "next/link";
import { getUser } from "@/actions/users";
import { Button } from "./button";
import LogOutButton from "./logoutbutton";

async function Header() {
  const user = await getUser();
  const adminUser = user ? user.email === "admin@mailinator.com" : false;
  return (
    <header className="relative flex h-24 w-full items-center justify-between px-3 sm:px-8">
      <div className="flex items-center gap-4">
        <h1 className="flex flex-col pb-1 text-2xl font-bold leading-4">
          GenVoice Assessment
        </h1>
      </div>
      <div className="flex gap-2">
        {adminUser && (
          <Button asChild>
            <Link href="/admin">Admin</Link>
          </Button>
        )}
        {user ? (
          <>
            <Button asChild>
              <Link href="/view">Home</Link>
            </Button>
            <Button asChild>
              <Link href="/survey">New Survey</Link>
            </Button>
            <Button asChild>
              <Link href="/settings">Settings</Link>
            </Button>
            <LogOutButton />
          </>
        ) : (
          <>
            <Button asChild>
              <Link href="/register">Register</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/login">Login</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
