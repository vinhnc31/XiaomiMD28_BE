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
 */

const express = require('express');
const router = express.Router();
const favoritesController = require("../controllers/favorites.controller")

router.get("/favorites/:AccountId",favoritesController.getAccount );
router.post("/favorites",favoritesController.createFavorites);
router.delete("/favorites/:id",favoritesController.deleteFavorites);

module.exports = router;