import mongoose, { Schema } from "mongoose";

const LocationSchema = new Schema({
    _id: Schema.Types.UUID,

    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
    address: String,
})

export const Location = mongoose.model('Location', LocationSchema)