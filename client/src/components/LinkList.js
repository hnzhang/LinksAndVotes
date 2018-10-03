import React, {Component} from 'react';

import {Query} from 'react-apollo';
import gql from 'graphql-tag';

import Link from './Link';

export const FEED_QUERY = gql`
  {
    feed {
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
class LinkList extends Component {
    render(){
        return <Query query={FEED_QUERY}>
            {
                ({loading, error, data})=>{
                    if(loading){
                        return <div>Fetching</div>
                    }
                    if(error){
                        console.log(error);
                        return <div>Error</div>
                    }
                    const linkToRender = data.feed.links;
                    //console.log("fetched data", linkToRender);
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
}

export default LinkList;