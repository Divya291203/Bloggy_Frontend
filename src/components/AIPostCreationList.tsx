import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Brain,
	Sparkles,
	Lightbulb,
	TrendingUp,
	Clock,
	Target,
	Wand2,
	Zap,
	ArrowRight,
	Copy,
	Edit,
	Plus,
} from "lucide-react";
import { API_PATHS } from "@/utils/apiPaths";
import axiosInstance from "@/utils/axiosInstance";

interface AIPostIdea {
	id: string;
	title: string;
	description: string;
	category: string;
	difficulty: "Easy" | "Medium" | "Hard";
	estimatedTime: string;
	trending: boolean;
}

const generateAIIdeas = async (topic: string) => {
	const result = await axiosInstance.post(
		API_PATHS.AI.GENERATE_BLOG_POST_IDEAS,
		{
			topic,
		}
	);
	return result.data;
};

const AIPostCard: React.FC<{
	idea: AIPostIdea;
	onUse: (idea: AIPostIdea) => void;
}> = ({ idea, onUse }) => {
	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty) {
			case "Easy":
				return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
			case "Medium":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
			case "Hard":
				return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
		}
	};

	return (
		<Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-border/50 hover:border-primary/30 bg-gradient-to-br from-card to-card/80">
			<CardHeader className="pb-4">
				<div className="flex items-start justify-between">
					<div className="flex items-center gap-2">
						<div className="p-2 rounded-lg bg-primary/10 text-primary">
							<Lightbulb className="h-4 w-4" />
						</div>
						{idea.trending && (
							<Badge
								variant="secondary"
								className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
							>
								<TrendingUp className="h-3 w-3 mr-1" />
								Trending
							</Badge>
						)}
					</div>
					<Badge
						variant="outline"
						className={getDifficultyColor(idea.difficulty)}
					>
						{idea.difficulty}
					</Badge>
				</div>
				<CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
					{idea.title}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<p className="text-muted-foreground text-sm leading-relaxed">
					{idea.description}
				</p>

				<div className="flex items-center justify-between text-xs text-muted-foreground">
					<div className="flex items-center gap-4">
						<span className="flex items-center gap-1">
							<Target className="h-3 w-3" />
							{idea.category}
						</span>
						<span className="flex items-center gap-1">
							<Clock className="h-3 w-3" />
							{idea.estimatedTime}
						</span>
					</div>
				</div>

				<div className="flex gap-2 pt-2">
					<Button
						size="sm"
						onClick={() => onUse(idea)}
						className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
					>
						<Edit className="h-3 w-3 mr-2" />
						Use This Idea
					</Button>
					<Button size="sm" variant="outline" className="px-3">
						<Copy className="h-3 w-3" />
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};

const AIPostCreationList = () => {
	const [topic, setTopic] = useState("");
	const [isGenerating, setIsGenerating] = useState(false);
	const [ideas, setIdeas] = useState<AIPostIdea[]>([]);
	const [hasGenerated, setHasGenerated] = useState(false);

	const handleGenerateIdeas = async () => {
		if (!topic.trim()) return;

		setIsGenerating(true);
		// Simulate API call delay
		const result = await generateAIIdeas(topic);
		setIdeas(result);
		setHasGenerated(true);
		setIsGenerating(false);
	};

	const handleUseIdea = (idea: AIPostIdea) => {
		// This would typically populate the main post creation form
		console.log("Using idea:", idea);
	};

	return (
		<div className="flex flex-1 flex-col gap-6 p-6 bg-gradient-to-br from-background to-muted/20 rounded-lg border border-border/50">
			{/* Header */}
			<div className="space-y-2">
				<div className="flex items-center gap-3">
					<div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
						<Brain className="h-5 w-5" />
					</div>
					<div>
						<h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
							AI Post Ideas
						</h1>
						<p className="text-sm text-muted-foreground">
							Generate creative post ideas with AI assistance
						</p>
					</div>
				</div>
			</div>

			{/* Input Section */}
			<Card className="border-dashed border-2 border-primary/20 bg-primary/5">
				<CardContent className="p-6">
					<div className="space-y-4">
						<div className="flex flex-col sm:flex-row gap-3">
							<div className="flex-2 relative">
								<Input
									placeholder="Enter a topic, keyword, or theme..."
									value={topic}
									onChange={(e) => setTopic(e.target.value)}
									className="pr-10 bg-background/80 border-border/50 focus:border-primary/50"
									onKeyDown={(e) => e.key === "Enter" && handleGenerateIdeas()}
								/>
								<Wand2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							</div>
							<Button
								onClick={handleGenerateIdeas}
								disabled={isGenerating}
								className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
							>
								<Sparkles className="h-4 w-4 mr-2" />
							</Button>
						</div>

						{!hasGenerated && (
							<div className="flex items-center gap-2 text-xs text-muted-foreground">
								<Zap className="h-3 w-3" />
								<span>
									Try: "React hooks", "Machine learning", "Web design trends"
								</span>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Loading State */}
			{isGenerating && (
				<Card className="border-primary/20">
					<CardContent className="p-8 text-center">
						<div className="space-y-4">
							<div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center animate-pulse">
								<Brain className="h-6 w-6 text-white" />
							</div>
							<div>
								<h3 className="font-semibold text-lg">AI is thinking...</h3>
								<p className="text-sm text-muted-foreground">
									Generating creative post ideas for "{topic}"
								</p>
							</div>
							<div className="flex justify-center space-x-2">
								<div
									className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
									style={{ animationDelay: "0ms" }}
								></div>
								<div
									className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
									style={{ animationDelay: "150ms" }}
								></div>
								<div
									className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
									style={{ animationDelay: "300ms" }}
								></div>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Results */}
			{hasGenerated && ideas.length > 0 && (
				<>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<h2 className="text-lg font-semibold">Generated Ideas</h2>
							<Badge
								variant="secondary"
								className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
							>
								{ideas.length} ideas
							</Badge>
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={handleGenerateIdeas}
							className="text-primary border-primary/30 hover:bg-primary/10"
						>
							<Plus className="h-3 w-3 mr-1" />
							Generate More
						</Button>
					</div>

					<Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />

					<div className="grid gap-4">
						{ideas.map((idea, index) => (
							<div
								key={idea.id}
								className="animate-in slide-in-from-bottom-4 duration-500"
								style={{ animationDelay: `${index * 150}ms` }}
							>
								<AIPostCard idea={idea} onUse={handleUseIdea} />
							</div>
						))}
					</div>

					<Card className="border-dashed border-2 border-muted-foreground/20 bg-muted/10">
						<CardContent className="p-6 text-center">
							<div className="space-y-3">
								<div className="mx-auto w-10 h-10 rounded-full bg-muted flex items-center justify-center">
									<ArrowRight className="h-5 w-5 text-muted-foreground" />
								</div>
								<div>
									<h3 className="font-semibold">Need more ideas?</h3>
									<p className="text-sm text-muted-foreground">
										Try different keywords or refine your topic for more
										suggestions
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</>
			)}

			{/* Empty State */}
			{!hasGenerated && !isGenerating && (
				<Card className="border-dashed border-2 border-muted-foreground/20 bg-muted/10">
					<CardContent className="p-12 text-center">
						<div className="space-y-4">
							<div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center">
								<Lightbulb className="h-8 w-8 text-purple-600 dark:text-purple-400" />
							</div>
							<div>
								<h3 className="text-lg font-semibold">Get AI-Powered Ideas</h3>
								<p className="text-muted-foreground max-w-md mx-auto">
									Enter a topic above and let AI generate creative, engaging
									post ideas tailored to your audience
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
};

export default AIPostCreationList;
