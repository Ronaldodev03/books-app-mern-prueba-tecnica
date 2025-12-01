import { Router } from "express";
import {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/bookController.js";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation.js";

const router = Router();

router.get("/", getBooks);

router.post(
  "/",
  body("title")
    .notEmpty()
    .withMessage("El título es obligatorio")
    .isString()
    .withMessage("El título debe ser texto"),
  handleInputErrors,
  createBook
);

router.put(
  "/:id",
  param("id").isMongoId().withMessage("ID no válido"),
  body("title")
    .notEmpty()
    .withMessage("El título es obligatorio")
    .isString()
    .withMessage("El título debe ser texto"),
  handleInputErrors,
  updateBook
);

router.delete(
  "/:id",
  param("id").isMongoId().withMessage("ID no válido"),
  handleInputErrors,
  deleteBook
);

export default router;
