import { CreditCard, LogOut, Settings2, User } from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "#/components/ui/popover";
import { Separator } from "#/components/ui/separator";
import { LocaleLink, useLocaleRouter } from "#/i18n/routing";
import { signOut } from "#/lib/auth-client";

interface UserPopoverProps {
	user?: {
		name?: string;
		email?: string;
	};
}

export function UserPopover({ user }: UserPopoverProps) {
	const localeRouter = useLocaleRouter();

	const handleLogout = async () => {
		await signOut();
		void localeRouter.push("/");
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<button
					type="button"
					title="User profile"
					className="inline-flex h-8 w-8 items-center justify-center rounded-full border transition-all hover:bg-accent hover:text-accent-foreground"
				>
					<User className="h-4 w-4" />
					<span className="sr-only">User profile</span>
				</button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<div className="flex items-center justify-start gap-2 p-2">
					<div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted">
						<User className="h-4 w-4" />
					</div>
					<div className="flex flex-col space-y-1 leading-none">
						<p className="font-medium">{user?.name || "User"}</p>
						<p className="w-[140px] truncate text-sm text-muted-foreground">
							{user?.email}
						</p>
					</div>
				</div>
				<Separator />
				<LocaleLink
					href="/setting/billing"
					preload={false}
					className="flex cursor-pointer items-center space-x-2.5 p-2 hover:bg-accent hover:text-accent-foreground"
				>
					<CreditCard className="size-4 shrink-0" />
					<span className="text-sm">Billing</span>
				</LocaleLink>
				<LocaleLink
					href="/setting/profile"
					preload={false}
					className="flex cursor-pointer items-center space-x-2.5 p-2 hover:bg-accent hover:text-accent-foreground"
				>
					<Settings2 className="size-4 shrink-0" />
					<span className="text-sm">Settings</span>
				</LocaleLink>
				<Separator />
				<button
					type="button"
					className="flex w-full cursor-pointer items-center space-x-2.5 p-2 hover:bg-accent hover:text-accent-foreground"
					onClick={handleLogout}
				>
					<LogOut className="size-4 shrink-0" />
					<span className="text-sm">Log out</span>
				</button>
			</PopoverContent>
		</Popover>
	);
}
