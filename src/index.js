const {GraphQLServer} = require('graphql-yoga');
const {Prisma} = require('prisma-binding');

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
const options = {
    port: process.env.PORT || 4000,
};
server.start(options,
    ({port})=> console.log('Server is running on ', port )
);
///////////////////////////////////////////////////////////////
//server for static client
/**
const express = require('express');
const path = require('path');

if(process.env.NODE_ENV === 'production'){
    const app = express();
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.get('/', (request, response)=>{
        response.sendFile(path.join(__dirname, '../client/build/index.html'));
    });
    const port = process.env.PORT || 5000;
    app.listen(port, ()=>{
        console.log(`server running on port ${port}...`);
    });
}
*/