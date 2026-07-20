import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DesktopAuthClient from "./DesktopAuthClient";

export default async function DesktopAuthPage() {
  const session = await auth();

  if (!session) {
    redirect("/login?callbackUrl=/desktop-auth");
  }

  return <DesktopAuthClient />;
}
