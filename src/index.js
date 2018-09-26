const {GraphQLServer} = require('graphql-yoga');

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
        info: () =>`This is the API of the hackernews Clone`,
        feed: () =>links,
    },
    Mutation: {
        post: (root, args) => {
            let newPost = {
                id: idCount.toString(),
                url: args.url,
                description:args.description
            };
            links.push(newPost);
            return newPost;
        }
    }
};

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
});
server.start(
    ()=> console.log('Server is running on http://localhost:4000')
);
