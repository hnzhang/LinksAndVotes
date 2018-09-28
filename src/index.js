const {GraphQLServer} = require('graphql-yoga');
const {Prisma} = require('prisma-binding');

const links = [{
    id: '001',
    url: "playernetwork.com",
    description: 'A boy in in grade 5 in walnut road elementary, and swims at SurreyKnights Club',
},{
    id:'002',
    url: "fleetwood.com",
    description: 'A girl in Grade 10 in Fleetwood Park Secondary, and coach at SurreyKnight Swimming Club'
}];

let idCount = links.length;

const resolvers = {
    Query: {
        feed: (root, args, context, info) =>{
            return context.db.query.links({}, info);
        },
    },
    Mutation: {
        post: (root, args, context, info) => {
            return context.db.mutation.createLink({
                data:{ url: args.url, description:args.description }
            }, info);
        },
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
