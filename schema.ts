import { varchar, pgTable, integer, doublePrecision, timestamp, pgEnum, index, serial, text } from "drizzle-orm/pg-core";

export const product = pgTable('product', {
    id: varchar('id', { length: 31 }).primaryKey(),
    name: varchar('name', { length: 63 }).notNull(),
    weight: doublePrecision('weight').notNull()
});

export const stock = pgTable('stock', {
    id: varchar('id', { length: 31 }).primaryKey(),
    productId: varchar('product_id', { length: 31 }).notNull().references(() => product.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    cost: integer('cost').notNull(),
    createdAt: timestamp('created_at', {withTimezone: true}).defaultNow(),
    updatedAt : timestamp('updated_at', {withTimezone: true}).defaultNow().$onUpdate(() => new Date()).notNull(),
    transactionId: varchar('transaction_id', { length: 31 }).notNull()
}, (table) => {
    return {
        productIdx: index("product_idx").on(table.productId)
    }
})

export const transactionStatus = pgEnum('transaction_status', ['PURCHASE', 'SALE']);

export const transaction = pgTable('transaction', {
    id: varchar('id', { length: 31 }).primaryKey(),
    status: transactionStatus('status').notNull(),
    createdAt: timestamp('created_at', {withTimezone: true}).defaultNow(),
    updatedAt : timestamp('updated_at', {withTimezone: true}).defaultNow().$onUpdate(() => new Date()).notNull(),
    totalPrice: integer('total_price').notNull(),
    profit: integer('profit').default(0)
}, (table) => {
    return {
        statusIdx: index("status_idx").on(table.status),
        createdAtIdx: index("created_at_idx").on(table.createdAt),
    }
})

export const transactionItem = pgTable('transaction_item', {
    id: serial('id').notNull().primaryKey(),
    transactionId : varchar('transaction_id', { length: 31 }).notNull().references(() => transaction.id),
    productId: varchar('product_id', { length: 31 }).notNull(),
    stockId: varchar('stock_id', { length: 31 }).notNull(),
    price: integer('price').notNull()
}, (table) => {
    return {
        transactionIdx: index("transaction_idx").on(table.transactionId),
    }
})

export const log = pgTable('logs', {
    id: serial('id').primaryKey(),
    detail: text('detail'),
    identifier: varchar('identifier', { length: 31 }),
    action: varchar('action', { length: 31 }),
    createdAt: timestamp('created_at', {withTimezone: true}).defaultNow()
})
