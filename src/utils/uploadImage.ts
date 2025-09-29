import { axiosInstanceWithFile } from "./axiosInstance";
import { API_PATHS } from "./apiPaths";

const uploadImage = async (imageFile: File) => {
	const formData = new FormData();

	console.log("imageFile", imageFile);
	formData.append("image", imageFile);

	try {
		const response = await axiosInstanceWithFile.post(
			API_PATHS.IMAGE.UPLOAD,
			formData
		);
		return response.data;
	} catch (error) {
		console.error("Error uploading image:", error);
		throw error;
	}
};

export default uploadImage;
