const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;
app.use(express.json());
app.use(cors());

const routes = require("./src/routes/product");
app.use("/", routes);
app.use("/assets", express.static("assets"));

app.listen(port, () => {
  console.log("Server running at port", port);
});

module.exports = app;
