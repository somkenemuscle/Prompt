"use server";
import { revalidatePath } from "next/cache"; // Importing revalidatePath for cache revalidation
import Prompt from "../database/models/prompt.model"; // Importing the Prompt model
import { connectToDatabase } from "../database/mongoose"; // Importing the function to connect to MongoDB
import { handleError } from "../utils"; // Importing the error handler function
import User from "@lib/database/models/user.model";
import { redirect } from "next/navigation";

const populateUser = (query) => query.populate({
    path: 'author',
    model: User,
    select: '_id username email clerkId photo'
});

// CREATE: Function to create a new prompt
export async function createPrompt({ prompt, userId, path }) {
    try {
        await connectToDatabase(); // Connect to MongoDB

        const author = await User.findById(userId);

        if (!author) {
            throw new Error('user not found');
        }

        const newPrompt = await Prompt.create({
            ...prompt,
            author: author._id
        }); // Create a new prompt in the database

        revalidatePath(path);

        return JSON.parse(JSON.stringify(newPrompt)); // Return the newly created prompt as a plain object
    } catch (error) {
        handleError(error); // Handle any errors
    }
}

// READ: Function to get a prompt by its ID
export async function getPromptById(promptId) {
    try {
        await connectToDatabase(); // Connect to MongoDB

        const prompt = await populateUser(Prompt.findById(promptId)); // Find the prompt by its ID

        if (!prompt) throw new Error("Prompt not found"); // If prompt is not found, throw an error

        return JSON.parse(JSON.stringify(prompt)); // Return the prompt as a plain object
    } catch (error) {
        handleError(error); // Handle any errors
    }
}

// UPDATE: Function to update a prompt's information
export async function updatePrompt({ prompt, userId, path }) {
    try {
        await connectToDatabase(); // Connect to MongoDB

        const promptToUpdate = await Prompt.findById(prompt._id);

        if (!promptToUpdate || promptToUpdate.author.toHexString() !== userId) {
            throw new Error("Unauthorized or prompt not found");
        }

        const updatedPrompt = await Prompt.findByIdAndUpdate(
            promptToUpdate._id,
            prompt,
            { new: true }
        )

        revalidatePath(path);

        return JSON.parse(JSON.stringify(updatedPrompt));
    } catch (error) {
        handleError(error); // Handle any errors
    }
}

// DELETE: Function to delete a prompt
export async function deletePrompt(promptId) {
    try {
        await connectToDatabase(); // Connect to MongoDB

        // Find the prompt to delete
        const promptToDelete = await Prompt.findById(promptId);

        if (!promptToDelete) {
            throw new Error("Prompt not found"); // If prompt is not found, throw an error
        }

        // Delete the prompt
        await Prompt.findByIdAndDelete(promptToDelete._id);

    } catch (error) {
        handleError(error); // Handle any errors
    } finally {
        redirect('/profile');
    }
}

//READ ALL: Function to get all prompts
export async function getAllPrompts() {
    try {
        await connectToDatabase(); // Connect to MongoDB

        const prompts = await populateUser(
            Prompt.find().sort({ updatedAt: -1 }) // Find all prompts, populate author field, and sort by updatedAt in descending order
        );

        if (!prompts) throw new Error("No prompts found"); // If no prompts are found, throw an error

        return JSON.parse(JSON.stringify(prompts)); // Return the prompts as a plain object
    } catch (error) {
        handleError(error); // Handle any errors
    }
}

// READ ALL USER PROMPTS: Function to get all prompts for a specific user
export async function getUserPrompts(userId) {
    try {
        await connectToDatabase(); // Connect to MongoDB

        const prompts = await populateUser(Prompt.find({ author: userId }).sort({ updatedAt: -1 })); // Find all prompts by the user and populate author field

        if (!prompts) throw new Error("No prompts found for this user"); // If no prompts are found, throw an error

        return JSON.parse(JSON.stringify(prompts)); // Return the prompts as a plain object
    } catch (error) {
        handleError(error); // Handle any errors
    }
}

// READ ALL USER PROMPTS: Function to get all prompts for a specific user by username
export async function getUserPromptsByUsername(username) {
    try {
        await connectToDatabase(); // Connect to MongoDB

        // Find the user by username
        const user = await User.findOne({ username });

        if (!user) {
            throw new Error("User not found"); // If the user is not found, throw an error
        }

        // Find all prompts by the user's ID
        const prompts = await populateUser(Prompt.find({ author: user._id }).sort({ updatedAt: -1 }));

        if (!prompts || prompts.length === 0) {
            throw new Error("No prompts found for this user"); // If no prompts are found, throw an error
        }

        return JSON.parse(JSON.stringify(prompts)); // Return the prompts as a plain object
    } catch (error) {
        handleError(error); // Handle any errors
    }
}

