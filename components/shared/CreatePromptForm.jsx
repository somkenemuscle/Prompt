"use client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { defaultValues } from "@constants/defaultvalues"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"

import {
    Form,
} from "@/components/ui/form"
import { CustomField } from "./CustomField"
import { createPrompt, updatePrompt } from "@lib/actions/prompt.action"

//Define form schema
export const formSchema = z.object({
    prompt: z.string().min(1, "A Prompt is required"),
    site: z.string().min(1, "The Site is required"),
});

const CreatePromptForm = ({ action, data = null, userId }) => {

    const router = useRouter();

    const initialValues = data && action === 'Update' ? {
        prompt: data?.prompt,
        site: data?.site
    } : defaultValues

    // 1. Define your form.
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: initialValues
    });

    // 2. Define a submit handler.
    async function onSubmit(values) {

        const promptData = {
            prompt: values.prompt,
            site: values.site
        }

        if (action === 'Add') {
            try {
                const newPrompt = await createPrompt({
                    prompt: promptData,
                    userId,
                    path: '/'
                });
                if (newPrompt) {
                    form.reset()
                    router.push(`/prompts/${newPrompt._id}`)
                }
            } catch (error) {
                console.log(error);

            }
        }

        if (action === 'Update') {
            try {
                const updatedPrompt = await updatePrompt({
                    prompt: {
                        ...promptData,
                        _id: data._id
                    },
                    userId,
                    path: `/prompts/${data._id}`
                });
                if (updatedPrompt) {
                    router.push(`/prompts/${updatedPrompt._id}`)
                }
            } catch (error) {
                console.log(error);

            }
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <CustomField
                    control={form.control}
                    name='prompt'
                    formLabel='Enter Your Prompt'
                    className='w-full'
                    render={({ field }) => <Textarea {...field} />}
                />
                <CustomField
                    control={form.control}
                    name='site'
                    formLabel='Let us know the site'
                    className='w-full'
                    render={({ field }) => <Input {...field} />}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>

    )
}

export default CreatePromptForm