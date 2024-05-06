import { Indicator, Paper, Skeleton, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

export type StoryData = {
	by: string;
	descendants: number;
	id: number;
	score: number;
	time: number;
	title: string;
	type: string;
	url: string;
};

export type AuthorData = {
	about: string;
	created: number;
	id: string;
	karma: number;
	submitted: number[];
};

export const Story = ({ id }: { id: number }) => {
	const {
		isPending: storyIsPending,
		data: storyData,
		isFetched: storyIsFetched,
	} = useQuery<StoryData>({
		enabled: id > 0,
		queryKey: ["story", id],
		queryFn: () =>
			fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(
				(res) => res.json(),
			),
	});
	const {
		isPending: authorIsPending,
		data: authorData,
		isFetched: authorIsFetched,
	} = useQuery<AuthorData>({
		enabled: !!storyData?.by,
		queryKey: ["author", storyData?.by],
		queryFn: () =>
			fetch(
				`https://hacker-news.firebaseio.com/v0/user/${storyData?.by}.json`,
			).then((res) => res.json()),
	});
	const storyDataIsReady = !storyIsPending && storyIsFetched;
	const authorDataIsReady = !authorIsPending && authorIsFetched;
	const allDataIsReady = storyDataIsReady && authorDataIsReady;

	return (
		<Indicator
			position="top-start"
			size={30}
			offset={8}
			zIndex={1}
			label={<Text size="xs">{storyData?.score ?? ""}</Text>}
			processing={!allDataIsReady}
		>
			<a href={storyData?.url} target="_blank" rel="noreferrer">
				<Paper shadow="xs" radius="md" p="xl" withBorder>
					<Skeleton width="70%" visible={!allDataIsReady}>
						<Text size="md">{storyData?.title ?? "No title provided"}</Text>
					</Skeleton>
					<Skeleton visible={!allDataIsReady} mt={6}>
						<Text size="xs">
							{storyData?.time
								? new Date(storyData.time * 1000).toDateString()
								: "No timestamp provided"}
						</Text>
					</Skeleton>
					<Skeleton visible={!allDataIsReady} mt={6}>
						<Text size="xs">
							Written by {authorData?.id ?? "No author name provided"} •
							{` ${authorData?.karma ?? "No author karma provided"} karma`}
						</Text>
					</Skeleton>
					<Skeleton visible={!allDataIsReady} mt={6}>
						<Text size="xs" c="dimmed">
							{storyData?.url ?? "No url provided"}
						</Text>
					</Skeleton>
				</Paper>
			</a>
		</Indicator>
	);
};
