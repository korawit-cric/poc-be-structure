import { Router } from "express";
import { param } from "express-validator";
import { validateRequest } from "@/middlewares/requestValidator";

const router = Router();

// Route to get a mock customer by ID
router.get(
  "/mock-customer/:id",
  validateRequest([
    param("id").isNumeric().withMessage("ID must be a number"),
  ]),
  (req, res) => {
    const { id } = req.params;

    // Mock customer object
    const mockCustomer = {
      id,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "123-456-7890",
      address: "123 Mock Street, Test City",
    };

    res.json(mockCustomer);
  }
);

export default router;