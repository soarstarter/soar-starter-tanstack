import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as authSchema from "./schema/auth";
import * as paymentSchema from "./schema/payment";

let pool: Pool | undefined;
let dbInstance: ReturnType<typeof createDb> | undefined;

function createDb() {
	const connectionString = process.env.DATABASE_URL;
	if (!connectionString) {
		throw new Error(
			"DATABASE_URL is required to initialize the database pool.",
		);
	}
	pool = new Pool({ connectionString });
	return drizzle(pool, {
		schema: {
			...authSchema,
			...paymentSchema,
		},
	});
}

export const db = new Proxy({} as ReturnType<typeof createDb>, {
	get(_target, prop, receiver) {
		if (!dbInstance) {
			dbInstance = createDb();
		}
		return Reflect.get(dbInstance, prop, receiver);
	},
});

export { pool };
