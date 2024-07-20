import { Router } from "express";
import estimates_routes from "./estimates";

const router = Router();

router.use("/estimates", estimates_routes);

export default router;
