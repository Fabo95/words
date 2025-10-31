import { AccountNameForm } from "services/words/src/app/[lang]/(loggedIn)/account/_content/accountNameForm/accountNameForm"
import { AccountPasswordForm } from "services/words/src/app/[lang]/(loggedIn)/account/_content/accountPasswordForm/accountPasswordForm"
import { PageContent } from "services/words/src/components/ui/pageContent"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "services/words/src/components/ui/tabs"
import { getTranslations } from "next-intl/server"
import { Locale } from "services/words/src/utils/locale/localeTypes"

export default async function Page({ params }: { params: Promise<Record<"lang", Locale>> }) {
	// --- STATE ---

	const { lang } = await params

	const t = await getTranslations()

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
