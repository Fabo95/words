import deMessages from "messages/de-DE.json"
import { createTranslator } from "next-intl"

type AppMessages = typeof deMessages

export type TFunction = ReturnType<typeof createTranslator<AppMessages>>
