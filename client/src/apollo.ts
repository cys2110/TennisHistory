import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'
import type { DefaultOptions, FetchPolicy } from '@apollo/client/core'

// const API_URL: string = import.meta.env.VITE_API_URL as string
const API_URL: string = 'http://localhost:4000/'

const httpLink = createHttpLink({
  uri: API_URL,
})

const cache = new InMemoryCache()

const defaultOptions: DefaultOptions = {
  query: {
    fetchPolicy: 'cache-and-network' as FetchPolicy, // Use cache but always refetch in the background
    errorPolicy: 'all',
  },
  watchQuery: {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  },
  mutate: {
    errorPolicy: 'all',
  },
}

const apolloClient: ApolloClient<object> = new ApolloClient({
  link: httpLink,
  cache,
  defaultOptions,
})

export default apolloClient
