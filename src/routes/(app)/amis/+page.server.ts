import { getWeekCommonOccupations } from "$lib/commonOccupations";
import { scheduleFromJson } from "$lib/sanitization";
import * as db from "$lib/server/db";
import type { Period, Schedule } from "$lib/types";
import dayjs from "dayjs";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals, url }) => {
    const friendId = url.searchParams.get("friendId");
    const groupId = Number.parseInt(url.searchParams.get("groupId") ?? "");
    const isCommonSchedule = url.searchParams.get("commonSchedule") !== null;

    let schedule: Schedule | null = null;

    if (groupId) {
        const group = await db.getGroup(groupId);
        if (group) {
            const membersCombinedPeriods: Period[] = [];
            for (const userId of group.usersId) {
                const user = await db.getUser(userId);
                if (user) {
                    const memberSchedule = scheduleFromJson(await db.getSchedule(user));
                    membersCombinedPeriods.push(
                        ...memberSchedule.periods,
                        ...memberSchedule.classes
                    );
                }
            }

            schedule = getWeekCommonOccupations(dayjs(), membersCombinedPeriods);
        }
    } else if (friendId && (await db.getFriendsId(locals.user)).some((id) => id === friendId)) {
        const friend = await db.getUser(friendId);

        if (friend) {
            if (isCommonSchedule) {
                const friendScheduleToCompare = scheduleFromJson(await db.getSchedule(friend));
                const localUserSchedule = scheduleFromJson(await db.getSchedule(locals.user));

                schedule = getWeekCommonOccupations(dayjs(), [
                    ...friendScheduleToCompare.periods,
                    ...friendScheduleToCompare.classes,
                    ...localUserSchedule.periods,
                    ...localUserSchedule.classes,
                ]);
            } else {
                schedule = await db.getSchedule(friend);
            }
        }
    }

    return {
        friendId,
        groupId,
        schedule: schedule,
    };
}) satisfies PageServerLoad;
