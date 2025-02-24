import { amritotsavamDb } from "../db/poolConnection.js";
import {
    setResponseOk,
    setResponseBadRequest,
    setResponseInternalError,
} from "../utilities/response.js";
import { logError } from "../utilities/errorLogger.js";
import { checkDuplicateDept } from "../utilities/dbUtilities/deptUtilities.js";

const deptModule = {
    // Fetch all depts
    getAllDepts: async () => {
        const db = await amritotsavamDb.promise().getConnection();
        try {
            // Use READ lock to ensure data consistency during reading
            await db.query("LOCK TABLES deptData READ");

            const query = "SELECT * FROM deptData";
            const [result] = await db.query(query);

            return setResponseOk("Dept data fetched successfully", result);
        } catch (error) {
            logError(error, "deptModule:getAllDepts", "db");
            return setResponseInternalError();
        } finally {
            await db.query("UNLOCK TABLES"); // Unlock tables
            db.release();
        }
    },

    // Add a dept
    // TODO: when adding new department data, make sure to update the deptEventMapping too with new entries (the whole registration process relies on this.)
    addDept: async (deptData) => {
        const db = await amritotsavamDb.promise().getConnection();
        try {
            // Check if a duplicate dept exists
            const duplicateExists = await checkDuplicateDept({
                deptName: deptData.deptName,
                deptAbbrevation: deptData.deptAbbrevation,
                db,
            });
            if (duplicateExists) {
                return setResponseBadRequest(
                    "A dept with the same name or abbreviation already exists.",
                );
            }

            // Use WRITE lock to prevent other processes from modifying the table
            await db.query("LOCK TABLES deptData WRITE");

            const query = `
        INSERT INTO deptData (deptName, imageUrl, deptHead, deptAbbrevation, godName)
        VALUES (?, ?, ?, ?, ?)
      `;
            const values = [
                deptData.deptName,
                deptData.imageUrl,
                deptData.deptHead,
                deptData.deptAbbrevation,
                deptData.godName,
            ];
            const [result] = await db.query(query, values);

            // Check if insertion was successful
            if (result.affectedRows === 0) {
                return setResponseInternalError(
                    "Could not insert dept into the database.",
                );
            }

            return setResponseOk("Dept added successfully", result.insertId);
        } catch (error) {
            logError(error, "deptModule:addDept", "db");
            return setResponseInternalError();
        } finally {
            await db.query("UNLOCK TABLES"); // Unlock tables
            db.release();
        }
    },

    // Edit a dept
    editDept: async (deptData) => {
        const db = await amritotsavamDb.promise().getConnection();
        try {
            // Check if a duplicate dept exists
            const duplicateExists = await checkDuplicateDept({
                deptName: deptData.deptName,
                db,
                excludeDeptID: deptData.deptID,
            });
            if (duplicateExists) {
                return setResponseBadRequest(
                    "A dept with the same name already exists.",
                );
            }

            // Use WRITE lock to prevent other processes from modifying the table
            await db.query("LOCK TABLES deptData WRITE");

            const query = `
        UPDATE deptData 
        SET deptName = ? 
        WHERE deptID = ?
      `;
            const values = [
                deptData.deptName,
                deptData.deptID,
            ];
            const [result] = await db.query(query, values);

            if (result.affectedRows === 0) {
                return setResponseBadRequest(
                    "Dept not found or no changes made.",
                );
            }
            return setResponseOk("Dept updated successfully.");
        } catch (error) {
            logError(error, "deptModule:editDept", "db");
            return setResponseInternalError();
        } finally {
            await db.query("UNLOCK TABLES"); // Unlock tables
            db.release();
        }
    },

    // Remove a dept
    removeDept: async (deptID) => {
        const db = await amritotsavamDb.promise().getConnection();
        try {
            // Use WRITE lock to prevent other processes from modifying the table
            await db.query("LOCK TABLES deptData WRITE");

            const query = "DELETE FROM deptData WHERE deptID = ?";
            const [result] = await db.query(query, [deptID]);

            if (result.affectedRows === 0) {
                return setResponseBadRequest(
                    "Dept not found or already deleted.",
                );
            }
            return setResponseOk("Dept removed successfully.");
        } catch (error) {
            logError(error, "deptModule:removeDept", "db");
            return setResponseInternalError();
        } finally {
            await db.query("UNLOCK TABLES"); // Unlock tables
            db.release();
        }
    },
};

export default deptModule;
