import { Router } from "express";
import deptController from "../controller/deptController.js";
import { tokenValidator } from "../middleware/auth/tokenValidator.js";
import authorizeRoles from "../middleware/auth/authRoleValidator.js";

const deptRouter = Router();

// Routes
deptRouter.get("/", deptController.getAllDepts); // GET: Fetch all depts (No token validation required)

// Apply tokenValidator only for protected routes
deptRouter.post(
    "/",
    tokenValidator("JWT"),
    authorizeRoles([1]),
    deptController.addDept,
); // POST: Add a new dept
deptRouter.put(
    "/",
    tokenValidator("JWT"),
    authorizeRoles([1]),
    deptController.editDept,
); // PUT: Edit an existing dept
deptRouter.delete(
    "/",
    tokenValidator("JWT"),
    authorizeRoles([1]),
    deptController.removeDept,
); // DELETE: Remove a dept

export default deptRouter;
