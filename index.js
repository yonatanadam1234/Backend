const express = require("express");
const cors = require("cors");
const http = require("http");

const app = express();
const server = http.createServer(app);

const { mongoose } = require("mongoose");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 8080;

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const errorMiddleware = require("./middleware/errorHandler");
require("express-async-errors");

// Import Router
const authRoute = require("./app/routes/auth");

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to our Backend.");
});
app.set("view engine", "ejs");

// Router
app.use("/auth", authRoute);

app.use(errorMiddleware);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    mongoose.set("strictQuery", false);
    await connectDB();
    server.listen(PORT, console.log(`Server is listening on port ${PORT}...`));
  } catch (error) {
    console.log(error);
  }
};
start();
