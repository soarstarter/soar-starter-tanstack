import { LoginForm } from "#/components/auth/LoginForm";
import { Button } from "#/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "#/components/ui/dialog";

export function LoginFormDialog() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm">
					Log in
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-sm">
				<DialogTitle className="sr-only">Log in</DialogTitle>
				<LoginForm />
			</DialogContent>
		</Dialog>
	);
}
