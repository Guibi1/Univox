import { getWeekCommonOccupations } from "$lib/commonOccupations";
import { scheduleFromJson } from "$lib/sanitization";
import * as db from "$lib/server/db";
import type { Period, Schedule } from "$lib/types";
import dayjs from "dayjs";
import type { User } from "lucia-auth";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals, url, depends }) => {
    depends("friends:search");

    const query = url.searchParams.get("query") ?? "";
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

    const result: { user: User; friendRequestSent: boolean }[] = [];

    const users = query.length ? await db.searchUsers(locals.user, query) : [];
    for (const user of users) {
        const friendRequestSent = !!(await db.getNotificationIfItExists(
            locals.user,
            "FriendRequest",
            user
        ));
        result.push({ user: user, friendRequestSent });
    }

    return {
        query,
        friendId,
        groupId,
        schedule: schedule,
        searchResults: result,
    };
}) satisfies PageServerLoad;
