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
  | "News"
  | "Fact Check"
  | "Research"
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
  officialSourcesFound: number;
  independentSourcesFound: number;
  contradictingSourcesFound: number;
  supportingSourcesFound: number;
  searchTimestamp: string;
  isTimeSensitive: boolean;
  temporalReferenceDate: string;
  temporalContext?: string;
}

export interface VerificationSource {
  title: string;
  publisher?: string;
  date?: string;
  publishedDate?: string;
  updatedDate?: string;
  eventDate?: string;
  retrievedDate?: string;
  url?: string | null;
  canonicalUrl?: string | null;
  category?: SourceCategory;
  relationship?: SourceRelationship;
  isHistorical?: boolean;
  relevance?: string;
  evidenceSummary?: string;
  summary?: string;
  quality?: "Official" | "Peer-Reviewed" | "Major News" | "Standard" | "Archive";
  tier?: "Tier 1: Official / Primary" | "Tier 2: Major News / Fact-Check" | "Tier 3: Secondary Reporting" | "Tier 4: Low-Grade / Unverified";
  sourceTier?: string;
  independence?: "Independent" | "Direct" | "Syndicated";
  relevanceScore?: number;
  isVerified?: boolean;
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
  claimType?: ClaimType;
  verificationDifficulty?: VerificationDifficulty;
  positiveEvidenceFound?: boolean;
  why: string;
  truthCorrection?: string;
  evidence: string[];
  supportingEvidence?: string[];
  contradictingEvidence?: string[];
  contextEvidence?: string[];
  context?: string[];
  sources: VerificationSource[];
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
