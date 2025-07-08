import React from "react";
import Footer from "../Footer";
import { Outlet } from "react-router-dom";

const FooterLayout: React.FC = () => {
	return (
		<div className="min-h-screen bg-background flex flex-col">
			<main className="flex-1">
				<Outlet />
			</main>
			<Footer />
		</div>
	);
};

export default FooterLayout;
