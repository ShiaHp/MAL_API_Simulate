const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const auth = require("../server/middleware/auth");
const dotenv = require("dotenv");
var morgan = require("morgan");
const redisClient  = require("./utils/redis")
const logger = require("./utils/log/index")

/*console.log('hello');
console.info('text info');
console.warn('text warn');
console.error('text error');
console.error(new Error('something went wrong'));*/


// set up
const app = express();

app.use(express.static("public"));
app.use(morgan("tiny"));
app.use(
  cors({
    origin: "http://localhost:3000", // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // allow session cookie from browser to pass through
  })
);
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
app.use(
  "/public/uploads/post",
  express.static(__dirname + "/public/uploads/post")
);

app.use(bodyParser.json({}));
app.use(cors());
dotenv.config();

const connectDB = (url) => {
  return mongoose.connect(url);
};
// Routes

const userRoute = require("./routes/user.route");
const withListRoute = require("./routes/userChange,route");
const animeRoute = require("./routes/anime.route");
const anime_infoRoute = require("./routes/anime_info.routes");

app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

// routes

app.use("/api/v1/auth/", userRoute);
app.use("/api/v1/users", withListRoute);
app.use("/api/v1/anime", animeRoute);
app.use("/api/v1/animeinfo",anime_infoRoute)

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(process.env.PORT || 8080, (req, res) => {
      console.log("Server is running on port 8080");
      console.log(`Connect to DB`);
    });
  } catch (error) {
    console.log(error);
  }
};
redisClient.on('connect',() => {
  console.log('connected to redis successfully!');
})

redisClient.on('error',(error) => {
  console.log('Redis connection error :', error);
})
start();
