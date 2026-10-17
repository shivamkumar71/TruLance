export type VerdictType =
  | "TRUE"
  | "LIKELY TRUE"
  | "MISLEADING"
  | "MIXED"
  | "LIKELY FALSE"
  | "FALSE"
  | "UNVERIFIED";

export type SourceCategory =
  | "Official"
  | "Government"
  | "News"
  | "Fact Check"
  | "Research"
  | "Wikipedia"
  | "Specialized"
  | "YouTube"
  | "Historical Context"
  | "Document"
  | "Blog / Analysis"
  | "Other";

export type AIDetectionStatus =
  | "AI-Generated"
  | "Likely AI-Generated"
  | "Likely Human / Authentic"
  | "Human-Authored"
  | "Uncertain / Mixed";

export interface AIDetectionSignal {
  indicator: string;
  detected: boolean;
  confidence: "High" | "Medium" | "Low";
  description: string;
}

export interface AIDetectionAssessment {
  status: AIDetectionStatus;
  isAIGenerated: boolean;
  aiProbability: number; // 0 - 100%
  confidence: number; // 0 - 100%
  explanation: string;
  signals: AIDetectionSignal[];
  mediaType: "text" | "image" | "pdf" | "document";
}

export type SourceRelationship = "SUPPORTS" | "CONTRADICTS" | "CONTEXT" | "NEUTRAL";

export type EvidenceCoverage = "strong" | "moderate" | "limited" | "insufficient";

export type SourceDirectness = "direct" | "indirect" | "commentary" | "unknown";

export type SourceIndependence = "independent" | "possibly_dependent" | "duplicate" | "unknown";

export type SourceType =
  | "government"
  | "official"
  | "research"
  | "academic"
  | "news"
  | "fact_check"
  | "wikipedia"
  | "specialized"
  | "youtube"
  | "social"
  | "other";

export type ConfidenceLevel =
  | "Very High"
  | "High"
  | "Moderate"
  | "Limited"
  | "Low"
  | "Insufficient";

export type EvidenceStrength =
  | "Very High Evidence"
  | "High Evidence"
  | "Moderate Evidence"
  | "Limited Evidence"
  | "Insufficient Evidence";

export type ClaimType =
  | "Direct Factual"
  | "Official / Legal Record"
  | "Statistical / Numerical"
  | "Scientific / Technical"
  | "Historical Event"
  | "Current Event / Reporting"
  | "Breaking / Emerging"
  | "Disputed / Interpretive"
  | "Ambiguous / Context-Dependent"
  | "Rumor / Unsubstantiated Assertion"
  | "No Verifiable Claim";

export type VerificationDifficulty = "Low" | "Moderate" | "High" | "Extreme";

export interface SearchTransparency {
  queriesUsed: string[];
  sourcesFound: number;
  sourcesEvaluated: number;
  sourcesTarget?: number;
  officialSourcesFound: number;
  independentSourcesFound: number;
  contradictingSourcesFound: number;
  supportingSourcesFound: number;
  contextSourcesFound?: number;
  neutralSourcesFound?: number;
  searchTimestamp: string;
  isTimeSensitive: boolean;
  temporalReferenceDate: string;
  temporalContext?: string;
  evidenceCoverage?: EvidenceCoverage;
  evidenceCoverageExplanation?: string;
  categoriesSearched?: string[];
}

export interface VerificationSource {
  title: string;
  publisher?: string;
  publisherDomain?: string;
  publisherUrl?: string;
  date?: string;
  publishedDate?: string;
  updatedDate?: string;
  eventDate?: string;
  retrievedDate?: string;
  url?: string | null;
  canonicalUrl?: string | null;
  category?: SourceCategory;
  sourceType?: SourceType;
  relationship?: SourceRelationship;
  isHistorical?: boolean;
  relevance?: string;
  evidenceSummary?: string;
  summary?: string;
  quality?: "Official" | "Peer-Reviewed" | "Major News" | "Standard" | "Archive";
  tier?: "Tier 1: Official / Primary" | "Tier 2: Research / Expert" | "Tier 3: Major News / Fact-Check" | "Tier 4: Secondary / Specialized" | "Tier 5: Reference / General" | "Tier 6: User-Generated / Social" | "Tier 2: Major News / Fact-Check" | "Tier 3: Secondary Reporting" | "Tier 4: Low-Grade / Unverified";
  sourceTier?: string;
  independence?: "Independent" | "Direct" | "Syndicated" | "independent" | "possibly_dependent" | "duplicate" | "unknown";
  directness?: SourceDirectness;
  originalSource?: string;
  relevanceScore?: number;
  isVerified?: boolean;
  /** Open Graph / Twitter image found on the verified source page, when available. */
  referenceImageUrl?: string;
}

export interface FactCheckRecord {
  publisher: string;
  reviewedClaim: string;
  rating: string;
  reviewDate?: string;
  url?: string | null;
}

export interface DetailedAnalysis {
  reasoning?: string;
  sourceComparison?: string;
  conflictingEvidence?: string;
  timeline?: string;
  historicalContext?: string;
  imageForensics?: string;
  investigationDetails?: string;
  factChecks?: FactCheckRecord[];
}

export interface ImageAnalysisInfo {
  isAuthentic?: string;
  authenticityRating?:
    | "Visual authenticity: Likely authentic"
    | "Visual authenticity: Signs of manipulation detected"
    | "Visual authenticity: Cannot be determined"
    | "Likely authentic"
    | "Likely manipulated"
    | "Likely AI-generated"
    | "Unclear";
  captionAccuracy?: string;
  originEstablished?: boolean;
  visualContext?: string;
  hasVerifiableClaim?: boolean;
  notes?: string;
}

export interface DocumentAnalysisInfo {
  extractedClaims?: string[];
  tablesSummary?: string;
  citations?: string[];
  notes?: string;
}

export interface TimelineEntry {
  date: string;
  event: string;
}

export interface SubClaim {
  claim: string;
  verdict: VerdictType;
  detail?: string;
}

export interface VerificationResult {
  id?: string;
  verificationId?: string;
  claim: string;
  normalizedClaim?: string;
  verdict: VerdictType;
  confidence: number;
  confidenceLabel?: ConfidenceLevel;
  evidenceStrength?: EvidenceStrength;
  evidenceCoverage?: EvidenceCoverage;
  claimType?: ClaimType;
  verificationDifficulty?: VerificationDifficulty;
  positiveEvidenceFound?: boolean;
  why: string;
  truthCorrection?: string;
  trueFact?: string;
  evidence: string[];
  supportingEvidence?: string[];
  contradictingEvidence?: string[];
  contextEvidence?: string[];
  context?: string[];
  sources: VerificationSource[];
  sourcesFound?: number;
  sourcesTarget?: number;
  supportsCount?: number;
  contradictsCount?: number;
  contextCount?: number;
  bottomLine?: string;
  checkedFocus?: string | null;
  disputedPoints?: string[];
  uncertainties?: string[];
  timelineItems?: TimelineEntry[];
  timeline?: TimelineEntry[];
  additionalClaims?: SubClaim[];
  extractedAssertions?: string[];
  detailedAnalysis?: DetailedAnalysis;
  imageAnalysis?: ImageAnalysisInfo;
  imageAssessment?: ImageAnalysisInfo;
  documentAnalysis?: DocumentAnalysisInfo;
  documentAssessment?: DocumentAnalysisInfo;
  searchTransparency?: SearchTransparency;
  aiDetection?: AIDetectionAssessment;
  analyzedAt: string;
  contentType?: "text" | "image" | "pdf" | "document";
}

export interface UploadedFileItem {
  file: File;
  base64: string;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  extractedText?: string;
}

export interface VerifyRequestPayload {
  text?: string;
  userContext?: string;
  file?: UploadedFileItem;
}

export interface TrendingNewsItem {
  id: string;
  title: string;
  category: string;
  badgeBg: string;
  badgeText: string;
  icon: string;
  sourceName: string;
  sourceUrl?: string;
  publishedTime: string;
  claimType?: string;
}

export interface VerificationProgressEvent {
  type: "progress" | "result" | "error";
  step?: "parse" | "search" | "analyze" | "crossref" | "verdict";
  percent?: number;
  title?: string;
  message?: string;
  log?: string;
  sourcesFound?: number;
  result?: VerificationResult;
  error?: string;
}

export interface HistoryItem {
  id: string;
  claim: string;
  verdict: VerdictType;
  confidence: number;
  confidenceLabel?: ConfidenceLevel;
  evidenceStrength?: EvidenceStrength;
  claimType?: ClaimType;
  verificationDifficulty?: VerificationDifficulty;
  sourcesCount: number;
  timestamp: string;
  contentType: "text" | "image" | "pdf" | "document";
  aiDetection?: AIDetectionAssessment;
  result: VerificationResult;
}
