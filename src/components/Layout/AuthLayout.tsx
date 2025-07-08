import React from "react";

import UI_IMG from "@/assets/bg1.jpg";

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<div className="flex h-screen w-full">
			<div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12">
				<h2 className="text-lg font-medium text-black">Bloggy</h2>
				{children}
			</div>
			<div className="hidden md:flex w-[40vw] h-screen ">
				<img src={UI_IMG} alt="bg_img" />
			</div>
		</div>
	);
};

export default AuthLayout;
