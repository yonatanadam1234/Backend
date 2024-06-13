const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(403).send({ message: "A token is required for authentication" });
  }

  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email, id } = decoded;
    req.user = { id, email };
    next();
  } catch (err) {
    return res.status(401).send({ message: "Invalid Token" });
  }
};

module.exports = verifyToken;
