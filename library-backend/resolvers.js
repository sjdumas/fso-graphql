const Author = require("./models/author");
const Book = require("./models/book");

const resolvers = {
	Query: {
		bookCount: async () => Book.collection.countDocuments(),
		authorCount: async () => Author.collection.countDocuments(),
		allBooks: async () => {
			return Book.find({});
		},
		allAuthors: async () => Author.find({}),
	},
	Author: {
		bookCount: () => 0,
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
