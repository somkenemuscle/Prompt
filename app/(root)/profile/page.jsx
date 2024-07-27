import { getUserPrompts } from "@lib/actions/prompt.action";
import { getUserById } from "@lib/actions/user.actions";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

const ProfilePage = async () => {
  const { userId } = auth();

  // Redirect to the sign-in page if the user ID is not found (i.e., user is not authenticated)
  if (!userId) return null;

  // Fetch the user details from the database using the retrieved user ID
  const user = await getUserById(userId);

  const prompts = await getUserPrompts(user._id);

  return (
    <div>
      <h1>{user.username}'s Prompts</h1>
      <ul>
        {prompts.map((prompt) => (
          <li key={prompt._id}>
            <h2>{prompt.prompt}</h2>
            <p>{prompt.site}</p>
            <Link href={`/prompts/${prompt._id}`}>View More</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfilePage;
