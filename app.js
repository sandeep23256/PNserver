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

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Vary', 'Origin');
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});


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