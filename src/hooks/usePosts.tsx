import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";
import type { userType } from "@/types/typeDef";

interface Post {
	_id: string;
	userId: userType;
	content: string;
	title: string;
	image: string;
	category: string;
	slug: string;
	createdAt: string;
	updatedAt: string;
}

interface UsePostsProps {
	page?: number;
	limit?: number;
	search?: string;
	category?: string;
	sortBy?: string;
	order?: string;
}

const usePosts = (props: UsePostsProps) => {
	const [posts, setPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [totalPages, setTotalPages] = useState<number>(0);

	const { page, limit, search, category, sortBy, order } = props;

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				setLoading(true);
				setError(null);

				const params = new URLSearchParams();
				if (page) params.append("page", page.toString());
				if (limit) params.append("limit", limit.toString());
				if (search) params.append("search", search);
				if (category) params.append("category", category);
				if (sortBy) params.append("sortBy", sortBy);
				if (order) params.append("order", order);

				const response = await axiosInstance.get(
					`${API_PATHS.POST.GET_ALL_POSTS}?${params}`
				);

				setPosts(response.data.posts);
				setTotalPages(response.data.totalPages);
				setPosts(response.data.posts);
				setTotalPages(response.data.totalPages);
			} catch (error) {
				setError(error as string);
			} finally {
				setLoading(false);
			}
		};

		fetchPosts();
	}, [page, limit, search, category, sortBy, order]);

	return { posts, loading, error, totalPages };
};

export default usePosts;
