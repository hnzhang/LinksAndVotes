const jwt = require('jsonwebtoken');

const APP_SECRET = 'mysecret123';

function getUserId(context){
    const authorization = context.request.get('authorization');
    if(authorization){
        const token = authorization.replace('Bearer ', '');
        const userId = jwt.verify(token, APP_SECRET);
        return userId;
    }
    throw new Error("Not Authorized");
}

module.exports = {
    APP_SECRET,
    getUserId,
}