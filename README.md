# Full Stack Open GraphQL

This repository contains the assignments for the University of Helsinki [Full Stack Open](https://fullstackopen.com/en/) course - [Part 8: GraphQL](https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-graphql).

It is a library app with a GraphQL API for books, authors, and users, and a React frontend that uses it. The backend uses Apollo Server, MongoDB (with Mongoose), and JSON Web Tokens for login. The frontend uses React, Vite, and Apollo Client.

## Features

- List authors with their birth year and number of books
- List books, and filter them by genre
- Log in to add books and set an author's birth year
- Recommendations: books in the logged-in user's favorite genre
- Adding a book with a new author name creates the author automatically

## Tech Stack

- **Backend:** Node.js, Apollo Server 5, GraphQL, MongoDB, Mongoose, `jsonwebtoken`, dotenv
- **Frontend:** React 19, Vite, Apollo Client 4
- **Tests:** Node's built-in test runner with `mongodb-memory-server` (API tests), Playwright (end-to-end tests)
- **CI:** GitHub Actions

## Project Structure

```text
├── .github/workflows/
│   ├── test-chapter4.yml     Runs the API tests on pushes to main
│   └── test-chapter5.yml     Runs the end-to-end tests on pushes to main
├── library-backend/          GraphQL server
│   ├── models/               Mongoose models for Author, Book, and User
│   ├── data.js               Sample data from the early exercises (not used by the server)
│   ├── index.js              Connects to MongoDB, reads the login token, and starts the server
│   ├── resolvers.js          Resolvers for the queries and mutations
│   └── schema.js             GraphQL type definitions
├── library-frontend/         React frontend
│   └── src/
│       ├── components/       Authors, Books, LoginForm, NewBook, and Recommendations views
│       ├── main.jsx          Sets up Apollo Client and sends the login token with each request
│       ├── App.jsx           Navigation and login state
│       └── queries.js        GraphQL queries and mutations used by the frontend
├── tests-chapter4/           API tests that run the resolvers against an in-memory database
└── tests-chapter5/           Playwright end-to-end tests for the full app
```

## Getting Started

### Prerequisites

- Node.js (CI uses v24)
- A MongoDB database, for example a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### Backend

1. Install dependencies:

   ```bash
   cd library-backend
   npm install
   ```

2. Create a `.env` file in `library-backend`:

   ```env
   MONGODB_URI="mongodb+srv://USER:PASSWORD@CLUSTER/library?retryWrites=true&w=majority"
   JWT_SECRET="replace-with-a-long-random-string"
   ```

   Never commit `.env`. It is listed in `library-backend/.gitignore`.

3. Start the server:

   ```bash
   npm start
   ```

   Or, to restart automatically when files change:

   ```bash
   npm run dev
   ```

The server always runs at <http://localhost:4000>. Opening that address in a browser shows Apollo Sandbox, where you can run queries and mutations directly.

`index.js` makes Node use Google's DNS servers (`8.8.8.8` and `8.8.4.4`) to look up `mongodb+srv://` addresses, as a workaround for a local network problem. If your network blocks outside DNS servers, remove those lines.

### Frontend

In a second terminal:

```bash
cd library-frontend
npm install
npm run dev
```

Then open <http://localhost:5173>. The frontend expects the backend at `http://localhost:4000`.

### Creating a User

There is no sign-up page. Create a user in Apollo Sandbox at <http://localhost:4000>:

```graphql
mutation {
  createUser(username: "alice", favoriteGenre: "refactoring") {
    username
    favoriteGenre
  }
}
```

Then log in on the frontend with that username and the password `secret`.

## GraphQL API

### Queries

| Query                         | Description                                                       |
| ----------------------------- | ----------------------------------------------------------------- |
| `bookCount`                   | Number of books                                                   |
| `authorCount`                 | Number of authors                                                 |
| `allBooks(author:, genre:)`   | All books, optionally filtered by author name, genre, or both     |
| `allAuthors`                  | All authors, with `bookCount` for each                            |
| `me`                          | The logged-in user, or `null`                                     |

### Mutations

| Mutation                                          | Login required | Description                                       |
| ------------------------------------------------- | -------------- | ------------------------------------------------- |
| `addBook(title, author, published, genres)`       | Yes            | Add a book, creating the author if needed         |
| `editAuthor(name, setBornTo)`                     | Yes            | Set an author's birth year                        |
| `createUser(username, favoriteGenre)`             | No             | Create a user                                     |
| `login(username, password)`                       | No             | Returns a token for the user                      |

To use a mutation that needs a login, send the token from `login` in the request header:

```text
Authorization: Bearer <token>
```

In Apollo Sandbox, add it under **Headers**. The frontend saves the token in local storage and sends it automatically.

Validation rules:

- Book titles must be unique and at least 5 characters long.
- Author names must be unique and at least 4 characters long.
- Usernames must be unique and at least 3 characters long.

## Tests

### API Tests (`tests-chapter4`)

These tests call the backend's resolvers directly, using an in-memory MongoDB database, so they don't need a running server or a real database. Install the backend's dependencies first, because the tests load them from `library-backend`:

```bash
cd library-backend
npm install
cd ../tests-chapter4
npm install
npm test
```

### End-to-End Tests (`tests-chapter5`)

These Playwright tests start the backend (with an in-memory database) and the frontend dev server automatically, then use the app in Chromium. Install the backend's and frontend's dependencies first, and make sure nothing else is using ports 4000 or 5173:

```bash
cd tests-chapter5
npm install
npx playwright install chromium
npm test
```

Run `npm run test:report` to open the HTML report from the last run.

### Continuous Integration

On every push to `main` or `master`, GitHub Actions runs both test suites in separate workflows. Each workflow can also be started by hand from the **Actions** tab. The end-to-end workflow uploads the Playwright report after each run.

## Known Limitations

This project was built for learning, and a few things would need to change before using it in production:

- **Every user has the same password.** `login` accepts any existing username with the hard-coded password `secret`. Users should have their own hashed passwords.
- **Tokens never expire.** They are valid until `JWT_SECRET` changes.
- **The backend address and port are fixed.** The server always uses port 4000, and the frontend always connects to `http://localhost:4000`.
- **The genre buttons are fixed.** The Books view shows a set list of genres instead of the genres in the database.
