import { Schema, model, models } from "mongoose";

const PromptSchema = new Schema({
    prompt: {
        type: String,
        required: true
    },
    site: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Prompt = models?.Prompt || model("Prompt", PromptSchema);

export default Prompt;