import React, {Component} from 'react';
import {Mutation} from 'react-apollo';
import gql from 'graphql-tag';

import {AUTH_TOKEN, USER_NAME} from '../constants';

const SIGNUP_MUTATION = gql`
mutation SignupMutation($email: String!, $password: String!, $name: String!){
    signup(email: $email, password: $password, name: $name){
        token
        user {
            id
            name
        }
    }
}
`;

const LOGIN_MUTATION = gql`
mutation LoginMutation($email: String!, $password: String!){
    login(email: $email, password: $password){
        token
        user {
            id
            name
        }
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

        const mutationAction = login ? LOGIN_MUTATION : SIGNUP_MUTATION;

        return (
            <div className='container'>
            <div className='row'>
            <div className="col-md-8 m-auto">
                <h4 className='display-4 text-center'>{login ?  'Login' : 'Sign up' }</h4>
                    {!login && (
                        <div className="form-group">
                        <input className='form-control'
                            value={name} onChange={e=> this.setState({name: e.target.value})}
                            type='text'
                            placeholder='Your Name' />
                    </div>
                    )}
                    <div className="form-group">
                        <input className='form-control'
                            value={email} onChange={e=> this.setState({email: e.target.value})}
                            type='text'
                            placeholder="Your Email" />
                    </div>
                    <div className="form-group">
                        <input className='form-control' value={password} onChange={e => this.setState({password: e.target.value})}
                            type="password"
                            placeholder="Your password" />
                    </div>
                <div className='form-group'>
                    <Mutation mutation={mutationAction} variables={{email, password, name}}
                        onCompleted={ data=>this._confirm(data)} >
                        {mutation=>(
                            <div className="btn btn-info btn-block mt-4" onClick={mutation}>
                               {login ? 'login' : 'create account'}
                             </div>
                        )}
                    </Mutation>
                    <div className='btn btn-block ' onClick={()=> this.setState({login: !login})}>
                        {login ? 'need to create a new account' : 'already have an account'}
                    </div>
                </div>
            </div>
            </div>
            </div>
        )
    }

    _confirm = async (data) => {
        const {token, user} = this.state.login ? data.login : data.signup;
        this._saveUserData(token, user);
        this.props.history.push('/');
    }

    _saveUserData = (token, user) =>{
        localStorage.setItem(AUTH_TOKEN, token)
        localStorage.setItem(USER_NAME, user.name);
    }
}

export default Login;