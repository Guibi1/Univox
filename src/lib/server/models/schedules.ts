import type { Class, Schedule } from "$lib/Types";
import mongoose, { Schema } from "mongoose";

const PeriodSchema = new Schema<Class>({
    code: { type: String, required: false },
    name: { type: String, required: true },
    group: { type: Number, required: false },
    local: { type: String, required: false },
    theory: { type: Boolean, required: false },
    teacher: { type: String, required: false },
    virtual: { type: Boolean, required: false },
    timeStart: { type: Date, required: true },
    timeEnd: { type: Date, required: true },
});

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
