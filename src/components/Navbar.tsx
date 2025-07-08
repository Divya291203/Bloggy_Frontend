import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ui/ThemeToggle";
import { useUser } from "@/context/userContext";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { API_PATHS } from "@/utils/apiPaths";
const Navbar: React.FC = () => {
	const { user } = useUser();
	const role = user?.role;
	const location = useLocation();

	const isActive = (path: string) => {
		if (path === "/home" && location.pathname === "/") return true;
		return location.pathname === path || location.pathname.startsWith(path);
	};

	const getLinkClassName = (path: string) => {
		const baseClasses =
			"transition-colors duration-200 font-medium hover:scale-105 hover:drop-shadow-sm";
		if (isActive(path)) {
			return `${baseClasses} text-purple-600 dark:text-purple-400 font-semibold drop-shadow-sm underline decoration-purple-600 dark:decoration-purple-400 decoration-2 underline-offset-4`;
		}
		return `${baseClasses} text-foreground/80 hover:text-purple-600 dark:hover:text-purple-400`;
	};

	return (
		<div>
			<div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-background/70 backdrop-blur-xl p-4 border-b border-border/20 shadow-lg supports-[backdrop-filter]:bg-background/60">
				<div className="flex items-center gap-4">
					<span className="text-2xl font-bold text-foreground flex items-center">
						<span className="text-primary">B</span>
						<span className="text-foreground">LOGGY</span>
					</span>
				</div>
				<div className="hidden md:flex items-center gap-6">
					<Link to="/home" className={getLinkClassName("/home")}>
						Home
					</Link>
					<Link
						to={`${API_PATHS.POST.GET_ALL_POSTS}`}
						className={getLinkClassName("/post")}
					>
						Articles
					</Link>
					<Link to="/topics" className={getLinkClassName("/topics")}>
						Topics
					</Link>
					<Link to="/about" className={getLinkClassName("/about")}>
						About
					</Link>
				</div>
				<div className="flex items-center gap-4">
					<ThemeToggle variant="icon" />
					{!user ? (
						<div className="flex items-center gap-4">
							<Link to="/login" className={getLinkClassName("/login")}>
								Login
							</Link>
							<Link
								to="/register"
								className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors duration-200 font-medium shadow-sm"
							>
								Register
							</Link>
						</div>
					) : (
						<div>
							<Link
								to={`/${role}/dashboard`}
								className="text-foreground/80 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 font-medium hover:scale-105 hover:drop-shadow-sm"
							>
								<Avatar>
									<AvatarImage src={user.avatar} alt={user.name} />
									<AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
								</Avatar>
							</Link>
						</div>
					)}
				</div>
			</div>
			{/* Spacer to prevent content from hiding behind fixed navbar */}
			<div className="h-16"></div>
		</div>
	);
};

export default Navbar;
