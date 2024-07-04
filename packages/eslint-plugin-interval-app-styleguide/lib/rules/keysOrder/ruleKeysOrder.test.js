"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const experimental_utils_1 = require("@typescript-eslint/experimental-utils");
const ruleKeysOrder_1 = require("../../rules/keysOrder/ruleKeysOrder");
const ruleTester = new experimental_utils_1.TSESLint.RuleTester({
    env: {
        browser: true,
        es2021: true,
    },
    parser: require.resolve("@typescript-eslint/parser"),
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: "module",
    },
});
const validStatements = [
    {
        code: `export const INITIAL_EDITABLE_IMAGE_STATE: EditableImageState = {
        contentType: "",
        filename: "",
        isThumbnail: false,
        src: null,
        title: "",
    };`,
    },
    {
        code: `return {
            ...pick(initialApplicationListState, RESET_KEYS),
            ...state,
        filters: newFilters,
    };`,
    },
    {
        code: `export const initialApplicationListState: ApplicationListState = {
        applications: [],
        enquiries: [],
        filters: {
            groupBy: "enquiry",
            seen: [true, false],
        },
        groupedApplicationItemRequestLoadingState: {},
        ungroupedApplicationsTotalCount: 0,
        ungroupedRequestLoadingState: "Not Asked",
    };`,
    },
    {
        code: `export enum AnalyticsDatePeriodFilterQuickSelectType {
        LAST_MONTH = "lastMonth",
        LAST_SEVEN_DAYS = "lastSevenDays",
        WHOLE_PERIOD = "wholePeriod",
    }`,
    },
    {
        code: `useOnboarding({
        stepsDisplayCondition,
        isTourAllowedToStart: isHomeResponseSuccessBody,
        page: "dashboard",
    });`,
    },
    {
        code: `const INITIAL_STATE = {
                    errors: {},
                    isEmployed: null,
                    salutation: "Herr",
                };

                export const { actions: actions, reducer: reducer } = createSlice({
                    name: "state",
                    initialState: INITIAL_STATE,
                    reducers: {
                        response: (state, action) => ({ ...state, ...action.payload }),
                        error: (state, action) => ({ ...state.errors, ...action.payload }),
                    },
                });`,
    },
    {
        code: `export const CandidateSearchesListCardDesktopContent = ({
                    canViewSearches,
                    dataTest,
                    savedCandidateSearch,
                    textColor,
                }: CandidateSearchesListCardDesktopContentProps) => {
                    /* --- CODE --- */
                };`,
    },
];
const invalidStatements = [
    {
        code: `dispatch(cvClearReference({ sectionName: CvSectionName.ENGAGEMENTS, entityID: id }))`,
        errors: [{ messageId: "defaultMessage" }],
        output: `dispatch(cvClearReference({ entityID: id, sectionName: CvSectionName.ENGAGEMENTS }))`,
    },
    {
        code: `export const newInitialWorkExperience = (): WorkExperiences => ({
            referenceEmail: null,
            workExperienceTypeId: null,
            city: null,
            description: null,
            referencePhone: null,
            startYear: null,
            id: negativeId(),
        });`,
        errors: [{ messageId: "defaultMessage" }],
        output: `export const newInitialWorkExperience = (): WorkExperiences => ({
            city: null,
            description: null,
            id: negativeId(),
            referenceEmail: null,
            referencePhone: null,
            startYear: null,
            workExperienceTypeId: null,
        });`,
    },
    {
        code: `validateString(email, {
            isEmail: { value: true, message: "Bitte gib eine gültige E-Mail ein." },
            required: { message: "Bitte gib deine E-Mail an.", value: true },
        })`,
        errors: [{ messageId: "defaultMessage" }],
        output: `validateString(email, {
            isEmail: { message: "Bitte gib eine gültige E-Mail ein.", value: true },
            required: { message: "Bitte gib deine E-Mail an.", value: true },
        })`,
    },
    {
        code: `export interface EnquiryState {
            [EnquirySectionName.COMPETENCY_LEVELS]: EnquiryPageSection<CompetencyLevel>;
            [EnquirySectionName.SKILLS]: EnquiryPageSection<SkillLevel>;
            company: ApiData<MeCompaniesGetResponseBody>;

            requirements: ApiData<EnquiryRequirementsResponseBody>;
            enquiry: EnquiryEntityState<EnquiryPageEnquiry>;
        }`,
        errors: [{ messageId: "defaultMessage" }],
        output: `export interface EnquiryState {
            [EnquirySectionName.COMPETENCY_LEVELS]: EnquiryPageSection<CompetencyLevel>;
            [EnquirySectionName.SKILLS]: EnquiryPageSection<SkillLevel>;
            company: ApiData<MeCompaniesGetResponseBody>;

            enquiry: EnquiryEntityState<EnquiryPageEnquiry>;
            requirements: ApiData<EnquiryRequirementsResponseBody>;
        }`,
    },
    {
        code: `dispatch(
            enquiryAddEntity({
                sectionName: SECTION_NAME,
                entity: copyToNewEnquiry ? { ...languageLevel, id: negativeId() } : languageLevel,
            })
        )`,
        errors: [{ messageId: "defaultMessage" }],
        output: `dispatch(
            enquiryAddEntity({
                entity: copyToNewEnquiry ? { ...languageLevel, id: negativeId() } : languageLevel,
                sectionName: SECTION_NAME,
            })
        )`,
    },
    {
        code: `const INITIAL_STATE = {
                    salutation: "Herr",
                    isEmployed: null,
                    errors: {},
                };

                export const { actions: actions, reducer: reducer } = createSlice({
                    name: "state",
                    initialState: INITIAL_STATE,
                    reducers: {
                        response: (state, action) => ({ ...state, ...action.payload }),
                        error: (state, action) => ({ ...state.errors, ...action.payload }),
                    },
                });`,
        errors: [{ messageId: "defaultMessage" }],
        output: `const INITIAL_STATE = {
                    errors: {},
                    isEmployed: null,
                    salutation: "Herr",
                };

                export const { actions: actions, reducer: reducer } = createSlice({
                    name: "state",
                    initialState: INITIAL_STATE,
                    reducers: {
                        response: (state, action) => ({ ...state, ...action.payload }),
                        error: (state, action) => ({ ...state.errors, ...action.payload }),
                    },
                });`,
    },
    {
        code: `export const CandidateSearchesListCardDesktopContent = ({
                    dataTest,
                    canViewSearches,
                    textColor,
                    savedCandidateSearch,
                }: CandidateSearchesListCardDesktopContentProps) => {
                    /* --- CODE --- */
                };`,
        errors: [{ messageId: "defaultMessage" }],
        output: `export const CandidateSearchesListCardDesktopContent = ({
                    canViewSearches,
                    dataTest,
                    savedCandidateSearch,
                    textColor,
                }: CandidateSearchesListCardDesktopContentProps) => {
                    /* --- CODE --- */
                };`,
    },
];
ruleTester.run("keys-order", ruleKeysOrder_1.RuleKeysOrder, {
    valid: validStatements,
    invalid: invalidStatements,
});
//# sourceMappingURL=ruleKeysOrder.test.js.map