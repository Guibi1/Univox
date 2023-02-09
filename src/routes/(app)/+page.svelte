<script lang="ts">
    import { Weekday, type Class } from "$lib/Types";
    import dayjs from "dayjs";

    /*
    this is just for reference, please don't delete

    export type Class = {
    id: string;
    name: string;
    group: number;
    local: string;
    type: "T" | "L";
    teacher: string;
    virtual: boolean;
    weekday: Weekday;
    timeStart: Dayjs;
    timeEnd: Dayjs;
    };
    */

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
            timeStart: dayjs().hour(12),
            timeEnd: dayjs().hour(14),
        },
    ];
</script>

<body>
    <table>
        <tr>
            <th>Company</th>
            <th>Contact</th>
            <th>Country</th>
        </tr>
        <tr class="text-center">
            <td>Alfreds Futterkiste</td>
            <td>Maria Anders</td>
            <td>Germany</td>
        </tr>
        <tr class="text-center">
            <td>Centro comercial Moctezuma</td>
            <td>Francisco Chang</td>
            <td>Mexico</td>
        </tr>
    </table>
</body>
