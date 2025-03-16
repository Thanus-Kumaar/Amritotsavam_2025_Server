import { amritotsavamDb } from "../db/poolConnection.js";
import { checkDeptIDsExists } from "../utilities/dbUtilities/deptUtilities.js";
import {
    setResponseBadRequest,
    setResponseNotFound,
    setResponseOk,
} from "../utilities/response.js";
import { logError } from "../utilities/errorLogger.js";

const scoreModule = {
    addScore: async function (deptID, eventID, points) {
        const db = await amritotsavamDb.promise().getConnection();
        try {
            const deptFound = await checkDeptIDsExists([deptID], db);
            if (deptFound != null) {
                return setResponseBadRequest("Department not found!");
            }

            await db.query("LOCK TABLE eventData READ, scoreboard WRITE");
            const [eventExists] = await db.query(
                "SELECT * FROM eventData WHERE eventID = ?",
                [eventID],
            );
            if (eventExists.length === 0) {
                return setResponseBadRequest("Event Not Found");
            }

            const [resut] = await db.query(
                "INSERT INTO scoreboard (deptID, eventID, points) VALUES (?,?,?)",
                [deptID, eventID, points],
            );
            if (resut.affectedRows === 0) {
                return setResponseBadRequest("We could not add score...");
            }
            return setResponseOk("Score added successfully");
        } catch (error) {
            logError(error, "scoreModule:addScore", "db");
            return setResponseInternalError();
        } finally {
            await db.query("UNLOCK TABLES");
            db.release();
        }
    },
    deleteScore: async function (scoreID) {
        const db = await amritotsavamDb.promise().getConnection();
        try {
            await db.query("LOCK TABLES scoreboard WRITE");
            const [deleted] = await db.query(
                "DELETE FROM scoreboard WHERE scoreID = ?",
                [scoreID],
            );
            if (deleted.affectedRows === 0) {
                return setResponseNotFound("Score not found!");
            }
            return setResponseOk("Successfully deleted score.");
        } catch (error) {
            logError(error, "scoreModule:deleteScore", "db");
            return setResponseInternalError();
        } finally {
            await db.query("UNLOCK TABLES");
            db.release();
        }
    },
    getScoreByDept: async function () {
        const db = await amritotsavamDb.promise().getConnection();
        try {
            await db.query("LOCK TABLES scoreboard AS s READ, deptData AS d READ");
            const [scores] = await db.query(
                `SELECT s.deptID, d.deptName, SUM(s.points) AS points 
                  FROM 
                  scoreboard s 
                    JOIN
                  deptData d ON s.deptID = d.deptID 
                  GROUP BY s.deptID 
                  ORDER BY points DESC
                    `,
            );
            if (scores.length == 0) {
                return setResponseNotFound("No scores found for departments!");
            }
            return setResponseOk("Fetched scores successfully", scores);
        } catch (error) {
            logError(error, "scoreModule:getScoreByDept", "db");
            return setResponseInternalError();
        } finally {
            await db.query("UNLOCK TABLES");
            db.release();
        }
    },
    getScoreByEvent: async function () {
        const db = await amritotsavamDb.promise().getConnection();
        try {
            await db.query("LOCK TABLES scoreboard AS s READ, eventData AS e READ, deptData AS d READ");
            const [scores] = await db.query(
                `SELECT 
            DISTINCT(e.eventID), 
            e.eventName, 
            (
              SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                  'deptID', s.deptID,
                  'deptName', d.deptName,
                  'deptScore', s.points
                )
              )
              FROM deptData d
              JOIN scoreboard s ON d.deptID = s.deptID
              WHERE s.eventID = e.eventID 
            ) AS scores
            FROM
            eventData e
            ORDER BY e.eventID
          `,
            );
            if (scores.length == 0) {
                return setResponseNotFound("No scores found for events!");
            }
            return setResponseOk("Fetched scores successfully", scores);
        } catch (error) {
            logError(error, "scoreModule:getScoreByDept", "db");
            return setResponseInternalError();
        } finally {
            await db.query("UNLOCK TABLES");
            db.release();
        }
    },
    getAllScores: async function () {
        const db = await amritotsavamDb.promise().getConnection();
        try {
            await db.query("LOCK TABLES scoreboard AS s READ, eventData AS e READ, deptData AS d READ");
            const [scores] = await db.query(
                `SELECT s.scoreID, s.eventID, e.eventName, s.deptID, d.deptName, s.points 
                  FROM 
                  scoreboard s 
                    JOIN
                  eventData e ON s.eventID = e.eventID
                    JOIN
                  deptData d ON s.deptID = d.deptID 
                    `,
            );
            if (scores.length == 0) {
                return setResponseNotFound("No scores found!");
            }
            return setResponseOk("Fetched scores successfully", scores);
        } catch (error) {
            logError(error, "scoreModule:getAllScores", "db");
            return setResponseInternalError();
        } finally {
            await db.query("UNLOCK TABLES");
            db.release();
        }
    },
};

export default scoreModule;
