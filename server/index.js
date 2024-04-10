require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http").Server(app);

const db = require("./datasource/pg");
const authRouter = require("./routes/authRoutes");
const authMiddleware = require("./middlewares/authMiddleware");
const envRouter = require("./routes/envRouter");

const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.pgDataSource
  .initialize()
  .then(() => {
    console.log("Connected to Postgres");
  })
  .catch((err) => {
    console.error(err);
  });

app.get("/", (_, res) => {
  res.json({ status: true, msg: "Hello World!" });
});

app.use("/auth", authRouter);
app.use(authMiddleware);
app.use("/envs", envRouter);

app.use((err, _, res, __) => {
  console.error(err);
  res.status(500).json({ status: false, msg: "Internal server error" });
});

app.use((_, res) => {
  res.status(404).json({ status: false, msg: "Route not found" });
});

http.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
