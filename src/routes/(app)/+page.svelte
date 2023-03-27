<script lang="ts">
    import ScheduleView from "$lib/components/ScheduleView.svelte";
    import type { Class } from "$lib/Types";
    import dayjs from "dayjs";
    import mongoose from "mongoose";

    let schedule: Class[] = [
        {
            _id: new mongoose.Types.ObjectId(),
            code: "601-101-MQ",
            name: "Yey c'est le 2",
            group: 105,
            local: "B-105",
            type: "L",
            teacher: "asdjkfwlbk",
            virtual: false,
            timeStart: dayjs().date(2).hour(6).minute(0),
            timeEnd: dayjs().date(2).hour(8).minute(0),
        },
        {
            _id: new mongoose.Types.ObjectId(),
            code: "601-101-MQ",
            name: "aName",
            group: 105,
            local: "B-105",
            type: "L",
            teacher: "asdjkfwlbk",
            virtual: false,
            timeStart: dayjs().hour(14).minute(0),
            timeEnd: dayjs().hour(16).minute(0),
        },
        {
            _id: new mongoose.Types.ObjectId(),
            code: "601-101-MQ",
            name: "BName",
            group: 105,
            local: "B-105",
            type: "L",
            teacher: "asdjkfwlbk",
            virtual: false,
            timeStart: dayjs().weekday(6).hour(16).minute(30),
            timeEnd: dayjs().weekday(6).hour(20).minute(0),
        },
    ];
</script>

<svelte:head>
    <title>Univox</title>
</svelte:head>

<ScheduleView {schedule} />
