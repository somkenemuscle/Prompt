'use client'
import { useEffect, useState } from "react";
import Link from "next/link"; // Import Next.js Link component
import { getAllPrompts } from "@lib/actions/prompt.action";
import Image from "next/image";

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
    <div className="cursor-pointer mt-40 mb-4 container mx-auto max-w-lg border border-gray-300 rounded-lg p-0">
      <ul className="flex flex-col ">
        {prompts.map((prompt) => (
          <li key={prompt._id} className="flex p-4 border-b border-gray-200">
            <div className="flex flex-col flex-grow">
              <div className="flex items-center mb-2">
                <Link href={`/profile/${prompt.author.username}/`}>
                  <Image
                    src={prompt.author.photo} // Replace with actual avatar source
                    alt="profilepic"
                    width={100}
                    height={100}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                </Link>
                <p className="text-black">
                  {prompt.author.username} <span className="text-gray-500">@{prompt.author.username}.</span>  <span className="text-gray-500 text-sm">{new Date(prompt.createdAt).toLocaleDateString()}</span>
                </p>
              </div>

              <h4 className="text-md font-normal mb-2">{prompt.prompt}</h4>
              {prompt.img ? (
                <Image
                  alt="prompt-image"
                  src={prompt.img}
                  width={200}
                  height={200}
                  layout="responsive"
                  className="w-full rounded-lg mt-4 mb-2"
                />
              ) : null}
              <Link className="text-blue-500 hover:underline text-sm mt-2" href={`/prompts/${prompt._id}`}>
                View More
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>

  );
};

export default PromptPage;
