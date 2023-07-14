import { index, mysqlTable, serial, smallint, varchar } from "drizzle-orm/mysql-core";

export const booksTable = mysqlTable(
    "books",
    {
        id: serial("id").primaryKey(),
        userId: varchar("user_id", { length: 15 }).notNull(),
        title: varchar("title", { length: 128 }).notNull(),
        isbn: varchar("isbn", { length: 16 }).notNull(),
        image: varchar("image", { length: 256 }),
        author: varchar("author", { length: 128 }).notNull(),
        price: smallint("price").notNull(),
        state: varchar("state", { length: 128 }).notNull(),
        code: varchar("code", { length: 32 }).notNull(),
    },
    (book) => ({
        userIndex: index("user_idx").on(book.userId),
    })
);
