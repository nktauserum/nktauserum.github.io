export interface Post {
    uuid: string,
    title: string,
    description: string,
    body: string,
    created_at: string,
    tags: string[],
}

export interface PostsResponse {
  posts: Post[];
  page: number;
  limit: number;
}