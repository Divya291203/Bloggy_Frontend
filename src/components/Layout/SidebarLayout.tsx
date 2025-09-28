import React from "react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { Home, LogOut } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AUTHOR_MENU_ITEMS } from "@/utils/data";
import type { userType } from "@/types/typeDef";
import { Avatar } from "../ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { ThemeToggle } from "../ui/ThemeToggle";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

type SidebarLayoutProps = {
	children: React.ReactNode;
	menuItems: typeof AUTHOR_MENU_ITEMS;
	user: userType | null;
	signout: () => void;
	activeView?: string;
	onViewChange?: (view: string) => void;
};

const SidebarLayout: React.FC<SidebarLayoutProps> = ({
	children,
	menuItems,
	user,
	signout,
	activeView,
	onViewChange,
}) => {
	const handleMenuClick = (item: (typeof AUTHOR_MENU_ITEMS)[number]) => {
		if (onViewChange) {
			// Use component switching mode
			onViewChange(item.title);
		} else {
			// Fallback to navigation mode (if you still want some items to navigate)
			window.location.href = item.url;
		}
	};

	let breadcrumbText = "User";
	if (user?.role === "admin") {
		breadcrumbText = "Admin";
	} else if (user?.role === "author") {
		breadcrumbText = "Author";
	}

	return (
		<SidebarProvider>
			<Sidebar>
				<SidebarHeader>
					<div className="flex items-center gap-2 px-4 py-2">
						<Avatar className="h-8 w-8">
							<AvatarImage src={user?.avatar} alt={user?.name || "User"} />
							<AvatarFallback>{user?.name[0] || "U"}</AvatarFallback>
						</Avatar>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-semibold">
								{user?.name || "User Dashboard"}
							</span>
							<span className="truncate text-xs text-muted-foreground">
								{user?.email || "user@example.com"}
							</span>
						</div>
						<Link to="/home">
							<Button
								variant="outline"
								size="icon"
								className="h-8 w-8 cursor-pointer"
							>
								<Home className="h-4 w-4" />
							</Button>
						</Link>
					</div>
				</SidebarHeader>

				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupLabel>Navigation</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{menuItems.map((item: (typeof AUTHOR_MENU_ITEMS)[number]) => (
									<SidebarMenuItem key={item.id}>
										<SidebarMenuButton
											onClick={() => handleMenuClick(item)}
											className={
												activeView === item.title
													? "bg-sidebar-accent text-sidebar-accent-foreground"
													: ""
											}
										>
											<item.icon className="h-4 w-4" />
											<span>{item.title}</span>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>

				<SidebarFooter>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<div
									onClick={() => signout()}
									className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
								>
									<LogOut className="h-4 w-4" />
									<span>Logout</span>
								</div>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarFooter>
			</Sidebar>

			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 ">
					<SidebarTrigger className="-ml-1 md:hidden" />
					<Separator orientation="vertical" className="mr-2 h-4 md:hidden" />
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem className="hidden md:block">
								<BreadcrumbLink>{breadcrumbText} Dashboard</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="hidden md:block" />
							<BreadcrumbItem>
								<BreadcrumbPage>{activeView || "Overview"}</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>

					<ThemeToggle variant="icon" className="ml-auto" />
				</header>
				<div className="h-full py-4">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
};

export default SidebarLayout;
