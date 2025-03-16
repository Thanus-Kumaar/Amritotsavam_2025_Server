import pkg from "validator";
import { isValidID } from "../utilities/dataValidator/common.js";
import {
    setResponseBadRequest,
    setResponseInternalError,
} from "../utilities/response.js";
import { logError } from "../utilities/errorLogger.js";
import scoreModule from "../module/scoreModule.js";
const { isNumeric } = pkg;

const scoreController = {
    addScore: async (req, res) => {
        const { deptID, eventID, points } = req.body;
        if (!isValidID(deptID) || !isValidID(eventID) || !isValidID(points)) {
            const response = setResponseBadRequest(
                "Invalid IDs for event or dept",
            );
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
        try {
            const response = await scoreModule.addScore(
                deptID,
                eventID,
                points,
            );
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (err) {
            logError(err, "scoreController:addScore", "db");
            const response = setResponseInternalError();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },
    deleteScore: async (req, res) => {
        const { scoreID } = req.body;
        if (!isValidID(scoreID)) {
            const response = setResponseBadRequest("Invalid ID sent");
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
        try {
            const response = await scoreModule.deleteScore(scoreID);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (err) {
            logError(err, "scoreController:deleteScore", "db");
            const response = setResponseInternalError();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },
    getScoreByDept: async (req, res) => {
        try {
            const response = await scoreModule.getScoreByDept();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (err) {
            logError(err, "scoreController:getScoreByDept", "db");
            const response = setResponseInternalError();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },
    getScoreByEvent: async (req, res) => {
        try {
            const response = await scoreModule.getScoreByEvent();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (err) {
            logError(err, "scoreController:getScoreByEvent", "db");
            const response = setResponseInternalError();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },
    getAllScores: async (req, res) => {
        try {
            const response = await scoreModule.getAllScores();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (err) {
            logError(err, "scoreController:getAllScores", "db");
            const response = setResponseInternalError();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },
};

export default scoreController;
