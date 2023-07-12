import { boolean, datetime, index, mysqlTable, smallint, varchar } from "drizzle-orm/mysql-core";

export const periodsTable = mysqlTable(
    "period_schedules",
    {
        id: varchar("id", { length: 15 }).primaryKey(),
        userId: varchar("user_id", { length: 15 }).notNull(),

        name: varchar("name", { length: 128 }).notNull(),
        timeStart: datetime("time_start").notNull(),
        timeEnd: datetime("time_end").notNull(),
    },
    (period) => ({
        userIndex: index("user_idx").on(period.userId),
    })
);

export const lessonsTable = mysqlTable(
    "period_lessons",
    {
        id: varchar("id", { length: 15 }).primaryKey(),
        userId: varchar("user_id", { length: 15 }).notNull(),

        name: varchar("name", { length: 128 }).notNull(),
        timeStart: datetime("time_start").notNull(),
        timeEnd: datetime("time_end").notNull(),

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
