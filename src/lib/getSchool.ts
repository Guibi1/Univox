import type { User } from "lucia-auth";

export function getSchool(user: User) {
    const domain = user.email.split("@")[1];
    return schoolNames.get(domain) ?? domain;
}

const schoolNames = new Map([
    ["bdeb.qc.ca", "Collège Bois de Boulogne"],
    ["collegeahuntsic.qc.ca", "Collège Ahuntsic"],
]);
