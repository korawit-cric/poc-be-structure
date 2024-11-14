import { Express } from "express";
import userRoute from "./user.route";

const initializeRouter = (app: Express) => {
  app.use(userRoute);
};

export default initializeRouter;