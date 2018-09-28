const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const {getUser} = require('./AuthPayload');
const {APP_SECRET, getUserId} = require('../../utils');

async function post(parent, args, context, info){
    const userId = getUserId(context);
    return context.db.mutation.createLink({
        data:{
            description: args.description,
            url: args.url,
            postedBy: {connect: {id: userId}},
        }
    }, info);
}

async function signup(parent, args, context, info){
    const password = await bcrypt.hash(args.password, 10);
    const user = await context.db.mutation.createUser({
        data:{ ...args, password }
    },`{id}`);


    if(!user){
        throw new Error("Failed to sign up");
    }
    
    const token = jwt.sign({ userId: user.id }, APP_SECRET);
    const user = getUser()
    return {token, id: user.id};
}

async function login(parent, args, context, info){
    const user = await context.db.query.user({where: {email: args.email}}, `{id password}`);
    if(!user){
        throw new Error("No such user found");
    }
    const valid = await bcrypt.compare(args.password, user.password);
    if(!valid){
        throw new Error("Invalid password");
    }
    const token = jwt.sign({userId: user.id}, APP_SECRET);

    return {token, id: user.id};
}
module.exports = {
    post,
    signup,
    login,
}