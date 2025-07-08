import AuthLayout from "@/components/Layout/AuthLayout";
import React from "react";
import { LoginForm } from "@/components/forms/login-form";
const Login: React.FC = () => {
	return (
		<AuthLayout>
			<div className="lg:w-[70%] h-3/4 md:h-full">
				<LoginForm />
			</div>
		</AuthLayout>
	);
};

export default Login;

//className="w-full max-w-md mx-auto p-6"
