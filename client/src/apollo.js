import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'
import { provideApolloClient } from '@vue/apollo-composable'

const httpLink = createHttpLink({
  // uri: "https://tennis-history-backend-a82162895ecd.herokuapp.com/",
  uri: 'http://localhost:4000/',
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
