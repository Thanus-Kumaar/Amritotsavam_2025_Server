import { Router } from "express";
import scoreController from "../controller/scoreController.js";
import authorizeRoles from "../middleware/auth/authRoleValidator.js";
import { tokenValidator } from "../middleware/auth/tokenValidator.js";

const scoreRouter = Router();

scoreRouter.post(
    "/",
    tokenValidator("JWT"),
    authorizeRoles([1]),
    scoreController.addScore,
);

scoreRouter.delete(
    "/",
    tokenValidator("JWT"),
    authorizeRoles([1]),
    scoreController.deleteScore,
);

scoreRouter.get("/dept", scoreController.getScoreByDept);

scoreRouter.get("/event", scoreController.getScoreByEvent);

scoreRouter.get("/", scoreController.getAllScores);

export default scoreRouter;
