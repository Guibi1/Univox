import type { Schedule } from "$lib/Types";
import dayjs from "dayjs";
import mongoose, { Schema } from "mongoose";

const ScheduleSchema = new Schema<Schedule>({
    periods: {
        type: [
            {
                code: String,
                name: String,
                group: Number,
                local: String,
                type: String,
                teacher: String,
                virtual: Boolean,
                timeStart: dayjs.Dayjs,
                timeEnd: dayjs.Dayjs,
            },
        ],
        required: true,
        default: [],
    },
});

const Schedules = mongoose.models["schedules"] ?? mongoose.model("schedules", ScheduleSchema);
export default Schedules;
