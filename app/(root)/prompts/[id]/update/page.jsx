import { getUserById } from "@/lib/actions/user.actions";
import { getPromptById } from "@lib/actions/prompt.action";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CreatePromptForm from "@components/shared/CreatePromptForm";

const page = async ({ params: { id } }) => {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const user = await getUserById(userId);
  const prompt = await getPromptById(id);

  return (
    <div>
      <h1>Update Page</h1>
      <CreatePromptForm
        action='Update'
        userId={user._id}
        data={prompt}
      />
    </div>
  )
}

export default page