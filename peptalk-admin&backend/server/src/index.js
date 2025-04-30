require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require('fs');

const authRoutes = require("./routes/auth");
const blogRoutes = require("./routes/blogs");
const authMiddleware = require("./middleware/auth");
const InquiryRoutes = require("./routes/user")
const authUser = require("./routes/authUser")
const imageRoutes = require("./routes/imageRoutes")
const app = express();
const allowedOrigin = "http://localhost:5173/";
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

app.use(bodyParser.json());

app.use("/health",((res,req)=>{
    req.send(({
      mesaage:"working"
    }))
}))
app.use("/auth", authRoutes);
app.use("/blogs", authMiddleware, blogRoutes);
app.use("/auth/user", authMiddleware, authUser)
app.use("/user", InquiryRoutes)
app.use("/", imageRoutes)

const UPLOAD_DIR = './uploads';
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error(err));
