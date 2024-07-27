import { getUserPromptsByUsername } from "@lib/actions/prompt.action"
import Link from "next/link"

const page = async ({ params: { username } }) => {
    const data = await getUserPromptsByUsername(username)

    return (
        <div>
            <h1>Prompts for {username}</h1>
            {data.length === 0 ? (
                <p>No prompts found for this user.</p>
            ) : (
                <ul>
                    {data.map((prompt) => (
                        <li key={prompt._id}>
                            <h2>{prompt.prompt}</h2>
                            <p>{prompt.site}</p>
                            <Link href={`/prompts/${prompt._id}`}>View More</Link>
                        </li>
                    ))}
                </ul>
            )}

        </div>
    )
}

export default page