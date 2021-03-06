import React, {Component, Fragment} from 'react';

import {Query} from 'react-apollo';
import gql from 'graphql-tag';

import Link from './Link';
import {LINKS_PER_PAGE} from '../constants';

export const FEED_QUERY = gql`
query FeedQuery($first: Int, $skip: Int, $orderBy: LinkOrderByInput) {
    feed(first: $first, skip: $skip, orderBy: $orderBy) {
      links {
        id
        url
        description
        createdAt
        postedBy {
            id
            name
        }
        votes{
            id
            user {
                id
            }
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
    _getQueryVaraibles(){
        const isNewPage = this.props.location.pathname.includes('new');
        const page = parseInt(this.props.match.params.page, 10);
        const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
        const first = isNewPage ? LINKS_PER_PAGE : 100;
        const orderBy = isNewPage ? 'createdAt_DESC' : null;
        return {first, skip, orderBy};
    }

    _getLinksToRender = data =>{
        const isNewPage = this.props.location.pathname.includes('new');
        if(isNewPage){
            return data.feed.links;
        }
        const rankedLinks = data.feed.links.slice();
        rankedLinks.sort((l1, l2)=> l2.votes.length - l1.votes.length);
        return rankedLinks;
    }

    render(){
        return <Query query={FEED_QUERY} variables={this._getQueryVaraibles()} >
            {
                ({loading, error, data, subscribeToMore})=>{
                    if(loading){
                        return <div>Fetching</div>
                    }
                    if(error){
                        console.log(error);
                        return <div>Error</div>
                    }
                    this._subscribeToNewLinks(subscribeToMore);
                    this._subscribeToNewVotes(subscribeToMore);

                    const linkToRender = this._getLinksToRender(data);
                    const isNewPage = this.props.location.pathname.includes('new');
                    const pageIndex = !isNaN(this.props.match.params.page) ?
                        (this.props.match.params.page - 1) * LINKS_PER_PAGE : 0;
                    return (
                        <Fragment>
                        <div className='list-group' >
                            {linkToRender.map( (link, index) =>(
                            <Link key={link.id} index={index + pageIndex}
                                link={link}
                                updateStoreAfterVote={this._updateCacheAfterVote} />
                            ))}
                         </div>
                        {isNewPage  && (
                            <div className='container'>
                                <div className="btn btn-info"  onClick={this._previousPage}>
                                    Previous
                                </div>{'  '}
                                <div className="btn btn-info"  onClick={()=> this._nextPage(data)}>
                                    Next
                                </div>
                            </div>
                        )}
                        </Fragment>
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
            updateQuery: (prev, {subscriptionData}) => {
                console.log(subscriptionData);
                if(!subscriptionData.data) return prev;
                const newLink = subscriptionData.data.newLink.node;
                return Object.assign({}, prev, {
                    feed: {
                        links: [newLink, ...prev.feed.links],
                        count: prev.feed.links.length + 1,
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

    _nextPage = (data) => {
        const page = parseInt(this.props.match.params.page, 10);
        if( page <= data.feed.count / LINKS_PER_PAGE){
            const nextPage = page + 1;
            this.props.history.push(`/new/${nextPage}`);
        }
    }
    _previousPage = ()=> {
        const page = parseInt(this.props.match.params.page, 10);
        if(page > 1){
            const previousPage = page -1;
            this.props.history.push(`/new/${previousPage}`);
        }
    }
}

export default LinkList;