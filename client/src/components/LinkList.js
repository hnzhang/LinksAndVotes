import React, {Component} from 'react';

import {Query} from 'react-apollo';
import gql from 'graphql-tag';

import Link from './Link';

export const FEED_QUERY = gql`
  query FeedQuery($first:Int, $skip: Int, $orderBy: LinkOrderByInput) {
    feed(first: $first, skip: $skip, orderBy: $orderBy) {
      links {
        id
        url
        description
        createdAt
        postedBy {
            name
        }
        votes{
            id
        }
      }
      count
    }
  }
`;

const NEW_LINKS_SUBSCRIPTION = gql`
subscription {
    newLink {
        node {
            id
            url
            description
            createdAt
            postedBy {
                id
                name
            }
            votes {
                id
                user {
                    id
                }
            }
        }
    }
}
`;

const NEW_VOTES_SUBSCRIPTION = gql`
subscription {
    newVote {
        node {
            id
            link {
                id, url
                description
                postedBy {
                    id
                    name
                }
                votes {
                    id
                    user {
                        id
                    }
                }
            }
            user {
                id
            }
        }
    }
}
`;

class LinkList extends Component {
    render(){
        return <Query query={FEED_QUERY}>
            {
                ({loading, error, data, subscribeToMore})=>{
                    if(loading){
                        return <div>Fetching</div>
                    }
                    if(error){
                        console.log(error);
                        return <div>Error</div>
                    }
                    const linkToRender = data.feed.links;
                    //console.log("fetched data", linkToRender);
                    this._subscribeToNewLinks(subscribeToMore);
                    this._subscribeToNewVotes(subscribeToMore);
                    return (
                        <div>
                         {linkToRender.map( (link, index) => <Link key={link.id} index={index}
                             link={link}
                             updateStoreAfterVote={this._updateCacheAfterVote} /> )}
                        </div>
                    );
                }
            }
        </Query>
    }

    _updateCacheAfterVote(store, createVote, linkId){
        const data = store.readQuery({query: FEED_QUERY});
        const votedLink = data.feed.links.find(link => link.id === linkId)
        votedLink.votes = createVote.link.votes;

        store.writeQuery({query: FEED_QUERY, data});

    }

    _subscribeToNewLinks = subscribeToMore => {
        subscribeToMore({
            document: NEW_LINKS_SUBSCRIPTION,
            query: (prev, {subscriptionData}) => {
                console.log(subscriptionData);
                if(!subscriptionData.data) return prev;
                const newLink = subscriptionData.data.newLink.node;

                return Object.assign({}, prev, {
                    feed: {
                        links: [newLink, ...prev.feed.links],
                        count: prev.links.length + 1,
                        __typename: prev.feed.__typename,
                    }
                })
            },
        })
    }

    _subscribeToNewVotes = subscribeToMore => {
        subscribeToMore({
            document: NEW_VOTES_SUBSCRIPTION,
        });
    }
}

export default LinkList;