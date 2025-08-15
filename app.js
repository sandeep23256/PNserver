require('dotenv').config(); 
const express = require("express");
const app = express();
const port = process.env.PORT;
const web = require("./routes/web");
const connectDB = require('./database/connectDB');
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const allowedOrigins = [
  process.env.CLIENT_URL,        // Dev URL
  process.env.PROD_CLIENT_URL    // Prod URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


//image upload
app.use(fileUpload({ useTempFiles: true }));
//tokan get cookie
app.use(cookieParser());

//connectDb
connectDB();

app.use(express.urlencoded({ extended: true }));

//data get
app.use(express.json());


//route load
app.use("/api", web);

//server create
app.listen(port, () => {
  console.log(`server start localhost ${port}`);
});