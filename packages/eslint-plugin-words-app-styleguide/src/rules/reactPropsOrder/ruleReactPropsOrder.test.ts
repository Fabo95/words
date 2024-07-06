import { TSESLint } from "@typescript-eslint/experimental-utils";
import { RuleReactPropsOrder } from "@styleguide/rules/reactPropsOrder/ruleReactPropsOrder";

const ruleTester: TSESLint.RuleTester = new TSESLint.RuleTester({
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

const validStatements: TSESLint.ValidTestCase<[]>[] = [
  {
    code: `<Box
                    $background={SEARCH_JOB_ICON_COLOR}
                    $display="inline" $justify="center"
                    // Lineheight is 1.7 so 35% is half of 0.7
                    $marginTop={percent(35)}
                    {...size(px(16))}
                />`,
  },
  {
    code: `<FormPageHeading
                    id={SETTINGS_SECTIONS.account.subSections?.colloquial.anchor}
                    $level={2}
                    $marginBottom={spacingPx(3)}
                >
                    {SETTINGS_SECTIONS.account.subSections?.colloquial.sectionName}
                </FormPageHeading>`,
  },
  { code: `<Box $width={px(245)} {...(isMobile && { $align: "center" })} />` },
  {
    code: `<Box
                    $align="stretch"
                    $borderRadius={REGULAR_BORDER_RADIUS}
                    $width={px(260)}
                    {...(isMobile && {$margin: spacingPx(1, 0), $width: percent(100),})}
                    {...styleProps}
                />`,
  },
  {
    code: `<Jusssomething
                    onChange={changeAtsProvider}
                    options={atsProviderSelectOptions}
                    $marginBottom={(spacingPx(4))}
                />`,
  },
];

const invalidStatements: TSESLint.InvalidTestCase<"defaultMessage", []>[] = [
  {
    code: `<LandingProcessSectionSvgMobile
        currentIndex={currentIndex}
        step={processSection}
        dataTest={\`process-section-section-\${index}\`}
        selectIndex={selectIndex}
        />`,
    errors: [{ messageId: "defaultMessage" }],
    output: `<LandingProcessSectionSvgMobile
        currentIndex={currentIndex}
        dataTest={\`process-section-section-\${index}\`}
        selectIndex={selectIndex}
        step={processSection}
        />`,
  },
  {
    code: `<SideBarPageItem
                    alt="Seitenleiste Bewerbungen Symbol"
                    $sth={wdwd}
                    text="Bewerbungen"
                    to={CbUrl.APPLICATION_LIST}
                />`,
    errors: [{ messageId: "defaultMessage" }],
    output: `<SideBarPageItem
                    alt="Seitenleiste Bewerbungen Symbol"
                    text="Bewerbungen"
                    to={CbUrl.APPLICATION_LIST}
                    $sth={wdwd}
                />`,
  },
  {
    code: `<SettingsNavigationAnchor
                    isActive={SettingsSectionName.PASSWORD_CHANGE === activeSection}
                    sectionName={SettingsSectionName.PASSWORD_CHANGE}
                    handleSetActiveSection={handleSetActiveSection}
                />`,
    errors: [{ messageId: "defaultMessage" }],
    output: `<SettingsNavigationAnchor
                    handleSetActiveSection={handleSetActiveSection}
                    isActive={SettingsSectionName.PASSWORD_CHANGE === activeSection}
                    sectionName={SettingsSectionName.PASSWORD_CHANGE}
                />`,
  },
  {
    code: `<img {...px(sth)} className="allowed-applicant__img" src={getFullUrl(props.src)} alt={props.alt} />`,
    errors: [{ messageId: "defaultMessage" }],
    output: `<img {...px(sth)} alt={props.alt} className="allowed-applicant__img" src={getFullUrl(props.src)} />`,
  },
  {
    code: `<Select
                    {...wdwd}
                    value={currentlySelectedAtsProvider}
                    options={atsProviderSelectOptions}
                    $marginBottom={(spacingPx(4))}
                    onChange={changeAtsProvider}
                />`,
    errors: [{ messageId: "defaultMessage" }],
    output: `<Select
                    {...wdwd}
                    onChange={changeAtsProvider}
                    options={atsProviderSelectOptions}
                    value={currentlySelectedAtsProvider}
                    $marginBottom={(spacingPx(4))}
                />`,
  },
];

ruleTester.run("react-props-order", RuleReactPropsOrder, {
  valid: validStatements,
  invalid: invalidStatements,
});
