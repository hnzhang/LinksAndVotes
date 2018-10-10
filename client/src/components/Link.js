import React, {Component} from 'react';

import {Mutation} from 'react-apollo';
import gql from 'graphql-tag';

import { AUTH_TOKEN } from '../constants';
import { timeDifferenceForDate } from '../utils';

const VOTE_MUTATION = gql`
mutation VoteMutation($linkId: ID!){
    vote(linkId: $linkId){
        id
        link {
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
`;

class Link extends Component{
    render(){
        const authToken = localStorage.getItem(AUTH_TOKEN);

        return (
            <div className='list-group-item'>
                    <span className='badge'>{this.props.index+1}.</span>
                    {this.props.link.description} ({this.props.link.url})
                    {authToken && (
                        <Mutation mutation={VOTE_MUTATION} variables={{linkId:this.props.link.id}}
                            update={
                                (store, {data:{vote}})=>
                                this.props.updateStoreAfterVote(store, vote, this.props.link.id)
                            }
                        >
                            {
                                (voteMutation)=>(
                                <span className='btn-success' onClick={voteMutation}>
                                    +++++<i className='far fa-thumbs-up' />
                                </span>
                                )
                             }
                        </Mutation>
                    )}
                    <span className='badge badge-secondary'>
                        {this.props.link.votes.length } votes | by {' '}
                        {this.props.link.postedBy ? this.props.link.postedBy.name : 'Unknown'}{' '}
                        {timeDifferenceForDate(this.props.link.createdAt)}
                    </span>
            </div>
        );
    }

    async _voteForLink(){

    }
}

export default Link;