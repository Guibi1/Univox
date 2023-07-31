import { getWeekCommonOccupations } from "$lib/commonOccupations";
import { scheduleFromJson } from "$lib/sanitization";
import * as db from "$lib/server/db";
import type { Period } from "$lib/types";
import dayjs from "dayjs";
import type { PageServerLoad } from "./$types";

export const load = (({ locals, url }) => {
    const friendId = url.searchParams.get("friendId");
    const groupId = Number.parseInt(url.searchParams.get("groupId") ?? "");
    const isCommonSchedule = url.searchParams.get("commonSchedule") !== null;

    const group = Promise.resolve(groupId ? db.getGroupWithUsers(groupId) : null);

    const getSchedule = async () => {
        const grp = await group;
        if (grp) {
            const membersCombinedPeriods: Period[] = [];
            for (const user of grp.users) {
                const memberSchedule = scheduleFromJson(await db.getSchedule(user));
                membersCombinedPeriods.push(...memberSchedule.periods, ...memberSchedule.classes);
            }

            return getWeekCommonOccupations(dayjs(), membersCombinedPeriods);
        }

        if (friendId && (await db.getFriendsId(locals.user)).some((id) => id === friendId)) {
            const friend = await db.getUser(friendId);

            if (friend) {
                if (isCommonSchedule) {
                    const friendScheduleToCompare = scheduleFromJson(await db.getSchedule(friend));
                    const localUserSchedule = scheduleFromJson(await db.getSchedule(locals.user));

                    return getWeekCommonOccupations(dayjs(), [
                        ...friendScheduleToCompare.periods,
                        ...friendScheduleToCompare.classes,
                        ...localUserSchedule.periods,
                        ...localUserSchedule.classes,
                    ]);
                } else {
                    return await db.getSchedule(friend);
                }
            }
        }
        return null;
    };

    return {
        friendId,
        streamed: {
            group,
            schedule: getSchedule(),
        },
    };
}) satisfies PageServerLoad;
