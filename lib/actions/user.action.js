"use server";

import { revalidatePath } from "next/cache"; // Importing revalidatePath for cache revalidation
import User from "../database/models/user.model"; // Importing the User model
import { connectToDatabase } from "../database/mongoose"; // Importing the function to connect to MongoDB
import { handleError } from "../utils"; // Importing the error handler function

// CREATE: Function to create a new user
export async function createUser(user) {
  try {
    await connectToDatabase(); // Connect to MongoDB

    const newUser = await User.create(user); // Create a new user in the database

    return JSON.parse(JSON.stringify(newUser)); // Return the newly created user as a plain object
  } catch (error) {
    handleError(error); // Handle any errors
  }
}

// // READ: Function to get a user by their ID
// export async function getUserById(userId) {
//   try {
//     await connectToDatabase(); // Connect to MongoDB

//     const user = await User.findOne({ clerkId: userId }); // Find the user by their Clerk ID

//     if (!user) throw new Error("User not found"); // If user is not found, throw an error

//     return JSON.parse(JSON.stringify(user)); // Return the user as a plain object
//   } catch (error) {
//     handleError(error); // Handle any errors
//   }
// }

// UPDATE: Function to update a user's information
export async function updateUser(clerkId, user) {
  try {
    await connectToDatabase(); // Connect to MongoDB

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true, // Return the updated user
    });

    if (!updatedUser) throw new Error("User update failed"); // If update fails, throw an error
    
    return JSON.parse(JSON.stringify(updatedUser)); // Return the updated user as a plain object
  } catch (error) {
    handleError(error); // Handle any errors
  }
}

// DELETE: Function to delete a user
export async function deleteUser(clerkId) {
  try {
    await connectToDatabase(); // Connect to MongoDB

    // Find the user to delete
    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error("User not found"); // If user is not found, throw an error
    }

    // Delete the user
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);

    // Revalidate the homepage path to update the content
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null; // Return the deleted user as a plain object or null
  } catch (error) {
    handleError(error); // Handle any errors
  }
}

