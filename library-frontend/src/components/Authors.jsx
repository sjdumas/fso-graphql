import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";

const Authors = (props) => {
	const [name, setName] = useState("");
	const [born, setBorn] = useState("");

	const result = useQuery(ALL_AUTHORS);
	const [editAuthor] = useMutation(EDIT_AUTHOR, {
		refetchQueries: [{ query: ALL_AUTHORS }],
	});

	if (!props.show) {
		return null;
	}

	if (result.loading) {
		return <div>loading...</div>;
	}

	const authors = result.data.allAuthors;

	const submit = (event) => {
		event.preventDefault();

		editAuthor({
			variables: { name, setBornTo: Number(born) },
		});

		setName("");
		setBorn("");
	};

	return (
		<div>
			<h2>authors</h2>
			<table>
				<tbody>
					<tr>
						<th></th>
						<th>born</th>
						<th>books</th>
					</tr>
					{authors.map((a) => (
						<tr key={a.id}>
							<td>{a.name}</td>
							<td>{a.born}</td>
							<td>{a.bookCount}</td>
						</tr>
					))}
				</tbody>
			</table>

			<h3>set birthyear</h3>
			<form onSubmit={submit}>
				<div>
					<label htmlFor="authorName">name</label>
					<select
						id="authorName"
						value={name}
						onChange={({ target }) => setName(target.value)}
					>
						<option value="">select author</option>
						{authors.map((a) => (
							<option key={a.id} value={a.name}>
								{a.name}
							</option>
						))}
					</select>
				</div>
				<div>
					<label htmlFor="born">born</label>
					<input
						id="born"
						type="number"
						value={born}
						onChange={({ target }) => setBorn(target.value)}
					/>
				</div>
				<button type="submit">update author</button>
			</form>
		</div>
	);
};

export default Authors;
