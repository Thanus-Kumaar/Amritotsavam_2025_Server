import {
    setResponseBadRequest,
    setResponseInternalError,
} from "../utilities/response.js";
import profileModule from "../module/profileModule.js";
import { logError } from "../utilities/errorLogger.js";
import { validateProfileData } from "../utilities/dataValidator/profile.js";
import { isValidID } from "../utilities/dataValidator/common.js";

const profileController = {
    getUserProfile: async (req, res) => {
        const { userID } = req.body;
        if (!isValidID(userID)) {
            const response = setResponseBadRequest("Invalid user ID sent!");
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }

        try {
            const response = await profileModule.getUserProfile(userID);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (err) {
            logError(err, "profileController:getUserProfile", "db");
            const response = setResponseInternalError();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },

    /*
    Request Header: Bearer Token
    {
      "userID": "string",
      "userName": "string",
      "rollNumber": "string",
      "phoneNumber": "string",
      "deptID": "number",
      "academicYear": "number",
    }
    */
    editProfile: async (req, res) => {
        const {
            userID,
            userName,
            rollNumber,
            phoneNumber,
            deptID,
            academicYear,
        } = req.body;

        const validationErrordata = validateProfileData(req.body);
        if (validationErrordata != null) {
            const response = setResponseBadRequest(validationErrordata);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }

        try {
            const response = await profileModule.editProfile(
                userID,
                userName,
                rollNumber,
                phoneNumber,
                deptID,
                academicYear,
            );
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (err) {
            logError(err, "profileController:editProfile", "db");
            const response = setResponseInternalError();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },
};

export default profileController;
