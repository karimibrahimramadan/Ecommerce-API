require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const routesController = require("./routes/routesController");
const errorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");
require("colors");

const app = express();
const port = 3000 || process.env.port;

// middlewares
app.use(express.json());
app.use(helmet());
app.use(cookieParser());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(cors());
app.use("/api/v1/uploads", express.static(path.join(__dirname, "./uploads")));

// routes
app.use("/api/v1/auth", routesController.authRouter);
app.use("/api/v1/categories", routesController.categoryRouter);
app.use("/api/v1/orders", routesController.orderRouter);
app.use("/api/v1/products", routesController.productRouter);
app.use("/api/v1/reviews", routesController.reviewRouter);
app.use("/api/v1/subcategories", routesController.subCategoryRouter);
app.use("/api/v1/users", routesController.userRouter);
app.use("*", (req, res, next) => {
  next(new AppError("404 Not Found", 404));
});

// error handler
app.use(errorHandler);

connectDB();

app.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}`.cyan.underline)
);
