<script lang="ts">
    import { Weekday, type Class } from "$lib/Types";
    import ScheduleView from "$lib/components/ScheduleView.svelte";
    // import user from "$lib/stores/user";
    import dayjs from "dayjs";

    let schedule: Class[] = [
        {
            id: "theIDLOL",
            name: "aName",
            group: 105,
            local: "B-105",
            type: "L",
            teacher: "asdjkfwlbk",
            virtual: false,
            weekday: Weekday.Friday,
            timeStart: dayjs().hour(6).minute(8),
            timeEnd: dayjs().hour(8).minute(0),
        },
        {
            id: "theIDLOL",
            name: "aName",
            group: 105,
            local: "B-105",
            type: "L",
            teacher: "asdjkfwlbk",
            virtual: false,
            weekday: Weekday.Wednesday,
            timeStart: dayjs().hour(14).minute(30),
            timeEnd: dayjs().hour(16).minute(0),
        },
    ];
</script>

<ScheduleView {schedule} />
