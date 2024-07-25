import { getPromptById } from "@lib/actions/prompt.action"
import { auth } from "@clerk/nextjs/server";
import { Button } from "@components/ui/button";
import Link from "next/link";
import { DeleteConfirmation } from "@components/shared/DeleteConfirmation";


const page = async ({ params: { id } }) => {
  const { userId } = auth();
  const prompt = await getPromptById(id);
  return (
    <div>
      <ul>
        <li>{prompt._id}</li>
        <li>{prompt.site}</li>
        <li>{prompt.prompt}</li>
        <li>{prompt.author.email}</li>
        <li>{prompt.author.username}</li>
      </ul>
      {userId === prompt.author.clerkId && (
        <div className="mt-4 space-y-4">
          <Button asChild type="button" className="submit-button capitalize">
            <Link href={`/prompts/${prompt._id}/update`}>
              Update Prompt
            </Link>
          </Button>

          <DeleteConfirmation promptId={prompt._id} />
        </div>
      )}
    </div>

  )
}

export default page