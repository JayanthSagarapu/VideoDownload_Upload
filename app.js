const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());

const cors = require("cors");
app.use(cors());

const routes = require("./routes/router");
app.use("/googleDrive", routes);

app.use((req, res) => {
  res.sendFile(path.join(__dirname, `${req.url}`));
});

app.listen(4000, () => {
  console.log("Server Running");
});
