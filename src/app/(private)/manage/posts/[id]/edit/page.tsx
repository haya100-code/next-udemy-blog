import { notFound } from "next/navigation";
import EditPostForm from "./EditPostForm";
import { auth } from "@/auth";
import { getOwnPost } from "@/lib/ownPost";

type PageProps = {params:Promise<{id: string}>}

export default async function EditPage({params}:PageProps) {
  const { id } = await params;
  const session = await auth();
  const userId = session?.user?.id;
  if (!session?.user?.email || !userId) {throw new Error("不正なリクエストです")}
  const post = await getOwnPost(userId, id);
  if (!post) {notFound()}

  return (
    <EditPostForm post = {post} />
  )
}
