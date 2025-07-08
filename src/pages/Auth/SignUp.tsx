import AuthLayout from "@/components/Layout/AuthLayout";
import React from "react";
import { SignInForm } from "@/components/forms/signin-form";

const SignUp: React.FC = () => {
	return (
		<AuthLayout>
			<div className="lg:w-[70%] h-3/4 md:h-ful">
				<SignInForm />
			</div>
		</AuthLayout>
	);
};

export default SignUp;
