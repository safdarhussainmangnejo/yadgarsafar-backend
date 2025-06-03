const express = require("express");
const serverless = require("serverless-http");
const multer = require("multer");
const bodyParser = require("body-parser");
require("dotenv").config();
const session = require("express-session");
const cors = require("cors");
const path = require("path");
const { default: mongoose } = require("mongoose");
const fileupload = require("express-fileupload");
const app = express();
app.use(bodyParser.json());
const agencyRoute = require("../router/agencyRoute");

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileupload());
// var corsOptions = {
//   origin: "http://localhost:3000",
//   credentials:true,            //access-control-allow-credentials:true
//   optionSuccessStatus:200
// };
app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

//connecting to database

mongoose
  .connect(
    //"mongodb+srv://safdar:yadgarsafar@project1.3hqbd.mongodb.net/yadgardb?retryWrites=true&w=majority",
    "mongodb+srv://safdar:yadgarsafar@project1.3hqbd.mongodb.net/?retryWrites=true&w=majority&appName=project1"
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// setting path
app.use("/", express.static(path.resolve("public/images")));
app.use("/", express.static(path.join(__dirname, "public/images")));

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/images");
  },
  filename: function (req, file, callback) {
    callback(null, new Date.now() + "_" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
}).single("image");

//middlewares
app.use('/', agencyRoute);
// simple route
app.get("/", async (req, res) => {
  res.json({ message: "Welcome to Yadgar Safar application." });
});




module.exports = app;
module.exports.handler = serverless(app);
