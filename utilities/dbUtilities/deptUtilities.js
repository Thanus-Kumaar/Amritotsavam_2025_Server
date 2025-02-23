import { logError } from "../errorLogger.js";

const checkDeptIDsExists = async function (deptIDs, db) {
    try {
        await db.query("LOCK TABLES deptData READ");
        const [result] = await db.query(
            "SELECT deptID FROM deptData WHERE deptID IN (?)",
            [deptIDs],
        );
        await db.query("UNLOCK TABLES");
        if (result.length != deptIDs.length) {
            return "Some or all dept IDs not found in database";
        }
        return null;
    } catch (err) {
        logError(err, "checkDeptIDsExists", "db");
        return "Error Occured";
    }
};

// Check if a duplicate dept exists
const checkDuplicateDept = async function ({
    deptName,
    deptAbbrevation,
    db,
    excludeDeptID = null,
}) {
    try {
        await db.query("LOCK TABLES deptData READ");
        let query = `
      SELECT * FROM deptData
      WHERE (deptName = ? OR deptAbbrevation = ?)
    `;
        const params = [deptName, deptAbbrevation];

        // Exclude the current dept ID for edit operations
        if (excludeDeptID) {
            query += " AND deptID != ?";
            params.push(excludeDeptID);
        }

        const [result] = await db.query(query, params);
        return result.length > 0; // Return true if duplicate exists
    } catch (error) {
        logError(error, "deptModule:checkDuplicateDept", "db");
        throw error;
    } finally {
        db.query("UNLOCK TABLES");
        db.release();
    }
};

export { checkDeptIDsExists, checkDuplicateDept };
