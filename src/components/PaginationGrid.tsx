import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

export function PaginationGrid({
	totalPages,
	currentPage,
	onPageChange,
}: {
	totalPages: number;
	currentPage: number;
	onPageChange: (page: number) => void;
}) {
	// Don't render pagination if there's only one page or no pages
	if (totalPages <= 1) return null;

	const maxVisiblePages = 5;

	// Calculate which pages to show
	const getVisiblePages = () => {
		if (totalPages <= maxVisiblePages) {
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		}

		const halfVisible = Math.floor(maxVisiblePages / 2);
		let start = Math.max(1, currentPage - halfVisible);
		const end = Math.min(totalPages, start + maxVisiblePages - 1);

		// Adjust start if we're near the end
		if (end - start + 1 < maxVisiblePages) {
			start = Math.max(1, end - maxVisiblePages + 1);
		}

		return Array.from({ length: end - start + 1 }, (_, i) => start + i);
	};

	const visiblePages = getVisiblePages();
	const showStartEllipsis = visiblePages[0] > 2;
	const showEndEllipsis =
		visiblePages[visiblePages.length - 1] < totalPages - 1;

	const handlePageClick = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			onPageChange(page);
		}
	};

	return (
		<div className="mt-8">
			<Pagination>
				<PaginationContent>
					{/* Previous Button */}
					<PaginationItem>
						<PaginationPrevious
							onClick={() => handlePageClick(currentPage - 1)}
							className={
								currentPage === 1
									? "pointer-events-none opacity-50"
									: "cursor-pointer hover:bg-purple-50 hover:text-purple-700 transition-colors"
							}
						/>
					</PaginationItem>

					{/* First page */}
					{visiblePages[0] > 1 && (
						<PaginationItem>
							<PaginationLink
								onClick={() => handlePageClick(1)}
								isActive={currentPage === 1}
								className={`cursor-pointer transition-colors ${
									currentPage === 1
										? "bg-purple-600 text-white hover:bg-purple-700"
										: "hover:bg-purple-50 hover:text-purple-700"
								}`}
							>
								1
							</PaginationLink>
						</PaginationItem>
					)}

					{/* Start ellipsis */}
					{showStartEllipsis && (
						<PaginationItem>
							<PaginationEllipsis />
						</PaginationItem>
					)}

					{/* Visible page numbers */}
					{visiblePages.map((page) => (
						<PaginationItem key={page}>
							<PaginationLink
								onClick={() => handlePageClick(page)}
								isActive={page === currentPage}
								className={`cursor-pointer transition-colors ${
									page === currentPage
										? "bg-purple-600 text-white hover:bg-purple-700"
										: "hover:bg-purple-50 hover:text-purple-700"
								}`}
							>
								{page}
							</PaginationLink>
						</PaginationItem>
					))}

					{/* End ellipsis */}
					{showEndEllipsis && (
						<PaginationItem>
							<PaginationEllipsis />
						</PaginationItem>
					)}

					{/* Last page */}
					{visiblePages[visiblePages.length - 1] < totalPages && (
						<PaginationItem>
							<PaginationLink
								onClick={() => handlePageClick(totalPages)}
								isActive={currentPage === totalPages}
								className={`cursor-pointer transition-colors ${
									currentPage === totalPages
										? "bg-purple-600 text-white hover:bg-purple-700"
										: "hover:bg-purple-50 hover:text-purple-700"
								}`}
							>
								{totalPages}
							</PaginationLink>
						</PaginationItem>
					)}

					{/* Next Button */}
					<PaginationItem>
						<PaginationNext
							onClick={() => handlePageClick(currentPage + 1)}
							className={
								currentPage === totalPages
									? "pointer-events-none opacity-50"
									: "cursor-pointer hover:bg-purple-50 hover:text-purple-700 transition-colors"
							}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	);
}
