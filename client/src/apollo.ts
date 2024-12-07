import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  DefaultOptions,
  FetchPolicy,
} from '@apollo/client/core'
import { provideApolloClient } from '@vue/apollo-composable'

// Typing for environment variables
const API_URL: string = import.meta.env.VITE_API_URL as string

// Typing for HTTP Link
const httpLink = createHttpLink({
  uri: API_URL,
})

// Typing for the cache
const cache = new InMemoryCache()

// Typing for default options
const defaultOptions: DefaultOptions = {
  query: {
    fetchPolicy: 'cache-and-network' as FetchPolicy, // Use cache but always refetch in the background
    errorPolicy: 'all', // Handle partial errors gracefully
  },
  watchQuery: {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  },
  mutate: {
    errorPolicy: 'all',
  },
}

// Typing for Apollo Client
const apolloClient: ApolloClient<object> = new ApolloClient({
  link: httpLink,
  cache,
  defaultOptions,
})

export default apolloClient
