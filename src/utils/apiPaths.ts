export const BASE_URL = "http://localhost:5000/api/v1";

export const API_PATHS = {
	AUTH: {
		SIGNUP: "/auth/register", //Register a new user(Author, Reader, Admin)
		LOGIN: "/auth/login", //authenticate user and return a jwt token
		GET_ME: "/auth/me", //get user details
	},
	ADMIN: {
		GET_ALL_USERS: "/user/all-users", //get all users
		DELETE_USER: "/user/delete", //delete user
	},
	USER: {
		GET_MY_PROFILE: "/user/my-profile", //get user details
		UPDATE_USER: "/user/update", //update user details
		DELETE_USER: "/user/delete", //delete user
	},
	POST: {
		GET_ALL_POSTS: "/post", //get all posts
		GET_ONE_POST: (id: string) => `/post/${id}`, //get post details
		GET_DRAFTS: "/post/drafts", //get all drafts
		GET_MY_POSTS: "/post/my-posts", //get all my posts
		CREATE_POST: "/post/create-post", //create a new post
		UPDATE_POST: (id: string) => `/post/update/${id}`, //update post details
		DELETE_POST: "/post/delete-post", //delete post
	},
	COMMENT: {
		GET_ALL_COMMENTS: "/comment/get-all-comments", //get all comments
		GET_POST_COMMENTS: (id: string) => `/comment/get-post-comments/${id}`, //get post comments
		CREATE_COMMENT: "/comment/create", //create a new comment
		DELETE_COMMENT: "/comment/delete", //delete a comment
		EDIT_COMMENT: "/comment/edit", //edit a comment
		LIKE_COMMENT: "/comment/like", //like a comment
		REPLY_COMMENT: "/comment/reply", //reply to a comment
	},
	IMAGE: {
		UPLOAD: "/user/image-upload", //upload image to cloudinary (temporary local storage)
	},
	STATS: {
		//Admin Stats
		GET_TOTAL_POSTS: "/stats/total-posts", //get total posts
		GET_TOTAL_USERS: "/stats/total-users", //get total users
		GET_TOTAL_COMMENTS: "/stats/total-comments", //get total comments
		GET_RECENT_ACTIVITIES: "/stats/recent-activities", //get recent activities
		GET_PUBLISHED_TODAY: "/stats/published-today", //get published today

		//Author Stats
		GET_TOTAL_AUTHOR_POSTS: "/stats/author-total-posts", //get total posts

		//Topic Stats
		GET_CATEGORY_STATS: "/stats/category-stats", //get category stats
	},
};
