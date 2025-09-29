import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import PrivateRoute from "./routes/PrivateRoute";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import UserProvider from "./context/userContext";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AuthorDashboard from "./pages/Author/AuthorDashboard";
import UserDashboard from "./pages/User/UserDashboard";
import PrivateRoute from "./routes/PrivateRoute";
import { ThemeProvider } from "./context/themeContext";
import Home from "./pages/Public/Home";
import MainLayout from "./components/Layout/MainLayout";
import Articles from "./pages/Public/Articles";
import Topics from "./pages/Public/Topics";
import About from "./pages/Public/About";
import FooterLayout from "./components/Layout/FooterLayout";
import PostDetails from "./components/PostDetails";
import CreatePost from "./components/CreatePost";



function App() {
	return (
		<Router >
			<UserProvider>
				<ThemeProvider >
					<Routes>
						{/* Auth Routes - No Navbar */}
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<SignUp />} />

						{/* Admin Routes - No Navbar (uses SidebarLayout) */}
						<Route element={<PrivateRoute allowedRoles={["admin"]} />}>
							<Route path="/admin/dashboard" element={<AdminDashboard />} />
							<Route path="/admin/create-post" element={<CreatePost />} />
						</Route>

						{/* Author Routes - No Navbar (uses SidebarLayout) */}
						<Route element={<PrivateRoute allowedRoles={["author"]} />}>
							<Route path="/author/dashboard" element={<AuthorDashboard />} />
							<Route path="/author/create-post" element={<CreatePost />} />
							{/* <Route path="author/posts" element={<AuthorPosts />} /> */}
						</Route>

						{/* User Routes */}
						<Route element={<PrivateRoute allowedRoles={["reader"]} />}>
							<Route path="/reader/dashboard" element={<UserDashboard />} />
						</Route>

						{/* Public Routes only home page and about page - With Navbar */}
						<Route element={<FooterLayout />}>
							<Route element={<MainLayout />}>
								<Route path="/home" element={<Home />} />
								<Route path="/about" element={<About />} />
								<Route element={<PrivateRoute />}>
									<Route path={"/post"} element={<Articles />} />
									<Route path="/topics" element={<Topics />} />
								</Route>
								{/* Add other public routes here that should have the navbar */}
							</Route>

							{/* Post Private Route */}
							<Route element={<MainLayout />}>
								<Route element={<PrivateRoute />}>
									<Route path="/post/:id" element={<PostDetails />} />
								</Route>
							</Route>
						</Route>
						{/* Root Route */}
						<Route element={<FooterLayout />}>
							<Route element={<MainLayout />}>
								<Route path="/" element={<Home />} />
							</Route>
						</Route>
					</Routes>
				</ThemeProvider>
			</UserProvider>
		</Router>
	);
}

export default App;
