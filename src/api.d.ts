/**
 * This file is generated by sveltekit-api-fetch.
 * Do not edit it, as it will be overwritten.
 * Learn more here: https://github.com/Guibi1/sveltekit-api-fetch
 */

type ProjectAPI = {
    GET: {
        "/api/books": { searchParams: { query: string; codes: string; page: string; } };
        "/api/books/[bookId]": { routeParams: { bookId: string } };
        "/api/friends": never;
        "/api/groups": never;
        "/api/notifications": never;
        "/api/schedule": never;
        "/api/user": never;
        "/api/user/search": { searchParams: { query: string; } };
    };
    POST: {
        "/api/friends": { body: { friendId: string } };
        "/api/groups": { body: { name: string; usersId: string[] } };
        "/api/groups/invite": { body: { groupId: string; usersId: string[] } };
        "/api/groups/members": { body: { groupId: string } };
        "/api/groups/name": { body: { groupId: string; name: string } };
        "/api/notifications": { body: { kind: string; receiverId: string } };
        "/api/schedule": { body: { period: { name: string; id: number; timeStart: string; timeEnd: string; } } };
        "/api/user/avatar": { body: { avatar: string } };
    };
    PUT: {
        "/api/settings/colorScheme": { body: { colorScheme: string } };
    };
    DELETE: {
        "/api/books/[bookId]": { routeParams: { bookId: string } };
        "/api/friends": { body: { friendId: string } };
        "/api/groups": { body: { groupId: string } };
        "/api/notifications": { body: { notificationId: number } };
        "/api/schedule": { body: { periodId: number } };
    };
};
