import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { ALL_BOOKS } from "../queries";

const Books = (props) => {
	const [genre, setGenre] = useState(null);

	const result = useQuery(ALL_BOOKS, {
		variables: { genre },
		fetchPolicy: "cache-and-network",
	});

	if (!props.show) {
		return null;
	}

	if (result.loading) {
		return <div>loading...</div>;
	}

	const books = result.data.allBooks;

	return (
		<div>
			<h2>books</h2>

			{genre && (
				<p>
					in genre <strong>{genre}</strong>
				</p>
			)}

			<table>
				<tbody>
					<tr>
						<th></th>
						<th>author</th>
						<th>published</th>
					</tr>
					{books.map((a) => (
						<tr key={a.id}>
							<td>{a.title}</td>
							<td>{a.author.name}</td>
							<td>{a.published}</td>
						</tr>
					))}
				</tbody>
			</table>

			<div>
				<button onClick={() => setGenre("refactoring")}>refactoring</button>
				<button onClick={() => setGenre("agile")}>agile</button>
				<button onClick={() => setGenre("patterns")}>patterns</button>
				<button onClick={() => setGenre("design")}>design</button>
				<button onClick={() => setGenre("sci-fi")}>sci-fi</button>
				<button onClick={() => setGenre("horror")}>horror</button>
				<button onClick={() => setGenre("fantasy")}>fantasy</button>
				<button onClick={() => setGenre(null)}>all genres</button>
			</div>
		</div>
	);
};

export default Books;
