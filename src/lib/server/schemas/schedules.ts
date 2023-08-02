import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import {
    boolean,
    customType,
    index,
    mysqlTable,
    serial,
    smallint,
    varchar,
} from "drizzle-orm/mysql-core";

// Dayjs type for the mysql database
const mysqlDayjs = customType<{ data: Dayjs; driverData: Date }>({
    dataType: () => "datetime",
    toDriver: (value) => value.toDate(),
    fromDriver: (value) => dayjs(value),
});

export const periodsTable = mysqlTable(
    "period_schedules",
    {
        id: serial("id").primaryKey(),
        userId: varchar("user_id", { length: 15 }).notNull(),

        name: varchar("name", { length: 128 }).notNull(),
        timeStart: mysqlDayjs("time_start").notNull(),
        timeEnd: mysqlDayjs("time_end").notNull(),
    },
    (period) => ({
        userIndex: index("user_idx").on(period.userId),
    })
);

export const lessonsTable = mysqlTable(
    "period_lessons",
    {
        id: serial("id").primaryKey(),
        userId: varchar("user_id", { length: 15 }).notNull(),

        name: varchar("name", { length: 128 }).notNull(),
        timeStart: mysqlDayjs("time_start").notNull(),
        timeEnd: mysqlDayjs("time_end").notNull(),

        code: varchar("code", { length: 32 }).notNull(),
        group: smallint("group").notNull(),
        local: varchar("local", { length: 32 }).notNull(),
        theory: boolean("is_theory").notNull(),
        teacher: varchar("teacher", { length: 128 }).notNull(),
        virtual: boolean("is_virtual").notNull(),
    },
    (lesson) => ({
        userIndex: index("user_idx").on(lesson.userId),
    })
);
