const express = require("express");
const app = express();
const userRouter = require("./routes/userRoute");
const cors = require("cors");

app.use(express.json());
app.use(cors());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/user", userRouter);

module.exports = app;
