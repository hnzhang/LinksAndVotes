import React from 'react';
import ReactDOM from 'react-dom';

import {BrowserRouter} from 'react-router-dom';

import './styles/index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

import {ApolloProvider} from 'react-apollo';
import {ApolloClient} from 'apollo-client';
import { getMainDefinition} from 'apollo-utilities';

import {split} from 'apollo-link';
import {WebSocketLink} from 'apollo-link-ws';
import {createHttpLink} from 'apollo-link-http';

import {InMemoryCache} from 'apollo-cache-inmemory';
import {setContext} from 'apollo-link-context';
import { AUTH_TOKEN } from './constants';

let wsURI= 'ws://localhost:4000';
let httpURI = `http://localhost:4000`;
if (process.env.NODE_ENV) {
    const hostname = process.env.HOST_NAME;

    httpURI = `https://${hostname}`;
    wsURI = `wss://${hostname}`;
}
const wsLink = new WebSocketLink({
    uri: wsURI,
    options: {
        reconnect: true,
        connectionParams: {
            authToken: localStorage.getItem(AUTH_TOKEN),
        }
    }
});

const httpLink = createHttpLink({ uri: httpURI });
const authLink = setContext((_, {headers}) => {
    const token = localStorage.getItem(AUTH_TOKEN);
    return {
        headers:{
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        }
    }
});

const link = split(
    ({query})=>{
        const {kind, operation} = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    authLink.concat(httpLink),
);

const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
});

ReactDOM.render(
    <BrowserRouter>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </BrowserRouter>,
 document.getElementById('root'));
registerServiceWorker();
