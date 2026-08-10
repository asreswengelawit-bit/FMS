export type Opportunity = {
  id: number;
  opportunityNumber: string | null;
  opportunityName: string;
  customerId: number | null;
  leadId: number | null;
  stage: string | null;
  expectedRevenue: number | null;
  active: boolean | null;
};
