import express from "express";

const router = express.Router();

const app = express();

router.use(express.urlencoded({ extended: true }));

router.use(express.json());

router.use((req, res, next) => {
    Object.setPrototypeOf(req, app.request);
    Object.setPrototypeOf(res, app.response);
    req.res = res;
    res.req = req;
    next();
});

export default router;
