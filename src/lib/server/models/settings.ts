import type { FirstDayOfTheWeek } from "$lib/stores/firstDayOfTheWeek";
import mongoose, { Schema } from "mongoose";

interface Settings {
    firstDayOfTheWeek: FirstDayOfTheWeek;
}

const SettingsSchema = new Schema<Settings>({
    firstDayOfTheWeek: {
        type: String,
        default: "Dimanche",
        required: true,
    },
});

const Settings = mongoose.models["settings"] ?? mongoose.model("settings", SettingsSchema);
export default Settings;
