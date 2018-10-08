const {GraphQLServer} = require('graphql-yoga');
const {Prisma} = require('prisma-binding');
const path = require('path');
const express = require('express');

const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const AuthPayload = require('./resolvers/AuthPayload');
const Subscription = require('./resolvers/Subscription');
const Feed = require('./resolvers/Feed');

const resolvers = {
    Query,
    Mutation,
    AuthPayload,
    Subscription,
    Feed,
};

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: req =>(
        {
            ...req,
            db: new Prisma({
                typeDefs: 'src/generated/schema.graphql',
                endpoint: 'https://us1.prisma.sh/hnzhang-4d9d09/database/dev',
                secret: 'mysecret123',
                debug: true,
            }),
        }
    ),
});

if (process.env.NODE_ENV || process.env.NODE_ENV === 'production') {
    server.express.use("/", express.static(path.join(__dirname, '../client/build')));
    console.log("also hosting static content");
}
const options = {
    port: process.env.PORT || 4000,
};
server.start(options,
    ({port})=> console.log('Server is running on ', port )
);
///////////////////////////////////////////////////////////////
