import JWT from "jsonwebtoken";
import User from '../models/User.js'
import csrf from 'csurf';

const protect = async(req, res, next) => {
    let token;
    try{
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            
                token = req.headers.authorization.split(" ")[1];
    
                const decoded = JWT.verify(token, process.env.JWT_SECRET);
    
                const user = await User.findById(decoded.id).select("-password");
                if(!user){
                    res.status(401);
                    throw new Error("Not authorized, token failed");
                }
                req.user = user; 
                next();
        }

        if (!token) {
            res.status(401);
            throw new Error("Not authorized, no token");
        }
    }catch(err){
        res.status(401).json({
            message:err.message
        })
    }

};

const csrfProtection = csrf(
    { 
        cookie:{key:"_cProtect", secure:'isSecure', sameSite:"lax", httpOnly:"true"}
    });

export {
    protect,
    csrfProtection
}