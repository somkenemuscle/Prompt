import { clerkClient } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

import { createUser, deleteUser, updateUser } from "@/lib/actions/user.actions";

export async function POST(req) {
    // Retrieve the webhook secret from environment variables
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error("Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local");
    }

    // Get the headers
    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // Check for the presence of svix headers
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response("Error occurred -- no svix headers", { status: 400 });
    }

    // Get the body payload
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt;

    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        });
    } catch (err) {
        console.error("Error verifying webhook:", err);
        return new Response("Error occurred", { status: 400 });
    }

    // Extract the ID and event type from the event data
    const { id } = evt.data;
    const eventType = evt.type;

    // Handle user creation event
    if (eventType === "user.created") {
        const { id, email_addresses, image_url, username } = evt.data;

        const user = {
            clerkId: id,
            email: email_addresses[0].email_address,
            username: username,
            photo: image_url
        };

        const newUser = await createUser(user);

        // Set public metadata for the new user
        if (newUser) {
            await clerkClient.users.updateUserMetadata(id, {
                publicMetadata: {
                    userId: newUser._id,
                },
            });
        }

        return NextResponse.json({ message: "OK", user: newUser });
    }

    // Handle user update event
    if (eventType === "user.updated") {
        const { id, image_url, username } = evt.data;

        // Provide default values for firstName and lastName if they are null
        const user = {
            username: username,
            photo: image_url
        };

        const updatedUser = await updateUser(id, user);

        return NextResponse.json({ message: "OK", user: updatedUser });
    }

    // Handle user deletion event
    if (eventType === "user.deleted") {
        const { id } = evt.data;

        const deletedUser = await deleteUser(id);

        return NextResponse.json({ message: "OK", user: deletedUser });
    }

    // Log webhook details for debugging purposes
    console.log(`Webhook with an ID of ${id} and type of ${eventType}`);
    console.log("Webhook body:", body);

    return new Response("", { status: 200 });
}