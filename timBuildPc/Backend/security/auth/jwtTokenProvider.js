const jwt = require('jsonwebtoken')
const express = require('express');


class JWT_Token_Provider {
    constructor(){
    this.JWT_Token = process.env.ACCESS_TOKEN_SECRET
    this.ACCESS_Token_Expires = '10min'
    this.REFRESH_Token = process.env.REFRESH_TOKEN
    this.REFRESH_Token_Expires = "1d"
    }

    // generatingAccessToken function
    generateAccessToken(user){
        const payload = {
            sub: user.id || user.sub,
            firstName: user.firstName,
            isAdmin: user.isAdmin ,
        }

        return jwt.sign(
            payload, this.JWT_Token, {
                expiresIn: this.ACCESS_Token_Expires
            }
        )
    }
    // generating Refresh token method passing expiring data 
    generateRefreshToken(user){
        const payload = {
            sub: user.id || user.sub,
            firstName: user.firstName,
            isAdmin: user.isAdmin,
        }
        return jwt.sign(
            payload, this.REFRESH_Token,
            {expiresIn:this.REFRESH_Token_Expires}
        )
    }
    // verifying the token that is not fake, cheking if same secret numbers
    verifyRefreshToken(token) {
        try {
            const userPayload = jwt.verify(token, this.REFRESH_Token);
            console.log(userPayload)
            return userPayload; 
        } catch (err) {
            // Token is invalid or expired
            return null; 
        }
    }

    // verification of the access token 

    authenticateToken(req, res, next) {
          const JWT_Token = process.env.ACCESS_TOKEN_SECRET
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; 

        console.log("acutal "+token)
        if (!token ) {
            return res.status(401).json({data:[], message: 'Token missing' });
        }
  // verification if the token is the proper token
        jwt.verify(token, JWT_Token, (err, user) => {
            // console.log('fsdfsdf FF '+token)
            if (err) {
               
                return res.status(403).json({ data:[],message: 'Invalid or expired token' });
            }

            req.user = user; 
            next();
        });
    }


}

module.exports = new JWT_Token_Provider();

