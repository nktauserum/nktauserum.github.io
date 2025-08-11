import type { Post } from '$lib/types/Post';

export async function fetchPost(id: string): Promise<Post> {
	const res = await fetch(`http://localhost:8080/articles/${id}`, {
		headers: { 'Content-Type': 'application/json' }
	});
	if (!res.ok) {
		const err = await res.json().catch(() => ({ message: res.statusText }));
		throw new Error(err.message || `Ошибка ${res.status}`);
	}
	return (await res.json()) as Post;
}
