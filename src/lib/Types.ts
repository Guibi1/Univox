import type { Dayjs } from "dayjs";

export type Book = {
    id: string;
    title: string;
    ISBN: string;
    src: string;
    author: string;
    price: number;
    state: string;
};

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

export enum Weekday {
    Monday = 0,
    Tuesday = 1,
    Wednesday = 2,
    Thursday = 3,
    Friday = 4,
}
