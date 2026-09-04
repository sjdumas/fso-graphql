const { authors, books, uuid } = require("./data");

const resolvers = {
	Query: {
		bookCount: () => books.length,
		authorCount: () => authors.length,
		allBooks: (root, args) => {
			let filteredBooks = books;

			if (args.author) {
				filteredBooks = filteredBooks.filter(
					(book) => book.author === args.author
				);
			}

			if (args.genre) {
				filteredBooks = filteredBooks.filter((book) =>
					book.genres.includes(args.genre)
				);
			}

			return filteredBooks;
		},
		allAuthors: () => authors,
	},
	Author: {
		bookCount: (root) =>
			books.filter((book) => book.author === root.name).length,
	},
	Mutation: {
		addBook: (root, args) => {
			const authorName = args.author.trim();
			const book = { ...args, author: authorName, id: uuid() };
			books.push(book);

			const authorExists = authors.some((a) => a.name === authorName);
			if (!authorExists) {
				const newAuthor = { name: authorName, id: uuid() };
				authors.push(newAuthor);
			}

			return book;
		},
		editAuthor: (root, args) => {
			const author = authors.find((a) => a.name === args.name);

			if (!author) {
				return null;
			}

			author.born = args.setBornTo;
			return author;
		},
	},
};

module.exports = resolvers;
