import mongoose, { Schema } from "mongoose";

const MultimediaSchema = new Schema({
    issueID: {
        type: Schema.Types.ObjectId,
        ref: 'Issue',
        required: true,
    },
    fileType: {
        type: String,
        enum: [
            'image', 'video'
        ],
        default: "",
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    }
},
{
    timestamps: true,
})

export const Multimedia = mongoose.model('Multimeda', MultimediaSchema)