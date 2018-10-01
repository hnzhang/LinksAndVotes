function info(parent, args, context, info){
    return "Hello, this is GraphQL playground from Harry!";
}

async function feed(parent, args, context, info){
    const where = args.filter
    ? {
        OR: [
            {url_contains: args.filter},
            {description_contains: args.filter},
        ],
    }
    : {};
    const links = await context.db.query.links(
        {where, skip: args.skip, first: args.first, orderBy: args.orderBy},
        `{id}`);
        console.log("links: " , links);
    const countSelectedSet = `
    {
        aggregate {
            count
        }
    }
    `;
    const linksConnection = await context.db.query.linksConnection(
        {where, skip: args.skip, first: args.first, orderBy: args.orderBy},
        countSelectedSet);
    return {
        count: linksConnection.aggregate.count,
        linkIds: links.map(link => link.id),
    };
}

module.exports = {
    info,
    feed,
}