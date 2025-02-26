import {
    setResponseOk,
    setResponseTransactionFailed,
    setResponseBadRequest,
    setResponseInternalError,
    setResponseServiceFailure,
} from "../utilities/response.js";
import fetch from "node-fetch";
import { appConfig } from "../config/config.js";
import { generateVerifyHash } from "../utilities/payU.js";
import { appendFileSync } from "fs";

const { payUKey, payUVerifyURL } = appConfig;

let transactionResponse = null;

export const verifyTransaction = async function (
    txnID,
    amritotsavamDb,
    transactionsDb,
) {
    const db = await amritotsavamDb.promise().getConnection();
    const transactionDB = await transactionsDb.promise().getConnection();

    // console.log("[INFO]: Verify Transaction Controller Called");

    try {
        var transactionStarted = 0;

        await transactionDB.query("LOCK TABLES transactionData READ");

        const [transactionData] = await transactionDB.query(
            "SELECT * FROM transactionData WHERE txnID = ?",
            [txnID],
        );

        await transactionDB.query("UNLOCK TABLES");

        if (transactionData.length === 0) {
            return setResponseBadRequest(
                "No Transaction Exists for the given Transaction ID !",
            );
        }

        if (transactionData[0].transactionStatus !== "1") {
            return setResponseOk(
                "Transaction Verification Done.",
                transactionData[0].transactionStatus,
            );
        }

        // console.log(
        //     "[INFO]: Transaction Verification Started for Transaction ID: ",
        //     txnID,
        // );

        const hash = generateVerifyHash({
            command: "verify_payment",
            var1: txnID,
        });

        const response = await fetch(payUVerifyURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `key=${payUKey}&command=verify_payment&hash=${hash}&var1=${txnID}`,
        });

        const responseData = await response.json();

        if (responseData.status === 0) {
            if (!responseData.transaction_details) {
                return setResponseServiceFailure(
                    "Payment Gateway Failed ! Try again later.",
                );
            }
        }

        const transactionDetails = responseData.transaction_details[txnID];

        // console.log(
        //     "[INFO]: PayU Transaction Details for Transaction ID: ",
        //     txnID,
        // );
        // console.log(transactionDetails);

        await db.beginTransaction();
        await transactionDB.beginTransaction();

        transactionStarted = 1;
        if (
            transactionDetails.status === "Not Found" ||
            transactionDetails.status === "failure"
        ) {
            await transactionDB.query(
                "UPDATE transactionData SET transactionStatus = '0' WHERE txnID = ?",
                [txnID],
            );

            const [releaseSeats] = await db.query(
                "SELECT registrationID, eventID, totalMembers, userID FROM registrationData WHERE txnID = ?",
                [txnID],
            );

            if (releaseSeats.length > 0) {
                await db.query(
                    "DELETE FROM groupDetail WHERE registrationID = ?",
                    [releaseSeats[0].registrationID],
                );

                await db.query("DELETE FROM registrationData WHERE txnID = ?", [
                    txnID,
                ]);

                const [userDeptID] = await db.query(
                    "SELECT deptID FROM userData WHERE userID = ?",
                    [releaseSeats[0].userID],
                );

                if (userDeptID.length == 0) {
                    return setResponseBadRequest(
                        "The user trying to verify transaction is not registered in amritotsavam!",
                    );
                }

                await db.query(
                    "UPDATE deptEventMapping SET numRegistrations = numRegistrations-1 WHERE eventID = ? AND deptID = ?",
                    [releaseSeats[0].eventID, userDeptID[0].deptID],
                );
            }

            transactionResponse = setResponseTransactionFailed(
                "Transaction Failed !!",
            );
        } else if (transactionDetails.status === "success") {
            await transactionDB.query(
                "UPDATE transactionData SET transactionStatus = '2' WHERE txnID = ?",
                [txnID],
            );

            await db.query(
                "UPDATE registrationData SET registrationStatus = '2' WHERE txnID = ?",
                [txnID],
            );

            transactionResponse = setResponseOk(
                "Transaction Verified Succussfully",
            );
        } else {
            transactionResponse = setResponseInternalError(
                "Unable to Verify Transaction !!",
            );
        }

        await transactionDB.commit();
        await db.commit();
        return transactionResponse;
    } catch (err) {
        if (transactionStarted === 1) {
            await db.rollback();
            await transactionDB.rollback();
        }

        console.log("[ERROR]: Error in Verify Transaction Module: ", err);
        appendFileSync(
            "./logs/controller/controllerErrors.log",
            `${new Date().getTime()}-"Verify Transaction Module Failed"-${err}`,
        );
        return setResponseInternalError(err);
    } finally {
        await db.query("UNLOCK TABLES");
        await transactionDB.query("UNLOCK TABLES");

        db.release();
        transactionDB.release();
    }
};
