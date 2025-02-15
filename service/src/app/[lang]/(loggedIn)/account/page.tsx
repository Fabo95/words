import { AccountNameForm } from "@app/app/[lang]/(loggedIn)/account/_content/accountNameForm/accountNameForm"
import { AccountPasswordForm } from "@app/app/[lang]/(loggedIn)/account/_content/accountPasswordForm/accountPasswordForm"
import { Box } from "@app/components/ui/box"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@app/components/ui/tabs"
import { getTFunction } from "@app/utils/i18n/utils/i18nHelpers"
import { Locale } from "@app/utils/locale/localeTypes"

export default async function ({ params }: { params: Promise<Record<"lang", Locale>> }) {
	// --- STATE ---

	const { lang } = await params

	const t = getTFunction(lang)

	// --- RENDER ---

	return (
		<Box className="justify-center pt-16 items-center">
			<Tabs defaultValue="name" className="max-w-[400px] w-full">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="name">{t("pages.account.name.title")}</TabsTrigger>

					<TabsTrigger value="password">{t("pages.account.password.title")}</TabsTrigger>
				</TabsList>

				<TabsContent value="name">
					<AccountNameForm />
				</TabsContent>

				<TabsContent value="password">
					<AccountPasswordForm />
				</TabsContent>
			</Tabs>
		</Box>
	)
}
