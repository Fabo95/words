import { AccountNameForm } from "@app/app/[lang]/(loggedIn)/account/_content/accountNameForm/accountNameForm"
import { AccountPasswordForm } from "@app/app/[lang]/(loggedIn)/account/_content/accountPasswordForm/accountPasswordForm"
import { PageContent } from "@app/components/ui/pageContent"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@app/components/ui/tabs"
import { getTFunction } from "@app/utils/i18n/utils/i18nHelpers"
import { Locale } from "@app/utils/locale/localeTypes"

export default async function Page({ params }: { params: Promise<Record<"lang", Locale>> }) {
	// --- STATE ---

	const { lang } = await params

	const t = getTFunction(lang)

	// --- RENDER ---

	return (
		<PageContent>
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
		</PageContent>
	)
}
