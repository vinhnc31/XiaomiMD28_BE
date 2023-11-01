/**
 * @swagger
 * tags:
 *   name: Favorites
 *   description: The Favorites managing API
 * components:
 *   schemas:
 *     Favorites:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         ProductId:
 *           type: string
 *         UserId:
 *           type: string
 *       required:
 *         - ProductId
 *         - UserId
 * /api/favorites:
 *   post:
 *     summary: Add a product to favorites
 *     tags:
 *       - Favorites
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Favorites'
 *     responses:
 *       201:
 *         description: Favorite created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Favorites'
 *       400:
 *         description: Invalid request data
 * /api/favorites/{id}:
 *   delete:
 *     summary: Remove a product from favorites
 *     tags:
 *       - Favorites
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the favorite entry to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Favorite entry deleted successfully
 *       404:
 *         description: Favorite entry not found
 *       500:
 *         description: Error connecting to the database
 * /api/favorites/{AccountId}:
 *   get:
 *     summary: Get favorites by account ID
 *     tags:
 *       - Favorites
 *     parameters:
 *       - in: path
 *         name: AccountId
 *         description: ID of the account
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Favorites'
 */

const express = require('express');
const router = express.Router();
const favoritesController = require("../controllers/favorites.controller");

router.get("/favorites/:AccountId", favoritesController.getAccount);
router.post("/favorites", favoritesController.createFavorites);
router.delete("/favorites/:id", favoritesController.deleteFavorites);

module.exports = router;