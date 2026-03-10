import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
	type ColumnDef,
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table";
import {
	ArrowUpDown,
	ChevronDown,
	GripVertical,
	MoreHorizontal,
} from "lucide-react";
import * as React from "react";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";

interface TableItem {
	id: string;
	header: string;
	type: string;
	status: "Done" | "In Progress";
	target: string;
	limit: string;
	reviewer: string;
}

const initialData: TableItem[] = [
	{
		id: "1",
		header: "Project Alpha",
		type: "Technical",
		status: "Done",
		target: "Q1 2024",
		limit: "$50,000",
		reviewer: "John Smith",
	},
	{
		id: "2",
		header: "Budget Review",
		type: "Financial",
		status: "In Progress",
		target: "Q2 2024",
		limit: "$120,000",
		reviewer: "Sarah Johnson",
	},
	{
		id: "3",
		header: "Market Analysis",
		type: "Research",
		status: "Done",
		target: "Q1 2024",
		limit: "$30,000",
		reviewer: "Mike Davis",
	},
	{
		id: "4",
		header: "Product Launch",
		type: "Marketing",
		status: "In Progress",
		target: "Q3 2024",
		limit: "$80,000",
		reviewer: "Emily Chen",
	},
	{
		id: "5",
		header: "Security Audit",
		type: "Technical",
		status: "Done",
		target: "Q1 2024",
		limit: "$25,000",
		reviewer: "Alex Turner",
	},
	{
		id: "6",
		header: "User Research",
		type: "Research",
		status: "In Progress",
		target: "Q2 2024",
		limit: "$15,000",
		reviewer: "Lisa Wang",
	},
	{
		id: "7",
		header: "API Integration",
		type: "Technical",
		status: "Done",
		target: "Q1 2024",
		limit: "$45,000",
		reviewer: "David Brown",
	},
	{
		id: "8",
		header: "Sales Report",
		type: "Financial",
		status: "Done",
		target: "Q1 2024",
		limit: "$10,000",
		reviewer: "Rachel Green",
	},
	{
		id: "9",
		header: "UX Redesign",
		type: "Design",
		status: "In Progress",
		target: "Q3 2024",
		limit: "$60,000",
		reviewer: "Chris Lee",
	},
	{
		id: "10",
		header: "Data Migration",
		type: "Technical",
		status: "Done",
		target: "Q2 2024",
		limit: "$35,000",
		reviewer: "Anna Park",
	},
	{
		id: "11",
		header: "Brand Strategy",
		type: "Marketing",
		status: "In Progress",
		target: "Q3 2024",
		limit: "$40,000",
		reviewer: "Tom Wilson",
	},
	{
		id: "12",
		header: "Compliance Check",
		type: "Legal",
		status: "Done",
		target: "Q1 2024",
		limit: "$20,000",
		reviewer: "Helen Moore",
	},
	{
		id: "13",
		header: "Infrastructure",
		type: "Technical",
		status: "In Progress",
		target: "Q2 2024",
		limit: "$90,000",
		reviewer: "Kevin Zhang",
	},
	{
		id: "14",
		header: "Customer Survey",
		type: "Research",
		status: "Done",
		target: "Q1 2024",
		limit: "$12,000",
		reviewer: "Maya Patel",
	},
	{
		id: "15",
		header: "Mobile App",
		type: "Technical",
		status: "In Progress",
		target: "Q4 2024",
		limit: "$150,000",
		reviewer: "James Kim",
	},
	{
		id: "16",
		header: "Annual Budget",
		type: "Financial",
		status: "Done",
		target: "Q1 2024",
		limit: "$200,000",
		reviewer: "Linda Scott",
	},
	{
		id: "17",
		header: "Partner Portal",
		type: "Technical",
		status: "In Progress",
		target: "Q3 2024",
		limit: "$70,000",
		reviewer: "Ryan Adams",
	},
	{
		id: "18",
		header: "Content Plan",
		type: "Marketing",
		status: "Done",
		target: "Q2 2024",
		limit: "$18,000",
		reviewer: "Sophie Bell",
	},
	{
		id: "19",
		header: "QA Testing",
		type: "Technical",
		status: "Done",
		target: "Q2 2024",
		limit: "$28,000",
		reviewer: "Daniel Cruz",
	},
	{
		id: "20",
		header: "HR Policies",
		type: "Legal",
		status: "In Progress",
		target: "Q3 2024",
		limit: "$15,000",
		reviewer: "Karen White",
	},
	{
		id: "21",
		header: "Cloud Setup",
		type: "Technical",
		status: "Done",
		target: "Q1 2024",
		limit: "$55,000",
		reviewer: "Mark Taylor",
	},
	{
		id: "22",
		header: "Email Campaign",
		type: "Marketing",
		status: "In Progress",
		target: "Q2 2024",
		limit: "$22,000",
		reviewer: "Olivia Ng",
	},
	{
		id: "23",
		header: "Vendor Review",
		type: "Financial",
		status: "Done",
		target: "Q2 2024",
		limit: "$8,000",
		reviewer: "Ben Harris",
	},
	{
		id: "24",
		header: "Design System",
		type: "Design",
		status: "In Progress",
		target: "Q3 2024",
		limit: "$42,000",
		reviewer: "Amy Foster",
	},
	{
		id: "25",
		header: "Load Testing",
		type: "Technical",
		status: "Done",
		target: "Q2 2024",
		limit: "$16,000",
		reviewer: "Paul Martin",
	},
	{
		id: "26",
		header: "SEO Strategy",
		type: "Marketing",
		status: "In Progress",
		target: "Q3 2024",
		limit: "$25,000",
		reviewer: "Nancy Clark",
	},
	{
		id: "27",
		header: "Risk Assessment",
		type: "Financial",
		status: "Done",
		target: "Q1 2024",
		limit: "$14,000",
		reviewer: "George Hill",
	},
	{
		id: "28",
		header: "CI/CD Pipeline",
		type: "Technical",
		status: "Done",
		target: "Q2 2024",
		limit: "$38,000",
		reviewer: "Iris Chang",
	},
	{
		id: "29",
		header: "Training Plan",
		type: "Research",
		status: "In Progress",
		target: "Q3 2024",
		limit: "$20,000",
		reviewer: "Oscar Reed",
	},
	{
		id: "30",
		header: "Dashboard V2",
		type: "Design",
		status: "In Progress",
		target: "Q4 2024",
		limit: "$48,000",
		reviewer: "Wendy Liu",
	},
];

const columns: ColumnDef<TableItem>[] = [
	{
		id: "drag",
		header: () => null,
		cell: () => <GripVertical className="text-muted-foreground size-4" />,
		enableSorting: false,
		enableHiding: false,
	},
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
		accessorKey: "header",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Header
				<ArrowUpDown className="ml-2 size-4" />
			</Button>
		),
		cell: ({ row }) => (
			<span className="font-medium">{row.getValue("header")}</span>
		),
	},
	{
		accessorKey: "type",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Type
				<ArrowUpDown className="ml-2 size-4" />
			</Button>
		),
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
					variant={status === "Done" ? "default" : "secondary"}
					className={
						status === "Done"
							? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
							: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
					}
				>
					{status}
				</Badge>
			);
		},
	},
	{
		accessorKey: "target",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Target
				<ArrowUpDown className="ml-2 size-4" />
			</Button>
		),
	},
	{
		accessorKey: "limit",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Limit
				<ArrowUpDown className="ml-2 size-4" />
			</Button>
		),
	},
	{
		accessorKey: "reviewer",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Reviewer
				<ArrowUpDown className="ml-2 size-4" />
			</Button>
		),
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const item = row.original;
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
							onClick={() => navigator.clipboard.writeText(item.id)}
						>
							View
						</DropdownMenuItem>
						<DropdownMenuItem>Edit</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];

function DraggableRow({
	row,
}: {
	row: import("@tanstack/react-table").Row<TableItem>;
}) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: row.original.id });

	const style: React.CSSProperties = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<TableRow
			ref={setNodeRef}
			style={style}
			data-state={row.getIsSelected() && "selected"}
		>
			{row.getVisibleCells().map((cell) => (
				<TableCell
					key={cell.id}
					{...(cell.column.id === "drag"
						? { ...attributes, ...listeners }
						: {})}
					className={cell.column.id === "drag" ? "cursor-grab" : undefined}
				>
					{flexRender(cell.column.columnDef.cell, cell.getContext())}
				</TableCell>
			))}
		</TableRow>
	);
}

export function DataTable() {
	const [data, setData] = React.useState(initialData);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});
	const [globalFilter, setGlobalFilter] = React.useState("");

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
			globalFilter,
		},
		getRowId: (row) => row.id,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
	});

	const sensors = useSensors(
		useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
		useSensor(TouchSensor, {
			activationConstraint: { delay: 200, tolerance: 6 },
		}),
		useSensor(KeyboardSensor),
	);

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (over && active.id !== over.id) {
			setData((prev) => {
				const oldIndex = prev.findIndex((item) => item.id === active.id);
				const newIndex = prev.findIndex((item) => item.id === over.id);
				return arrayMove(prev, oldIndex, newIndex);
			});
		}
	}

	const rows = table.getRowModel().rows;
	const dataIds = React.useMemo(
		() => rows.map((row) => row.original.id),
		[rows],
	);

	return (
		<Tabs defaultValue="outline" className="w-full">
			<div className="flex items-center justify-between px-4 lg:px-6">
				<TabsList>
					<TabsTrigger value="outline">Outline</TabsTrigger>
					<TabsTrigger value="past-performance">Past Performance</TabsTrigger>
					<TabsTrigger value="key-personnel">Key Personnel</TabsTrigger>
					<TabsTrigger value="focus-documents">Focus Documents</TabsTrigger>
				</TabsList>
			</div>
			<TabsContent value="outline">
				<Card>
					<CardHeader>
						<CardTitle>Project Overview</CardTitle>
						<CardDescription>
							Review all project items and their current status.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex items-center justify-between gap-2 pb-4">
							<Input
								placeholder="Filter projects..."
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
												{column.id}
											</DropdownMenuCheckboxItem>
										))}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
						<div className="rounded-md border">
							<DndContext
								sensors={sensors}
								collisionDetection={closestCenter}
								onDragEnd={handleDragEnd}
							>
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
										<SortableContext
											items={dataIds}
											strategy={verticalListSortingStrategy}
										>
											{table.getRowModel().rows.length ? (
												table
													.getRowModel()
													.rows.map((row) => (
														<DraggableRow key={row.id} row={row} />
													))
											) : (
												<TableRow>
													<TableCell
														colSpan={columns.length}
														className="h-24 text-center"
													>
														No results.
													</TableCell>
												</TableRow>
											)}
										</SortableContext>
									</TableBody>
								</Table>
							</DndContext>
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
			</TabsContent>
			<TabsContent value="past-performance">
				<Card>
					<CardHeader>
						<CardTitle>Past Performance</CardTitle>
						<CardDescription>
							Historical performance data will appear here.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-muted-foreground py-10 text-center text-sm">
							No past performance data available.
						</p>
					</CardContent>
				</Card>
			</TabsContent>
			<TabsContent value="key-personnel">
				<Card>
					<CardHeader>
						<CardTitle>Key Personnel</CardTitle>
						<CardDescription>Key team members and their roles.</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-muted-foreground py-10 text-center text-sm">
							No key personnel data available.
						</p>
					</CardContent>
				</Card>
			</TabsContent>
			<TabsContent value="focus-documents">
				<Card>
					<CardHeader>
						<CardTitle>Focus Documents</CardTitle>
						<CardDescription>Important documents for review.</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-muted-foreground py-10 text-center text-sm">
							No focus documents available.
						</p>
					</CardContent>
				</Card>
			</TabsContent>
		</Tabs>
	);
}
