import { inngestServeRoute } from '@/routes/inngest/serve/latest.js'
import { referralsRoute } from '@/routes/referrals/latest.js'
import { referralsPendingRoute } from '@/routes/referrals/pending/latest.js'
import { referralsRedeemReferralIdRoute } from '@/routes/referrals/redeem/[referralId]/latest.js'
import { referralsRewardRoute } from '@/routes/referrals/reward/latest.js'
import { subscriptionsCancellationOfferPurchaseRoute } from '@/routes/subscriptions/cancellation-offer/purchase/latest.js'
import { subscriptionsCancellationOfferTriggerRoute } from '@/routes/subscriptions/cancellation-offer/trigger/latest.js'
import { subscriptionsChangePlanRoute } from '@/routes/subscriptions/change-plan/latest.js'
import { subscriptionsVerifyRoute } from '@/routes/subscriptions/verify/latest.js'
import { usersIdRoute } from '@/routes/users/[id]/latest.js'
import { usersCurrentRoute } from '@/routes/users/current/latest.js'
import { usersRoute } from '@/routes/users/latest.js'
import { usersProfileImageRoute } from '@/routes/users/profileImage/latest.js'
import { usersSavingsRoute } from '@/routes/users/savings/latest.js'
import { usersTrackingEventDetailsRoute } from '@/routes/users/trackingEventDetails/latest.js'
import { voucherCodeRoute } from '@/routes/vouchers/[code]/latest.js'
import { webhooksUserRoute } from '@/routes/webhooks/user/latest.js'
import { FastifyInstance } from 'fastify'
import { adminVoucherIdRoute } from './routes/admin/vouchers/[id]/latest.js'
import { adminVoucherGroupExportRoute } from './routes/admin/vouchers/groups/[voucherGroupId]/export/latest.js'
import { adminVoucherGroupIdRoute } from './routes/admin/vouchers/groups/[voucherGroupId]/latest.js'
import { adminVoucherGroupsRoute } from './routes/admin/vouchers/groups/latest.js'
import { adminVouchersRoute } from './routes/admin/vouchers/latest.js'
import { adminRewardRoute } from './routes/admin/referrals/reward/latest.js'
import { canImpersonateRoute } from './routes/auth/can-impersonate/latest.js'
import { authConfirmRoute } from './routes/auth/confirm/latest.js'
import { impersonateRoute } from './routes/auth/impersonate/latest.js'
import { authRefreshRoute } from './routes/auth/refresh/latest.js'
import { authValidateRoute } from './routes/auth/validate/latest.js'
import { hubspotVoucherCreateRoute } from './routes/hubspot/vouchers/create/latest.js'
import { subscriptionsRoute } from './routes/subscriptions/latest.js'
import { voucherCheckRoute } from './routes/vouchers/check/latest.js'
import { webhooksAwinRoute } from './routes/webhooks/awin/install/latest.js'

const v1UsersPrefix = { prefix: 'users/v1' }
const v1Prefix = { prefix: 'v1' }
const adminPrefix = { prefix: 'admin' }
const webhooksPrefix = { prefix: 'webhooks' }

export default function router(fastify: FastifyInstance) {
    // admin
    fastify.register(adminVouchersRoute, adminPrefix)
    fastify.register(adminVoucherIdRoute, adminPrefix)
    fastify.register(adminVoucherGroupsRoute, adminPrefix)
    fastify.register(adminVoucherGroupIdRoute, adminPrefix)
    fastify.register(adminVoucherGroupExportRoute, adminPrefix)
    fastify.register(adminRewardRoute, adminPrefix)

    // webhooks
    fastify.register(webhooksUserRoute, webhooksPrefix)
    fastify.register(webhooksAwinRoute, webhooksPrefix)
    fastify.register(hubspotVoucherCreateRoute, webhooksPrefix)

    // auth
    fastify.register(authConfirmRoute, v1UsersPrefix)
    fastify.register(authValidateRoute, v1UsersPrefix)
    fastify.register(authRefreshRoute, v1UsersPrefix)
    fastify.register(canImpersonateRoute, v1UsersPrefix)
    fastify.register(impersonateRoute, v1UsersPrefix)

    // users
    fastify.register(usersCurrentRoute, v1UsersPrefix)
    fastify.register(usersRoute, v1UsersPrefix)
    fastify.register(usersIdRoute, v1UsersPrefix)
    fastify.register(usersTrackingEventDetailsRoute, v1UsersPrefix)
    fastify.register(usersProfileImageRoute, v1UsersPrefix)
    fastify.register(usersSavingsRoute, v1UsersPrefix)

    // vouchers
    fastify.register(voucherCodeRoute, v1UsersPrefix)
    fastify.register(voucherCheckRoute, v1UsersPrefix)

    // subscriptions
    fastify.register(subscriptionsRoute, v1UsersPrefix)
    fastify.register(subscriptionsVerifyRoute, v1UsersPrefix)
    fastify.register(subscriptionsCancellationOfferPurchaseRoute, v1UsersPrefix)
    fastify.register(subscriptionsChangePlanRoute, v1UsersPrefix)
    fastify.register(subscriptionsCancellationOfferTriggerRoute, v1UsersPrefix)

    // referrals
    fastify.register(referralsRoute, v1UsersPrefix)
    fastify.register(referralsPendingRoute, v1UsersPrefix)
    fastify.register(referralsRedeemReferralIdRoute, v1UsersPrefix)
    fastify.register(referralsRewardRoute, v1UsersPrefix)
    // mapping the same route to both /users/v1 and /v1 for easier access
    fastify.register(referralsRewardRoute, v1Prefix)

    // inngest
    fastify.register(inngestServeRoute)
}
