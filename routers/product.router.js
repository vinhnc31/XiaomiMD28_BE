/**
 * @swagger
 * tags:
 *   name: Product
 *   description: The product managing API
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         image:
 *           type: string
 *         price:
 *           type: number
 *         description:
 *           type: string
 *         quantity:
 *           type: integer
 *         CategoryId:
 *           type: integer
 *       required:
 *         - name
 *         - price
 *         - description
 *         - quantity
 *         - image
 *         - CategoryId
 *   responses:
 *     ProductListResponse:
 *       description: List of products
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Product'
 * /api/product:
 *   get:
 *     summary: List all products
 *     tags:
 *       - Product
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/ProductListResponse'
 *   post:
 *     summary: Add a new product
 *     tags:
 *       - Product
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               CategoryId:
 *                 type: integer
 *             required:
 *               - image
 *               - name
 *               - price
 *               - description
 *               - quantity
 *               - CategoryId
 *     responses:
 *       200:
 *         description: Product added successfully
 *       400:
 *         description: Invalid request data
 * /api/product/category/{CategoryId}:
 *   get:
 *     summary: Get products by category ID
 *     tags:
 *       - Product
 *     parameters:
 *       - in: path
 *         name: CategoryId
 *         description: ID of the category
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/ProductListResponse'
 *       500:
 *          description:Error connecting to database
 * /api/product/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags:
 *       - Product
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the product to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *          description:Error connecting to database
 */
const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const cloudinary = require("../middleWare/cloudinary.middlewere");

router.get("/product", productController.getProduct);
router.get("/product/:id", productController.getProductId);
router.get("/product/category/:CategoryId", productController.getCategoryID);
router.post(
  "/product",
  cloudinary.single("image"),
  productController.addCategory
);
router.delete("/product/:id", productController.deleteProduct);
module.exports = router;
