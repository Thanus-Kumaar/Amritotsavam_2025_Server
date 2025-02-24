import {
    setResponseBadRequest,
    setResponseInternalError,
} from "../utilities/response.js";
import deptModule from "../module/deptModule.js";
import { logError } from "../utilities/errorLogger.js";
import {
    validateDeptData,
    validateDeptID,
} from "../utilities/dataValidator/dept.js";

const deptController = {
    // Fetch all depts
    getAllDepts: async (req, res) => {
        try {
            const response = await deptModule.getAllDepts();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (error) {
            logError(error, "deptController:getAllDepts", "db");
            const response = setResponseInternalError();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },

    // Add a new dept
    addDept: async (req, res) => {
        const { deptName } = req.body;

        // Validate input data
        const validationError = validateDeptData(req.body);
        if (validationError) {
            const response = setResponseBadRequest(validationError);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }

        try {
            // Add the dept
            const response = await deptModule.addDept({
                deptName,
            });
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (error) {
            logError(error, "deptController:addDept", "db");
            const response = setResponseInternalError();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },

    // Edit a dept
    editDept: async (req, res) => {
        const { deptID, deptName } = req.body;

        // Validate input data
        const validationError = validateDeptData(req.body);
        if (validationError) {
            const response = setResponseBadRequest(validationError);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }

        // Validate dept ID
        const idValidationError = validateDeptID(deptID);
        if (idValidationError) {
            const response = setResponseBadRequest(idValidationError);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }

        try {
            // Edit the dept
            const response = await deptModule.editDept({
                deptID,
                deptName,
            });
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (error) {
            logError(error, "deptController:editDept", "db");
            const response = setResponseInternalError();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },

    // Remove a dept
    removeDept: async (req, res) => {
        const { deptID } = req.body;

        // Validate dept ID
        const idValidationError = validateDeptID(deptID);
        if (idValidationError) {
            const response = setResponseBadRequest(idValidationError);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }

        try {
            const response = await deptModule.removeDept(deptID);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (error) {
            logError(error, "deptController:removeDept", "db");
            const response = setResponseInternalError();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },
};

export default deptController;
