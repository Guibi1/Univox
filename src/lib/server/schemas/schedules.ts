import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { relations } from "drizzle-orm";
import {
    boolean,
    customType,
    index,
    int,
    mysqlTable,
    serial,
    smallint,
    varchar,
} from "drizzle-orm/mysql-core";
import { usersTable } from "./users";

// Dayjs type for the mysql database
const mysqlDayjs = customType<{ data: Dayjs; driverData: Date }>({
    dataType: () => "datetime",
    toDriver: (value) => value.toDate(),
    fromDriver: (value) => dayjs(value),
});

export const schedulesTable = mysqlTable(
    "schedules",
    {
        id: serial("id").primaryKey(),
        userId: varchar("userid", { length: 15 }).notNull(),
    },
    (schedule) => ({
        userIndex: index("useridx").on(schedule.userId),
    })
);

export const periodsTable = mysqlTable(
    "period_schedules",
    {
        id: serial("id").primaryKey(),
        scheduleId: int("scheduleid").notNull(),

        name: varchar("name", { length: 128 }).notNull(),
        timeStart: mysqlDayjs("time_start").notNull(),
        timeEnd: mysqlDayjs("time_end").notNull(),
    },
    (period) => ({
        scheduleIndex: index("scheduleidx").on(period.scheduleId),
    })
);

export const lessonsTable = mysqlTable(
    "period_lessons",
    {
        id: serial("id").primaryKey(),
        scheduleId: int("scheduleid").notNull(),

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
        scheduleIndex: index("scheduleidx").on(lesson.scheduleId),
    })
);

export const schedulesRelations = relations(schedulesTable, ({ one, many }) => ({
    user: one(usersTable, { fields: [schedulesTable.userId], references: [usersTable.id] }),
    periods: many(periodsTable),
    lessons: many(lessonsTable),
}));
export const periodsRelations = relations(periodsTable, ({ one }) => ({
    schedule: one(schedulesTable),
}));
export const lessonsRelations = relations(lessonsTable, ({ one }) => ({
    schedule: one(schedulesTable),
}));
