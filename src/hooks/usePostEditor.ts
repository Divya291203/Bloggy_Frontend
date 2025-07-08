import { useState } from "react";

export const usePostEditor = () => {
	const [editingPostId, setEditingPostId] = useState<string | undefined>(
		undefined
	);

	return {
		editingPostId,
		setEditingPostId,
	};
};
