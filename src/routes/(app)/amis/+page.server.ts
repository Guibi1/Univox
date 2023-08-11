import { getWeekCommonOccupations } from "$lib/commonOccupations";
import { scheduleToJson } from "$lib/sanitization";
import * as db from "$lib/server/db";
import type { Schedule } from "$lib/types";
import dayjs from "dayjs";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals, url }) => {
    const friendId = url.searchParams.get("friendId");
    const groupId = url.searchParams.get("groupId");
    const isCommonSchedule = url.searchParams.get("commonSchedule") !== null;

    const group = groupId ? await db.getGroupWithUsers(groupId) : null;

    const getSchedule: () => Promise<Schedule | undefined> = async () => {
        if (friendId) {
            const friend = await db.getUserIfFriend(locals.user, friendId);

            if (friend) {
                if (isCommonSchedule) {
                    const friendScheduleToCompare = await db.getSchedule(friend);
                    const localUserSchedule = await db.getSchedule(locals.user);

                    return getWeekCommonOccupations(dayjs(), [
                        ...friendScheduleToCompare.periods,
                        ...friendScheduleToCompare.lessons,
                        ...localUserSchedule.periods,
                        ...localUserSchedule.lessons,
                    ]);
                } else {
                    return await db.getSchedule(friend);
                }
            }
        } else if (group) {
            const schedules = group?.users.map((user) => db.getSchedule(user));

            return getWeekCommonOccupations(
                dayjs(),
                (await Promise.all(schedules)).flatMap((s) => [...s.periods, ...s.lessons])
            );
        }
    };

    return {
        friendId,
        group,
        streamed: {
            schedule: getSchedule().then((s) => (s ? scheduleToJson(s) : null)),
        },
    };
}) satisfies PageServerLoad;
