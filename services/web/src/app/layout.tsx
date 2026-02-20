import { ReactNode } from "react"
import "@app/styles/globals.css"

import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { Toaster } from "@app/components/ui/toaster"
import { cn } from "@app/utils/shadcn/shadcnHelpers"
import { getLocale } from "next-intl/server"
import { NextIntlClientProvider } from "next-intl"
import { QueryClientProvider } from "@app/components/reactQuery/QueryClientProvider"
import { Box } from "@app/components/ui/box"

const font = Inter({
	subsets: ["latin"],
	variable: "--font-sans",
})

export const metadata: Metadata = {
	description: "Learn vocabulary with spaced repetition, daily goals, and collections.",
	title: {
		default: "Words",
		template: "%s | Words",
	},
}

type RootLayoutProps = { children: ReactNode }

export default async function RootLayout({ children }: RootLayoutProps) {
	const locale = await getLocale()

	return (
		<html lang={locale}>
			<body
				className={cn("min-h-screen box-content bg-background font-sans antialiased tracking-tight", font.variable)}
			>
				<NextIntlClientProvider>
					<QueryClientProvider>
						<Box>{children}</Box>

						<Toaster />
					</QueryClientProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	)
}
