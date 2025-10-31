import { Braze } from '@/clients/braze.js'
import { Inngest } from '@/clients/inngest.js'

type InngestVoucherEventFunctionsDeps = {
    inngest: Inngest
    braze: Braze
}

export const getInngestVoucherEventFunctions = ({
    inngest,
    braze,
}: InngestVoucherEventFunctionsDeps) => {
    const voucherUsedTracking = inngest.createFunction(
        { id: 'voucher-used' },
        { event: 'voucher.used' },
        async ({ event, step }) => {
            await step.run('braze-track', async () => {
                const brazePayload = braze.prepareTrackEventPayload({
                    eventName: 'Voucher Used',
                    ...event.data,
                })

                await braze.trackEvent(brazePayload)
            })
        }
    )

    return [voucherUsedTracking]
}
