import express from "express";

const router = express.Router();

import { fetchUser } from "../controllers/profile.js";

router.get("/", fetchUser);

export default router;
