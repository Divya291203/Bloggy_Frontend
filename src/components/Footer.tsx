import React from "react";

const Footer: React.FC = () => {
	return (
		<footer className="bg-background text-foreground">
			<div className="w-full h-[1px] bg-primary" />
			<div className="container mx-auto px-4 py-8">
				<p className="text-center text-sm text-muted-foreground">
					&copy; {new Date().getFullYear()} BLOGGY. All rights reserved.
				</p>
			</div>
		</footer>
	);
};

export default Footer;
