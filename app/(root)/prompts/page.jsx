'use client'
import { useEffect, useState } from "react";
import Link from "next/link"; // Import Next.js Link component
import { getAllPrompts } from "@lib/actions/prompt.action";

const PromptPage = () => {
  const [prompts, setPrompts] = useState([]);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const data = await getAllPrompts(); // Fetch prompts
        setPrompts(data); // Set prompts in state
      } catch (error) {
        console.error("Error fetching prompts:", error);
      }
    };

    fetchPrompts(); // Fetch prompts when component mounts
  }, []);

  return (
    <div>
      <h1>Prompts</h1>
      <ul>
        {prompts.map((prompt) => (
          <li key={prompt._id}>
            <h2>{prompt.prompt}</h2>
            <p>Site: {prompt.site}</p>
            <p>Author: {prompt.author.username}</p>
            <p>Author: {prompt.author.email}</p>
            <p>Created At: {new Date(prompt.createdAt).toLocaleDateString()}</p>
            {/* Use Link component for client-side navigation */}
            <Link className="text-blue-500 hover:underline" href={`/prompts/${prompt._id}`}>
              View More
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PromptPage;
