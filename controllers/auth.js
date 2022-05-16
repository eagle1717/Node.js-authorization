import User from "../model/auth.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import "dotenv/config";

const expiresIn = 3600;

const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
});

export const signUp = (req, res) => {
    bcrypt
        .hash(req.body.password, 12)
        .then((bcryptPassword) => {
            const user = new User({
                email: req.body.email,
                password: bcryptPassword,
            });
            return user.save();
        })
        .then((user) => {
            const token = jwt.sign(
                {
                    email: user.email,
                    userId: user._id.toString(),
                },
                "somesupersecretsecret",
                { expiresIn }
            );
            res.status(200).json({
                token,
                expiresIn,
                email: user.email,
                message: "Sign up completed successfully!",
            });
        })
        .catch(() => {
            res.status(400).json({ message: "Failed to sign up!" });
        });
};

export const signIn = (req, res) => {
    let loadedUser;
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                res.status(400).json({ message: "Invalid sign in details!" });
            } else {
                loadedUser = user;
                return bcrypt.compare(req.body.password, user.password);
            }
        })
        .then((bool) => {
            if (loadedUser) {
                if (bool) {
                    const token = jwt.sign(
                        {
                            email: loadedUser.email,
                            userId: loadedUser._id.toString(),
                        },
                        "somesupersecretsecret",
                        { expiresIn }
                    );
                    res.status(200).json({
                        token,
                        expiresIn,
                        email: loadedUser.email,
                        message: "You have successfully signed in to your account!",
                    });
                } else {
                    res.status(400).json({ message: "Invalid sign in details!" });
                }
            }
        });
};

export const forgotPassword = (req, res) => {
    const uniqueID = Date.now().toString(36);
    User.findOneAndUpdate(
        { email: req.body.email },
        { $set: { confirmation_link: uniqueID } }
    ).then(async (user) => {
        if (user) {
            try {
                await transport.sendMail({
                    to: req.body.email,
                    from: "eagle-auth.nativeci.io",
                    subject: "Reset Password",
                    html: `<h1>To reset your password, follow the link</h1><a href="https://eagle-auth.nativeci.io/new-password?link=${uniqueID}&email=${req.body.email}">Follow me</a>`,
                });
                res.status(200).json({
                    message: "We have sent you an email to verify your identity.",
                });
            } catch {
                res.status(400).json({ message: "Failed to send email!" });
            }
        } else {
            res.status(400).json({ message: "User is not found!" });
        }
    });
};

export const confirmLink = (req, res) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (req.body.link == user.confirmation_link) {
                res
                    .status(200)
                    .json({ message: "Your identity has been successfully verified!" });
            } else {
                res.status(400).json({ message: "Failed to verify identity!" });
            }
        })
        .catch(() => {
            res.status(400).json({ message: "User was not found!" });
        });
};

export const updatePassword = (req, res) => {
    bcrypt.hash(req.body.password, 12).then((bcryptPassword) => {
        User.findOneAndUpdate(
            { email: req.body.email },
            { $set: { password: bcryptPassword } }
        )
            .then(() => {
                res.status(201).json({ message: "Password changed successfully!" });
            })
            .catch(() => {
                res.status(400).json({ message: "Failed to change password!" });
            });
    });
};
