import React from "react";

import UI_IMG from "@/assets/bg1.jpg";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="flex h-screen w-full">
			{/* left side */}
			{/* sm md lg xl 2xl 3xl 4xl 5xl 6xl 7xl 8xl 9xl 10xl screen breakpoints */}
			<div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12">
				<h2 className="text-lg font-medium text-white pb-4">Bloggy</h2>
				{children}
			</div>
			{/* right side */}
			<div className="hidden md:flex w-[40vw] h-screen ">
				<img src={UI_IMG} alt="bg_img" />
			</div>
		</div>
	);
};

export default AuthLayout;
