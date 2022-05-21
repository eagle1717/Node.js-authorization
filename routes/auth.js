import express from "express";

const router = express.Router();

import {
    signUp,
    signIn,
    forgotPassword,
    confirmLink,
    updatePassword,
} from "../controllers/auth.js";

router.post("/sign-up", signUp);

router.post("/sign-in", signIn);

router.post("/forgot-password", forgotPassword);

router.post("/confirm-link", confirmLink);

router.post("/update-password", updatePassword);

export default router;
