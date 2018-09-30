function info(parent, args, context, info){
    return "Hello, this is GraphQL playground from Harry!";
}

function feed(parent, args, context, info){
    const where = args.filter
    ? {
        OR: [
            {url_contains: args.filter},
            {description_contains: args.filter},
        ],
    }
    : {};
    return context.db.query.links({where}, info);
}

module.exports = {
    info,
    feed,
}