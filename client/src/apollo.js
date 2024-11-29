import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'
import { provideApolloClient } from '@vue/apollo-composable'

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_URL,
})

const cache = new InMemoryCache()

const defaultOptions = {
  query: {
    fetchPolicy: 'cache-and-network', // Use cache but always refetch in the background
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

const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
  defaultOptions,
})

provideApolloClient(apolloClient)

export default apolloClient
