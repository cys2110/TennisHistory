import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client/core";
import { provideApolloClient } from "@vue/apollo-composable";

const httpLink = createHttpLink({
  // uri: "https://tennis-history-backend-a82162895ecd.herokuapp.com/",
  uri: "http://localhost:4000/",
});

const cache = new InMemoryCache();

const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
});

provideApolloClient(apolloClient);

export default apolloClient;
