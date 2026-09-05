import { useQuery } from "@apollo/client/react";
import { ME, ALL_BOOKS } from "../queries";

const Recommendations = (props) => {
	const userResult = useQuery(ME);
	const booksResult = useQuery(ALL_BOOKS, {
		fetchPolicy: "cache-and-network",
	});

	if (!props.show) {
		return null;
	}

	if (userResult.loading || booksResult.loading) {
		return <div>loading...</div>;
	}

	const favoriteGenre = userResult.data.me.favoriteGenre;
	const books = booksResult.data.allBooks;

	const recommendedBooks = books.filter((b) => b.genres.includes(favoriteGenre));

	return (
		<div>
			<h2>recommendations</h2>
			<p>
				books in your favorite genre <strong>{favoriteGenre}</strong>
			</p>

			<table>
				<tbody>
					<tr>
						<th></th>
						<th>author</th>
						<th>published</th>
					</tr>
					{recommendedBooks.map((a) => (
						<tr key={a.id}>
							<td>{a.title}</td>
							<td>{a.author.name}</td>
							<td>{a.published}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default Recommendations;
