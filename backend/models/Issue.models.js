import mongoose, { Schema } from "mongoose";

const issueSchema = new Schema({
    _id: Schema.Types.UUID,

    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    issueType: {
        type: String,
        enum: [
            'Road Infrastructure', 'Waste Management', 'Environmental Issues', 'Utilities & Infrastructure', 'Public Safety', 'Other'
        ],
        default: 'Road Infrastructure',
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: [
            'Reported', 'In Progress', 'Resolved', 'Rejected'
        ],
        default: 'Reported',
    },
    location: {
        type: Schema.Types.ObjectId,
        ref: 'Location',
    },
    media: {
        type: Schema.Types.ObjectId,
        ref: 'Multimedia',
    },
}, {timestamps: true})

export const Issue = mongoose.model('Issue', issueSchema)