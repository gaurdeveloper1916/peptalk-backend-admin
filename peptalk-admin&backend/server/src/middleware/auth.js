const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).send({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(' ')[1]; // Split "Bearer token"

  if (!token) {
    return res.status(401).send({ message: "Token is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach decoded payload (like user id) to request
    next();
  } catch (err) {
    console.error(err);
    res.status(401).send({ message: "Token is not valid" });
  }
};
