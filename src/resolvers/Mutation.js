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
            postBy: {connect: {id: userId}},
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
    //this user contains id field and get auto resolved from user resolver
    //defined in AuthPayload
    return {token, user};
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

    return {token, user};
}

async function vote(parent, args, context, info) {
    const userToken = getUserId(context);

    const linkExists = await context.db.exists.Vote({
        user: {id: userToken.userId},
        link: {id: args.linkId},
    })
    if(linkExists){
        throw new Error(`User[${userToken.userId}] already voted for link:[${args.linkId}]`);
    }
    const link  = { connect: {id: args.linkId} };
    const user = { connect: {id: userToken.userId} };
    console.log("link:", link);
    console.log("user: " , user);

    return context.db.mutation.createVote({
        data:{
            link: { connect: {id: args.linkId} },
            user:{ connect: {id: userToken.userId} },
        }
    }, info);
}
module.exports = {
    post,
    signup,
    login,
    vote,
}