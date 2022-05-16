import User from "../model/auth.js";
import jwt from "jsonwebtoken";

export const fetchUser = (req, res) => {
    jwt.verify(
        req.headers.authorization,
        "somesupersecretsecret",
        (err, decoded) => {
            if (decoded) {
                User.findOne({ email: decoded.email })
                    .then((userInfo) => {
                        res.status(200).send({ userInfo });
                    })
                    .catch(() => {
                        res.status(400).json({ message: "User was not found!" });
                    });
            }
            if (err) {
                res.status(400).json({ message: "Failed to get user data!" });
            }
        }
    );
};
