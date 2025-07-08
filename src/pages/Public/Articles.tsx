import React, { useState, useCallback } from "react";
import usePosts from "@/hooks/usePosts";
import PostCard from "@/components/PostCard";
import Loading from "@/components/Loading";
import { PaginationGrid } from "@/components/PaginationGrid";
import SearchFilters from "@/components/SearchFilters";
import { Button } from "@/components/ui/button";

const Articles: React.FC = () => {
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [search, setSearch] = useState<string>("");
	const [category, setCategory] = useState<string>("");
	const [sortBy, setSortBy] = useState<string>("newest");

	const { posts, loading, error, totalPages } = usePosts({
		page: currentPage,
		limit: 6,
		search,
		category,
		sortBy,
	});

	// Handler functions for SearchFilters component - wrapped in useCallback to prevent recreation
	const handleSearchChange = useCallback((newSearch: string) => {
		setSearch(newSearch);
		setCurrentPage(1); // Reset to first page when search changes
	}, []);

	const handleCategoryChange = useCallback((newCategory: string) => {
		setCategory(newCategory);
		setCurrentPage(1);
	}, []);

	const handleSortChange = useCallback((newSortBy: string) => {
		setSortBy(newSortBy);
		setCurrentPage(1);
	}, []);

	const handleReset = useCallback(() => {
		setSearch("");
		setCategory("");
		setSortBy("newest");
		setCurrentPage(1);
	}, []);

	return (
		<div className="container mx-auto px-12 py-8">
			<h1 className="text-3xl font-bold text-left mb-8 text-purple-800">
				Articles
			</h1>

			{/* Search and Filters Component */}
			<SearchFilters
				search={search}
				category={category}
				sortBy={sortBy}
				onSearchChange={handleSearchChange}
				onCategoryChange={handleCategoryChange}
				onSortChange={handleSortChange}
				onReset={handleReset}
			/>

			{/* Results Count */}
			<div className="mb-4 text-gray-600">
				{loading ? (
					<p className="text-purple-600">Searching...</p>
				) : error ? (
					<p className="text-red-500">Error loading articles: {error}</p>
				) : posts.length > 0 ? (
					<p>
						Showing {posts.length} article{posts.length !== 1 ? "s" : ""}{" "}
						{totalPages > 1 && `(Page ${currentPage} of ${totalPages})`}
					</p>
				) : (
					<p>No articles found. Try adjusting your search or filters.</p>
				)}
			</div>

			{/* Articles Grid */}
			<div className="min-h-[400px] relative">
				{loading ? (
					<Loading message="Searching articles..." />
				) : error ? (
					<div className="flex justify-center items-center h-[400px]">
						<div className="text-center text-red-500">
							<p className="text-lg font-semibold mb-2">
								Error loading articles
							</p>
							<p className="text-sm">{error}</p>
						</div>
					</div>
				) : posts.length === 0 ? (
					<div className="text-center py-16">
						<div className="mb-4">
							<svg
								className="h-16 w-16 text-muted-foreground mx-auto mb-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1}
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
						</div>
						<h3 className="text-xl font-semibold text-foreground mb-2">
							No Articles Found
						</h3>
						<p className="text-muted-foreground mb-6">
							We couldn't find any articles matching your search criteria.
						</p>
						<Button onClick={() => window.location.reload()} variant="outline">
							Reset Filters
						</Button>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 justify-items-center">
						{posts.map((post) => (
							<PostCard key={post._id} post={post} type="normal" />
						))}
					</div>
				)}
			</div>

			{/* Pagination - Only show when we have posts and no error */}
			{!loading && !error && posts.length > 0 && (
				<PaginationGrid
					totalPages={totalPages}
					currentPage={currentPage}
					onPageChange={setCurrentPage}
				/>
			)}
		</div>
	);
};

export default Articles;
