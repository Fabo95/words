import { ReactNode } from "react"

type PageContentProps = { children: ReactNode }

export const PageContent = ({ children }: PageContentProps) => {
	// --- RENDER ---
	return <div className="flex justify-center pt-16 pb-16 items-center">{children}</div>
}
