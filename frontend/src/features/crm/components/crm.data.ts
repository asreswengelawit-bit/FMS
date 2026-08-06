// ── Configs ───────────────────────────────────────────────────────────────────

export const stageConfig: Record<string, { color: string; bg: string }> = {
  New:          { color: "#64748B", bg: "#F1F5F9" },
  Qualified:    { color: "#2563EB", bg: "#EEF2FF" },
  Proposal:     { color: "#7C3AED", bg: "#F5F3FF" },
  Negotiation:  { color: "#D97706", bg: "#FFFBEB" },
  "Closed Won": { color: "#16A34A", bg: "#F0FDF4" },
  Lost:         { color: "#C8102E", bg: "#FFF1F3" },
}

export const statusConfig: Record<string, { color: string; bg: string }> = {
  Draft:          { color: "#64748B", bg: "#F1F5F9" },
  Sent:           { color: "#2563EB", bg: "#EEF2FF" },
  Accepted:       { color: "#16A34A", bg: "#F0FDF4" },
  Converted:      { color: "#0B1E3D", bg: "#F0F4FF" },
  Rejected:       { color: "#C8102E", bg: "#FFF1F3" },
  Processing:     { color: "#D97706", bg: "#FFFBEB" },
  Confirmed:      { color: "#2563EB", bg: "#EEF2FF" },
  Delivered:      { color: "#16A34A", bg: "#F0FDF4" },
  Cancelled:      { color: "#C8102E", bg: "#FFF1F3" },
  Pending:        { color: "#D97706", bg: "#FFFBEB" },
  "Pending Approval": { color: "#D97706", bg: "#FFFBEB" },
  Approved:       { color: "#16A34A", bg: "#F0FDF4" },
  "50% Received": { color: "#D97706", bg: "#FFFBEB" },
  "Fully Paid":   { color: "#16A34A", bg: "#F0FDF4" },
  Unpaid:         { color: "#C8102E", bg: "#FFF1F3" },
  Partial:        { color: "#D97706", bg: "#FFFBEB" },
  Overdue:        { color: "#C8102E", bg: "#FFF1F3" },
  Paid:           { color: "#16A34A", bg: "#F0FDF4" },
  Voided:         { color: "#64748B", bg: "#F1F5F9" },
  Completed:      { color: "#16A34A", bg: "#F0FDF4" },
  Active:         { color: "#16A34A", bg: "#F0FDF4" },
  Inactive:       { color: "#64748B", bg: "#F1F5F9" },
  Prospect:       { color: "#7C3AED", bg: "#F5F3FF" },
  Blacklisted:    { color: "#C8102E", bg: "#FFF1F3" },
  Planned:        { color: "#2563EB", bg: "#EEF2FF" },
  Running:        { color: "#16A34A", bg: "#F0FDF4" },
  Paused:         { color: "#D97706", bg: "#FFFBEB" },
  Closed:         { color: "#64748B", bg: "#F1F5F9" },
  Won:            { color: "#16A34A", bg: "#F0FDF4" },
  Lost:           { color: "#C8102E", bg: "#FFF1F3" },
}

// ── Customers ─────────────────────────────────────────────────────────────────

export interface Customer {
  id: string
  name: string
  type: "Government" | "State Enterprise" | "Private" | "NGO"
  status: "Active" | "Inactive" | "Prospect" | "Blacklisted"
  contact: string
  phone: string
  email: string
  city: string
  address: string
  tin: string
  creditLimit: number
  outstanding: number
  orders: number
  dataClassification: "PUBLIC" | "INTERNAL" | "CONFIDENTIAL" | "SECRET"
  notes: string
}

export const customers: Customer[] = [
  { id: "CUS-001", name: "Ministry of Finance", type: "Government", status: "Active", contact: "Meron Bekele", phone: "+251 115 517 700", email: "meron@mof.gov.et", city: "Addis Ababa", address: "Churchill Ave, Addis Ababa", tin: "0001234567", creditLimit: 5000000, outstanding: 1050000, orders: 12, dataClassification: "CONFIDENTIAL", notes: "Key government account. Net 30 payment terms." },
  { id: "CUS-002", name: "Ethiopian Airlines", type: "State Enterprise", status: "Active", contact: "Ato Kebede Haile", phone: "+251 116 179 900", email: "kebede@etha.et", city: "Addis Ababa", address: "Bole International Airport, Addis Ababa", tin: "0002345678", creditLimit: 2000000, outstanding: 0, orders: 5, dataClassification: "INTERNAL", notes: "Strategic partner. Excellent payment history." },
  { id: "CUS-003", name: "Commercial Bank of Ethiopia", type: "State Enterprise", status: "Active", contact: "Tigist Lemma", phone: "+251 115 510 210", email: "t.lemma@cbe.et", city: "Addis Ababa", address: "Gambia St, Addis Ababa", tin: "0003456789", creditLimit: 3000000, outstanding: 750000, orders: 8, dataClassification: "CONFIDENTIAL", notes: "Bank client. Requires formal procurement process." },
  { id: "CUS-004", name: "Addis Ababa City Admin", type: "Government", status: "Prospect", contact: "Ato Solomon Tesfaye", phone: "+251 111 571 171", email: "solomon@aa.gov.et", city: "Addis Ababa", address: "Kirkos Sub-City, Addis Ababa", tin: "0004567890", creditLimit: 4000000, outstanding: 0, orders: 3, dataClassification: "INTERNAL", notes: "Ongoing tender evaluation. Decision Q3 2025." },
  { id: "CUS-005", name: "Ethio Telecom", type: "State Enterprise", status: "Prospect", contact: "Dawit Hailu", phone: "+251 115 504 700", email: "d.hailu@et.et", city: "Addis Ababa", address: "Mexico Square, Addis Ababa", tin: "0005678901", creditLimit: 1500000, outstanding: 0, orders: 2, dataClassification: "INTERNAL", notes: "Exploratory discussions in progress." },
  { id: "CUS-006", name: "NBEAC", type: "Government", status: "Active", contact: "Hiwot Bekele", phone: "+251 115 530 788", email: "h.bekele@nbeac.et", city: "Addis Ababa", address: "Kirkos, Addis Ababa", tin: "0006789012", creditLimit: 1000000, outstanding: 290000, orders: 4, dataClassification: "CONFIDENTIAL", notes: "Regulatory body. Requires audit trail for all transactions." },
  { id: "CUS-007", name: "Dashen Bank S.C.", type: "Private", status: "Inactive", contact: "Alem Girma", phone: "+251 115 520 145", email: "a.girma@dashen.et", city: "Addis Ababa", address: "Haile Gebre Selassie St, Addis Ababa", tin: "0007890123", creditLimit: 800000, outstanding: 0, orders: 1, dataClassification: "INTERNAL", notes: "Project completed. No current active pipeline." },
  { id: "CUS-008", name: "Oromia Regional Gov't", type: "Government", status: "Active", contact: "Bekele Tadesse", phone: "+251 116 626 000", email: "b.tadesse@oromia.gov.et", city: "Adama", address: "Adama City, Oromia Region", tin: "0008901234", creditLimit: 6000000, outstanding: 2400000, orders: 7, dataClassification: "SECRET", notes: "High-value state security client. SECRET clearance required." },
]

// ── Leads ─────────────────────────────────────────────────────────────────────

export interface Lead {
  id: string
  name: string
  contact: string
  phone: string
  email: string
  source: string
  stage: string
  value: number
  date: string
  assignedTo: string
  score: number
  notes: string
}

export const leads: Lead[] = [
  { id: "LED-2025-001", name: "Ethiopian Airlines", contact: "Ato Kebede", phone: "+251 911 100 200", email: "kebede@etha.et", source: "Direct", stage: "Qualified", value: 480000, date: "2025-07-01", assignedTo: "Selam Haile", score: 72, notes: "Follow up scheduled for Aug 5." },
  { id: "LED-2025-002", name: "Addis Ababa City Admin", contact: "Ato Solomon", phone: "+251 911 200 300", email: "solomon@aa.gov.et", source: "Government Tender", stage: "Proposal", value: 1200000, date: "2025-07-03", assignedTo: "Selam Haile", score: 85, notes: "Proposal submitted. Waiting decision." },
  { id: "LED-2025-003", name: "Commercial Bank of Ethiopia", contact: "Tigist Lemma", phone: "+251 911 300 400", email: "t.lemma@cbe.et", source: "Referral", stage: "Negotiation", value: 750000, date: "2025-07-05", assignedTo: "Selam Haile", score: 91, notes: "Final pricing under negotiation." },
  { id: "LED-2025-004", name: "Ethio Telecom", contact: "Dawit Hailu", phone: "+251 911 400 500", email: "d.hailu@et.et", source: "Conference", stage: "New", value: 320000, date: "2025-07-08", assignedTo: "Selam Haile", score: 45, notes: "Initial contact made at ICT conference." },
  { id: "LED-2025-005", name: "Ministry of Finance", contact: "Meron Bekele", phone: "+251 911 500 600", email: "m.bekele@mof.et", source: "Government Tender", stage: "Closed Won", value: 2100000, date: "2025-06-20", assignedTo: "Selam Haile", score: 100, notes: "Contract signed June 28." },
  { id: "LED-2025-006", name: "Dashen Bank", contact: "Alem Girma", phone: "+251 911 600 700", email: "a.girma@dashen.et", source: "Referral", stage: "Lost", value: 280000, date: "2025-06-25", assignedTo: "Selam Haile", score: 20, notes: "Lost to competitor pricing." },
  { id: "LED-2025-007", name: "Oromia Regional Gov't", contact: "Bekele Tadesse", phone: "+251 911 700 800", email: "b.tadesse@oromia.gov.et", source: "Government Tender", stage: "Qualified", value: 3500000, date: "2025-07-10", assignedTo: "Yonas Tesfaye", score: 78, notes: "Large infrastructure project. High priority." },
  { id: "LED-2025-008", name: "Awash Bank", contact: "Sara Mengistu", phone: "+251 911 800 900", email: "s.mengistu@awashbank.com", source: "Cold Outreach", stage: "New", value: 420000, date: "2025-07-12", assignedTo: "Yonas Tesfaye", score: 38, notes: "Sent introductory email, awaiting response." },
]

// ── Opportunities ─────────────────────────────────────────────────────────────

export interface Opportunity {
  id: string
  name: string
  customer: string
  stage: string
  value: number
  probability: number
  expectedClose: string
  assignedTo: string
  competitor: string
  notes: string
}

export const opportunities: Opportunity[] = [
  { id: "OPP-2025-001", name: "IT Security Audit — Ministry of Finance", customer: "Ministry of Finance", stage: "Won", value: 2100000, probability: 100, expectedClose: "2025-06-28", assignedTo: "Selam Haile", competitor: "None", notes: "Contract awarded. Delivery in progress." },
  { id: "OPP-2025-002", name: "Network Infrastructure Upgrade — CBE", customer: "Commercial Bank of Ethiopia", stage: "Negotiation", value: 750000, probability: 75, expectedClose: "2025-08-15", assignedTo: "Selam Haile", competitor: "TechSol Ltd", notes: "Pricing discussion ongoing. Decision expected mid-August." },
  { id: "OPP-2025-003", name: "Cybersecurity Training — AA City Admin", customer: "Addis Ababa City Admin", stage: "Proposal", value: 1200000, probability: 55, expectedClose: "2025-09-01", assignedTo: "Selam Haile", competitor: "SecureIT PLC", notes: "Proposal submitted July 10. RFP response pending." },
  { id: "OPP-2025-004", name: "Endpoint Management — Ethiopian Airlines", customer: "Ethiopian Airlines", stage: "Qualified", value: 480000, probability: 40, expectedClose: "2025-09-30", assignedTo: "Selam Haile", competitor: "GlobalTech", notes: "Technical evaluation phase." },
  { id: "OPP-2025-005", name: "SOC Implementation — Oromia Gov't", customer: "Oromia Regional Gov't", stage: "Qualified", value: 3500000, probability: 45, expectedClose: "2025-10-15", assignedTo: "Yonas Tesfaye", competitor: "CyberShield Inc", notes: "Largest open opportunity. Board approval required." },
  { id: "OPP-2025-006", name: "Data Recovery Solution — Ethio Telecom", customer: "Ethio Telecom", stage: "New", value: 320000, probability: 20, expectedClose: "2025-11-01", assignedTo: "Yonas Tesfaye", competitor: "Unknown", notes: "RFI sent, awaiting technical requirements." },
  { id: "OPP-2025-007", name: "Compliance Platform — NBEAC", customer: "NBEAC", stage: "Negotiation", value: 680000, probability: 70, expectedClose: "2025-08-30", assignedTo: "Selam Haile", competitor: "Compliance Pro", notes: "Final contract terms under review." },
  { id: "OPP-2025-008", name: "Digital ID System — Awash Bank", customer: "Awash Bank S.C.", stage: "New", value: 420000, probability: 15, expectedClose: "2025-12-01", assignedTo: "Yonas Tesfaye", competitor: "Unknown", notes: "Early stage. Qualification meeting pending." },
]

// ── Quotations ────────────────────────────────────────────────────────────────

export const quotations = [
  { id: "SQ-2025-081", customer: "Ethiopian Airlines", date: "2025-07-08", validUntil: "2025-08-08", amount: 480000, items: 3, status: "Draft", discount: 5 },
  { id: "SQ-2025-082", customer: "Addis Ababa City Admin", date: "2025-07-10", validUntil: "2025-08-10", amount: 1200000, items: 8, status: "Sent", discount: 8 },
  { id: "SQ-2025-083", customer: "CBE", date: "2025-07-12", validUntil: "2025-08-12", amount: 750000, items: 5, status: "Accepted", discount: 6 },
  { id: "SQ-2025-084", customer: "Ministry of Finance", date: "2025-06-22", validUntil: "2025-07-22", amount: 2100000, items: 12, status: "Converted", discount: 10 },
  { id: "SQ-2025-085", customer: "Ethio Telecom", date: "2025-07-14", validUntil: "2025-08-14", amount: 320000, items: 2, status: "Draft", discount: 0 },
]

// ── Sales Orders ──────────────────────────────────────────────────────────────

export interface SalesOrder {
  id: string
  quotation: string
  customer: string
  date: string
  deliveryDate: string
  amount: number
  status: string
  paymentStatus: string
  approvedBy: string
  notes: string
}

export const salesOrders: SalesOrder[] = [
  { id: "SO-2025-021", quotation: "SQ-2025-084", customer: "Ministry of Finance", date: "2025-06-28", deliveryDate: "2025-07-30", amount: 2100000, status: "Processing", paymentStatus: "50% Received", approvedBy: "Abebe Girma", notes: "Phase 1 delivery completed. Phase 2 in progress." },
  { id: "SO-2025-022", quotation: "SQ-2025-083", customer: "Commercial Bank of Ethiopia", date: "2025-07-14", deliveryDate: "2025-08-15", amount: 750000, status: "Confirmed", paymentStatus: "Pending", approvedBy: "Abebe Girma", notes: "Awaiting procurement department PO issuance." },
  { id: "SO-2025-023", quotation: "SQ-2025-078", customer: "INSA HQ", date: "2025-07-02", deliveryDate: "2025-07-20", amount: 380000, status: "Delivered", paymentStatus: "Fully Paid", approvedBy: "Yonas Tesfaye", notes: "Delivered and signed off July 20." },
  { id: "SO-2025-024", quotation: "SQ-2025-079", customer: "NBEAC", date: "2025-07-05", deliveryDate: "2025-07-25", amount: 290000, status: "Confirmed", paymentStatus: "Pending", approvedBy: "Pending", notes: "Awaiting manager approval before dispatch." },
  { id: "SO-2025-025", quotation: "SQ-2025-080", customer: "Oromia Regional Gov't", date: "2025-07-15", deliveryDate: "2025-09-30", amount: 3500000, status: "Pending Approval", paymentStatus: "Unpaid", approvedBy: "—", notes: "Large order. Requires Director approval." },
  { id: "SO-2025-026", quotation: "SQ-2025-076", customer: "Ethiopian Airlines", date: "2025-06-15", deliveryDate: "2025-07-10", amount: 480000, status: "Delivered", paymentStatus: "Fully Paid", approvedBy: "Abebe Girma", notes: "Completed. All deliverables accepted." },
]

// ── Invoices ──────────────────────────────────────────────────────────────────

export interface Invoice {
  id: string
  orderId: string
  customer: string
  date: string
  dueDate: string
  amount: number
  paid: number
  status: string
  items: number
}

export const invoices: Invoice[] = [
  { id: "INV-2025-041", orderId: "SO-2025-021", customer: "Ministry of Finance", date: "2025-06-28", dueDate: "2025-07-28", amount: 2100000, paid: 1050000, status: "Partial", items: 12 },
  { id: "INV-2025-042", orderId: "SO-2025-022", customer: "Commercial Bank of Ethiopia", date: "2025-07-14", dueDate: "2025-08-13", amount: 750000, paid: 0, status: "Unpaid", items: 5 },
  { id: "INV-2025-043", orderId: "SO-2025-023", customer: "INSA HQ", date: "2025-07-02", dueDate: "2025-08-01", amount: 380000, paid: 380000, status: "Paid", items: 4 },
  { id: "INV-2025-044", orderId: "SO-2025-024", customer: "NBEAC", date: "2025-07-05", dueDate: "2025-08-04", amount: 290000, paid: 0, status: "Unpaid", items: 3 },
  { id: "INV-2025-045", orderId: "SO-2025-026", customer: "Ethiopian Airlines", date: "2025-06-15", dueDate: "2025-07-15", amount: 480000, paid: 480000, status: "Paid", items: 3 },
  { id: "INV-2025-040", orderId: "SO-2025-019", customer: "Oromia Regional Gov't", date: "2025-06-01", dueDate: "2025-07-01", amount: 1800000, paid: 0, status: "Overdue", items: 8 },
  { id: "INV-2025-039", orderId: "SO-2025-018", customer: "Dashen Bank S.C.", date: "2025-05-20", dueDate: "2025-06-19", amount: 280000, paid: 280000, status: "Paid", items: 2 },
]

// ── Payments ──────────────────────────────────────────────────────────────────

export interface Payment {
  id: string
  invoiceId: string
  customer: string
  date: string
  amount: number
  method: string
  status: string
  reference: string
  processedBy: string
}

export const payments: Payment[] = [
  { id: "PAY-2025-031", invoiceId: "INV-2025-041", customer: "Ministry of Finance", date: "2025-07-05", amount: 1050000, method: "Bank Transfer", status: "Completed", reference: "TXN-MOF-001", processedBy: "Hiwot Bekele" },
  { id: "PAY-2025-032", invoiceId: "INV-2025-043", customer: "INSA HQ", date: "2025-07-22", amount: 380000, method: "Bank Transfer", status: "Completed", reference: "TXN-INSA-001", processedBy: "Hiwot Bekele" },
  { id: "PAY-2025-033", invoiceId: "INV-2025-045", customer: "Ethiopian Airlines", date: "2025-07-16", amount: 480000, method: "Cheque", status: "Completed", reference: "CHQ-ET-2025-556", processedBy: "Hiwot Bekele" },
  { id: "PAY-2025-034", invoiceId: "INV-2025-039", customer: "Dashen Bank S.C.", date: "2025-06-20", amount: 280000, method: "Bank Transfer", status: "Completed", reference: "TXN-DB-002", processedBy: "Hiwot Bekele" },
  { id: "PAY-2025-035", invoiceId: "INV-2025-042", customer: "Commercial Bank of Ethiopia", date: "2025-07-20", amount: 375000, method: "Bank Transfer", status: "Pending", reference: "TXN-CBE-003", processedBy: "Hiwot Bekele" },
  { id: "PAY-2025-036", invoiceId: "INV-2025-040", customer: "Oromia Regional Gov't", date: "2025-07-18", amount: 900000, method: "Bank Transfer", status: "Pending", reference: "TXN-ORG-001", processedBy: "Selam Haile" },
]

// ── Campaigns ─────────────────────────────────────────────────────────────────

export interface Campaign {
  id: string
  name: string
  type: string
  status: string
  startDate: string
  endDate: string
  budget: number
  spent: number
  targetSegment: string
  leads: number
  conversions: number
  revenue: number
  assignedTo: string
}

export const campaigns: Campaign[] = [
  { id: "CAM-2025-001", name: "Q3 Gov't Cybersecurity Outreach", type: "Email", status: "Running", startDate: "2025-07-01", endDate: "2025-09-30", budget: 150000, spent: 62000, targetSegment: "Government Accounts", leads: 12, conversions: 3, revenue: 3300000, assignedTo: "Selam Haile" },
  { id: "CAM-2025-002", name: "Banking Sector Digital ID Push", type: "Direct Sales", status: "Planned", startDate: "2025-08-01", endDate: "2025-10-31", budget: 200000, spent: 0, targetSegment: "Banking Clients", leads: 0, conversions: 0, revenue: 0, assignedTo: "Yonas Tesfaye" },
  { id: "CAM-2025-003", name: "ICT Conference 2025 Follow-up", type: "Conference", status: "Completed", startDate: "2025-06-10", endDate: "2025-07-10", budget: 80000, spent: 78500, targetSegment: "All Prospects", leads: 8, conversions: 2, revenue: 800000, assignedTo: "Selam Haile" },
  { id: "CAM-2025-004", name: "SOC-as-a-Service Awareness", type: "Webinar", status: "Planned", startDate: "2025-08-15", endDate: "2025-08-15", budget: 30000, spent: 0, targetSegment: "State Enterprises", leads: 0, conversions: 0, revenue: 0, assignedTo: "Yonas Tesfaye" },
  { id: "CAM-2025-005", name: "End-of-Year Security Audit Push", type: "Email", status: "Planned", startDate: "2025-11-01", endDate: "2025-12-31", budget: 120000, spent: 0, targetSegment: "All Active Customers", leads: 0, conversions: 0, revenue: 0, assignedTo: "Selam Haile" },
]

// ── Segments ──────────────────────────────────────────────────────────────────

export interface Segment {
  id: string
  name: string
  description: string
  criteria: string
  customerCount: number
  createdBy: string
  createdAt: string
  lastUpdated: string
}

export const segments: Segment[] = [
  { id: "SEG-001", name: "Government Accounts", description: "All active government ministry and agency customers", criteria: "Type = Government AND Status = Active", customerCount: 3, createdBy: "Selam Haile", createdAt: "2025-01-15", lastUpdated: "2025-07-01" },
  { id: "SEG-002", name: "State Enterprise Tier", description: "State-owned enterprises with high credit limits", criteria: "Type = State Enterprise AND CreditLimit >= 1,500,000", customerCount: 2, createdBy: "Selam Haile", createdAt: "2025-02-20", lastUpdated: "2025-07-01" },
  { id: "SEG-003", name: "High-Value Pipeline", description: "Customers with active orders above ETB 1M", criteria: "Outstanding > 1,000,000 OR OpenOrders > 5", customerCount: 3, createdBy: "Yonas Tesfaye", createdAt: "2025-03-10", lastUpdated: "2025-07-10" },
  { id: "SEG-004", name: "Overdue Risk Accounts", description: "Accounts with overdue invoices requiring follow-up", criteria: "InvoiceStatus = Overdue OR DaysPastDue > 30", customerCount: 2, createdBy: "Hiwot Bekele", createdAt: "2025-05-01", lastUpdated: "2025-07-20" },
  { id: "SEG-005", name: "Upsell Candidates", description: "Active customers with short order history and no active campaign", criteria: "Status = Active AND Orders <= 3 AND NoCampaign = true", customerCount: 4, createdBy: "Yonas Tesfaye", createdAt: "2025-06-15", lastUpdated: "2025-07-15" },
]

// ── Audit Log ─────────────────────────────────────────────────────────────────

export interface AuditEntry {
  id: string
  user: string
  role: string
  action: "CREATE" | "UPDATE" | "DELETE" | "VIEW" | "EXPORT" | "APPROVE" | "REJECT"
  module: string
  entity: string
  entityId: string
  timestamp: string
  ipAddress: string
  details: string
  classification: "PUBLIC" | "INTERNAL" | "CONFIDENTIAL" | "SECRET"
}

export const auditLog: AuditEntry[] = [
  { id: "AUD-CRM-001", user: "Selam Haile", role: "SALES_OFFICER", action: "CREATE", module: "CRM", entity: "Lead", entityId: "LED-2025-008", timestamp: "2025-07-12 09:14:32", ipAddress: "192.168.1.42", details: "Created new lead: Awash Bank — Digital ID Solution", classification: "INTERNAL" },
  { id: "AUD-CRM-002", user: "Selam Haile", role: "SALES_OFFICER", action: "UPDATE", module: "CRM", entity: "Opportunity", entityId: "OPP-2025-003", timestamp: "2025-07-11 14:22:10", ipAddress: "192.168.1.42", details: "Updated opportunity stage from Qualified → Proposal for AA City Admin", classification: "CONFIDENTIAL" },
  { id: "AUD-CRM-003", user: "Abebe Girma", role: "SALES_MANAGER", action: "APPROVE", module: "CRM", entity: "SalesOrder", entityId: "SO-2025-023", timestamp: "2025-07-10 11:05:44", ipAddress: "192.168.1.10", details: "Approved Sales Order SO-2025-023 for INSA HQ — ETB 380,000", classification: "INTERNAL" },
  { id: "AUD-CRM-004", user: "Hiwot Bekele", role: "FINANCE_OFFICER", action: "CREATE", module: "CRM", entity: "Payment", entityId: "PAY-2025-032", timestamp: "2025-07-22 10:30:15", ipAddress: "192.168.1.55", details: "Recorded payment ETB 380,000 from INSA HQ — Bank Transfer TXN-INSA-001", classification: "CONFIDENTIAL" },
  { id: "AUD-CRM-005", user: "Yonas Tesfaye", role: "SALES_OFFICER", action: "CREATE", module: "CRM", entity: "Lead", entityId: "LED-2025-007", timestamp: "2025-07-10 08:45:00", ipAddress: "192.168.1.48", details: "Created lead: Oromia Regional Gov't — SOC Implementation, ETB 3.5M", classification: "SECRET" },
  { id: "AUD-CRM-006", user: "Selam Haile", role: "SALES_OFFICER", action: "EXPORT", module: "CRM", entity: "Report", entityId: "RPT-2025-07", timestamp: "2025-07-09 16:55:22", ipAddress: "192.168.1.42", details: "Exported monthly sales report PDF — July 2025", classification: "INTERNAL" },
  { id: "AUD-CRM-007", user: "Abebe Girma", role: "SALES_MANAGER", action: "UPDATE", module: "CRM", entity: "Customer", entityId: "CUS-001", timestamp: "2025-07-08 09:20:05", ipAddress: "192.168.1.10", details: "Updated credit limit for Ministry of Finance: ETB 4M → ETB 5M", classification: "CONFIDENTIAL" },
  { id: "AUD-CRM-008", user: "Hiwot Bekele", role: "FINANCE_OFFICER", action: "VIEW", module: "CRM", entity: "Invoice", entityId: "INV-2025-040", timestamp: "2025-07-07 14:10:33", ipAddress: "192.168.1.55", details: "Viewed overdue invoice INV-2025-040 for Oromia Regional Gov't", classification: "CONFIDENTIAL" },
  { id: "AUD-CRM-009", user: "Dr. Amanuel Worku", role: "AUDITOR", action: "VIEW", module: "CRM", entity: "AuditLog", entityId: "AUD-CRM-001", timestamp: "2025-07-06 10:00:00", ipAddress: "192.168.1.99", details: "Auditor reviewed CRM audit trail — Q2 compliance check", classification: "SECRET" },
  { id: "AUD-CRM-010", user: "Selam Haile", role: "SALES_OFFICER", action: "UPDATE", module: "CRM", entity: "Campaign", entityId: "CAM-2025-001", timestamp: "2025-07-05 13:44:18", ipAddress: "192.168.1.42", details: "Updated campaign CAM-2025-001 spend: ETB 45,000 → ETB 62,000", classification: "INTERNAL" },
  { id: "AUD-CRM-011", user: "Abebe Girma", role: "SALES_MANAGER", action: "REJECT", module: "CRM", entity: "SalesOrder", entityId: "SO-2025-025", timestamp: "2025-07-04 15:30:00", ipAddress: "192.168.1.10", details: "Returned SO-2025-025 for Oromia Gov't — Director approval required above ETB 2M", classification: "SECRET" },
  { id: "AUD-CRM-012", user: "Yonas Tesfaye", role: "SALES_OFFICER", action: "CREATE", module: "CRM", entity: "Opportunity", entityId: "OPP-2025-008", timestamp: "2025-07-03 09:10:55", ipAddress: "192.168.1.48", details: "Created opportunity: Awash Bank Digital ID System — ETB 420,000", classification: "INTERNAL" },
]

// ── Sales Trend ───────────────────────────────────────────────────────────────

export const salesTrendData = [
  { month: "Jan", sales: 850000,  target: 900000 },
  { month: "Feb", sales: 1200000, target: 1000000 },
  { month: "Mar", sales: 980000,  target: 1000000 },
  { month: "Apr", sales: 1400000, target: 1200000 },
  { month: "May", sales: 1100000, target: 1200000 },
  { month: "Jun", sales: 2100000, target: 1500000 },
  { month: "Jul", sales: 1520000, target: 1500000 },
]

export const pipelineByStage = [
  { stage: "New",        count: 2, value: 740000 },
  { stage: "Qualified",  count: 2, value: 3980000 },
  { stage: "Proposal",   count: 2, value: 1880000 },
  { stage: "Negotiation",count: 2, value: 1430000 },
  { stage: "Closed Won", count: 1, value: 2100000 },
  { stage: "Lost",       count: 1, value: 280000 },
]
