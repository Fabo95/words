import { LoginForm } from "@app/components/forms/loginForm/loginForm"
import { RegistrationForm } from "@app/components/forms/registrationForm/registrationForm"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@app/components/ui/tabs"
import { getTranslations } from "next-intl/server"
import { Locale } from "@app/utils/locale/localeTypes"

export default async function Authentication({ params }: { params: Promise<Record<"lang", Locale>> }) {
	// --- STATE ---

	const { lang } = await params

	const t = await getTranslations()

	// --- RENDER ---

	return (
		<Tabs defaultValue="login" className="max-w-[400px] w-full">
			<TabsList className="grid w-full grid-cols-2">
				<TabsTrigger value="login">{t("forms.loginForm.title")}</TabsTrigger>

				<TabsTrigger value="register">{t("forms.registrationForm.title")}</TabsTrigger>
			</TabsList>

			<TabsContent value="login">
				<LoginForm />
			</TabsContent>

			<TabsContent value="register">
				<RegistrationForm />
			</TabsContent>
		</Tabs>
	)
}
