import validator from "validator";
import { isValidID, validatePhoneNumber } from "./common.js";

const allowedDepartments = ["1", "2", "3", "4", "5", "6", "7"];

// function that validates email
const validateEmail = (email) => {
    if (
        typeof email == "string" &&
        email.length > 0 &&
        email.length <= 255 &&
        validator.isEmail(email)
    ) {
        return true;
    }
    return false;
};

// function that validates hashed password (64 bit hashing)
const validatePassword = (password) => {
    if (
        typeof password === "string" &&
        password != null &&
        password.length >= 8 &&
        password.length <= 255 &&
        !validator.contains(password, "-" || "'")
    ) {
        return true;
    }
    return false;
};

// Function that Validates OTP
const validateOTP = (otp) => {
    if (
        typeof otp === "string" &&
        otp != null &&
        otp.length > 0 &&
        otp.length <= 255
    ) {
        return true;
    }
    return false;
};

// Function to validate academic year
const validateAcademicYear = (year) => {
    return Number.isInteger(year);
};

// Function to validate signup data
const validateSignupData = (data) => {
    if (!validateEmail(data.userEmail)) {
        return "Invalid or missing email.";
    }

    if (!validatePassword(data.userPassword)) {
        return "Invalid or missing password.";
    }

    if (
        typeof data.userName !== "string" ||
        data.userName.trim().length === 0
    ) {
        return "Invalid or missing userName.";
    }

    if (
        typeof data.rollNumber !== "string" ||
        data.rollNumber.trim().length === 0
    ) {
        return "Invalid or missing rollNumber.";
    }

    if (!validatePhoneNumber(data.phoneNumber)) {
        return "Invalid or missing phoneNumber.";
    }

    if (!isValidID(data.deptID)) {
        return "Invalid or missing deptartment ID.";
    }

    if (!allowedDepartments.includes(data.deptID))
        return "Department should be one of 7 default ones. (should be string)";

    if (!validateAcademicYear(data.academicYear)) {
        return "Invalid or missing academicYear.";
    }

    return null;
};

export { validateEmail, validatePassword, validateSignupData, validateOTP };
