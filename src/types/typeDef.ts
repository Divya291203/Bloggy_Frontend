export type userType = {
	_id: string;
	name: string;
	email: string;
	avatar: string;
	role: string;
	bio: string;
	token: string;
	createdAt: string;
	updatedAt: string;
};

export type CommentType = {
	_id: string;
	content: string;
	postId: {
		_id: string;
		title: string;
		slug: string;
	};
	userId: {
		_id: string;
		name: string;
		email: string;
		avatar: string;
		bio: string;
		role: string;
	};
	parentComment: string | null;
	depth: number;
	commentedAt: string;
	replies: CommentType[];
	likes: string[];
	numberOfLikes: number;
	createdAt: string;
	updatedAt: string;
};
