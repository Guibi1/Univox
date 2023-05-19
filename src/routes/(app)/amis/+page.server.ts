import type { Period, Schedule, User } from "$lib/Types";
import { getWeekCommonOccupations } from "$lib/commonOccupations";
import { arrayIdToString, objectIdToString, scheduleFromJson } from "$lib/sanitization";
import * as db from "$lib/server/db";
import dayjs from "dayjs";
import { isObjectIdOrHexString } from "mongoose";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals, url, depends }) => {
    depends("app:notifications");

    const query = url.searchParams.get("query") ?? "";
    const friendId = url.searchParams.get("friendId") ?? "";
    const groupId = url.searchParams.get("groupId") ?? "";
    const isCommonSchedule = url.searchParams.get("commonSchedule") !== null;

    let schedule: Schedule | null = null;

    if (isObjectIdOrHexString(groupId)) {
        const group = await db.getGroup(groupId);
        if (group) {
            const membersCombinedPeriods: Period[] = [];
            for (const userId of group.usersId) {
                const user = await db.getServerUser(userId);
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
    } else if (
        isObjectIdOrHexString(friendId) &&
        locals.user.friendsId.some((id) => id.equals(friendId))
    ) {
        const friend = await db.getServerUser(friendId);

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

    const result: { user: User; friendRequestSent: boolean }[] = [];

    const users = await db.searchUsers(locals.user, query);
    for (const user of users) {
        const friendRequestSent = await db.friendRequestExists(locals.user, user);
        result.push({ user: db.serverUserToUser(user), friendRequestSent });
    }

    return {
        query,
        friendId,
        groupId,
        schedule: objectIdToString(schedule),
        searchResults: arrayIdToString(result),
    };
}) satisfies PageServerLoad;
