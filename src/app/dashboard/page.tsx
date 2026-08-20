import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import KnowledgeUI from "../components/knowledgeUI";
export default async function Dashboard() {

  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return (
    <KnowledgeUI/>
  );
}