const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();

app.use(cookieParser());

const sessionConfig = {
  secret: "fingerprint_customer",
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }, // Change this to 'true' if using HTTPS
  // Add a custom deserialize function
  deserializeUser: (userSerialized, callback) => {
    jwt.verify(userSerialized, "secretAccess", (err, user) => {
      if (err) {
        return callback(err);
      }
      return callback(null, user);
    });
  },
};

app.use(session(sessionConfig));

app.use(express.json());

app.use("/customer/auth/**", function auth(req, res, next) {
  //Write the authenication mechanism here
  console.log("Session ID in request:", req.sessionID);
  console.log("Session information:", req.session.authorization);
  if (req.session.authorization) {
    let token = req.session.authorization.accessToken;

    jwt.verify(token, "secretAccess", (err, user) => {
      if (!err) {
        req.user = user;
        next();
      } else {
        return res.status(401).json({ message: "Not an authenicated User" });
      }
    });
  } else {
    return res.status(401).json({ message: "User not logged in" });
  }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
