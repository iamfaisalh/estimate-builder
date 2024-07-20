import { Router } from "express";
import * as EstimatesController from "../controllers/estimates";

const router = Router();

router.post("/", EstimatesController.create);
router.get("/", EstimatesController.fetchAll);
router.get("/:id", EstimatesController.fetchOne);

export default router;
