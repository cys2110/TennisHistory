import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { Neo4jGraphQL } from "@neo4j/graphql";
import neo4j from "neo4j-driver";
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';

const driver = neo4j.driver(
    "neo4j+s://84ef144c.databases.neo4j.io",
    neo4j.auth.basic("neo4j", "bSaIKEK1G0dW-0j9w-aMMvsE7-_BtxGFm_7ZXOy-1W0")
);

const neoSchema = new Neo4jGraphQL({ typeDefs, 
    resolvers, 
    driver });

const server = new ApolloServer({
    schema: await neoSchema.getSchema(),
});

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});

console.log(`🚀 Server ready at ${url}`);