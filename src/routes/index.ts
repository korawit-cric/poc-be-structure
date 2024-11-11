import { Express } from "express";
import mockCustomerRoutes from "./mockCustomer.routes";

const initializeRouter = (app: Express) => {
  app.use(mockCustomerRoutes);
};

export default initializeRouter;