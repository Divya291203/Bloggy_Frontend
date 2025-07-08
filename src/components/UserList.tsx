import { cn } from "@/lib/utils";
import { API_PATHS } from "@/utils/apiPaths";
import axiosInstance from "@/utils/axiosInstance";
import React, { useEffect, useState } from "react";
import type { userType } from "@/types/typeDef";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Trash2, User, Calendar, Mail, Shield } from "lucide-react";
import dayjs from "dayjs";

interface UserListProps {
	className?: string;
}

const UserList: React.FC<UserListProps> = ({ className }) => {
	const [users, setUsers] = useState<userType[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await axiosInstance.get(API_PATHS.ADMIN.GET_ALL_USERS);
				setUsers(response.data.users);
				setError(null);
			} catch (error) {
				setError(error as string);
			} finally {
				setLoading(false);
			}
		};
		fetchUsers();
	}, []);

	const handleDeleteUser = async (userId: string) => {
		setDeletingId(userId);
		try {
			await axiosInstance.delete(API_PATHS.ADMIN.DELETE_USER, {
				data: { id: userId },
			});
			setUsers((prev) => prev.filter((u) => u._id !== userId));
			setError(null);
		} catch (error) {
			console.error("Error deleting user:", error);
			setError("Failed to delete user");
		} finally {
			setDeletingId(null);
		}
	};

	const UserCard = ({ user }: { user: userType }) => (
		<Card key={user._id} className="w-full">
			<CardHeader className="pb-3">
				<div className="flex items-start gap-4">
					<Avatar className="w-16 h-16 flex-shrink-0">
						<AvatarImage src={user.avatar} alt={user.name} />
						<AvatarFallback className="text-lg">
							{user.name.charAt(0).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div className="flex-1 min-w-0">
						<CardTitle className="text-lg mb-2">{user.name}</CardTitle>
						<div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
							<div className="flex items-center gap-1">
								<Mail className="h-4 w-4" />
								{user.email}
							</div>
						</div>
						<div className="flex items-center gap-3 text-sm text-muted-foreground">
							<div className="flex items-center gap-1">
								<Calendar className="h-4 w-4" />
								Joined {dayjs(user.createdAt).format("MMM DD, YYYY")}
							</div>
							<span
								className={`text-xs font-medium px-2 py-1 rounded-full ${
									user.role === "admin"
										? "text-red-600 bg-red-100"
										: user.role === "author"
										? "text-blue-600 bg-blue-100"
										: "text-gray-600 bg-gray-100"
								}`}
							>
								<Shield className="h-3 w-3 inline mr-1" />
								{user.role.charAt(0).toUpperCase() + user.role.slice(1)}
							</span>
						</div>
					</div>
				</div>
			</CardHeader>
			<CardContent className="pt-0">
				{user.bio && (
					<p className="text-sm text-muted-foreground line-clamp-2 mb-4">
						{user.bio}
					</p>
				)}
				<div className="flex items-center gap-2 flex-wrap">
					<Button
						variant="outline"
						size="sm"
						className="text-destructive hover:text-destructive"
						onClick={() => handleDeleteUser(user._id)}
						disabled={deletingId === user._id}
					>
						{deletingId === user._id ? (
							<>
								<div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600 mr-1" />
								Deleting...
							</>
						) : (
							<>
								<Trash2 className="h-4 w-4 mr-1" />
								Delete User
							</>
						)}
					</Button>
				</div>
			</CardContent>
		</Card>
	);

	if (loading) {
		return (
			<div className={cn("flex flex-1 flex-col gap-6 p-6", className)}>
				<h1 className="text-2xl font-bold">All Users</h1>
				<div className="flex justify-center items-center h-64">
					<Loader2 className="w-8 h-8 animate-spin" />
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className={cn("flex flex-1 flex-col gap-6 p-6", className)}>
				<h1 className="text-2xl font-bold">All Users</h1>
				<Card>
					<CardContent className="pt-6">
						<div className="text-center text-destructive">
							<p>Error loading users: {error}</p>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className={cn("flex flex-1 flex-col gap-6 p-6", className)}>
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">All Users ({users.length})</h1>
			</div>

			{users.length === 0 ? (
				<Card>
					<CardContent className="pt-6">
						<div className="text-center text-muted-foreground">
							<User className="h-12 w-12 mx-auto mb-4 opacity-50" />
							<p>No users found</p>
							<p className="text-sm">Users will appear here once registered</p>
						</div>
					</CardContent>
				</Card>
			) : (
				<div className="grid gap-4">
					{users.map((user) => (
						<UserCard key={user._id} user={user} />
					))}
				</div>
			)}
		</div>
	);
};

export default UserList;
