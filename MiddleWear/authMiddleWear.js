require('dotenv').config()
const JWT = require("jsonwebtoken")
const secrete = process.env.JwtSecret

module.exports= (req, res, next) => {
    try {
        console.log(req.headers.authorization);
        var token = req.headers.authorization
        JWT.verify(token, secrete ,function(err,decoded){
            if(err){
                return res.status(400).json({
                    message:"unauthrized"
                })
            }
            req._id=decoded._id
         console.log(decoded)

         })
        next();
    
    } catch (e){
      console.log(e);
      
    }
  };
  