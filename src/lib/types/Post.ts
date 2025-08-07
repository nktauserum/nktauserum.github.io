export interface Post {
	uuid: string;
	title: string;
	description: string;
	content: string;
	created_at: string;
	tags: string[];
}

export interface PostsResponse {
	posts: Post[];
	page: number;
	limit: number;
}
