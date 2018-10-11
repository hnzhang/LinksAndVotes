import React, {Component} from 'react';
import {withApollo} from 'react-apollo';
import gql from 'graphql-tag';

import Link from './Link';

const FEED_SEARCH_QUERY = gql`
query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
        links {
            id,
            url,
            description
            createdAt
            postedBy {
                id
                name
            }
            votes {
                id,
                user {
                    id
                }
            }
        }
    }
}
`;

class Search extends Component {
    constructor(props){
        super(props);
        this.state = {
            links: [],
            filter: ''
        };
    }

    render(){
        return (
            <div className='container-fluid'>
            <form className='form-inline' >
                <div className='form-group mb-2'>
                    <input type='text' className='form-control' id='searchInput' onChange={e=>this.setState({filter:e.target.value})} placeholder='Input keyword...'/>
                </div> {'  '}
                <button className='btn btn-primary mb-2' onClick={()=>this._executeSearch()}>Search</button>
                <div>
                {
                    this.state.links.map((link, index)=>(
                        <Link key={link.id} link={link} index={index} />
                    ))
                }
            </div>
            </form>
            </div>
        );
    }

    _executeSearch = async () =>{
        const {filter} = this.state;
        const result = await this.props.client.query({
            query: FEED_SEARCH_QUERY,
            variables: {filter},
        });
        const links = result.data.feed.links;
        this.setState({links});
    }
}

export default withApollo(Search);