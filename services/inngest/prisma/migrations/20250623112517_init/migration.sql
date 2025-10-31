-- CreateTable
CREATE TABLE "__EFMigrationsHistory" (
    "migrationId" VARCHAR(150) NOT NULL,
    "productVersion" VARCHAR(32) NOT NULL,

    CONSTRAINT "pK___EFMigrationsHistory" PRIMARY KEY ("migrationId")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL,
    "subscriptionId" UUID NOT NULL,
    "paymentProvider" TEXT NOT NULL,
    "paymentMethod" TEXT,
    "netValue" DECIMAL NOT NULL,
    "taxValue" DECIMAL NOT NULL,
    "currency" TEXT,
    "paymentStatus" TEXT NOT NULL,
    "refundedDate" TIMESTAMPTZ(6),
    "providerRecordExternalId" TEXT,
    "providerInvoiceExternalId" TEXT,
    "paymentProviderData" TEXT,
    "isSetupPayment" BOOLEAN NOT NULL,
    "created" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMPTZ(6),
    "isDeleted" BOOLEAN NOT NULL,

    CONSTRAINT "pK_payments" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referralCodes" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "fullCode" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "created" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMPTZ(6),
    "isDeleted" BOOLEAN NOT NULL,

    CONSTRAINT "pK_referralCodes" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referrals" (
    "id" UUID NOT NULL,
    "reward" DECIMAL NOT NULL,
    "referralCodeId" UUID NOT NULL,
    "referredSubscriptionId" UUID,
    "claimedForSubscriptionId" UUID,
    "created" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMPTZ(6),
    "isDeleted" BOOLEAN NOT NULL,

    CONSTRAINT "pK_referrals" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roleClaims" (
    "id" SERIAL NOT NULL,
    "roleId" UUID NOT NULL,
    "claimType" TEXT,
    "claimValue" TEXT,

    CONSTRAINT "pK_roleClaims" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "name" VARCHAR(256),
    "normalizedName" VARCHAR(256),
    "concurrencyStamp" TEXT,

    CONSTRAINT "pK_roles" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptionEvents" (
    "id" UUID NOT NULL,
    "subscriptionId" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "voucherId" UUID,
    "referralId" UUID,
    "referralRewardId" UUID,
    "value" DOUBLE PRECISION,
    "referralUserCodeId" UUID,
    "discountCodeUsed" TEXT,
    "suspendedTo" TIMESTAMPTZ(6),
    "trialTo" TIMESTAMPTZ(6),
    "subscriptionTypeAfterTrial" TEXT,
    "trialActiveTo" TIMESTAMPTZ(6),
    "paymentId" UUID,
    "activeFrom" TIMESTAMPTZ(6),
    "activeTo" TIMESTAMPTZ(6),
    "priceId" TEXT,
    "productId" TEXT,
    "approximatedActivityRestaurantId" UUID,
    "created" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMPTZ(6),
    "isDeleted" BOOLEAN NOT NULL,
    "oldSubscriptionId" UUID,

    CONSTRAINT "pK_subscriptionEvents" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptionVouchers" (
    "id" UUID NOT NULL,
    "subscriptionId" UUID NOT NULL,
    "voucherId" UUID NOT NULL,
    "created" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMPTZ(6),
    "isDeleted" BOOLEAN NOT NULL,

    CONSTRAINT "pK_subscriptionVouchers" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" UUID NOT NULL,
    "baseCost" DECIMAL NOT NULL,
    "userId" UUID NOT NULL,
    "activeFrom" TIMESTAMPTZ(6) NOT NULL,
    "activeTo" TIMESTAMPTZ(6) NOT NULL,
    "confirmedAt" TIMESTAMPTZ(6),
    "trialActiveTo" TIMESTAMPTZ(6),
    "canceledAt" TIMESTAMPTZ(6),
    "paymentsSuspendedTo" TIMESTAMPTZ(6),
    "churnDate" TIMESTAMPTZ(6),
    "specialOfferCost" DECIMAL,
    "specialOfferActiveTo" TIMESTAMPTZ(6),
    "subscriptionType" TEXT NOT NULL,
    "isCancellationConfirmed" BOOLEAN NOT NULL,
    "paymentProvider" TEXT NOT NULL,
    "subscriptionPlanExternalId" TEXT,
    "subscriptionRecordExternalId" TEXT,
    "conversionDate" TIMESTAMPTZ(6),
    "paymentProviderData" TEXT,
    "subscriptionState" TEXT NOT NULL,
    "created" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMPTZ(6),
    "isDeleted" BOOLEAN NOT NULL,

    CONSTRAINT "pK_subscriptions" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userClaims" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "claimType" TEXT,
    "claimValue" TEXT,

    CONSTRAINT "pK_userClaims" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userLogins" (
    "loginProvider" TEXT NOT NULL,
    "providerKey" TEXT NOT NULL,
    "providerDisplayName" TEXT,
    "userId" UUID NOT NULL,

    CONSTRAINT "pK_userLogins" PRIMARY KEY ("loginProvider","providerKey")
);

-- CreateTable
CREATE TABLE "userRoles" (
    "userId" UUID NOT NULL,
    "roleId" UUID NOT NULL,

    CONSTRAINT "pK_userRoles" PRIMARY KEY ("userId","roleId")
);

-- CreateTable
CREATE TABLE "userTokens" (
    "userId" UUID NOT NULL,
    "loginProvider" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT,

    CONSTRAINT "pK_userTokens" PRIMARY KEY ("userId","loginProvider","name")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "streetAndNumber" TEXT,
    "postalCode" TEXT,
    "city" TEXT,
    "country" TEXT,
    "refreshToken" TEXT,
    "smsVerificationId" TEXT,
    "imageUrl" TEXT,
    "currentBalance" DECIMAL NOT NULL,
    "created" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMPTZ(6),
    "isDeleted" BOOLEAN NOT NULL,
    "dealsRedeemed" INTEGER NOT NULL,
    "mollieCustomerId" TEXT,
    "paypalPayerId" TEXT,
    "advertisingType" INTEGER,
    "deviceIdentifier" TEXT,
    "stripeCustomerId" TEXT,
    "userLanguageCode" TEXT DEFAULT 'de',
    "cultureName" TEXT,
    "currencyCode" TEXT DEFAULT 'EUR',
    "countryCode" TEXT,
    "firebaseAppInstanceId" TEXT,
    "mobilePlatform" TEXT,
    "specialOfferTriggeredAt" TIMESTAMPTZ(6),
    "blockImportForEventTrackingServices" BOOLEAN NOT NULL,
    "imageId" UUID,
    "referralId" UUID,
    "personalReferralCodeId" UUID,
    "approximatedCityId" UUID,
    "userName" VARCHAR(256),
    "normalizedUserName" VARCHAR(256),
    "email" VARCHAR(256),
    "normalizedEmail" VARCHAR(256),
    "emailConfirmed" BOOLEAN NOT NULL,
    "passwordHash" TEXT,
    "securityStamp" TEXT,
    "concurrencyStamp" TEXT,
    "phoneNumber" TEXT,
    "phoneNumberConfirmed" BOOLEAN NOT NULL,
    "twoFactorEnabled" BOOLEAN NOT NULL,
    "lockoutEnd" TIMESTAMPTZ(6),
    "lockoutEnabled" BOOLEAN NOT NULL,
    "accessFailedCount" INTEGER NOT NULL,
    "canImpersonate" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "pK_users" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voucherGroups" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "groupCode" TEXT,
    "totalUsesPerCode" INTEGER,
    "quantity" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL,
    "subscriptionMandatory" BOOLEAN NOT NULL,
    "restriction" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    "activeUntil" TIMESTAMPTZ(6),
    "periodType" INTEGER NOT NULL,
    "created" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMPTZ(6),
    "isDeleted" BOOLEAN NOT NULL,

    CONSTRAINT "pK_voucherGroups" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vouchers" (
    "id" UUID NOT NULL,
    "code" VARCHAR(32) NOT NULL,
    "uses" INTEGER NOT NULL,
    "totalUses" INTEGER,
    "active" BOOLEAN NOT NULL,
    "type" TEXT NOT NULL,
    "subscriptionMandatory" BOOLEAN NOT NULL,
    "restriction" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "monthlyValue" INTEGER NOT NULL,
    "activeUntil" TIMESTAMPTZ(6),
    "periodType" TEXT,
    "dailyValue" INTEGER NOT NULL,
    "voucherGroupId" UUID,
    "created" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMPTZ(6),
    "isDeleted" BOOLEAN NOT NULL,

    CONSTRAINT "pK_vouchers" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "iX_payments_subscriptionId" ON "payments"("subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "iX_referralCodes_fullCode" ON "referralCodes"("fullCode");

-- CreateIndex
CREATE UNIQUE INDEX "iX_referralCodes_userId" ON "referralCodes"("userId");

-- CreateIndex
CREATE INDEX "iX_referralCodes_name" ON "referralCodes"("name");

-- CreateIndex
CREATE INDEX "iX_referralCodes_number" ON "referralCodes"("number");

-- CreateIndex
CREATE UNIQUE INDEX "iX_referrals_referredSubscriptionId" ON "referrals"("referredSubscriptionId");

-- CreateIndex
CREATE INDEX "iX_referrals_claimedForSubscriptionId" ON "referrals"("claimedForSubscriptionId");

-- CreateIndex
CREATE INDEX "iX_referrals_referralCodeId" ON "referrals"("referralCodeId");

-- CreateIndex
CREATE INDEX "iX_roleClaims_roleId" ON "roleClaims"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "RoleNameIndex" ON "roles"("normalizedName");

-- CreateIndex
CREATE INDEX "iX_subscriptionEvents_subscriptionId" ON "subscriptionEvents"("subscriptionId");

-- CreateIndex
CREATE INDEX "iX_subscriptionVouchers_subscriptionId" ON "subscriptionVouchers"("subscriptionId");

-- CreateIndex
CREATE INDEX "iX_subscriptionVouchers_voucherId" ON "subscriptionVouchers"("voucherId");

-- CreateIndex
CREATE INDEX "iX_subscriptions_userId" ON "subscriptions"("userId");

-- CreateIndex
CREATE INDEX "iX_userClaims_userId" ON "userClaims"("userId");

-- CreateIndex
CREATE INDEX "iX_userLogins_userId" ON "userLogins"("userId");

-- CreateIndex
CREATE INDEX "iX_userRoles_roleId" ON "userRoles"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "UserNameIndex" ON "users"("normalizedUserName");

-- CreateIndex
CREATE INDEX "EmailIndex" ON "users"("normalizedEmail");

-- CreateIndex
CREATE INDEX "iX_users_referralId" ON "users"("referralId");

-- CreateIndex
CREATE UNIQUE INDEX "iX_voucherGroups_name" ON "voucherGroups"("name");

-- CreateIndex
CREATE UNIQUE INDEX "iX_voucherGroups_groupCode" ON "voucherGroups"("groupCode");

-- CreateIndex
CREATE UNIQUE INDEX "iX_vouchers_code" ON "vouchers"("code");

-- CreateIndex
CREATE INDEX "iX_vouchers_voucherGroupId" ON "vouchers"("voucherGroupId");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "fK_payments_subscriptions_subscriptionId" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "referralCodes" ADD CONSTRAINT "fK_referralCodes_users_userId" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "referrals" ADD CONSTRAINT "fK_referrals_referralCodes_referralCodeId" FOREIGN KEY ("referralCodeId") REFERENCES "referralCodes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "referrals" ADD CONSTRAINT "fK_referrals_subscriptions_claimedForSubscriptionId" FOREIGN KEY ("claimedForSubscriptionId") REFERENCES "subscriptions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "referrals" ADD CONSTRAINT "fK_referrals_subscriptions_referredSubscriptionId" FOREIGN KEY ("referredSubscriptionId") REFERENCES "subscriptions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "roleClaims" ADD CONSTRAINT "fK_roleClaims_roles_roleId" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subscriptionEvents" ADD CONSTRAINT "fK_subscriptionEvents_subscriptions_subscriptionId" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subscriptionVouchers" ADD CONSTRAINT "fK_subscriptionVouchers_subscriptions_subscriptionId" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subscriptionVouchers" ADD CONSTRAINT "fK_subscriptionVouchers_vouchers_voucherId" FOREIGN KEY ("voucherId") REFERENCES "vouchers"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "fK_subscriptions_users_userId" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "userClaims" ADD CONSTRAINT "fK_userClaims_users_userId" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "userLogins" ADD CONSTRAINT "fK_userLogins_users_userId" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "userRoles" ADD CONSTRAINT "fK_userRoles_roles_roleId" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "userRoles" ADD CONSTRAINT "fK_userRoles_users_userId" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "userTokens" ADD CONSTRAINT "fK_userTokens_users_userId" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "fK_users_referrals_referralId" FOREIGN KEY ("referralId") REFERENCES "referrals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vouchers" ADD CONSTRAINT "fK_vouchers_voucherGroups_voucherGroupId" FOREIGN KEY ("voucherGroupId") REFERENCES "voucherGroups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
