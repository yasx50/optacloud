import { Router } from "express";
import {currentLocation} from '../controllers/map.controller'
const router = Router()
router.route("/location").post(currentLocation)
export default router;