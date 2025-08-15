require('dotenv').config(); 
const express = require("express");
const app = express();
const port = process.env.PORT;
const web = require("./routes/web");
const connectDB = require('./database/connectDB');
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// app.use(
//   cors({
//     origin: process.env.CLIENT_URL,
//     credentials: true,
//   })
// );

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.PROD_CLIENT_URL,
].filter(Boolean); // remove undefined/null

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      // allow server-to-server / Postman (no origin) and your listed origins
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // preflight



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