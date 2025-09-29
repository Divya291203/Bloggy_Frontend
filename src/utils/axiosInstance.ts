import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
	baseURL: BASE_URL,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

export const axiosInstanceWithFile = axios.create({
	baseURL: BASE_URL,
	timeout: 10000,
	// Don't set Content-Type for FormData - let axios handle it automatically
});

//Request Interceptor for file uploads
axiosInstanceWithFile.interceptors.request.use(
	(req) => {
		const accessToken = localStorage.getItem("token");
		if (accessToken) {
			req.headers.Authorization = `Bearer ${accessToken}`;
		}
		return req;
	},
	(error) => {
		return Promise.reject(error);
	}
);

//Request Interceptor
axiosInstance.interceptors.request.use(
	(req) => {
		const accessToken = localStorage.getItem("token");
		if (accessToken) {
			req.headers.Authorization = `Bearer ${accessToken}`;
		}
		return req;
	},
	(error) => {
		return Promise.reject(error);
	}
);

//Response Interceptor
axiosInstance.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (error.response) {
			if (error.response.status === 401) {
				window.location.href = "/login";
			} else if (error.response.status === 500) {
				console.error("Server Error. Please try again later.");
			}
		} else if (error.code === "ECONNABORTED") {
			console.error("Request timed out. Please try again later.");
		}

		return Promise.reject(error);
	}
);

axios.get("http://localhost:5000/api/v1/post/my-posts", {
	params: {
		page: 1,
		limit: 10,
	},
});

export default axiosInstance;
