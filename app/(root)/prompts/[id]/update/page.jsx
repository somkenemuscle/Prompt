import { getUserById } from "@/lib/actions/user.actions";
import { getPromptById } from "@lib/actions/prompt.action";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CreatePromptForm from "@components/shared/CreatePromptForm";

const UpdateHomePage = async ({ params: { id } }) => {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const user = await getUserById(userId);
  const prompt = await getPromptById(id);

  return (
    <div className="mt-6">
      <CreatePromptForm
        action='Update'
        userId={user._id}
        data={prompt}
        header='Update Prompt'
      />
    </div>
  )
}

export default UpdateHomePage