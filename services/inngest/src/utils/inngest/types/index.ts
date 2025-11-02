export type InngestEvents = {
	"translation.created": { data: { translationId: number } }
	"translation.checked": { data: { translationId: number } }
	"translation.cefr_assigned": { data: { translationId: number } }
}
