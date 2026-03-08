export function buildOrderNo(): string {
	const now = new Date();
	const pad = (n: number, len = 2) => String(n).padStart(len, "0");
	const timestamp = [
		now.getFullYear(),
		pad(now.getMonth() + 1),
		pad(now.getDate()),
		pad(now.getHours()),
		pad(now.getMinutes()),
		pad(now.getSeconds()),
	].join("");
	const random = String(Math.floor(Math.random() * 1_000_000)).padStart(6, "0");
	return `${timestamp}${random}`;
}
