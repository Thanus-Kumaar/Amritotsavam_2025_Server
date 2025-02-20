import { createPool } from "mysql2";
import { appConfig } from "../config/config.js";

const amritotsavamDb = createPool(appConfig.db.amritotsavam);
const transactionsDb = createPool(appConfig.db.transactions);

export { amritotsavamDb, transactionsDb };
