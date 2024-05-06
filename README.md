# Zetland assignment

This is a simple web application that displays a list of top stories from Hacker News. It is built using React and leverages the `@tanstack/react-query` for fetching and managing the application's data state.

## How It Works

### Components

- **App Component**: This is the main component that fetches the top story IDs, invokes all the queries, and renders the sorted stories.
- **Story Component**: A component that displays the details of a single story. It shows the story's title, score, publication date, and author information.

### Data Fetching and State Management

It fetches the data in three steps. 

1. Gets the top stories, shuffles them in random order and then picks 10.
2. Gets the details for the chosen stories
3. Gets the author details for all stories.

All data fetching within those individual steps is parallelized.
When all data is fetched it exists within TanStack Query's cache, and we can therefore access it immediately with the `useQuery` hook in Story.tsx

### Usage

To run the application locally:

1. Clone the repository.
2. Install dependencies using `bun install`.
3. Start the application using `bun dev`.

The application will be available at `http://localhost:3000`.