import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "neutral";
type ButtonSize = "sm" | "md" | "lg";
type BadgeTone = "default" | "green" | "amber" | "slate" | "accent";

function cn(...classes: Array<string | false | undefined | null>) {
	return classes.filter(Boolean).join(" ");
}

export function Button({ className, variant = "primary", size = "md", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: ButtonSize }) {
	const variants: Record<ButtonVariant, string> = {
		primary: "bg-ink-900 text-white shadow-soft hover:-translate-y-0.5 hover:bg-ink-700",
		secondary: "bg-accent-50 text-accent-600 border border-accent-100 hover:bg-accent-100",
		ghost: "bg-transparent text-ink-700 hover:bg-sand-50",
		neutral: "bg-white text-ink-700 border border-sand-100 hover:border-sand-200 hover:bg-sand-50"
	};

	const sizes: Record<ButtonSize, string> = {
		sm: "h-9 px-3 text-sm",
		md: "h-11 px-4 text-sm",
		lg: "h-12 px-5 text-base"
	};

	const { type, ...rest } = props as ButtonHTMLAttributes<HTMLButtonElement>;

	return (
		<button
			type={type ?? "button"}
			className={cn(
				"inline-flex w-full items-center justify-center gap-2 rounded-2xl font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto focus:outline-none focus-visible:ring-4",
				"focus-visible:ring-accent-100",
				variants[variant],
				sizes[size],
				className
			)}
			{...rest}
		/>
	);
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return <div className={cn("rounded-[28px] border border-white/70 bg-white/85 shadow-soft ring-1 ring-sand-100/60", className)} {...props} />;
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return <div className={cn("flex flex-col items-start justify-between gap-4 border-b border-sand-100 px-4 py-4 sm:px-6 sm:py-5 md:flex-row md:items-center", className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
	return <h2 className={cn("text-lg font-bold tracking-tight text-ink-900", className)} {...props} />;
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
	return <p className={cn("mt-1 text-sm leading-6 text-ink-500", className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return <div className={cn("px-4 py-4 sm:px-6 sm:py-6", className)} {...props} />;
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
	return <input className={cn("h-11 w-full rounded-2xl border border-sand-200 bg-white px-4 text-sm text-ink-900 outline-none transition placeholder:text-ink-500 focus:border-accent-500 focus:ring-4 focus:ring-accent-100", className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
	return <textarea className={cn("min-h-32 w-full rounded-3xl border border-sand-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-ink-500 focus:border-accent-500 focus:ring-4 focus:ring-accent-100", className)} {...props} />;
}

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
	return <label className={cn("mb-2 block text-sm font-semibold text-ink-700", className)} {...props} />;
}

export function Badge({ className, tone = "default", ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
	const tones: Record<BadgeTone, string> = {
		default: "bg-sand-50 text-ink-700 border border-sand-100",
		green: "bg-accent-50 text-accent-600 border border-accent-100",
		amber: "bg-orange-50 text-orange-700 border border-orange-100",
		slate: "bg-slate-50 text-slate-700 border border-slate-200",
		accent: "bg-accent-100 text-accent-600 border border-accent-100"
	};

	return <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold", tones[tone], className)} {...props} />;
}

export function Toast({ className, children, onClose, tone = "info", title }: { className?: string; children?: ReactNode; onClose?: () => void; tone?: "success" | "error" | "info"; title?: string }) {
	const tones = {
		success: "border-emerald-200 bg-emerald-50 text-emerald-900",
		error: "border-orange-200 bg-orange-50 text-orange-900",
		info: "border-sand-100 bg-white text-ink-900"
	};
	return (
		<div className={cn("fixed right-6 bottom-6 z-50 w-full max-w-sm rounded-2xl border p-4 shadow-lift transition-all duration-300", tones[tone], className)} role="status" aria-live="polite">
			<div className="flex items-start justify-between gap-3">
				<div className="space-y-1 text-sm">
					{title ? <p className="font-semibold">{title}</p> : null}
					<div>{children}</div>
				</div>
				{onClose ? (
					<button onClick={onClose} className="text-sm text-ink-500 hover:text-ink-700">Close</button>
				) : null}
			</div>
		</div>
	);
}

export function TableSkeleton({ rows = 4 }: { rows?: number }) {
	return (
		<div className="space-y-3">
			{Array.from({ length: rows }).map((_, i) => (
				<div key={i} className="animate-pulse rounded-[22px] bg-white p-4 shadow-sm ring-1 ring-sand-100">
					<div className="h-4 w-1/3 rounded bg-sand-100" />
					<div className="mt-3 grid grid-cols-4 gap-4">
						<div className="h-4 rounded bg-sand-100" />
						<div className="h-4 rounded bg-sand-100" />
						<div className="h-4 rounded bg-sand-100" />
						<div className="h-4 rounded bg-sand-100" />
					</div>
				</div>
			))}
		</div>
	);
}

export function StatCard({ label, value, change, tone = "accent" }: { label: string; value: string; change: string; tone?: "accent" | "sand" }) {
	return (
		<Card className="p-0 transform transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
			<CardContent className="space-y-3">
				<div className="flex items-start justify-between gap-4">
					<div>
						<p className="text-sm font-medium text-ink-500">{label}</p>
						<p className="mt-2 text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">{value}</p>
					</div>
					<Badge tone={tone === "accent" ? "accent" : "default"}>{change}</Badge>
				</div>
				<div className={cn("h-1.5 rounded-full", tone === "accent" ? "bg-accent-100" : "bg-sand-100")}>
					<div className={cn("h-full rounded-full transition-all duration-200", tone === "accent" ? "w-3/4 bg-accent-500" : "w-2/3 bg-amber-400")} />
				</div>
			</CardContent>
		</Card>
	);
}

export function Progress({ value }: { value: number }) {
	return (
		<div className="h-2 overflow-hidden rounded-full bg-sand-100">
			<div className="h-full rounded-full bg-gradient-to-r from-accent-500 to-emerald-400" style={{ width: `${Math.min(100, value)}%` }} />
		</div>
	);
}
