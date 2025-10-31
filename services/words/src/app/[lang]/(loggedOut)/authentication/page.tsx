import { LoginForm } from "services/words/src/app/[lang]/(loggedOut)/authentication/_content/loginForm/loginForm"
import { RegistrationForm } from "services/words/src/app/[lang]/(loggedOut)/authentication/_content/registrationForm/registrationForm"
import { PageContent } from "services/words/src/components/ui/pageContent"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "services/words/src/components/ui/tabs"
import { getTranslations } from "next-intl/server"
import { Locale } from "services/words/src/utils/locale/localeTypes"

export default async function Authentication({ params }: { params: Promise<Record<"lang", Locale>> }) {
	// --- STATE ---

	const { lang } = await params

	const t = await getTranslations()

	// --- RENDER ---

	return (
		<PageContent>
			<Tabs defaultValue="login" className="max-w-[400px] w-full">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="login">{t("pages.authentication.login.title")}</TabsTrigger>

					<TabsTrigger value="register">{t("pages.authentication.registration.title")}</TabsTrigger>
				</TabsList>

				<TabsContent value="login">
					<LoginForm />
				</TabsContent>

				<TabsContent value="register">
					<RegistrationForm />
				</TabsContent>
			</Tabs>
		</PageContent>
	)
}
