import React from "react";
import { Edit3, Shield } from "lucide-react";
import {
	ABOUT_FEATURES,
	ABOUT_STATS,
	ABOUT_AUTHOR_FEATURES,
	ABOUT_ADMIN_FEATURES,
	ABOUT_TECH_STACK,
} from "@/utils/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
const About: React.FC = () => {
	return (
		<div className="min-h-screen bg-background">
			{/* Hero Section */}
			<section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
				<div className="container mx-auto px-4">
					<div className="max-w-4xl mx-auto text-center">
						<h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
							Welcome to <span className="text-primary">Bloggy</span>
						</h1>
						<p className="text-xl text-muted-foreground mb-8 leading-relaxed">
							A modern, feature-rich blogging platform designed for writers,
							content creators, and communities. Share your stories, build your
							audience, and engage with readers in a beautiful, intuitive
							environment.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Link to="/signup">
								<Button
									size="lg"
									className="px-8 py-3 rounded-lg font-semibold cursor-pointer"
								>
									Get Started
								</Button>
							</Link>
							<Link to="/about">
								<Button
									variant="outline"
									size="lg"
									className="px-8 py-3 rounded-lg font-semibold cursor-pointer"
								>
									Learn More
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="py-16 bg-muted/30">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
						{ABOUT_STATS.map((stat, index) => (
							<Card
								key={index}
								className="text-center border-0 shadow-none bg-transparent"
							>
								<CardContent className="p-0">
									<div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
										<stat.icon className="h-8 w-8 text-primary" />
									</div>
									<h3 className="text-3xl font-bold text-foreground mb-2">
										{stat.value}
									</h3>
									<p className="text-muted-foreground">{stat.label}</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-20">
				<div className="container mx-auto px-4">
					<div className="max-w-3xl mx-auto text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
							Powerful Features for Content Creators
						</h2>
						<p className="text-lg text-muted-foreground">
							Everything you need to create, manage, and grow your blog in one
							comprehensive platform.
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{ABOUT_FEATURES.map((feature, index) => (
							<Card
								key={index}
								className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-shadow"
							>
								<CardContent className="p-0">
									<div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
										<feature.icon className="h-6 w-6 text-primary" />
									</div>
									<CardTitle className="text-xl font-semibold text-foreground mb-3">
										{feature.title}
									</CardTitle>
									<p className="text-muted-foreground leading-relaxed">
										{feature.description}
									</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Role-Based Features */}
			<section className="py-20 bg-muted/30">
				<div className="container mx-auto px-4">
					<div className="max-w-3xl mx-auto text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
							Tailored Experiences for Every User
						</h2>
						<p className="text-lg text-muted-foreground">
							Different roles, different needs. Our platform adapts to provide
							the perfect experience.
						</p>
					</div>

					<div className="grid lg:grid-cols-2 gap-12">
						{/* Author Features */}
						<div className="space-y-6">
							<div className="text-center lg:text-left">
								<h3 className="text-2xl font-bold text-foreground mb-4 flex items-center justify-center lg:justify-start gap-2">
									<Edit3 className="h-6 w-6 text-blue-600" />
									For Authors
								</h3>
								<p className="text-muted-foreground mb-6">
									Focus on what you do best - creating amazing content. We
									handle the rest.
								</p>
							</div>
							<div className="space-y-4">
								{ABOUT_AUTHOR_FEATURES.map((feature, index) => (
									<Card
										key={index}
										className="p-4 rounded-lg border border-border bg-card shadow-none"
									>
										<CardContent className="flex items-start gap-3 p-0">
											<div className="flex-shrink-0">
												<feature.icon className="h-5 w-5 text-blue-600 mt-0.5" />
											</div>
											<div>
												<h4 className="font-semibold text-foreground">
													{feature.title}
												</h4>
												<p className="text-sm text-muted-foreground">
													{feature.description}
												</p>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</div>

						{/* Admin Features */}
						<div className="space-y-6">
							<div className="text-center lg:text-left">
								<h3 className="text-2xl font-bold text-foreground mb-4 flex items-center justify-center lg:justify-start gap-2">
									<Shield className="h-6 w-6 text-purple-600" />
									For Administrators
								</h3>
								<p className="text-muted-foreground mb-6">
									Complete control and oversight of your platform with powerful
									admin tools.
								</p>
							</div>
							<div className="space-y-4">
								{ABOUT_ADMIN_FEATURES.map((feature, index) => (
									<Card
										key={index}
										className="p-4 rounded-lg border border-border bg-card shadow-none"
									>
										<CardContent className="flex items-start gap-3 p-0">
											<div className="flex-shrink-0">
												<feature.icon className="h-5 w-5 text-purple-600 mt-0.5" />
											</div>
											<div>
												<h4 className="font-semibold text-foreground">
													{feature.title}
												</h4>
												<p className="text-sm text-muted-foreground">
													{feature.description}
												</p>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Technology Stack */}
			<section className="py-20">
				<div className="container mx-auto px-4">
					<div className="max-w-3xl mx-auto text-center">
						<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
							Built with Modern Technology
						</h2>
						<p className="text-lg text-muted-foreground mb-12">
							Powered by cutting-edge technologies for performance, security,
							and scalability.
						</p>

						<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
							{ABOUT_TECH_STACK.map((tech, index) => (
								<Card
									key={index}
									className="text-center border-0 shadow-none bg-transparent"
								>
									<CardContent className="p-0">
										<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
											<span className="text-primary font-bold text-lg">
												{tech.name[0]}
											</span>
										</div>
										<h4 className="font-semibold text-foreground">
											{tech.name}
										</h4>
										<p className="text-sm text-muted-foreground">
											{tech.description}
										</p>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
				<div className="container mx-auto px-4">
					<Card className="max-w-3xl mx-auto text-center border-0 shadow-none bg-transparent">
						<CardContent className="p-0">
							<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
								Ready to Start Your Journey?
							</h2>
							<p className="text-lg text-muted-foreground mb-8">
								Join thousands of content creators who trust Bloggy for their
								publishing needs.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Link to="/signup">
									<Button
										size="lg"
										className="px-8 py-3 rounded-lg font-semibold cursor-pointer"
									>
										Create Account
									</Button>
								</Link>
								<Link to="/Home">
									<Button
										variant="outline"
										size="lg"
										className="px-8 py-3 rounded-lg font-semibold cursor-pointer"
									>
										View Demo
									</Button>
								</Link>
							</div>
						</CardContent>
					</Card>
				</div>
			</section>
		</div>
	);
};

export default About;
