import React from 'react';
import ApolloClient from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
// import { WebSocketLink } from 'apollo-link-ws';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
// import { SubscriptionClient } from "subscriptions-transport-ws";

import './App.css';
import Map from './components/Map';

const BASE_URL = process.env.NODE_ENV === 'production' ? 
  '<your_production_url>' : `http://localhost:4000/graphql`;
/* 
const wsClient = SubscriptionClient(BASE_URL, {
  options: {
    reconnect: true
  }
});

const wsLink = new WebSocketLink(wsClient); */
/* const client = new ApolloClient({
  link: wsLink, cache: new InMemoryCache()
}); */

const wsLink = new HttpLink({
  uri: BASE_URL,
  options: {
    reconnect: true,
    timeout: 300000000
  }
});
const client = new ApolloClient({
  link: wsLink, cache: new InMemoryCache()
});


function App() {
  
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Map />
      </div>
    </ApolloProvider>
  );
}

export default App;
