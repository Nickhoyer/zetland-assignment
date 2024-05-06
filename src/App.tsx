import {
	AppShell,
	Button,
	Center,
	Container,
	Space,
	Stack,
	Title,
} from "@mantine/core";
import { useQueries, useQuery } from "@tanstack/react-query";
import { shuffle } from "./utils/array-shuffle";
import { type AuthorData, Story, type StoryData } from "./components/Story";
import { queryClient } from "./main";

const initialData = Array.from({ length: 10 }, (_, i) => -1 - i);

function App() {
	const { data: storyIds } = useQuery({
		queryKey: ["topStories"],
		queryFn: () =>
			fetch("https://hacker-news.firebaseio.com/v0/topstories.json")
				.then((res) => res.json())
				.then((data) => shuffle(data as number[]).slice(0, 10)),
		initialData,
	});
	const storyQueries = useQueries({
		queries: storyIds.map((id) => ({
			queryKey: ["story", id],
			queryFn: () =>
				fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(
					(res) => res.json(),
				) as Promise<StoryData>,
			enabled: id > 0,
		})),
	});
	const authorQueries = useQueries({
		queries: storyQueries.map((query) => ({
			queryKey: ["author", query.data?.by],
			queryFn: () =>
				fetch(
					`https://hacker-news.firebaseio.com/v0/user/${query.data?.by}.json`,
				).then((res) => res.json()) as Promise<AuthorData>,
			enabled: !!query.data?.by,
		})),
	});

	const allStoriesFetched = storyQueries.every((query) => query.isSuccess);
	const allAuthorsFetched = authorQueries.every((query) => query.isSuccess);
	const allDataFetched = allStoriesFetched && allAuthorsFetched;
	const stories = storyQueries
		.map((query) => query?.data ?? { id: -1, score: -1 })
		.sort((a, b) => a.score - b.score)
		.map((s) => s.id);

	return (
		<AppShell header={{ height: 50 }} padding={20}>
			<AppShell.Header>
				<Center>
					<Title>Hacker News</Title>
					<Space w={20} />
					<Button
						onClick={() => {
							window.scrollTo({ top: 0, behavior: "smooth" });
							queryClient.resetQueries({ queryKey: ["topStories"] });
						}}
					>
						Refresh
					</Button>
				</Center>
			</AppShell.Header>
			<AppShell.Main>
				<Container size="sm">
					<Stack>
						{(allDataFetched ? stories : initialData).map((id) => (
							<Story key={id} id={id} />
						))}
					</Stack>
				</Container>
			</AppShell.Main>
		</AppShell>
	);
}

export default App;
