import { createFileRoute } from "@tanstack/react-router";
import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { Checkbox } from "#/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { Input } from "#/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table";

export const Route = createFileRoute("/{-$locale}/_dashboard/admin/users/")({
	component: AdminUsersPage,
});

interface MockUser {
	id: string;
	name: string;
	email: string;
	avatar: string;
	verified: boolean;
	role: "admin" | "user";
	status: "Active" | "Banned";
	createdAt: string;
}

const mockUsers: MockUser[] = [
	{
		id: "1",
		name: "John Smith",
		email: "john@example.com",
		avatar: "",
		verified: true,
		role: "admin",
		status: "Active",
		createdAt: "2024-01-15",
	},
	{
		id: "2",
		name: "Sarah Johnson",
		email: "sarah@example.com",
		avatar: "",
		verified: true,
		role: "user",
		status: "Active",
		createdAt: "2024-02-20",
	},
	{
		id: "3",
		name: "Mike Davis",
		email: "mike@example.com",
		avatar: "",
		verified: false,
		role: "user",
		status: "Banned",
		createdAt: "2024-03-10",
	},
	{
		id: "4",
		name: "Emily Chen",
		email: "emily@example.com",
		avatar: "",
		verified: true,
		role: "user",
		status: "Active",
		createdAt: "2024-03-25",
	},
	{
		id: "5",
		name: "Alex Turner",
		email: "alex@example.com",
		avatar: "",
		verified: true,
		role: "admin",
		status: "Active",
		createdAt: "2024-04-05",
	},
	{
		id: "6",
		name: "Lisa Wang",
		email: "lisa@example.com",
		avatar: "",
		verified: false,
		role: "user",
		status: "Active",
		createdAt: "2024-04-18",
	},
	{
		id: "7",
		name: "David Brown",
		email: "david@example.com",
		avatar: "",
		verified: true,
		role: "user",
		status: "Active",
		createdAt: "2024-05-02",
	},
	{
		id: "8",
		name: "Rachel Green",
		email: "rachel@example.com",
		avatar: "",
		verified: true,
		role: "user",
		status: "Banned",
		createdAt: "2024-05-15",
	},
	{
		id: "9",
		name: "Chris Lee",
		email: "chris@example.com",
		avatar: "",
		verified: false,
		role: "user",
		status: "Active",
		createdAt: "2024-06-01",
	},
	{
		id: "10",
		name: "Anna Park",
		email: "anna@example.com",
		avatar: "",
		verified: true,
		role: "admin",
		status: "Active",
		createdAt: "2024-06-20",
	},
];

const columns: ColumnDef<MockUser>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "name",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Name
				<ArrowUpDown className="ml-2 size-4" />
			</Button>
		),
		cell: ({ row }) => (
			<div className="flex items-center gap-2">
				<Avatar className="size-8">
					<AvatarImage src={row.original.avatar} alt={row.original.name} />
					<AvatarFallback>
						{row.original.name
							.split(" ")
							.map((n) => n[0])
							.join("")}
					</AvatarFallback>
				</Avatar>
				<span className="font-medium">{row.getValue("name")}</span>
			</div>
		),
	},
	{
		accessorKey: "email",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Email
				<ArrowUpDown className="ml-2 size-4" />
			</Button>
		),
	},
	{
		accessorKey: "verified",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Verified
				<ArrowUpDown className="ml-2 size-4" />
			</Button>
		),
		cell: ({ row }) => {
			const verified = row.getValue("verified") as boolean;
			return (
				<Badge
					variant={verified ? "default" : "secondary"}
					className={
						verified
							? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
							: ""
					}
				>
					{verified ? "Verified" : "Unverified"}
				</Badge>
			);
		},
	},
	{
		accessorKey: "role",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Role
				<ArrowUpDown className="ml-2 size-4" />
			</Button>
		),
		cell: ({ row }) => {
			const role = row.getValue("role") as string;
			return (
				<Badge variant={role === "admin" ? "default" : "outline"}>{role}</Badge>
			);
		},
	},
	{
		accessorKey: "status",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Status
				<ArrowUpDown className="ml-2 size-4" />
			</Button>
		),
		cell: ({ row }) => {
			const status = row.getValue("status") as string;
			return (
				<Badge
					variant={status === "Active" ? "default" : "destructive"}
					className={
						status === "Active"
							? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
							: ""
					}
				>
					{status}
				</Badge>
			);
		},
	},
	{
		accessorKey: "createdAt",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Created At
				<ArrowUpDown className="ml-2 size-4" />
			</Button>
		),
		cell: ({ row }) =>
			new Date(row.getValue("createdAt") as string).toLocaleDateString(),
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const user = row.original;
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="size-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="size-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() => navigator.clipboard.writeText(user.email)}
						>
							Copy email
						</DropdownMenuItem>
						<DropdownMenuItem>View profile</DropdownMenuItem>
						<DropdownMenuItem>Edit user</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem variant="destructive">
							{user.status === "Active" ? "Ban user" : "Unban user"}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];

function AdminUsersPage() {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});
	const [globalFilter, setGlobalFilter] = React.useState("");

	const table = useReactTable({
		data: mockUsers,
		columns,
		state: {
			sorting,
			columnVisibility,
			rowSelection,
			globalFilter,
		},
		getRowId: (row) => row.id,
		onSortingChange: setSorting,
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
	});

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			<Card>
				<CardHeader>
					<CardTitle>Users</CardTitle>
					<CardDescription>
						Manage user accounts and permissions.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-between gap-2 pb-4">
						<Input
							placeholder="Search users..."
							value={globalFilter}
							onChange={(e) => setGlobalFilter(e.target.value)}
							className="max-w-sm"
						/>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" className="ml-auto">
									Columns <ChevronDown className="ml-2 size-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								{table
									.getAllColumns()
									.filter((column) => column.getCanHide())
									.map((column) => (
										<DropdownMenuCheckboxItem
											key={column.id}
											className="capitalize"
											checked={column.getIsVisible()}
											onCheckedChange={(value) =>
												column.toggleVisibility(!!value)
											}
										>
											{column.id === "createdAt" ? "Created At" : column.id}
										</DropdownMenuCheckboxItem>
									))}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								{table.getHeaderGroups().map((headerGroup) => (
									<TableRow key={headerGroup.id}>
										{headerGroup.headers.map((header) => (
											<TableHead key={header.id}>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext(),
														)}
											</TableHead>
										))}
									</TableRow>
								))}
							</TableHeader>
							<TableBody>
								{table.getRowModel().rows.length ? (
									table.getRowModel().rows.map((row) => (
										<TableRow
											key={row.id}
											data-state={row.getIsSelected() && "selected"}
										>
											{row.getVisibleCells().map((cell) => (
												<TableCell key={cell.id}>
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext(),
													)}
												</TableCell>
											))}
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell
											colSpan={columns.length}
											className="h-24 text-center"
										>
											No users found.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
					<div className="flex items-center justify-between pt-4">
						<div className="text-muted-foreground text-sm">
							{table.getFilteredSelectedRowModel().rows.length} of{" "}
							{table.getFilteredRowModel().rows.length} row(s) selected.
						</div>
						<div className="flex items-center gap-4">
							<div className="flex items-center gap-2">
								<span className="text-muted-foreground text-sm">
									Rows per page
								</span>
								<Select
									value={String(table.getState().pagination.pageSize)}
									onValueChange={(value) => table.setPageSize(Number(value))}
								>
									<SelectTrigger size="sm" className="w-[70px]">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{[10, 20, 30].map((size) => (
											<SelectItem key={size} value={String(size)}>
												{size}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="text-muted-foreground text-sm">
								Page {table.getState().pagination.pageIndex + 1} of{" "}
								{table.getPageCount()}
							</div>
							<div className="flex gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => table.previousPage()}
									disabled={!table.getCanPreviousPage()}
								>
									Previous
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => table.nextPage()}
									disabled={!table.getCanNextPage()}
								>
									Next
								</Button>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
