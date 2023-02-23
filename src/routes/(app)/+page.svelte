<script lang="ts">
    import type { Class } from "$lib/Types";
    import ScheduleView from "$lib/components/ScheduleView.svelte";
    import dayjs from "dayjs";
    import mongoose from "mongoose";

    let schedule: Class[] = [
        {
            _id: new mongoose.Types.ObjectId(),
            name: "aName",
            group: 105,
            local: "B-105",
            type: "L",
            teacher: "asdjkfwlbk",
            virtual: false,
            timeStart: dayjs().hour(6).minute(8),
            timeEnd: dayjs().hour(8).minute(0),
        },
        {
            _id: new mongoose.Types.ObjectId(),
            name: "aName",
            group: 105,
            local: "B-105",
            type: "L",
            teacher: "asdjkfwlbk",
            virtual: false,
            timeStart: dayjs().hour(14).minute(30),
            timeEnd: dayjs().hour(16).minute(0),
        },
    ];
</script>

<ScheduleView {schedule} />
