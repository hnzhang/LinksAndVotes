async function post(parent, args, context, info){
    return context.db.mutation.createLink({
        data:{
            description: args.description,
            url: args.url,
        }
    }, info);
}

module.exports = {
    post,
}