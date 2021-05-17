import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter } from "react-router-dom"
import { ApolloClient, createHttpLink, InMemoryCache, ApolloProvider, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'
import { setContext } from '@apollo/client/link/context';
import { SnackbarProvider } from 'notistack';
import { LoginProvider } from './contexts/Auth'

import App from "app"

import "assets/scss/black-dashboard-react.scss"
import "assets/demo/demo.css"
import "assets/css/nucleo-icons.css"
import "@fortawesome/fontawesome-free/css/all.min.css"

import ThemeContextWrapper from "./components/ThemeWrapper/ThemeWrapper"
import BackgroundColorWrapper from "./components/BackgroundColorWrapper/BackgroundColorWrapper"

const httpLink = createHttpLink({
  uri: 'https://meros-master.herokuapp.com/graphql',
});
  
const wsLink = () => {
// Get the authentication token from local storage if it exists
const token = localStorage.getItem('token');
	return new WebSocketLink({
			uri: `wss://meros-master.herokuapp.com/graphql`,
			options: {
			reconnect: true,
			timeout: 30000,
			connectionParams: {
				Authorization: `Bearer ${token}`,
				authToken: token
			}
		}
	});
};

const authLink = setContext(async(_, { headers }) => {
	const token = await localStorage.getItem('token')
	return {
	  headers: {
		...headers,
		authorization: token ? `${token}` : "",
	  }
	}
});

// const wsLink = new WebSocketLink({
// 	uri: `ws://localhost:5000/graphql`,
// 	options: {
// 		reconnect: true
// 	}
// })

const splitLink = split(
	({ query }) => {
	  const definition = getMainDefinition(query);
	  return (
		definition.kind === 'OperationDefinition' &&
		definition.operation === 'subscription'
	  );
	},
	wsLink(),
	authLink.concat(httpLink)
  )

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
});

ReactDOM.render(
  <ThemeContextWrapper>
      <ApolloProvider client={client}>
        <BackgroundColorWrapper>
			<LoginProvider>
				<SnackbarProvider maxSnack={3}>
					<BrowserRouter>
						<App />
					</BrowserRouter>
				</SnackbarProvider>
			</LoginProvider>
        </BackgroundColorWrapper>
      </ApolloProvider>
  </ThemeContextWrapper>,
  document.getElementById("root")
)
