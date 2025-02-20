import { amritotsavamDb, transactionsDb } from "../db/poolConnection.js";
import {
    setResponseOk,
    setResponseBadRequest,
    setResponseInternalError,
} from "../utilities/response.js";
import { logError } from "../utilities/errorLogger.js";
import { isUserExistsByUserID } from "../utilities/dbUtilities/common.js";

const profileModule = {
    getUserProfile: async (userID) => {
        const db = await amritotsavamDb.promise().getConnection();
        const transactionDB = await transactionsDb.promise().getConnection();
        try {
            const userExists = await isUserExistsByUserID(userID, db);
            if (!userExists || userExists == null) {
                return setResponseBadRequest("User not found");
            }

            await db.query(
                "LOCK TABLES userData READ, registrationData READ, groupDetail READ, eventData READ",
            );
            const query = `
            SELECT 
                userData.userID,
                userData.userEmail,
                userData.userName,
                userData.rollNumber,
                userData.phoneNumber,
                userData.userDepartment,
                userData.academicYear,
                (SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'registrationID', registrationData.registrationID,
                        'eventID', groupDetail.eventID,
                        'eventName', eventData.eventName,
                        'txnID', registrationData.txnID,
                        'amountPaid', registrationData.amountPaid,
                        'totalMembers', registrationData.totalMembers,
                        'teamName', registrationData.teamName,
                        'registrationStatus', registrationData.registrationStatus,
                        'roleDescription', groupDetail.roleDescription
                    )
                )
                FROM registrationData
                JOIN groupDetail ON groupDetail.registrationID = registrationData.registrationID
                JOIN eventData ON eventData.eventID = registrationData.eventID
                WHERE groupDetail.userID = userData.userID
                ) AS registrations
            FROM 
                userData 
            WHERE userData.userID = ?;
        `;

            const [result] = await db.query(query, [userID]);
            if (result.length === 0) {
                return setResponseBadRequest("User not found");
            }

            await transactionDB.query("LOCK TABLES transactionData READ");
            const [userTransactions] = await transactionDB.query(
                "SELECT * FROM transactionData WHERE userID = ?",
                [userID],
            );
            await db.query("LOCK TABLES eventData READ");
            userTransactions.forEach(async (transaction) => {
                const [eventData] = await db.query(
                    "SELECT eventName FROM eventData WHERE eventID = ?",
                    [transaction.eventID],
                );
                transaction.eventName = eventData[0].eventName;
            });
            result[0].transactions = userTransactions;
            return setResponseOk("Records fetched successfully", result[0]);
        } catch (error) {
            logError(error, "profileModule:getUserProfile", "db");
            return setResponseInternalError();
        } finally {
            await db.query("UNLOCK TABLES");
            await transactionDB.query("UNLOCK TABLES");
            transactionDB.release();
            db.release();
        }
    },

    editProfile: async (
        userID,
        userName,
        rollNumber,
        phoneNumber,
        userDepartment,
        academicYear,
    ) => {
        const db = await amritotsavamDb.promise().getConnection();
        try {
            const userExists = await isUserExistsByUserID(userID, db);
            if (!userExists) {
                return setResponseBadRequest("User not found");
            }

            await db.query("LOCK TABLES userData WRITE");
            const query = `
            UPDATE userData SET 
            userName = ?,
            rollNumber = ?,
            phoneNumber = ?,
            userDepartment = ?,
            academicYear = ?,
            WHERE userID = ?;`;

            const [result] = await db.query(query, [
                userName,
                rollNumber,
                phoneNumber,
                userDepartment,
                academicYear,
                userID,
            ]);
            if (result.affectedRows === 0) {
                return setResponseBadRequest(
                    "User not found or no changes made",
                );
            }
            return setResponseOk("Profile updated successfully");
        } catch (error) {
            logError(error, "profileModule:editProfile", "db");
            return setResponseInternalError();
        } finally {
            await db.query("UNLOCK TABLES");
            db.release();
        }
    },
};

export default profileModule;
