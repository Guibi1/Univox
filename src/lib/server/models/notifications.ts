import { NotificationKind, type Notification } from "$lib/Types";
import mongoose, { Schema } from "mongoose";

const NotificationSchema = new Schema<Notification>({
    kind: {
        type: Number,
        enum: NotificationKind,
        required: true,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
});

const Notifications =
    mongoose.models["notifications"] ?? mongoose.model("notifications", NotificationSchema);
export default Notifications;
