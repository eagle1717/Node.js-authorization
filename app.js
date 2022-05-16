import express from "express";
import mongoose from "mongoose";
import util from "./util/route.js";
import cors from "cors";

const app = express();

app.use(util);

import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";

const whitelist = ["https://eagle-auth.nativeci.io", "http://localhost:3000"];

const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
};

app.use(cors(corsOptions));

app.use("/auth", authRoutes);

app.use("/profile", profileRoutes);

mongoose
    .connect(
        "mongodb://localhost:27017"
    )
    .then(() => {
        app.listen(8000);
    });
