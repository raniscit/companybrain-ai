import {
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <main className="p-10">
      <div className="flex gap-4">
        <SignInButton forceRedirectUrl="/dashboard">
          <button className="rounded bg-black px-4 py-2 text-white">
            Login
          </button>
        </SignInButton>

        <SignUpButton forceRedirectUrl="/dashboard">
          <button className="rounded border px-4 py-2">
            Sign Up
          </button>
        </SignUpButton>
      </div>
    </main>
  );
}