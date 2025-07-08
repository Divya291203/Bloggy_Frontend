import {
	FileText,
	BarChart3,
	PenTool,
	// Heart,
	// Bookmark,
	User,
	MessageSquare,
	Users,
	Shield,
	Palette,
	TrendingUp,
	Edit3,
	Eye,
	Heart,
	Bookmark,
	Settings,
	Globe,
} from "lucide-react";

// Import carousel images
import image1 from "@/assets/carousel/image1.jpg";
import image2 from "@/assets/carousel/image2.jpg";
import image3 from "@/assets/carousel/image3.jpg";
import image4 from "@/assets/carousel/image4.jpg";
import image5 from "@/assets/carousel/image5.jpg";

export const AUTHOR_MENU_ITEMS = [
	{
		id: 1,
		title: "Dashboard",
		url: "/user/dashboard",
		icon: BarChart3,
	},
	{
		id: 2,
		title: "My Posts",
		url: "/user/posts",
		icon: FileText,
	},
	{
		id: 3,
		title: "Create Post",
		url: "/user/create-post",
		icon: PenTool,
	},
	{
		id: 4,
		title: "Edit Post",
		url: "/user/edit-post",
		icon: Edit3,
	},
	// {
	// 	id: 4,
	// 	title: "Favorites",
	// 	url: "/user/favorites",
	// 	icon: Heart,
	// },
	// {
	// 	id: 5,
	// 	title: "Bookmarks",
	// 	url: "/user/bookmarks",
	// 	icon: Bookmark,
	// },
	{
		id: 5,
		title: "Profile",
		url: "/user/profile",
		icon: User,
	},
];

export const ADMIN_MENU_ITEMS = [
	{
		id: 1,
		title: "Dashboard",
		url: "/admin/dashboard",
		icon: BarChart3,
	},
	{
		id: 2,
		title: "Create Post",
		url: "/admin/create-post",
		icon: PenTool,
	},
	{
		id: 3,
		title: "My Posts",
		url: "/admin/posts",
		icon: FileText,
	},
	{
		id: 4,
		title: "Edit Post",
		url: "/admin/edit-post",
		icon: Edit3,
	},
	// {
	// 	id: 4,
	// 	title: "Favorites",
	// 	url: "/admin/favorites",
	// 	icon: Heart,
	// },
	// {
	// 	id: 5,
	// 	title: "Bookmarks",
	// 	url: "/admin/bookmarks",
	// 	icon: Bookmark,
	// },
	{
		id: 5,
		title: "All Posts",
		url: "/admin/all-posts",
		icon: FileText,
	},
	{
		id: 6,
		title: "All Users",
		url: "/admin/all-users",
		icon: User,
	},
	{
		id: 7,
		title: "Comments",
		url: "/admin/comments",
		icon: MessageSquare,
	},
	{
		id: 8,
		title: "Profile",
		url: "/admin/profile",
		icon: User,
	},
];

export const USER_MENU_ITEMS = [
	// {
	// 	id: 1,
	// 	title: "Dashboard",
	// 	url: "/user/dashboard",
	// 	icon: BarChart3,
	// },
	// {
	// 	id: 2,
	// 	title: "Favorites",
	// 	url: "/user/favorites",
	// 	icon: Heart,
	// },
	// {
	// 	id: 3,
	// 	title: "Bookmarks",
	// 	url: "/user/bookmarks",
	// 	icon: Bookmark,
	// },
	{
		id: 1,
		title: "Profile",
		url: "/user/profile",
		icon: User,
	},
];

export const CAROUSEL_IMAGES = [
	{
		id: 1,
		title: "Image 1",
		image: image1,
	},
	{
		id: 2,
		title: "Image 2",
		image: image2,
	},
	{
		id: 3,
		title: "Image 3",
		image: image3,
	},
	{
		id: 4,
		title: "Image 4",
		image: image4,
	},
	{
		id: 5,
		title: "Image 5",
		image: image5,
	},
];

export const CATEGORIES = [
	"Technology",
	"Programming",
	"Web Development",
	"Mobile Development",
	"Design",
	"Business",
	"Marketing",
	"Lifestyle",
	"Anime",
	"Travel",
	"Food",
	"Health",
	"Education",
	"Entertainment",
	"News",
	"Other",
];

// About Page Data
export const ABOUT_FEATURES = [
	{
		icon: Edit3,
		title: "Rich Content Creation",
		description:
			"Create beautiful blog posts with our intuitive editor. Support for markdown, media embedding, and rich formatting options.",
	},
	{
		icon: Users,
		title: "Multi-Role Management",
		description:
			"Comprehensive user management with distinct roles for admins and authors, each with tailored dashboards and permissions.",
	},
	{
		icon: MessageSquare,
		title: "Interactive Comments",
		description:
			"Engage with your audience through our comment system. Moderation tools help maintain quality discussions.",
	},
	{
		icon: TrendingUp,
		title: "Analytics & Insights",
		description:
			"Track your content performance with detailed analytics, view counts, engagement metrics, and growth trends.",
	},
	{
		icon: Palette,
		title: "Theme Customization",
		description:
			"Switch between light and dark themes seamlessly. Consistent design system ensures beautiful presentation.",
	},
	{
		icon: Shield,
		title: "Secure & Reliable",
		description:
			"Built with security best practices, user authentication, and role-based access control for safe content management.",
	},
];

export const ABOUT_STATS = [
	{ icon: FileText, value: "1000+", label: "Blog Posts" },
	{ icon: Users, value: "500+", label: "Active Users" },
	{ icon: Eye, value: "50k+", label: "Monthly Views" },
	{ icon: Heart, value: "10k+", label: "Interactions" },
];

export const ABOUT_AUTHOR_FEATURES = [
	{
		icon: Edit3,
		title: "Post Creation",
		description: "Write and publish articles",
	},
	{
		icon: FileText,
		title: "Content Management",
		description: "Manage your posts and drafts",
	},
	{
		icon: TrendingUp,
		title: "Performance Tracking",
		description: "Monitor views and engagement",
	},
	{ icon: Bookmark, title: "Bookmarks", description: "Save favorite content" },
];

export const ABOUT_ADMIN_FEATURES = [
	{
		icon: Settings,
		title: "User Management",
		description: "Manage all platform users",
	},
	{
		icon: Shield,
		title: "Content Moderation",
		description: "Review and moderate content",
	},
	{
		icon: TrendingUp,
		title: "Platform Analytics",
		description: "Comprehensive platform insights",
	},
	{
		icon: Globe,
		title: "Site Configuration",
		description: "Configure platform settings",
	},
];

export const ABOUT_TECH_STACK = [
	{ name: "React", description: "Modern UI framework" },
	{ name: "TypeScript", description: "Type-safe development" },
	{ name: "Tailwind CSS", description: "Utility-first styling" },
	{ name: "Node.js", description: "Scalable backend" },
];
