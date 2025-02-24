import { validateBasicString } from "./common.js";
import validator from "validator";

// Validate dept data
const validateDeptData = (data) => {
    if (!validateBasicString(data.deptName, 255))
        return "Invalid or missing dept name.";
    return null; // No validation errors
};

// Validate dept ID
const validateDeptID = (deptID) => {
    if (!validator.isInt(String(deptID), { min: 1 })) return "Invalid dept ID."; // Ensures it's a positive integer
    return null;
};

export { validateDeptData, validateDeptID };
