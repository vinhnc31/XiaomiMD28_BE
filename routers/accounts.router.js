/**
 * @swagger
 * tags:
 *   name: Account
 *   description: The account managing API
 * components:
 *   schemas:
 *     Account:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         address:
 *           type: string
 *         sex:
 *           type: string
 *         image:
 *           type: string
 *         password:
 *           type: string
 *       required:
 *         - name
 *         - email
 *         - password
 *
 * /api/register:
 *   post:
 *     summary: Create a new account
 *     tags:
 *       - Account
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - name
 *               - password
 *     responses:
 *       201:
 *         description: Account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 *       400:
 *         description: Invalid request data
 *
 * /api/login:
 *   post:
 *     summary: Login to an existing account
 *     tags:
 *       - Account
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
const express = require("express");
const router = express.Router();
const account = require("../controllers/accounts.controller");
const authMidleWare = require("../middleWare/auth.middlewere");

router.post("/register", account.register);
router.post("/login", account.login);
router.get("/verify/:id/:token", account.verifyEmail);
router.get("/logout", authMidleWare.apiAuth, account.logout);
router.post(
  "/changePassword/:id",
  authMidleWare.apiAuth,
  account.changePassword
);
router.post("/forgotPassword", account.forgotPassword);

module.exports = router;
