import { readFile } from "fs";
import { appConfig } from "../../config/config.js";
import { amritotsavamDb, transactionsDb } from "../poolConnection.js";

const initDatabase = async (dbName) => {
    if (dbName == appConfig.db.amritotsavam.database) {
        const db_conn = await amritotsavamDb.promise().getConnection();
        try {
            readFile(
                "./db/schema/amritotsavamSchema.sql",
                "utf8",
                async (err, data) => {
                    if (err) {
                        console.error(err);
                        return;
                    } else {
                        await db_conn.query(data);
                        console.info(`[LOG]: Database ${dbName} Initialized.`);
                    }
                },
            );
        } catch (err) {
            console.error(err);
            return;
        } finally {
            db_conn.release(); // Ensure the connection is always released
        }
    } else if (dbName == appConfig.db.transactions.database) {
        const db_conn = await transactionsDb.promise().getConnection();
        try {
            readFile(
                "./db/schema/transactionSchema.sql",
                "utf8",
                async (err, data) => {
                    if (err) {
                        console.error(err);
                        return;
                    } else {
                        await db_conn.query(data);
                        console.info(`[LOG]: Database ${dbName} Initialized.`);
                    }
                },
            );
        } catch (err) {
            console.error(err);
            return;
        } finally {
            db_conn.release(); // Ensure the connection is always released
        }
    }
};

export default initDatabase;
