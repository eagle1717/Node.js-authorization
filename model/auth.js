import mongoose from "mongoose";

const authSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
        confirmation_link: {
            type: String,
            required: false,
        },
    },
    {
        // collection: "Users",
        versionKey: false,
    }
);

export default mongoose.model("User", authSchema);
