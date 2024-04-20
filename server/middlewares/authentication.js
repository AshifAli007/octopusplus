const logger = require('../../config/logger');
const jwt = require('jsonwebtoken');

const authorizeToken = (req, res, next) =>{
    console.log('Req:-----', req.headers);
    console.log('-----------------',req.body);
    const token = req.headers['authorization'].split(' ')[1];
    if(token == null){
        res.send(403);
    }else{
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
            if(err){
                logger.error(err);
                res.status(500).send(err);
            }else{
                req.user = user;
                next();
            }
        });
    }
}

module.exports = authorizeToken;

// token = req.headers['authorization'].split(' ')[1];
// if(token == null){
//     res.send(401);
// }else{
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
//         if(err){
//             console.log(err, 'token not verified');
//             res.status(500).send(err);
//         }else{
//             req.user = user;
//             next();
//         }
//     })
// }