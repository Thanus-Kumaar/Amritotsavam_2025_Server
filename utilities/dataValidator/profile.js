import { validateEmail } from "./auth.js";
import {
    isValidID,
    validateBasicString,
    validatePhoneNumber,
} from "./common.js";

const allowedDepartments = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

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
    if (!isValidID(userData.deptID)) {
        return "Invalid department ID.";
    }
    if (!allowedDepartments.includes(userData.deptID))
        return "Department should be one of 10 default ones. (should be string)";
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
