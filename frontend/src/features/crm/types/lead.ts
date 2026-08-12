export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "UNQUALIFIED"
  | "LOST"
  | "CONVERTED";

export type LeadSource =
  | "WEBSITE"
  | "REFERRAL"
  | "COLD_CALL"
  | "SOCIAL_MEDIA"
  | "EVENT"
  | "PARTNER";

export type Lead = {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  industry: string | null;
  jobTitle: string | null;
  source: LeadSource | null;
  sourceDetails: string | null;
  status: LeadStatus;
  leadScore: number | null;
  assignedTo: string | null;
  notes: string | null;
  territoryId: number | null;
  convertedCustomerId: number | null;
  convertedOpportunityId: number | null;
  convertedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type LeadCreateInput = {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  company?: string;
  industry?: string;
  jobTitle?: string;
  source?: LeadSource;
  sourceDetails?: string;
  assignedTo?: string;
  notes?: string;
};

export type LeadConvertInput = {
  conversionReason?: string;
  createOpportunity?: boolean;
  opportunityValue?: number;
  opportunityTitle?: string;
};

export function leadDisplayId(id: number): string {
  return `LED-${String(id).padStart(6, "0")}`;
}

export function leadFullName(lead: Lead): string {
  return [lead.firstName, lead.lastName].filter(Boolean).join(" ");
}
