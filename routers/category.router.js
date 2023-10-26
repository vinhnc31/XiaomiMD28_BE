/**
 * @swagger
 * tags:
 *   name: Category
 *   description: The category managing API
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         image:
 *           type: string
 *       required:
 *         - name
 *   parameters:
 *     CategoryId:
 *       in: path
 *       name: id
 *       description: ID of the category
 *       required: true
 *       schema:
 *         type: string
 *   requestBodies:
 *     CategoryUpdateBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *             example:
 *               name: Updated Category
 *               image: https://example.com/image.jpg
 *   responses:
 *     CategoryResponse:
 *       description: Category object
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 * /api/category:
 *   get:
 *     summary: List all categories
 *     tags:
 *       - Category
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *   post:
 *     summary: Create a new category
 *     tags:
 *       - Category
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *       required: true
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Invalid request data
 * /api/category/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags:
 *       - Category
 *     parameters:
 *       - $ref: '#/components/parameters/CategoryId'
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 *   put:
 *     summary: Update category by ID
 *     tags:
 *       - Category
 *     parameters:
 *       - $ref: '#/components/parameters/CategoryId'
 *     requestBody:
 *       $ref: '#/components/requestBodies/CategoryUpdateBody'
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: Category not found
 *   delete:
 *     summary: Delete category by ID
 *     tags:
 *       - Category
 *     parameters:
 *       - $ref: '#/components/parameters/CategoryId'
 *     responses:
 *       '204':
 *         description: Category deleted successfully
 *       '404':
 *         description: Category not found
 */
const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controlles");
const cloudinary = require("../middleWare/cloudinary.middlewere");

router.get("/category", categoryController.getCategory);
router.get("/category/:id", categoryController.getCategoryId);
router.post(
  "/category",
  cloudinary.single("image"),
  categoryController.createCategory
);
router.put(
  "/category/:id",
  cloudinary.single("image"),
  categoryController.updateCategory
);
router.delete("/category/:id", categoryController.deleteCategory);

module.exports = router;
