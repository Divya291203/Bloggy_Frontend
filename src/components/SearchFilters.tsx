import React, { useState, useEffect } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { CATEGORIES } from "@/utils/data";

interface SearchFiltersProps {
	search: string;
	category: string;
	sortBy: string;
	onSearchChange: (search: string) => void;
	onCategoryChange: (category: string) => void;
	onSortChange: (sortBy: string) => void;
	onReset: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
	search,
	category,
	sortBy,
	onSearchChange,
	onCategoryChange,
	onSortChange,
	onReset,
}) => {
	const [searchInput, setSearchInput] = useState<string>(search);

	// Category options - using data from utils with "All Categories" option
	const categoryOptions = [
		{ value: "all", label: "All Categories" },
		...CATEGORIES.map((cat) => ({
			value: cat.toLowerCase().replace(/\s+/g, "-"),
			label: cat,
		})),
	];

	// Sort options
	const sortOptions = [
		{ value: "newest", label: "Newest First" },
		{ value: "oldest", label: "Oldest First" },
		{ value: "title", label: "Title A-Z" },
		{ value: "views", label: "Most Views" },
	];

	// Debounce search input
	useEffect(() => {
		const debounceTimer = setTimeout(() => {
			onSearchChange(searchInput);
		}, 500); // 500ms delay

		return () => clearTimeout(debounceTimer);
	}, [searchInput, onSearchChange]);

	// Sync searchInput with external search prop
	useEffect(() => {
		setSearchInput(search);
	}, [search]);

	const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchInput(e.target.value);
	};

	const handleCategoryChange = (value: string) => {
		// Convert "all" back to empty string for the API
		onCategoryChange(value === "all" ? "" : value);
	};

	const handleResetFilters = () => {
		setSearchInput("");
		onReset();
	};

	const hasActiveFilters = searchInput || category || sortBy !== "newest";

	// Get display value for category (convert empty string to "all" for display)
	const categoryDisplayValue = category === "" ? "all" : category;

	return (
		<div className="mb-8 space-y-4">
			{/* Search Bar and Filters */}
			<div className="flex flex-col md:flex-row gap-4 items-center">
				<div className="flex-1 w-full relative">
					<input
						type="text"
						placeholder="Search articles..."
						value={searchInput}
						onChange={handleSearchInputChange}
						className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30"
					/>
					{/* Loading indicator for search */}
					{searchInput !== search && searchInput.length > 0 && (
						<div className="absolute right-3 top-1/2 transform -translate-y-1/2">
							<Skeleton className="w-4 h-4 rounded-full bg-primary/30" />
						</div>
					)}
				</div>

				{/* Category Filter */}
				<Select
					value={categoryDisplayValue}
					onValueChange={handleCategoryChange}
				>
					<SelectTrigger className="min-w-[150px]">
						<SelectValue placeholder="All Categories" />
					</SelectTrigger>
					<SelectContent className="max-h-[200px]">
						{categoryOptions.map((option, index) => (
							<SelectItem
								key={option.value}
								value={option.value}
								className={
									index === 0 ? "border-b border-border mb-1 pb-2" : ""
								}
							>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{/* Sort Filter */}
				<Select value={sortBy} onValueChange={onSortChange}>
					<SelectTrigger className="min-w-[150px]">
						<SelectValue placeholder="Newest First" />
					</SelectTrigger>
					<SelectContent>
						{sortOptions.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{/* Reset Button */}
				{hasActiveFilters && (
					<button
						onClick={handleResetFilters}
						className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2"
					>
						Reset Filters
					</button>
				)}
			</div>

			{/* Active Filters Display */}
			{(search || category || sortBy !== "newest") && (
				<div className="flex flex-wrap gap-2 text-sm">
					<span className="text-muted-foreground">Active filters:</span>
					{search && (
						<span className="inline-flex items-center rounded-md border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
							Search: "{search}"
						</span>
					)}
					{category && (
						<span className="inline-flex items-center rounded-md border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
							Category:{" "}
							{
								categoryOptions.find(
									(opt) => opt.value === categoryDisplayValue
								)?.label
							}
						</span>
					)}
					{sortBy !== "newest" && (
						<span className="inline-flex items-center rounded-md border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
							Sort: {sortOptions.find((opt) => opt.value === sortBy)?.label}
						</span>
					)}
				</div>
			)}
		</div>
	);
};

export default SearchFilters;
