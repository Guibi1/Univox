import schoolNames from "$lib/schoolNames.js";

export function load({ locals }) {
    const domain = locals.user.email.split("@")[1];

    return { schoolName: schoolNames.get(domain) ?? domain };
}
