import { useState, useEffect } from "react";
import { useApolloClient } from "@apollo/client/react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recommendations from "./components/Recommendations";

const App = () => {
	const [page, setPage] = useState("authors");
	const [token, setToken] = useState(null);
	const client = useApolloClient();

	useEffect(() => {
		const savedToken = localStorage.getItem("library-user-token");
		if (savedToken) {
			setToken(savedToken);
		}
	}, []);

	const logout = () => {
		setToken(null);
		localStorage.clear();
		client.resetStore();
		setPage("authors");
	};

	return (
		<div>
			<div>
				<button onClick={() => setPage("authors")}>authors</button>
				<button onClick={() => setPage("books")}>books</button>
				{token && (
					<button onClick={() => setPage("add")}>add book</button>
				)}
				{token && (
					<button onClick={() => setPage("recommend")}>recommend</button>
				)}
				{token ? (
					<button onClick={logout}>logout</button>
				) : (
					<button onClick={() => setPage("login")}>login</button>
				)}
			</div>

			<Authors show={page === "authors"} token={token} />

			<Books show={page === "books"} />

			<Recommendations show={page === "recommend"} />

			<NewBook show={page === "add"} />

			<LoginForm
				show={page === "login"}
				setToken={setToken}
				setPage={setPage}
			/>
		</div>
	);
};

export default App;
