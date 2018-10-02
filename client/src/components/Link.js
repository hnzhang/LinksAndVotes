import React, {Component} from 'react';
import { AUTH_TOKEN } from '../constants';

class Link extends Component{
    render(){
        const authToken = localStorage.getItem(AUTH_TOKEN);

        return (
            <div className='flex mt2 item-start'>
                <div className='flex items-center'>
                    <span className='gray'>{this.props.index+1}.</span>
                    {authToken && (
                        <div className='ml1 gray f11' onClick={()=>this._voteForLink()}>+</div>
                    )}
                    <div className='ml1'>
                        <div>
                            {this.props.link.description} ({this.props.link.url})
                        </div>
                        <div className='f6 lh-copy gray'>
                            {this.props.link.votes.length } votes | by {' '}
                            {this.props.link.postedBy ? this.props.link.postedBy.name : 'Unknown'}{' '}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    async _voteForLink(){

    }
}

export default Link;