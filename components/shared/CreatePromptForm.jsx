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
    img: z.string().url().min(1, "Kindly Choose an image")
});

const CreatePromptForm = ({ action, data = null, userId, header }) => {

    //hook to call the upload process to upload thing
    const { startUpload } = useUploadThing("media")

    //state to store the image file
    const [files, setFiles] = useState([]);
    
    //router to route to paths
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

 
    //function to handle image change
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
                console.log('error:', error);
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
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-3xl font-bold mb-9">{header}</h1>
            <Form className='mx-auto' {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="cursor-pointer mt-6 p-3" >
                    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg border-t-2 border-t-slate-100 space-y-8">
                        <CustomField
                            control={form.control}
                            name='site'
                            formLabel='Let us know the site'
                            className='w-full'
                            render={({ field }) => (
                                <Input {...field} className="w-full px-3 py-2 border rounded-md focus:outline-none " />
                            )}
                        />
                        <CustomField
                            control={form.control}
                            name='prompt'
                            formLabel='Enter Your Prompt'
                            className='w-full'
                            render={({ field }) => (
                                <Textarea rows={4} {...field} className="w-full px-3 py-2 border rounded-md focus:outline-none" />
                            )}
                        />
                        <CustomField
                            control={form.control}
                            name='img'
                            formLabel='Pick an image'
                            className='w-full'
                            render={({ field }) => (
                                <>
                                    {field.value && (
                                        <img
                                            src={field.value}
                                            alt="Current image"
                                            className="mb-2 w-48 h-48 object-cover border rounded-md"
                                        />
                                    )}
                                    <Input
                                        accept="image/*"
                                        onChange={(e) => { handleImage(e, field.onChange) }}
                                        type='file'
                                        className="w-full px-3 py-2 border rounded-md focus:outline-none cursor-pointer"
                                    />
                                </>
                            )}
                        />
                        <Button type="submit" className="w-full px-4 py-2 bg-slate-950 text-white rounded-md hover:bg-slate-900 focus:outline-none focus:bg-slate-800">
                            Submit
                        </Button>
                    </div>
                </form>
            </Form>
        </div>



    )
}

export default CreatePromptForm