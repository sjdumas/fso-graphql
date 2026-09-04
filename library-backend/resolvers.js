const Author = require("./models/author");
const Book = require("./models/book");

const resolvers = {
	Query: {
		bookCount: async () => Book.collection.countDocuments(),
		authorCount: async () => Author.collection.countDocuments(),
		allBooks: async (root, args) => {
			const filter = {};

			if (args.author) {
				const author = await Author.findOne({ name: args.author });
				if (!author) {
					return [];
				}
				filter.author = author._id;
			}

			if (args.genre) {
				filter.genres = args.genre;
			}

			return Book.find(filter);
		},
		allAuthors: async () => Author.find({}),
	},
	Book: {
		author: async (root) => Author.findById(root.author),
	},
	Author: {
		bookCount: async (root) =>
			Book.collection.countDocuments({ author: root._id }),
	},
	Mutation: {
		addBook: async (root, args) => {
			let author = await Author.findOne({ name: args.author });

			if (!author) {
				author = new Author({ name: args.author });
				await author.save();
			}

			const book = new Book({ ...args, author: author._id });
			await book.save();

			return book;
		},
		editAuthor: async (root, args) => {
			const author = await Author.findOne({ name: args.name });

			if (!author) {
				return null;
			}

			author.born = args.setBornTo;
			await author.save();

			return author;
		},
	},
};

module.exports = resolvers;
