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
 *         id:
 *           type: integer
 *         commentBody:
 *           type: string
 *         userId:
 *           type: integer
 *         productId:
 *           type: integer
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
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
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
 *     summary: Get comments by product ID
 *     tags:
 *       - Comment
 *     parameters:
 *       - in: path
 *         name: ProductId
 *         description: ID of the product
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
 * /api/comment/{id}:
 *   put:
 *     summary: Update a comment by ID
 *     tags:
 *       - Comment
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the comment to update
 *         required: true
 *         schema:
 *           type: integer
 *       - in: formData
 *         name: commentBody
 *         description: The updated comment body
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Error connecting to the database
 *   delete:
 *     summary: Delete a comment by ID
 *     tags:
 *       - Comment
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the comment to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Comment deleted successfully
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Error connecting to the database
 */

const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controllers");
const authMidleWare = require("../middleWare/auth.middlewere");
const cloudinary = require("../middleWare/cloudinary.middlewere");
router.get(
  "/comment/:ProductId",
  authMidleWare.apiAuth,
  commentController.getProductId
);
router.post(
  "/comment",
  authMidleWare.apiAuth,
  cloudinary.single("image"),
  commentController.createComment
);
router.put(
  "/comment/:id",
  authMidleWare.apiAuth,
  commentController.updateComment
);
router.delete(
  "/comment/:id",
  authMidleWare.apiAuth,
  commentController.deleteComment
);

module.exports = router;
