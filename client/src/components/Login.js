import React, {Component} from 'react';
import {Mutation} from 'react-apollo';
import gql from 'graphql-tag';

import {AUTH_TOKEN} from '../constants';

const SIGNUP_MUTATION = gql`
mutation SignupMutation($email: String!, $password: String!, $name: String!){
    signup(email: $email, password: $password, name: $name){
        token
    }
}
`;

const LOGIN_MUTATION = gql`
mutation LoginMutation($email: String!, $password: String!){
    login(email: $email, password: $password){
        token
    }
}
`;

class Login extends Component {
    constructor(){
        super();
        this.state = {
            login: true,
            email:'',
            password:'',
            name:'',
        };
    }

    render() {
        const {login, email, password, name} = this.state;
        return (
            <div>
                <h4>{login ?  'Login' : 'Sign up' }</h4>
                <div className="flex flex-column">
                    {!login && (
                        <input value={name} onChange={e=> this.setState({name: e.target.value})} 
                        type='text'
                        placeholder='Your Name' />
                    )}
                    <input value={email} onChange={e=> this.setState({email: e.target.value})} 
                        type='text'
                        placeholder="Your Email" />
                    <input value={password} onChange={e => this.setState({password: e.target.value})}
                        type="password"
                        placeholder="Your password" />
                </div>
                <div className='flex mt3'>
                    <div className="pointer mr2 button" onClick={()=>this._confirm()}>
                        {login ? 'login' : 'create account'}
                    </div>
                    <div className='pointer button' onClick={()=> this.setState({login: !login})}>
                        {login ? 'need to create a new account' : 'already have an account'}
                    </div>
                </div>
            </div>
        )
    }

    _confirm = async () => {
        //TODO: implement confirmation of input
    }

    _saveUserData = token =>{
        localStorage.setItem(AUTH_TOKEN, token)
    }
}

export default Login;