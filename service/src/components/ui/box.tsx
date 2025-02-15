import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react"

type BoxProps = {
	className?: string
	children?: ReactNode
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

export const Box = ({ className, children, ...props }: BoxProps) => {
	// --- RENDER ---

	return (
		<div className={`flex flex-col ${className ? className : ""}`} {...props}>
			{children}
		</div>
	)
}
