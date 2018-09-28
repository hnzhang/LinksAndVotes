const {GraphQLServer} = require('graphql-yoga');
const {Prisma} = require('prisma-binding');

const {info, feed} = require('./resolvers/Query');
const {post} = require('./resolvers/Mutation');


const resolvers = {
    Query: {
        info,
        feed,
    },
    Mutation: {
        post,
    },
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
server.start(
    ()=> console.log('Server is running on http://localhost:4000')
);
