"use client";

import { useTransition } from "react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deletePrompt } from "@lib/actions/prompt.action";
import { Button } from "../ui/button";

export const DeleteConfirmation = ({ promptId }) => {
    const [isPending, startTransition] = useTransition();

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild className="w-full rounded-full">
                <Button
                    type="button"
                    className="button h-[44px] w-full md:h-[54px]"
                    variant="destructive"
                >
                    Delete Prompt
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="flex flex-col gap-10">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you sure you want to delete this prompt?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="p-16-regular">
                        This will permanently delete this prompt
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className="border bg-red-500 text-white hover:bg-red-600"
                        onClick={() =>
                            startTransition(async () => {
                                await deletePrompt(promptId);
                            })
                        }
                    >
                        {isPending ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};