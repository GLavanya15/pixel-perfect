/** Workbook → consolidated SQL schema mapping (About module). Rendered in-app at /mapping. */
export type MappingStatus = "Confirmed" | "Proposed" | "Unmapped";
export interface FieldMapping {
  sheet: string;
  column: string;
  table: string;
  schemaColumn: string;
  status: MappingStatus;
  note?: string | undefined;
}

const t = (sheet: string, table: string, cols: [string, string, MappingStatus?, string?][]): FieldMapping[] =>
  cols.map(([column, schemaColumn, status = "Confirmed", note]) => ({ sheet, column, table, schemaColumn, status, note }));

const audit: [string, string][] = [
  ["CreatedBy", "CreatedBy"],
  ["CreatedAt", "CreatedAt"],
  ["LastModifiedBy", "LastModifiedBy"],
  ["LastModifiedAt", "LastModifiedAt"],
];

export const fieldMappings: FieldMapping[] = [
  ...t("CompanyProfile", "dbo.CompanyProfiles", [
    ["CompanyProfileID", "CompanyProfileId"], ["LegalName", "LegalName"], ["BrandName", "BrandName"],
    ["FormerName", "FormerName"], ["ShortDescription", "ShortDescription"], ["OverviewText", "OverviewText"],
    ["FoundedYear", "FoundedYear"], ["BrandNameChangeYear", "BrandNameChangeYear"], ["WebsiteURL", "WebsiteUrl"],
    ["CompanyType", "CompanyType"], ["Industry", "IndustryFreeText"], ["HeadquartersAddress", "HeadquartersAddress"],
    ["HeadquartersAddressVerificationStatusID", "HeadquartersVerificationStatusId"],
    ["HeadquartersAddressSourceID", "HeadquartersSourceId"], ["OwnershipSummary", "OwnershipSummary"],
    ["LogoURL", "LogoUrl", "Confirmed", "Empty in workbook — hidden."], ["ProfileStatus", "ProfileStatus"],
    ["LastReviewedDate", "LastReviewedDate"], ["SourceID", "SourceId"], ...audit,
  ]),
  ...t("CompanyMetric", "dbo.CompanyMetrics", [
    ["CompanyMetricID", "CompanyMetricId"], ["CompanyProfileID", "CompanyProfileId"], ["MetricName", "MetricName"],
    ["MetricValue", "MetricValue"], ["ValueQualifierID", "ValueQualifierId"], ["Unit", "UnitName"],
    ["PeriodTypeID", "PeriodTypeId", "Confirmed", "Workbook uses PT00x codes = dbo.PeriodTypes.PeriodCode."],
    ["GeographicScopeID", "RegionId", "Proposed", "Workbook GeographicScope (15 values) vs schema Regions (4). All rows = 'Global'. Hidden in UI."],
    ["BusinessScope", "BusinessScope"], ["IsEstimate", "IsEstimate"], ["MethodologyNote", "MethodologyNote"],
    ["VerificationStatusID", "VerificationStatusId"], ["SourceID", "SourceId"], ["LastVerifiedDate", "LastVerifiedDate"], ...audit,
  ]),
  ...t("CompanyFinancial", "dbo.CompanyFinancials", [
    ["CompanyFinancialID", "CompanyFinancialId"], ["CompanyProfileID", "CompanyProfileId"],
    ["FinancialMetricID", "FinancialMetricName", "Confirmed", "Lookup collapsed to name column (D-06)."],
    ["FiscalYear", "FiscalYear"], ["Amount", "Amount"],
    ["CurrencyID", "CurrencyId", "Confirmed", "Workbook CI00x = dbo.Currencies.CurrencyCode."],
    ["ValueBasisID", "ValueBasisName", "Confirmed", "Lookup collapsed to name column."], ["ScopeNote", "ScopeNote"],
    ["FinancialClassificationID", "FinancialClassification", "Confirmed", "Lookup collapsed to CHECK column."],
    ["VerificationStatusID", "VerificationStatusId"], ["SourceID", "SourceId", "Confirmed", "Empty in workbook."], ...audit,
  ]),
  ...t("Leader", "dbo.Leaders", [
    ["LeaderID", "LeaderId"], ["CompanyProfileID", "CompanyProfileId"], ["FullName", "FullName"], ["JobTitleID", "JobTitleId"],
    ["LeaderLevelID", "LeaderLevelName", "Confirmed", "Lookup collapsed to CHECK column."],
    ["LeadershipFunctionID", "LeadershipFunctionName", "Confirmed", "Lookup collapsed to name column."],
    ["DepartmentID", "OrganizationalUnitId", "Proposed", "Workbook Department has one placeholder row 'Not Available'; schema uses OrganizationalUnits. Hidden in UI."],
    ["RegionID", "RegionId", "Confirmed", "Empty for all leaders — hidden."], ["BioSummary", "BioSummary"], ["ProfileURL", "ProfileUrl"],
    ["IsCurrent", "IsCurrent"], ["VerificationStatusID", "VerificationStatusId"], ["SourceID", "SourceId"],
    ["LastVerifiedDate", "LastVerifiedDate"], ...audit,
  ]),
  ...t("CompanyMilestone", "dbo.CompanyMilestones", [
    ["CompanyMilestoneID", "CompanyMilestoneId"], ["CompanyProfileID", "CompanyProfileId"], ["EventTitle", "EventTitle"],
    ["EventTypeID", "EventTypeId"], ["TransactionTypeID", "TransactionTypeId"], ["CounterpartyName", "CounterpartyName"],
    ["EventStatusID", "EventStatusName", "Confirmed", "Lookup collapsed to CHECK column."], ["AcquiredScope", "AcquiredScope"],
    ["BusinessDescription", "BusinessDescription"], ["StrategicRationale", "StrategicRationale"], ["AcquiredYear", "AcquiredYear"],
    ["CountAsAcquisition", "CountAsAcquisition"], ["VerificationStatusID", "VerificationStatusId"], ["SourceID", "SourceId"],
    ["LastVerifiedDate", "LastVerifiedDate"], ...audit,
  ]),
  ...t("MilestoneGeographicScope", "dbo.MilestoneGeographicScopes", [
    ["CompanyMilestoneID", "CompanyMilestoneId"],
    ["GeographicScopeID", "RegionId", "Proposed", "Values like 'India', 'Serbia', '11 countries (2018)' have no dbo.Regions row. Hidden in UI."],
  ]),
  ...t("ServiceSolution", "dbo.CompanyOfferings", [
    ["ServiceSolutionID", "CompanyOfferingId", "Proposed", "Sheet name differs; schema FK name FK_LangCap_Solution indicates CompanyOfferings is the successor."],
    ["CompanyProfileID", "CompanyProfileId"], ["ServiceID", "ServiceId", "Confirmed", "S00x = dbo.Services.ServiceCode."],
    ["ServiceCategoryID", "ServiceCategoryId", "Confirmed", "SC00x = ServiceCategoryCode."],
    ["OfferingTypeID", "OfferingTypeName", "Confirmed", "Lookup collapsed to CHECK column."], ["Description", "Description"],
    ["UseCases", "UseCases"], ["GeographicAvailability", "GeographicAvailability"], ["DeliveryModel", "DeliveryModel"],
    ["IsActive", "IsActive"], ["OfficialURL", "OfficialUrl"], ["VerificationStatusID", "VerificationStatusId"],
    ["SourceID", "SourceId"], ["LastVerifiedDate", "LastVerifiedDate"], ...audit,
  ]),
  ...t("ServiceSolutionMarketSegment", "dbo.CompanyOfferingMarketSegments", [
    ["ServiceSolutionID", "CompanyOfferingId", "Proposed", "Follows ServiceSolution → CompanyOfferings."],
    ["MarketSegmentID", "MarketSegmentId"],
  ]),
  ...t("MarketSegmentDomain", "dbo.MarketSegmentDomains", [["MarketSegmentID", "MarketSegmentId"], ["DomainID", "DomainId"]]),
  ...t("Location", "dbo.Locations", [
    ["LocationID", "LocationId"], ["CompanyProfileID", "CompanyProfileId"], ["LocationName", "LocationName"],
    ["LocationTypeID", "LocationTypeId"], ["AddressLine", "AddressLine"], ["City", "City"], ["StateProvince", "StateProvince"],
    ["CountryID", "CountryId", "Confirmed", "RC00x = dbo.Countries.CountryCode."], ["RegionID", "RegionId"],
    ["IsHeadquarters", "IsHeadquarters"],
    ["PublicListingStatusID", "IsPubliclyListed", "Proposed", "Workbook has 'Unknown' / 'Public'; schema is a BIT — 'Unknown' has no BIT equivalent. Hidden in UI."],
    ["VerificationStatusID", "VerificationStatusId"], ["SourceID", "SourceId"], ["LastVerifiedDate", "LastVerifiedDate"], ...audit,
  ]),
  ...t("WorkforceMetric", "dbo.WorkforceMetrics", [
    ["WorkforceMetricID", "WorkforceMetricId"], ["CompanyProfileID", "CompanyProfileId"], ["PopulationType", "PopulationType"],
    ["CountValue", "CountValue"], ["ValueQualifierID", "ValueQualifierId"], ["BusinessFunction", "BusinessFunction"],
    ["RegionID", "RegionId"], ["MethodologyNote", "MethodologyNote"], ["VerificationStatusID", "VerificationStatusId"],
    ["SourceID", "SourceId"], ["LastVerifiedDate", "LastVerifiedDate"], ...audit,
  ]),
  ...t("LanguageCapability", "dbo.LanguageCapabilities", [
    ["LanguageCapabilityID", "LanguageCapabilityId"], ["LanguageID", "LanguageId"],
    ["ServiceSolutionID", "CompanyOfferingId", "Proposed", "Follows ServiceSolution → CompanyOfferings."],
    ["CapabilityTypeID", "CapabilityTypeName", "Confirmed", "Lookup collapsed to CHECK column."],
    ["GeographicScopeID", "RegionId", "Proposed", "Only value used is 'Serbia' (15), not a dbo.Regions row. Hidden in UI."],
    ["ProfessionalCount", "ProfessionalCount"], ["IsActive", "IsActive"], ["EvidenceNote", "EvidenceNote"],
    ["VerificationStatusID", "VerificationStatusId"], ["SourceID", "SourceId"], ["LastVerifiedDate", "LastVerifiedDate"], ...audit,
  ]),
  ...t("Award", "dbo.Awards", [
    ["AwardID", "AwardId"], ["CompanyProfileID", "CompanyProfileId"], ["AwardName", "AwardName"], ["AwardingBody", "AwardingBody"],
    ["AwardYear", "AwardYear"], ["AwardCategory", "AwardCategory"], ["Description", "Description"], ["AwardStatus", "AwardStatus"],
    ["VerificationStatusID", "VerificationStatusId"], ["SourceID", "SourceId"], ["LastVerifiedDate", "LastVerifiedDate"], ...audit,
  ]),
  ...t("Source", "dbo.SourceDocuments", [
    ["SourceID", "SourceId"], ["SourceName", "SourceName"], ["SourceURL", "SourceUrl"],
  ]),
  ...t("GeographicScope", "—", [
    ["GeographicScopeID / ScopeName", "—", "Unmapped", "No dbo.GeographicScopes table. Closest candidate: dbo.Regions (RegionId/RegionName)."],
  ]),
  ...t("Department", "dbo.OrganizationalUnits", [
    ["DepartmentID / DepartmentName", "OrganizationalUnitId / UnitName", "Proposed", "Single placeholder row."],
  ]),
  ...t("Lookup sheets", "various", [
    ["VerificationStatus, ValueQualifier, PeriodType, Region, Country, Currency, Language, JobTitle, EventType, TransactionType, LocationType, SegmentType, MarketSegment, ServiceCategory, Service, Domain", "dbo.<Plural>", "Confirmed", "1:1 reference tables."],
    ["LeaderLevel, LeadershipFunction, EventStatus, OfferingType, CapabilityType, FinancialClassification, ValueBasis, FinancialMetric, PublicListingStatus", "CHECK / name columns", "Confirmed", "Collapsed per D-06."],
  ]),
];

export const openQuestions = [
  "CompanyMetric.GeographicScopeID → dbo.CompanyMetrics.RegionId? (GeographicScope has 15 values; Regions has 4)",
  "MilestoneGeographicScope.GeographicScopeID → dbo.MilestoneGeographicScopes.RegionId? (India, Serbia, '11 countries (2018)' have no Region)",
  "LanguageCapability.GeographicScopeID → dbo.LanguageCapabilities.RegionId? (only 'Serbia')",
  "ServiceSolution → dbo.CompanyOfferings (and ServiceSolutionID → CompanyOfferingId)?",
  "Location.PublicListingStatusID ('Unknown'/'Public') → dbo.Locations.IsPubliclyListed BIT — how should 'Unknown' be stored?",
  "Leader.DepartmentID ('Not Available') → dbo.Leaders.OrganizationalUnitId?",
];

export const dataQualityNotes = [
  "Location 1 is flagged IsHeadquarters but is 'Partially verified' with no street address; Location 6 (same Washington, DC address as CompanyProfile.HeadquartersAddress) is 'Verified' but explicitly 'not confirmed as headquarters address'.",
  "CompanyProfile.HeadquartersAddress (Washington, DC) differs from Source 1 (North Carolina registration) — not reconciled.",
  "CompanyFinancial rows 2023/2024/2025 share one scope note describing a USD 1.2B–1.3B range; all are 'Unverified' estimates with no SourceID.",
  "Most milestones (12 of 20) have no AcquiredYear; there is no event-date column. Undated events are listed in source order, not placed on the timeline.",
  "WorkforceMetric rows overlap (review professionals are likely part of all employees; LOD 4,500+ is an acquired-entity historical figure). They are never summed.",
  "CompanyMetric 'Other' (50,000+ financial services engagements) has a generic metric name.",
  "ServiceSolution 8 (Legal Transformation) reuses the eDiscovery OfficialURL; ServiceCategory SC008 description is 'Not Available'.",
  "Award 2 has no AwardYear; Award 1 title 'to confirm'.",
  "All 17 leaders have empty RegionID and placeholder DepartmentID.",
];
