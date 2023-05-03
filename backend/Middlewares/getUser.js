var jwt = require("jsonwebtoken");

const getUser = async (req, res, next) => {
  const token = req.headers["auth-token"];
  if (token) {
    // Do something with the token
    try {
      var payloadData =  jwt.verify(token, "Mpower@1");  
      req.id = payloadData.id;
      next();
    } catch (error) {
        return res.status(401).send("Invalid Token from getuser");
    }
 }else{
    return res.status(400).send("Empty Token");
 }
};
// getuser
module.exports = getUser;
