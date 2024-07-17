import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { Neo4jGraphQL } from "@neo4j/graphql";
import neo4j from "neo4j-driver";
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import 'dotenv/config'

const driver = neo4j.driver(
    process.env.DATABASE_URL,
    neo4j.auth.basic("neo4j", process.env.DATABASE_PW)
);

const features = {
    filters: {
        String: {
            MATCHES: true
        },
        ID: {
            MATCHES: true
        }
    }
}

const neoSchema = new Neo4jGraphQL({
    features,
    typeDefs,
    resolvers,
    driver
});

const server = new ApolloServer({
    schema: await neoSchema.getSchema(),
});

const { url } = await startStandaloneServer(server, {
    listen: { port: process.env.PORT || 4000 },
});

console.log(`🚀 Server ready at ${url}`);