/**
 * Typed, read-only view of the populated Consilio workbook (About module).
 * Field names follow the consolidated SQL schema (dbo.*) — see ./mapping.ts.
 * Rules: no invented values, placeholders ("Not stated", "Not Available") are
 * treated as empty, and nothing is derived/summed unless explicitly safe.
 */
import raw from "./consilio.json";

type Row = Record<string, unknown>;
const wb = raw as unknown as Record<string, Row[]>;

const PLACEHOLDERS = new Set(["not stated", "not available", "n/a", ""]);
export function present(v: unknown): v is string | number | boolean {
  if (v === null || v === undefined) return false;
  if (typeof v === "string") return !PLACEHOLDERS.has(v.trim().toLowerCase());
  return true;
}
const str = (v: unknown) => (present(v) ? String(v) : undefined);
const num = (v: unknown) => (typeof v === "number" ? v : undefined);

function lookup(sheet: string, idKey: string, nameKey: string) {
  const m = new Map<unknown, string>();
  for (const r of wb[sheet] ?? []) m.set(r[idKey], String(r[nameKey]));
  return (id: unknown) => (id === undefined ? undefined : m.get(id));
}

// ---------- Reference lookups ----------
export type VerificationStatusName = "Verified" | "Partially verified" | "Unverified" | "Not Available";
const verificationName = lookup("VerificationStatus", "VerificationStatusID", "StatusName");
export const verificationStatuses = (wb.VerificationStatus ?? []).map((r) => ({
  name: String(r.StatusName) as VerificationStatusName,
  description: str(r.Description),
}));
const qualifierName = lookup("ValueQualifier", "ValueQualifierID", "QualifierName");
const periodName = lookup("PeriodType", "PeriodTypeID", "PeriodTypeName");
const regionName = lookup("Region", "RegionID", "RegionName");
const countryName = lookup("Country", "CountryID", "CountryName");
const locationTypeName = lookup("LocationType", "LocationTypeID", "LocationTypeName");
const eventTypeName = lookup("EventType", "EventTypeID", "EventTypeName");
const eventStatusName = lookup("EventStatus", "EventStatusID", "EventStatusName");
const transactionTypeName = lookup("TransactionType", "TransactionTypeID", "TransactionTypeName");
const leaderLevelName = lookup("LeaderLevel", "LeaderLevelID", "LeaderLevelName");
const leadershipFunctionName = lookup("LeadershipFunction", "LeadershipFunctionID", "LeadershipFunctionName");
const jobTitleName = lookup("JobTitle", "JobTitleID", "JobTitleName");
const currencyName = lookup("Currency", "CurrencyID", "CurrencyCode");
const valueBasisName = lookup("ValueBasis", "ValueBasisID", "ValueBasisName");
const classificationName = lookup("FinancialClassification", "FinancialClassificationID", "ClassificationName");
const financialMetricName = lookup("FinancialMetric", "FinancialMetricID", "FinancialMetricName");
const offeringTypeName = lookup("OfferingType", "OfferingTypeID", "OfferingTypeName");
const serviceName = lookup("Service", "ServiceID", "ServiceName");
const serviceCategoryName = lookup("ServiceCategory", "ServiceCategoryID", "ServiceCategoryName");
const languageName = lookup("Language", "LanguageID", "LanguageName");
const languageCode = lookup("Language", "LanguageID", "LanguageCode");
const capabilityTypeName = lookup("CapabilityType", "CapabilityTypeID", "CapabilityTypeName");
const segmentTypeName = lookup("SegmentType", "SegmentTypeID", "SegmentTypeName");

export interface SourceDocument {
  sourceId: number;
  sourceName: string;
  sourceUrl?: string;
}
const sources = new Map<unknown, SourceDocument>(
  (wb.Source ?? []).map((r) => [
    r.SourceID,
    { sourceId: Number(r.SourceID), sourceName: String(r.SourceName), sourceUrl: str(r.SourceURL) },
  ]),
);
const source = (id: unknown) => (id === undefined ? undefined : sources.get(id));

export interface Evidence {
  verificationStatus?: VerificationStatusName;
  source?: SourceDocument;
  lastVerifiedDate?: string;
}
const evidence = (r: Row, statusKey = "VerificationStatusID", srcKey = "SourceID"): Evidence => ({
  verificationStatus: verificationName(r[statusKey]) as VerificationStatusName | undefined,
  source: source(r[srcKey]),
  lastVerifiedDate: str(r.LastVerifiedDate),
});

// ---------- dbo.CompanyProfiles ----------
const p = wb.CompanyProfile[0];
export const companyProfile = {
  companyProfileId: Number(p.CompanyProfileID),
  legalName: String(p.LegalName),
  brandName: String(p.BrandName),
  formerName: str(p.FormerName),
  shortDescription: str(p.ShortDescription),
  overviewText: str(p.OverviewText),
  foundedYear: num(p.FoundedYear),
  brandNameChangeYear: num(p.BrandNameChangeYear),
  websiteUrl: typeof p.WebsiteURL === "string" && /^https?:\/\//.test(p.WebsiteURL) ? p.WebsiteURL : undefined,
  companyType: str(p.CompanyType),
  industryFreeText: str(p.Industry),
  headquartersAddress: str(p.HeadquartersAddress),
  headquartersEvidence: evidence(p, "HeadquartersAddressVerificationStatusID", "HeadquartersAddressSourceID"),
  ownershipSummary: str(p.OwnershipSummary),
  profileStatus: str(p.ProfileStatus),
  lastReviewedDate: str(p.LastReviewedDate),
  evidence: evidence(p),
};

// ---------- dbo.CompanyMetrics ----------
export interface CompanyMetric extends Evidence {
  companyMetricId: number;
  metricName: string;
  metricValue: number;
  valueQualifier?: string;
  unitName: string;
  periodType?: string;
  businessScope?: string;
  isEstimate: boolean;
  methodologyNote?: string;
}
export const companyMetrics: CompanyMetric[] = wb.CompanyMetric.map((r) => ({
  companyMetricId: Number(r.CompanyMetricID),
  metricName: String(r.MetricName),
  metricValue: Number(r.MetricValue),
  valueQualifier: qualifierName(r.ValueQualifierID),
  unitName: String(r.Unit),
  periodType: periodName(r.PeriodTypeID),
  businessScope: str(r.BusinessScope),
  isEstimate: r.IsEstimate === true,
  methodologyNote: str(r.MethodologyNote),
  ...evidence(r),
}));

// ---------- dbo.CompanyFinancials ----------
export interface CompanyFinancial extends Evidence {
  companyFinancialId: number;
  financialMetricName?: string;
  fiscalYear: number;
  amount: number;
  currency?: string;
  valueBasisName?: string;
  scopeNote?: string;
  financialClassification?: string;
}
export const companyFinancials: CompanyFinancial[] = wb.CompanyFinancial.map((r) => ({
  companyFinancialId: Number(r.CompanyFinancialID),
  financialMetricName: financialMetricName(r.FinancialMetricID),
  fiscalYear: Number(r.FiscalYear),
  amount: Number(r.Amount),
  currency: currencyName(r.CurrencyID),
  valueBasisName: valueBasisName(r.ValueBasisID),
  scopeNote: str(r.ScopeNote),
  financialClassification: classificationName(r.FinancialClassificationID),
  ...evidence(r),
})).sort((a, b) => a.fiscalYear - b.fiscalYear);

// ---------- dbo.Leaders ----------
export interface Leader extends Evidence {
  leaderId: number;
  fullName: string;
  jobTitle?: string;
  leaderLevelName?: string;
  leadershipFunctionName?: string;
  region?: string;
  bioSummary?: string;
  profileUrl?: string;
  isCurrent: boolean;
}
export const leaders: Leader[] = wb.Leader.map((r) => ({
  leaderId: Number(r.LeaderID),
  fullName: String(r.FullName),
  jobTitle: jobTitleName(r.JobTitleID),
  leaderLevelName: leaderLevelName(r.LeaderLevelID),
  leadershipFunctionName: leadershipFunctionName(r.LeadershipFunctionID),
  region: regionName(r.RegionID),
  bioSummary: str(r.BioSummary),
  profileUrl: str(r.ProfileURL),
  isCurrent: r.IsCurrent === true,
  ...evidence(r),
}));

// ---------- dbo.CompanyMilestones ----------
export interface CompanyMilestone extends Evidence {
  companyMilestoneId: number;
  eventTitle: string;
  eventType?: string;
  transactionType?: string;
  counterpartyName?: string;
  eventStatusName?: string;
  acquiredScope?: string;
  businessDescription?: string;
  strategicRationale?: string;
  acquiredYear?: number;
  countAsAcquisition: boolean;
}
export const companyMilestones: CompanyMilestone[] = wb.CompanyMilestone.map((r) => ({
  companyMilestoneId: Number(r.CompanyMilestoneID),
  eventTitle: String(r.EventTitle),
  eventType: eventTypeName(r.EventTypeID),
  transactionType: transactionTypeName(r.TransactionTypeID),
  counterpartyName: str(r.CounterpartyName),
  eventStatusName: eventStatusName(r.EventStatusID),
  acquiredScope: str(r.AcquiredScope),
  businessDescription: str(r.BusinessDescription),
  strategicRationale: str(r.StrategicRationale),
  acquiredYear: num(r.AcquiredYear),
  countAsAcquisition: r.CountAsAcquisition === true,
  ...evidence(r),
}));

// ---------- dbo.CompanyOfferings (workbook: ServiceSolution) ----------
export interface MarketSegment {
  marketSegmentId: number;
  segmentName: string;
  segmentType?: string;
}
const segments = new Map<unknown, MarketSegment>(
  wb.MarketSegment.map((r) => [
    r.MarketSegmentID,
    { marketSegmentId: Number(r.MarketSegmentID), segmentName: String(r.SegmentName), segmentType: segmentTypeName(r.SegmentTypeID) },
  ]),
);
export interface CompanyOffering extends Evidence {
  companyOfferingId: number;
  serviceCode: string;
  serviceName?: string;
  serviceCategory?: string;
  offeringTypeName?: string;
  description?: string;
  useCases?: string;
  geographicAvailability?: string;
  deliveryModel?: string;
  isActive: boolean;
  officialUrl?: string;
  marketSegments: MarketSegment[];
}
export const companyOfferings: CompanyOffering[] = wb.ServiceSolution.map((r) => ({
  companyOfferingId: Number(r.ServiceSolutionID),
  serviceCode: String(r.ServiceID),
  serviceName: serviceName(r.ServiceID),
  serviceCategory: serviceCategoryName(r.ServiceCategoryID),
  offeringTypeName: offeringTypeName(r.OfferingTypeID),
  description: str(r.Description),
  useCases: str(r.UseCases),
  geographicAvailability: str(r.GeographicAvailability),
  deliveryModel: str(r.DeliveryModel),
  isActive: r.IsActive === true,
  officialUrl: str(r.OfficialURL),
  marketSegments: wb.ServiceSolutionMarketSegment.filter((l) => l.ServiceSolutionID === r.ServiceSolutionID)
    .map((l) => segments.get(l.MarketSegmentID))
    .filter((s): s is MarketSegment => !!s),
  ...evidence(r),
}));

// ---------- dbo.Locations ----------
export interface Location extends Evidence {
  locationId: number;
  locationName: string;
  locationType?: string;
  addressLine?: string;
  city?: string;
  stateProvince?: string;
  country?: string;
  region?: string;
  isHeadquarters: boolean;
}
export const locations: Location[] = wb.Location.map((r) => ({
  locationId: Number(r.LocationID),
  locationName: String(r.LocationName),
  locationType: locationTypeName(r.LocationTypeID),
  addressLine: str(r.AddressLine),
  city: str(r.City),
  stateProvince: str(r.StateProvince),
  country: countryName(r.CountryID),
  region: regionName(r.RegionID),
  isHeadquarters: r.IsHeadquarters === true,
  ...evidence(r),
}));

/**
 * Map-eligibility rule: a location is placed on the map only when it is
 * "Verified" AND has a published street address. Everything else stays in the
 * directory with its status. Placement is city-level (see CITY_POSITIONS).
 */
export const isMappable = (l: Location) => l.verificationStatus === "Verified" && !!l.addressLine && !!l.city;

// ---------- dbo.WorkforceMetrics ----------
export interface WorkforceMetric extends Evidence {
  workforceMetricId: number;
  populationType: string;
  countValue: number;
  valueQualifier?: string;
  businessFunction?: string;
  region?: string;
  methodologyNote?: string;
}
export const workforceMetrics: WorkforceMetric[] = wb.WorkforceMetric.map((r) => ({
  workforceMetricId: Number(r.WorkforceMetricID),
  populationType: String(r.PopulationType),
  countValue: Number(r.CountValue),
  valueQualifier: qualifierName(r.ValueQualifierID),
  businessFunction: str(r.BusinessFunction),
  region: regionName(r.RegionID),
  methodologyNote: str(r.MethodologyNote),
  ...evidence(r),
}));

// ---------- dbo.LanguageCapabilities ----------
export interface LanguageCapability extends Evidence {
  languageCapabilityId: number;
  languageName?: string;
  languageCode?: string;
  offeringName?: string;
  capabilityTypeName?: string;
  professionalCount?: number;
  isActive?: boolean;
  evidenceNote?: string;
}
export const languageCapabilities: LanguageCapability[] = wb.LanguageCapability.map((r) => {
  const off = companyOfferings.find((o) => o.companyOfferingId === r.ServiceSolutionID);
  return {
    languageCapabilityId: Number(r.LanguageCapabilityID),
    languageName: languageName(r.LanguageID),
    languageCode: languageCode(r.LanguageID),
    offeringName: off?.serviceName,
    capabilityTypeName: capabilityTypeName(r.CapabilityTypeID),
    professionalCount: num(r.ProfessionalCount),
    isActive: typeof r.IsActive === "boolean" ? r.IsActive : undefined,
    evidenceNote: str(r.EvidenceNote),
    ...evidence(r),
  };
});

// ---------- dbo.Awards ----------
export interface Award extends Evidence {
  awardId: number;
  awardName: string;
  awardingBody: string;
  awardYear?: number;
  awardCategory?: string;
  description?: string;
  awardStatus?: string;
}
export const awards: Award[] = wb.Award.map((r) => ({
  awardId: Number(r.AwardID),
  awardName: String(r.AwardName),
  awardingBody: String(r.AwardingBody),
  awardYear: num(r.AwardYear),
  awardCategory: str(r.AwardCategory),
  description: str(r.Description),
  awardStatus: str(r.AwardStatus),
  ...evidence(r),
}));

// ---------- Formatting ----------
const QUALIFIER_PREFIX: Record<string, string> = { "At least": "", "More than": ">", Exact: "" };
const QUALIFIER_SUFFIX: Record<string, string> = { "At least": "+", "More than": "", Exact: "" };
export function formatQualified(value: number, qualifier?: string) {
  const n = value.toLocaleString("en-US");
  if (!qualifier) return n;
  return `${QUALIFIER_PREFIX[qualifier] ?? ""}${n}${QUALIFIER_SUFFIX[qualifier] ?? ""}`;
}
export function formatMoney(amount: number, currency?: string) {
  const b = amount / 1e9;
  const s = b >= 1 ? `${b.toLocaleString("en-US", { maximumFractionDigits: 2 })}B` : amount.toLocaleString("en-US");
  return currency ? `${currency} ${s}` : s;
}
export const uniq = <T,>(xs: (T | undefined)[]) => Array.from(new Set(xs.filter((x): x is T => x !== undefined)));
