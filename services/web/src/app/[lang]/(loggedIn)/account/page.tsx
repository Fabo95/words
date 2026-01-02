import { AccountNameForm } from "@app/components/forms/accountNameForm/accountNameForm"
import { AccountPasswordForm } from "@app/components/forms/accountPasswordForm/accountPasswordForm"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@app/components/ui/tabs"
import { getTranslations } from "next-intl/server"
import { Locale } from "@app/utils/locale/localeTypes"

export default async function Page({ params }: { params: Promise<Record<"lang", Locale>> }) {
	// --- STATE ---

	const { lang } = await params

	const t = await getTranslations()

	// --- RENDER ---

	return (
		<Tabs defaultValue="name" className="max-w-[400px] w-full">
			<TabsList className="grid w-full grid-cols-2">
				<TabsTrigger value="name">{t("forms.accountNameForm.title")}</TabsTrigger>

				<TabsTrigger value="password">{t("forms.accountPasswordForm.title")}</TabsTrigger>
			</TabsList>

			<TabsContent value="name">
				<AccountNameForm />
			</TabsContent>

			<TabsContent value="password">
				<AccountPasswordForm />
			</TabsContent>
		</Tabs>
	)
}
