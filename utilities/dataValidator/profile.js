import { validateEmail } from "./auth.js";
import {
    isValidID,
    validateBasicString,
    validatePhoneNumber,
} from "./common.js";

const validateProfileData = (userData) => {
    if (!isValidID(userData.userID)) {
        return "Invalid user ID given.";
    }
    if (userData.userName && !validateBasicString(userData.userName)) {
        return "Invalid user name.";
    }
    if (userData.rollNumber && !validateBasicString(userData.rollNumber)) {
        return "Invalid roll number.";
    }
    if (userData.phoneNumber && !validatePhoneNumber(userData.phoneNumber)) {
        return "Invalid phone number.";
    }
    if (
        userData.userDepartment &&
        !validateBasicString(userData.userDepartment)
    ) {
        return "Invalid user department.";
    }
    if (
        userData.academicYear &&
        (typeof userData.academicYear !== "number" ||
            userData.academicYear <= 0)
    ) {
        return "Invalid academic year. It must be a positive number.";
    }

    return null;
};

export { validateProfileData };
