import { Router } from "express";
import { body, param } from "express-validator";
import { validateRequest } from "@/middlewares/requestValidator";
import * as userController from "@/controllers/user.controller";

const router = Router();

router.get(
  "/users",
  userController.getAllUsers
);

router.get(
  "/users/:id",
  validateRequest([
    param("id").isNumeric().withMessage("ID must be a number"),
  ]),
  userController.getUser
);

router.post(
  "/users",
  validateRequest([
    body("user").isObject()
  ]),
  userController.createUser
)

router.put(
  "/users/:id",
  validateRequest([
    body("user").isObject()
  ]),
  userController.updateUser
)

router.delete(
  "/users/:id",
  validateRequest([
    param("id").isNumeric().withMessage("ID must be a number"),
  ]),
  userController.deleteUser
)
export default router;