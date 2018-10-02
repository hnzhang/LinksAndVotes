import React, {Component} from 'react';

import {Query} from 'react-apollo';
import gql from 'graphql-tag';

import Link from './Link';

const FEED_QUERY = gql`
  {
    feed {
      links {
        id
        url
        description
      }
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
                         {linkToRender.map( link => <Link key={link.id} link={link} /> )}
                        </div>
                    );
                }
            }
        </Query>
    }
}

export default LinkList;