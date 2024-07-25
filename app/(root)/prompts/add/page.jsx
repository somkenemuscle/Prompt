// Import necessary components and functions
import CreatePromptForm from "@components/shared/CreatePromptForm"; // Component to render the form for creating a prompt
import { getUserById } from "@lib/actions/user.actions"; // Function to fetch user details by ID
import { auth } from '@clerk/nextjs/server'; // Clerk authentication utility for accessing current user
import { redirect } from "next/navigation"; // Function to handle page redirection

const CreatePromptPage = async () => {
  // Retrieve the current user's ID from Clerk authentication
  const { userId } = auth();
  
  // Redirect to the sign-in page if the user ID is not found (i.e., user is not authenticated)
  if (!userId) redirect('/sign-in');

  // Fetch the user details from the database using the retrieved user ID
  const user = await getUserById(userId);

  return (
    <div className="mt-36">
      <h1>Create Prompt</h1> 
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. At deserunt, magnam accusantium iure voluptates ab voluptate ex maiores dignissimos.</p> 
      
      {/* Render the form for creating a prompt, passing the action type and user ID */}
      <CreatePromptForm
        action='Add' 
        userId={user._id} 
      />
    </div>
  );
}

export default CreatePromptPage;
