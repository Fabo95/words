import { AccountNameForm } from "@app/components/forms/accountNameForm/accountNameForm"
import { AccountPasswordForm } from "@app/components/forms/accountPasswordForm/accountPasswordForm"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@app/components/ui/tabs"
import { getTranslations } from "next-intl/server"
import { Locale } from "@app/utils/locale/localeTypes"
import { User, Lock } from "lucide-react"

export default async function Page({ params }: { params: Promise<Record<"lang", Locale>> }) {
	// --- STATE ---

	const { lang } = await params

	const t = await getTranslations()

	// --- RENDER ---

	return (
		<Tabs defaultValue="name" className="max-w-[400px] w-full">
			<TabsList className="grid w-full grid-cols-2">
				<TabsTrigger value="name" className="gap-2">
					<User className="h-4 w-4" />
					{t("forms.accountNameForm.title")}
				</TabsTrigger>

				<TabsTrigger value="password" className="gap-2">
					<Lock className="h-4 w-4" />
					{t("forms.accountPasswordForm.title")}
				</TabsTrigger>
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
