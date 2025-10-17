import dotenv from "dotenv";
import express from "express";
import { Request, Response } from "express";
import { testConnection } from "config/database.ts";

dotenv.config();
const app = express();
const port = Number(process.env.LOCALHOST_PORT || 3000);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
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
