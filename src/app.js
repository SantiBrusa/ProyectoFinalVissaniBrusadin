import express from "express";
import connectMongoDb from "./config/db.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.routes.js";
import dotenv from "dotenv";
import { engine } from "express-handlebars";

dotenv.config();

const app = express();
app.use(express.json());

connectMongoDb();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use(express.static("public"));
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

app.listen(8080, () => {
  console.log("Server iniciado");
});
