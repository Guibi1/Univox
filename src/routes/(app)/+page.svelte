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

    let timeParsing : number = 10;

    const dayOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

    let matrixSchedule : Class[] = [];

    for (let day in Weekday) {
        for (let periodNumber in schedule) {
            let timePeriodStartParsed = schedule[periodNumber].timeStart.hour() * 60 / timeParsing;
            let timePeriodEndParsed = schedule[periodNumber].timeEnd.hour() * 60 / timeParsing;
            // for each periods in the day, if the period is within the parsed time periods, put the period in there
            for (let i = 0; i < 24*60; i += timeParsing) {
                if (timePeriodStartParsed >= i && i >= timePeriodEndParsed) {
                    matrixSchedule[i/timeParsing] = schedule[periodNumber];
                }
            }
        }
    }
    //! fill somwhere the empty periods with something so html is still created but with no text


</script>

<body>
    <table class="w-3/5 border-2">
        <tr>
            {#each dayOfWeek as day}
                <th>
                    {day}
                </th> 

                    {#each matrixSchedule as period}
                        <!-- Do something -->
                    {/each}
            {/each}
        </tr>   

       <tr> 
            <td>Alfreds Futterkiste</td>
            <td>Maria Anders</td>
            <td>Germany</td>
            <td>Alfreds Futterkiste</td>
            <td>Maria Anders</td>
            <td>Germany</td>
            <td>Alfreds Futterkiste</td>
        </tr>   
        <tr>
            <td>Centro comercial Moctezuma</td>
            <td>Francisco Chang</td>
            <td>Mexico</td>
        </tr>
        <tr>
            <td>Centro comercial Moctezuma</td>
            <td>Francisco Chang</td>
            <td>Mexico</td>
        </tr>
        <tr>
            <td>{schedule[0].name}</td>
            <td>Francisco Chang</td>
            <td>Mexico</td>
        </tr>
        <tr>
            <td>Centro comercial Moctezuma</td>
            <td>Francisco Chang</td>
            <td>Mexico</td>
        </tr>
        <tr>
            <td>Centro comercial Moctezuma</td>
            <td>Francisco Chang</td>
            <td>Mexico</td>
        </tr>
    </table>
</body>

<style>
    tr {
        text-align: center;
        height: 50px;
    }

    td {
        border-width: 2px;
    }

    th {
        border-width: 2px;
        width: 10rem;
    }
</style>
