import dotenv from "dotenv";
import express, { Request, Response } from "express";
import path from "path";
import { testConnection } from "./config/database";
import router from "./routes/routes";

dotenv.config();
const app = express();
const port = Number(process.env.LOCALHOST_PORT || 3000);

app.use(express.json());
app.use(express.static("public"));
app.use(express.static("views"));
app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "views", "home.html"));
});

testConnection()
  .then(() => {
    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
