const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Workaround: local network's default DNS resolver fails on SRV lookups
// required for the mongodb+srv:// connection string. Force Node to use
// Google's DNS instead. Remove if deploying somewhere without this issue.
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const User = require("./models/user");

const MONGODB_URI = process.env.MONGODB_URI;

console.log("connecting to", MONGODB_URI);

mongoose
	.connect(MONGODB_URI, { family: 4 })
	.then(() => {
		console.log("connected to MongoDB");
	})
	.catch((error) => {
		console.log("error connecting to MongoDB:", error.message);
	});

const server = new ApolloServer({
	typeDefs,
	resolvers,
});

startStandaloneServer(server, {
	listen: { port: 4000 },
	context: async ({ req }) => {
		const auth = req ? req.headers.authorization : null;

		if (auth && auth.startsWith("Bearer ")) {
			const decodedToken = jwt.verify(
				auth.substring(7),
				process.env.JWT_SECRET
			);
			const currentUser = await User.findById(decodedToken.id);
			return { currentUser };
		}
	},
}).then(({ url }) => {
	console.log(`Server ready at ${url}`);
});
