import {
    setResponseOk,
    setResponseBadRequest,
    setResponseInternalError,
    setResponseNotFound,
} from "../utilities/response.js";
import { logError } from "../utilities/errorLogger.js";
import { amritotsavamDb } from "../db/poolConnection.js";
import { checkDeptIDsExists } from "../utilities/dbUtilities/deptUtilities.js";
import { checkOrganizerIDsExists } from "../utilities/dbUtilities/organizerUtilities.js";
import { checkTagIDsExists } from "../utilities/dbUtilities/tagUtilities.js";
import { getEventQueryFormatter } from "../utilities/dbUtilities/eventUtilities.js";

const eventModule = {
    addEvent: async function (
        eventName,
        imageUrl,
        videoUrl,
        eventFee,
        eventDescription,
        venue,
        time,
        rules,
        isGroup,
        eventDate,
        isPerHeadFee,
        firstPrice,
        secondPrice,
        thirdPrice,
        fourthPrice,
        fifthPrice,
        organizerIDs,
        tagIDs,
        maxRegistrationsPerDept,
        minTeamSize,
        maxTeamSize,
    ) {
        const db = await amritotsavamDb.promise().getConnection();
        var transactionStarted = 0;
        try {
            // Checking if organizer IDs are present in the database
            const organizersExists = await checkOrganizerIDsExists(
                organizerIDs,
                db,
            );
            if (organizersExists !== null) {
                await db.rollback();
                return setResponseBadRequest(organizersExists);
            }

            // Checking if tag IDs are present in the database
            const tagExists = await checkTagIDsExists(tagIDs, db);
            if (tagExists !== null) {
                // console.log("Error tag IDs not found");
                await db.rollback();
                return setResponseBadRequest(tagExists);
            }

            await db.beginTransaction();
            // Denotes that server entered the Transaction -> Needs rollback incase of error.
            transactionStarted = 1;

            const query = `
      INSERT INTO eventData (eventName, imageUrl, videoUrl, eventFee, eventDescription, venue, time, rules,
       isGroup, eventDate, isPerHeadFee, minTeamSize, maxTeamSize, firstPrice, secondPrice, thirdPrice, fourthPrice, fifthPrice)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      `;
            const values = [
                eventName,
                imageUrl,
                videoUrl,
                eventFee,
                eventDescription,
                venue,
                time,
                rules,
                isGroup,
                eventDate,
                isPerHeadFee,
                minTeamSize,
                maxTeamSize,
                firstPrice,
                secondPrice,
                thirdPrice,
                fourthPrice,
                fifthPrice,
            ];
            const [insertData] = await db.query(query, values);
            const eventID = insertData.insertId;
            if (eventID == null) {
                await db.rollback();
                return setResponseInternalError("Could not add event properly");
            }

            // Insert into organizerEventMapping table using a single query
            const organizerValues = organizerIDs.map((organizerID) => [
                organizerID,
                eventID,
            ]);
            await db.query(
                `INSERT INTO organizerEventMapping (organizerID, eventID)
        VALUES ?`,
                [organizerValues],
            );

            // Insert into tagEventMapping table using a single query
            const tagEventMapping = tagIDs.map((tagID) => [tagID, eventID]);
            await db.query(
                `INSERT INTO tagEventMapping (tagID, eventID)
        VALUES ?`,
                [tagEventMapping],
            );

            // Insert into deptEventMapping table
            const [depts] = await db.query("SELECT deptID FROM deptData");
            const registrationPerDept = depts.map((dept) => [
                dept.deptID,
                eventID,
                maxRegistrationsPerDept,
            ]);
            await db.query(
                `INSERT INTO deptEventMapping (deptID, eventID, maxRegistrations) values ?`,
                [registrationPerDept],
            );
            await db.commit();
            return setResponseOk("Event added successfully");
        } catch (err) {
            if (transactionStarted === 1) {
                await db.rollback();
            }
            if (err.code == "ER_DUP_ENTRY") {
                return setResponseBadRequest("Event already found in database");
            }
            logError(err, "eventModule:addEvent", "db");
            return setResponseInternalError();
        } finally {
            await db.query("UNLOCK TABLES");
            db.release();
        }
    },
    getAllEvents: async function (isLoggedIn, userID) {
        const db = await amritotsavamDb.promise().getConnection();
        try {
            await db.query(
                `LOCK TABLES eventData AS e READ, 
        organizerEventMapping AS oem READ, 
        organizerData AS o READ, 
        tagEventMapping AS tem READ, 
        tagData AS t READ, 
        deptEventMapping AS cem READ,  
        deptData AS c READ,
        registrationData AS rg READ,
        groupDetail AS g READ`,
            );
            const query = getEventQueryFormatter(isLoggedIn, userID);
            // console.log(query);
            const [events] = await db.query(query);
            if (events.length == 0) {
                return setResponseOk("No events found!", []);
            }
            return setResponseOk("All events selected", events);
        } catch (err) {
            logError(err, "eventModule:getAllEvents", "db");
            return setResponseInternalError();
        } finally {
            await db.query("UNLOCK TABLES");
            db.release();
        }
    },
    getEventDetailsByID: async function (eventID, isLoggedIn, userID) {
        const db = await amritotsavamDb.promise().getConnection();
        try {
            await db.query(
                `LOCK TABLES eventData AS e READ, 
        organizerEventMapping AS oem READ, 
        organizerData AS o READ, 
        tagEventMapping AS tem READ, 
        tagData AS t READ, 
        deptEventMapping AS cem READ,  
        deptData AS c READ,
        registrationData AS rg READ,
        groupDetail AS g READ`,
            );
            let query = getEventQueryFormatter(isLoggedIn, userID, {
                eventID: eventID,
            });
            // console.log(query);
            const [event] = await db.query(query);
            if (event.length == 0) {
                return setResponseNotFound("No events found!");
            }
            await db.query("UNLOCK TABLES");
            if (event[0].isRegistered == "1") {
                await db.query(
                    "LOCK TABLES userData AS u READ, registrationData AS rg READ, groupDetail AS g READ, groupDetail AS g2 READ",
                );
                const [teamDetails] = await db.query(`
                    SELECT COALESCE(JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'userID', u.userID,
                            'userName', u.userName,
                            'userEmail', u.userEmail,
                            'roleDescription', g.roleDescription,
                            'teamName', rg.teamName
                        )
                    ), '[]') AS teamDetails
                    FROM userData u
                    JOIN groupDetail g ON u.userID = g.userID
                    JOIN registrationData rg ON g.registrationID = rg.registrationID
                    JOIN groupDetail g2 ON g.registrationID = g2.registrationID 
                        AND g2.userID = ${userID} 
                        AND g2.eventID = ${event[0].eventID}
                    WHERE g.eventID = ${event[0].eventID};
                `);
                const team = JSON.parse(teamDetails[0].teamDetails);
                event[0].teamDetails = team;
            }
            return setResponseOk("Event selected", event);
        } catch (err) {
            logError(err, "eventModule:getEventDetailsByID", "db");
            return setResponseInternalError();
        } finally {
            await db.query("UNLOCK TABLES");
            db.release();
        }
    },
    // getEventForDept: async function (deptID, isLoggedIn, userID) {
    //     const db = await amritotsavamDb.promise().getConnection();
    //     try {
    //         await db.query(
    //             `LOCK TABLES eventData AS e READ,
    //     organizerEventMapping AS oem READ,
    //     organizerData AS o READ,
    //     tagEventMapping AS tem READ,
    //     tagData AS t READ,
    //     deptEventMapping AS cem READ,
    //     deptData AS c READ,
    //     registrationData AS rg READ,
    //     groupDetail AS g READ`,
    //         );
    //         const query = getEventQueryFormatter(isLoggedIn, userID, {
    //             deptID: deptID,
    //         });
    //         const [events] = await db.query(query);

    //         if (events.length == 0) {
    //             return setResponseNotFound(
    //                 "No events found for the given dept!",
    //             );
    //         }
    //         return setResponseOk("Event selected", events);
    //     } catch (err) {
    //         logError(err, "eventModule:getEventDetailsByID", "db");
    //         return setResponseInternalError();
    //     } finally {
    //         await db.query("UNLOCK TABLES");
    //         db.release();
    //     }
    // },
    getEventsRegisteredByUser: async function (id, isLoggedIn, userID) {
        const db = await amritotsavamDb.promise().getConnection();
        try {
            await db.query(
                `LOCK TABLES eventData AS e READ, 
        organizerEventMapping AS oem READ, 
        organizerData AS o READ, 
        tagEventMapping AS tem READ, 
        tagData AS t READ, 
        deptEventMapping AS cem READ,  
        deptData AS c READ,
        registrationData AS rg READ,
        registrationData READ,
        groupDetail AS g READ`,
            );
            const [eventIDs] = await db.query(
                "SELECT rg.eventID FROM registrationData rg JOIN groupDetail g ON rg.registrationID = g.registrationID WHERE g.userID = ?",
                [id],
            );
            // console.log(eventIDs);
            if (eventIDs.length == 0) {
                return setResponseNotFound(
                    "No registered events found for user.",
                );
            }
            const eventIDsNew = eventIDs.map(
                (eventIDObject) => eventIDObject.eventID,
            );
            const query = getEventQueryFormatter(isLoggedIn, userID, {
                eventIDs: eventIDsNew,
            });
            const [events] = await db.query(query);
            if (events.length == 0) {
                return setResponseNotFound(
                    "No registered events found for user.",
                );
            }
            return setResponseOk("Registered events fetched", events);
        } catch (err) {
            logError(err, "eventModule:getEventsRegisteredByUser", "db");
            return setResponseInternalError();
        } finally {
            await db.query("UNLOCK TABLES");
            db.release();
        }
    },
    editEvent: async function (
        eventID,
        eventName,
        imageUrl,
        videoUrl,
        eventFee,
        eventDescription,
        venue,
        time,
        rules,
        isGroup,
        eventDate,
        isPerHeadFee,
        firstPrice,
        secondPrice,
        thirdPrice,
        fourthPrice,
        fifthPrice,
        organizerIDs,
        tagIDs,
        maxRegistrationsPerDept,
        minTeamSize,
        maxTeamSize,
    ) {
        const db = await amritotsavamDb.promise().getConnection();
        var transactionStarted = 0;
        try {
            // // Checking if new maxRegistrations is >= numRegistrations
            // await db.query("LOCK TABLES eventData READ");
            // const [rows] = await db.query(
            //     `SELECT numRegistrations FROM eventData WHERE eventID = ?`,
            //     [eventID],
            // );
            // if (rows.length === 0) {
            //     return setResponseBadRequest("Event not found");
            // }
            // const numRegistrations = rows[0].numRegistrations;
            // if (maxRegistrations < numRegistrations) {
            //     return setResponseBadRequest(
            //         "Maximum registrations must be greater than or equal to registered students!",
            //     );
            // }

            // Checking if organizer IDs are present in the database
            const organizersExists = await checkOrganizerIDsExists(
                organizerIDs,
                db,
            );
            if (organizersExists !== null) {
                return setResponseBadRequest(organizersExists);
            }

            // Checking if tag IDs are present in the database
            const tagExists = await checkTagIDsExists(tagIDs, db);
            if (tagExists !== null) {
                // console.log("Error tag IDs not found");
                return setResponseBadRequest(tagExists);
            }

            await db.beginTransaction();
            // Denotes that server entered the Transaction -> Needs rollback incase of error.
            transactionStarted = 1;
            // Update the event data
            const query = `
        UPDATE eventData
        SET 
        eventName = ?, 
        imageUrl = ?, 
        videoUrl = ?,
        eventFee = ?, 
        eventDescription = ?, 
        venue = ?, 
        time = ?,
        rules = ?,
        isGroup = ?, 
        eventDate = ?, 
        isPerHeadFee = ?, 
        minTeamSize = ?, 
        maxTeamSize = ?,
        firstPrice = ?,
        secondPrice = ?,
        thirdPrice = ?,
        fourthPrice = ?,
        fifthPrice = ?
        WHERE eventID = ?
      `;
            const values = [
                eventName,
                imageUrl,
                videoUrl,
                eventFee,
                eventDescription,
                venue,
                time,
                rules,
                isGroup,
                eventDate,
                isPerHeadFee,
                minTeamSize,
                maxTeamSize,
                firstPrice,
                secondPrice,
                thirdPrice,
                fourthPrice,
                fifthPrice,
                eventID,
            ];
            const [updateResult] = await db.query(query, values); // explicit lock and unlock is not necessary in transactions

            if (updateResult.affectedRows === 0) {
                await db.rollback();
                return setResponseBadRequest(
                    "Event not found or update failed",
                );
            }

            // Clear existing mappings
            await db.query(
                `DELETE FROM organizerEventMapping WHERE eventID = ?`,
                [eventID],
            );
            await db.query(`DELETE FROM tagEventMapping WHERE eventID = ?`, [
                eventID,
            ]);

            // Re-inserting updated mappings
            const organizerValues = organizerIDs.map((organizerID) => [
                organizerID,
                eventID,
            ]);
            await db.query(
                `INSERT INTO organizerEventMapping (organizerID, eventID) VALUES ?`,
                [organizerValues],
            );

            const tagEventMapping = tagIDs.map((tagID) => [tagID, eventID]);
            await db.query(
                `INSERT INTO tagEventMapping (tagID, eventID) VALUES ?`,
                [tagEventMapping],
            );

            const [depts] = await db.query("SELECT deptID FROM deptData");
            const departments = depts.map((dept) => dept.deptID);
            await db.query(
                `UPDATE deptEventMapping SET maxRegistrations = ? WHERE deptID IN ? AND eventID = ?`,
                [maxRegistrationsPerDept, [departments], eventID],
            );

            await db.commit();
            return setResponseOk("Event updated successfully");
        } catch (err) {
            if (transactionStarted === 1) {
                await db.rollback();
            }
            logError(err, "eventModule:editEvent", "db");
            return setResponseInternalError();
        } finally {
            await db.query("UNLOCK TABLES");
            db.release();
        }
    },
    toggleStatus: async function (eventID) {
        const db = await amritotsavamDb.promise().getConnection();
        try {
            await db.query("LOCK TABLES eventData WRITE");
            const query = `UPDATE eventData
        SET eventStatus = CASE
            WHEN eventStatus = 1 THEN 0
            WHEN eventStatus = 0 THEN 1
            ELSE eventStatus
        END
        WHERE eventID = ?;`;
            const [updated] = await db.query(query, [eventID]);
            if (updated.affectedRows == 0)
                return setResponseBadRequest("Event not found!!");
            return setResponseOk("Event status updated successfully!");
        } catch (err) {
            logError(err, "eventModule:toggleStatus", "db");
            return setResponseInternalError();
        } finally {
            await db.query("UNLOCK TABLES");
            db.release();
        }
    },
    deleteEvent: async function (eventID) {
        const db = await amritotsavamDb.promise().getConnection();
        try {
            await db.query("LOCK TABLES eventData WRITE");
            // TODO: Should we remove all the entries in mapping tables or cascade will take care ?
            const [deleted] = await db.query(
                "DELETE  FROM eventData WHERE eventID = ?",
                [eventID],
            );
            if (deleted.affectedRows == 0) {
                return setResponseBadRequest("Event ID not found in database!");
            }
            return setResponseOk("Event deleted successfully :)");
        } catch (err) {
            logError(err, "eventModule:deleteEvent", "db");
            return setResponseInternalError();
        } finally {
            await db.query("UNLOCK TABLES");
            db.release();
        }
    },
};

export default eventModule;
