function info(parent, args, context, info){
    return "Hello, this is GraphQL playground from Harry!";
}

function feed(parent, args, context, info){
    return context.db.query.links({}, info);
}

module.exports = {
    info,
    feed,
}