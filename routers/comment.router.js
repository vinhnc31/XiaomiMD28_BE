/**
 * @swagger
 * tags:
 *   name: Comment
 *   description: The Comment managing API
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *          id:
 *            type: integer
 *          commentBody:
 *            type: string
 *          userId:
 *            type: integer
 *          productId:
 *            type: integer
 *       required:
 *         - commentBody
 *         - userId
 *         - productId
 *   responses:
 *     ProductListResponse:
 *       description: List of products
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Comment'
 * /api/comment:
 *   post:
 *     summary: Comment on a new category
 *     tags:
 *       - Comment
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *               userId:
 *                 type: integer
 *               commentBody:
 *                 type: string
 *             required:
 *               - productId
 *               - commentBody
 *               - userId
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Invalid request data
 * /api/comment/{ProductId}:
 *   get:
 *     summary: Get products by category ID
 *     tags:
 *       - Comment
 *     parameters:
 *       - in: path
 *         name: ProcutctId
 *         description: ID of the category
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/ProductListResponse'
 */

const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controllers");

router.get("/comment/:ProductId", commentController.getProductId);
router.post("/comment", commentController.createComment);
router.put("/comment/:id", commentController.updateComment);
router.delete("/comment/:id", commentController.deleteComment);

module.exports = router;
