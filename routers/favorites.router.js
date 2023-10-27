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