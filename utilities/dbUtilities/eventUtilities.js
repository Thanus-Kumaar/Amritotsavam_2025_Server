// function to generate query for all get functions.
/*
data = {
eventID : 1,
userID : 2,
...
}
NOTE: the key should match the column to search in database.
*/
// IMPORTANT: This function embeds the query with variable values too. So it will not be necessary to do,
//            db.query(thisQuery, [someValue,...]); The array is not necessary

const getEventQueryFormatter = function (
    isLoggedIn = 0,
    userID = -1,
    data = {},
) {
    let query;
    // for getAllEvents, the below function will be true
    if (Object.keys(data).length === 0) {
        query = `SELECT
        e.eventID,
        e.eventName,
        e.eventDate,
        e.eventDescription,
        e.venue,
        e.time,
        e.eventFee,
        e.isGroup,
        e.maxTeamSize,
        e.minTeamSize,
        e.eventStatus,
        e.isPerHeadFee,
        e.imageUrl AS eventImageUrl,
        (
            SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                    'tagID', t.tagID,
                    'tagName', t.tagName,
                    'tagAbbrevation', t.tagAbbrevation
                )
            )
            FROM tagEventMapping tem
            JOIN tagData t ON tem.tagID = t.tagID
            WHERE tem.eventID = e.eventID
        ) AS tags,
        CASE 
           WHEN EXISTS (
                SELECT 1 
                FROM registrationData rg 
                JOIN groupDetail g ON g.registrationID = rg.registrationID
                WHERE rg.eventID = e.eventID 
                AND g.userID = ${userID}
                AND rg.registrationStatus = '2'
                AND ${isLoggedIn} = 1
                ) 
            THEN '1' 
            ELSE '0'
            END AS isRegistered
        FROM
        eventData e
        `;
        return query;
    }
    // variable to avoid adding AND keyword in query for the first contition
    let firstCondition = true;
    query = `SELECT
    e.eventID,
    e.eventName,
    e.eventDate,
    e.eventDescription,
    e.venue,
    e.videoUrl,
    e.time,
    e.rules,
    e.eventFee,
    e.isGroup,
    e.maxTeamSize,
    e.minTeamSize,
    e.eventStatus,
    e.isPerHeadFee,
    e.imageUrl AS eventImageUrl,
    e.firstPrice,
    e.secondPrice,
    e.thirdPrice,
    e.fourthPrice,
    e.fifthPrice,
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'organizerID', o.organizerID,
                'organizerName', o.organizerName,
                'organizerPhoneNumber', o.phoneNumber
            )
        )
        FROM organizerEventMapping oem
        JOIN organizerData o ON oem.organizerID = o.organizerID
        WHERE oem.eventID = e.eventID
    ) AS organizers,
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'tagID', t.tagID,
                'tagName', t.tagName,
                'tagAbbrevation', t.tagAbbrevation
            )
        )
        FROM tagEventMapping tem
        JOIN tagData t ON tem.tagID = t.tagID
        WHERE tem.eventID = e.eventID
    ) AS tags,
    CASE 
      WHEN EXISTS (
        SELECT 1 
        FROM registrationData rg 
        JOIN groupDetail g ON g.registrationID = rg.registrationID
        WHERE rg.eventID = e.eventID 
        AND g.userID = ${userID}
        AND rg.registrationStatus = '2'
        AND ${isLoggedIn} = 1
        ) 
      THEN '1' 
      ELSE '0'
    END AS isRegistered
    FROM
      eventData e`;
    Object.entries(data).map((condition) => {
        if (firstCondition === true) {
            if (condition[0] == "eventIDs") {
                query += ` WHERE e.eventID IN (${condition[1]})`;
            } else
                query += ` WHERE ${condition[0][0]}.${condition[0]} = ${condition[1]}`;
            firstCondition = false;
        } else {
            if (condition[0] == "eventIDs") {
                query += ` WHERE e.eventID IN ${condition[1]}`;
            } else
                query += ` AND ${condition[0][0]}.${condition[0]} = ${condition[1]}`;
        }
    });
    return query;
};

export { getEventQueryFormatter };
