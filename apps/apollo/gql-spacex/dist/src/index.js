import { ApolloServer } from '@apollo/server';
import isEmail from 'isemail';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import { createStore } from './util.js';
import { LaunchAPI } from '../datasources/launch.js';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import json from 'body-parser';
// creates a sequelize connection once. NOT for every request
export const store = createStore();
// set up any dataSources our resolvers need
export const dataSources = () => ({
    launchAPI: new LaunchAPI()
});
// the function that sets up the global context for each resolver, using the req
export const context = async ({ req }) => {
    // simple auth check on every request
    const auth = (req.headers && req.headers.authorization) || '';
    const email = Buffer.from(auth, 'base64').toString('ascii');
    // if the email isn't formatted validly, return null for user
    if (!isEmail.validate(email))
        return { user: null };
    // find a user by their email
    const users = await store.users.findOrCreate({ where: { email } });
    const user = users && users[0] ? users[0] : null;
    return { user };
};
// Set up Apollo Server
const app = express();
const httpServer = http.createServer(app);
const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();
app.use('/graphql', cors(), json());
await new Promise((resolve) => httpServer.listen({ port: 4002 }));
console.log(`🚀 Server ready at http://localhost:4002/graphql`);
