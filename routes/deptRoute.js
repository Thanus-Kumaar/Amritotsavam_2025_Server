import { Router } from "express";
import deptController from "../controller/deptController.js";
import { tokenValidator } from "../middleware/auth/tokenValidator.js";
import authorizeRoles from "../middleware/auth/authRoleValidator.js";

const deptRouter = Router();

// Routes
deptRouter.get("/", deptController.getAllDepts);

// Apply tokenValidator only for protected routes
// deptRouter.post(
//     "/",
//     tokenValidator("JWT"),
//     authorizeRoles([1]),
//     deptController.addDept,
// ); 

// deptRouter.put(
//     "/",
//     tokenValidator("JWT"),
//     authorizeRoles([1]),
//     deptController.editDept,
// ); 

// deptRouter.delete(
//     "/",
//     tokenValidator("JWT"),
//     authorizeRoles([1]),
//     deptController.removeDept,
// ); 

export default deptRouter;
