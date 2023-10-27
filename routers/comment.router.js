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
 *            type: String
 *          userId:
 *            type: integer
 *          ProductId:
 *            type: integer
 *       required:
 *         - commentBody
 *         - userId
 *         - ProductId
 *         
 */