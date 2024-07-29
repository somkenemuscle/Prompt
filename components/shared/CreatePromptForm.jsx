"use client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { defaultValues } from "@constants/defaultvalues"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
    Form,
} from "@/components/ui/form"
import { CustomField } from "./CustomField"
import { createPrompt, updatePrompt } from "@lib/actions/prompt.action"
import { isBase64Image } from "@lib/utils"
import { useUploadThing } from "@lib/uploadthing"


//Define form schema
export const formSchema = z.object({
    prompt: z.string().min(1, "A Prompt is required"),
    site: z.string().min(1, "The Site is required"),
    img: z.string().url().min(1, "The url is required")
});

const CreatePromptForm = ({ action, data = null, userId }) => {

    const { startUpload } = useUploadThing("media")

    //state to store the image file
    const [files, setFiles] = useState([]);

    const router = useRouter();

    // Set initial form values based on action type and provided data
    const initialValues = data && action === 'Update' ? {
        prompt: data?.prompt,
        site: data?.site,
        img: data?.img
    } : defaultValues

    // Initialize the form with react-hook-form and Zod resolver
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: initialValues
    });


    function handleImage(e, fieldChange) {
        e.preventDefault();

        const fileReader = new FileReader();
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];

            setFiles(Array.from(e.target.files));

            if (!file.type.includes("image")) return;

            fileReader.onload = async (event) => {
                const imageDataUrl = event.target?.result?.toString() || "";
                fieldChange(imageDataUrl);
            };

            fileReader.readAsDataURL(file);
        }
    }



    // Form submission handler
    async function onSubmit(values) {

        const imageValue = values.img;
        const hasImageChanged = isBase64Image(imageValue);

        if (hasImageChanged) {
            const imgRes = await startUpload(files);
            if (imgRes && imgRes[0].url) {
                values.img = imgRes[0].url;
            }
        }


        const promptData = {
            prompt: values.prompt,
            site: values.site,
            img: values.img
        }

        if (action === 'Add') {
            try {
                const newPrompt = await createPrompt({
                    prompt: promptData,
                    userId
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
                    userId
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
                    name='site'
                    formLabel='Let us know the site'
                    className='w-96'
                    render={({ field }) => <Input {...field} />}
                />
                <CustomField
                    control={form.control}
                    name='prompt'
                    formLabel='Enter Your Prompt'
                    className='w-96'
                    render={({ field }) => <Textarea rows={4} {...field} />}
                />
                <CustomField
                    control={form.control}
                    name='img'
                    formLabel='Pick an image'
                    className='w-96'
                    render={({ field }) => <Input accept="image/*" onChange={(e) => { handleImage(e, field.onChange) }} type='file' />}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>

    )
}

export default CreatePromptForm