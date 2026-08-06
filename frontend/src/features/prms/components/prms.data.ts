// ─── Purchase Requests ────────────────────────────────────────────────────────
export const purchaseRequests = [
  {
    id: "PR-2025-041", title: "Office Supplies — Q3 2025",
    department: "Administration", requestedBy: "Hirut Mekonen",
    date: "2025-07-01", requiredDate: "2025-07-20",
    amount: 45000, urgency: "Normal", status: "Approved",
    items: 12, justification: "Quarterly office consumables replenishment",
    approvedBy: "Tigist Alemu", approvedDate: "2025-07-03",
  },
  {
    id: "PR-2025-042", title: "Network Equipment Upgrade",
    department: "ICT Infrastructure", requestedBy: "Yonas Tadesse",
    date: "2025-07-05", requiredDate: "2025-07-30",
    amount: 320000, urgency: "High", status: "Finance Review",
    items: 5, justification: "Replace end-of-life network switches in server room",
    approvedBy: null, approvedDate: null,
  },
  {
    id: "PR-2025-043", title: "Cold Storage Spare Parts",
    department: "Warehouse", requestedBy: "Dawit Alemu",
    date: "2025-07-08", requiredDate: "2025-07-15",
    amount: 88500, urgency: "Urgent", status: "Pending",
    items: 8, justification: "Prevent cold chain failure — spare compressor parts critical",
    approvedBy: null, approvedDate: null,
  },
  {
    id: "PR-2025-044", title: "Marketing & Branding Materials",
    department: "Sales & CRM", requestedBy: "Selam Haile",
    date: "2025-07-10", requiredDate: "2025-08-01",
    amount: 22000, urgency: "Normal", status: "Pending",
    items: 6, justification: "Trade exhibition materials for Q3 campaigns",
    approvedBy: null, approvedDate: null,
  },
  {
    id: "PR-2025-045", title: "Fuel & Logistics Q3",
    department: "Procurement", requestedBy: "Tigist Bekele",
    date: "2025-07-12", requiredDate: "2025-07-20",
    amount: 155000, urgency: "Normal", status: "PO Issued",
    items: 1, justification: "Generator fuel for Q3 operational continuity",
    approvedBy: "Abebe Girma", approvedDate: "2025-07-13",
  },
  {
    id: "PR-2025-046", title: "Server Hardware Replacement",
    department: "ICT Infrastructure", requestedBy: "Meron Kebede",
    date: "2025-07-14", requiredDate: "2025-08-15",
    amount: 480000, urgency: "High", status: "Pending",
    items: 3, justification: "Primary server reaching end-of-life — DR risk",
    approvedBy: null, approvedDate: null,
  },
  {
    id: "PR-2025-047", title: "Laboratory Testing Equipment",
    department: "Research & Development", requestedBy: "Biruk Desta",
    date: "2025-07-15", requiredDate: "2025-08-30",
    amount: 670000, urgency: "Urgent", status: "Pending",
    items: 4, justification: "New lab equipment for cybersecurity research project",
    approvedBy: null, approvedDate: null,
  },
]

// ─── RFQs (Request for Quotation) ────────────────────────────────────────────
export const rfqs = [
  {
    id: "RFQ-2025-011", title: "Network Equipment — ICT Upgrade",
    prRef: "PR-2025-042", createdBy: "Tigist Bekele",
    publishDate: "2025-07-08", deadline: "2025-07-22",
    status: "Closed", suppliersInvited: 4, quotationsReceived: 3,
    category: "IT & Electronics",
    amendments: 0,
  },
  {
    id: "RFQ-2025-012", title: "Cold Storage Spare Parts",
    prRef: "PR-2025-043", createdBy: "Tigist Bekele",
    publishDate: "2025-07-10", deadline: "2025-07-18",
    status: "Published", suppliersInvited: 3, quotationsReceived: 1,
    category: "Industrial Equipment",
    amendments: 1,
  },
  {
    id: "RFQ-2025-013", title: "Server Hardware — Datacenter",
    prRef: "PR-2025-046", createdBy: "Yonas Tadesse",
    publishDate: "2025-07-16", deadline: "2025-07-30",
    status: "Draft", suppliersInvited: 0, quotationsReceived: 0,
    category: "IT & Electronics",
    amendments: 0,
  },
  {
    id: "RFQ-2025-014", title: "Laboratory Testing Equipment",
    prRef: "PR-2025-047", createdBy: "Tigist Bekele",
    publishDate: "2025-07-17", deadline: "2025-07-31",
    status: "Published", suppliersInvited: 5, quotationsReceived: 2,
    category: "Research Equipment",
    amendments: 0,
  },
]

// ─── Quotations ───────────────────────────────────────────────────────────────
export const quotations = [
  {
    id: "QT-2025-031", rfqRef: "RFQ-2025-011",
    supplier: "Ethio Tech Solutions", submittedDate: "2025-07-18",
    totalAmount: 298000, leadTimeDays: 14,
    technicalScore: 92, commercialScore: 88, totalScore: 90,
    status: "Awarded", evaluatedBy: "Procurement Committee",
    paymentTerms: "Net 30", warranty: "24 months",
    notes: "Best technical compliance — recommended winner",
  },
  {
    id: "QT-2025-032", rfqRef: "RFQ-2025-011",
    supplier: "Addis Tech Import",
    submittedDate: "2025-07-19", totalAmount: 275000, leadTimeDays: 21,
    technicalScore: 78, commercialScore: 91, totalScore: 84,
    status: "Not Awarded", evaluatedBy: "Procurement Committee",
    paymentTerms: "Net 15", warranty: "12 months",
    notes: "Lower price but shorter warranty and delivery risk",
  },
  {
    id: "QT-2025-033", rfqRef: "RFQ-2025-011",
    supplier: "Digital Imports PLC",
    submittedDate: "2025-07-20", totalAmount: 315000, leadTimeDays: 10,
    technicalScore: 85, commercialScore: 80, totalScore: 83,
    status: "Not Awarded", evaluatedBy: "Procurement Committee",
    paymentTerms: "Net 30", warranty: "18 months",
    notes: "Faster delivery but higher price",
  },
  {
    id: "QT-2025-034", rfqRef: "RFQ-2025-012",
    supplier: "National Supply Corp.",
    submittedDate: "2025-07-15", totalAmount: 82000, leadTimeDays: 7,
    technicalScore: 88, commercialScore: 85, totalScore: 87,
    status: "Pending Evaluation", evaluatedBy: null,
    paymentTerms: "Net 45", warranty: "6 months",
    notes: "Under technical evaluation",
  },
]

// ─── Purchase Orders ──────────────────────────────────────────────────────────
export const purchaseOrders = [
  {
    id: "PO-2025-031", pr: "PR-2025-038", supplier: "Ethio Tech Solutions",
    date: "2025-06-25", deliveryDate: "2025-07-20",
    amount: 185000, items: 7, status: "Delivered", paymentStatus: "Paid",
    receivedBy: "Dawit Alemu", receivedDate: "2025-07-18",
    version: 1, approvedBy: "Abebe Girma",
  },
  {
    id: "PO-2025-032", pr: "PR-2025-039", supplier: "Addis Trading PLC",
    date: "2025-06-28", deliveryDate: "2025-07-25",
    amount: 92000, items: 15, status: "In Transit", paymentStatus: "Pending",
    receivedBy: null, receivedDate: null,
    version: 1, approvedBy: "Tigist Bekele",
  },
  {
    id: "PO-2025-033", pr: "PR-2025-040", supplier: "National Supply Corp.",
    date: "2025-07-01", deliveryDate: "2025-07-30",
    amount: 310000, items: 22, status: "Processing", paymentStatus: "Pending",
    receivedBy: null, receivedDate: null,
    version: 2, approvedBy: "Abebe Girma",
  },
  {
    id: "PO-2025-034", pr: "PR-2025-041", supplier: "Office Max Ethiopia",
    date: "2025-07-03", deliveryDate: "2025-07-18",
    amount: 45000, items: 12, status: "Delivered", paymentStatus: "Paid",
    receivedBy: "Hirut Mekonen", receivedDate: "2025-07-17",
    version: 1, approvedBy: "Tigist Alemu",
  },
  {
    id: "PO-2025-035", pr: "PR-2025-045", supplier: "Meseret Fuel Depot",
    date: "2025-07-13", deliveryDate: "2025-07-28",
    amount: 155000, items: 1, status: "Confirmed", paymentStatus: "Pending",
    receivedBy: null, receivedDate: null,
    version: 1, approvedBy: "Abebe Girma",
  },
  {
    id: "PO-2025-036", pr: "PR-2025-042", supplier: "Ethio Tech Solutions",
    date: "2025-07-21", deliveryDate: "2025-08-04",
    amount: 298000, items: 5, status: "Issued", paymentStatus: "Pending",
    receivedBy: null, receivedDate: null,
    version: 1, approvedBy: "Abebe Girma",
  },
]

// ─── Goods Receipts ───────────────────────────────────────────────────────────
export const goodsReceipts = [
  {
    id: "GR-2025-041", po: "PO-2025-031", supplier: "Ethio Tech Solutions",
    date: "2025-07-18", items: 7, receivedBy: "Dawit Alemu",
    inspectionStatus: "Passed", note: "All items received in good condition",
    acceptedQty: 7, rejectedQty: 0, warehouse: "WH-01 Main Warehouse",
  },
  {
    id: "GR-2025-042", po: "PO-2025-034", supplier: "Office Max Ethiopia",
    date: "2025-07-17", items: 12, receivedBy: "Hirut Mekonen",
    inspectionStatus: "Passed", note: "One box damaged — deducted from invoice",
    acceptedQty: 11, rejectedQty: 1, warehouse: "WH-02 Admin Store",
  },
  {
    id: "GR-2025-043", po: "PO-2025-033", supplier: "National Supply Corp.",
    date: null, items: 22, receivedBy: null,
    inspectionStatus: "Pending", note: null,
    acceptedQty: 0, rejectedQty: 0, warehouse: "WH-01 Main Warehouse",
  },
]

// ─── Suppliers ────────────────────────────────────────────────────────────────
export const suppliers = [
  {
    id: "SUP-001", name: "Ethio Tech Solutions",
    category: "IT & Electronics", contact: "Kebede Alemu",
    phone: "+251 911 111 222", email: "kebede@ethiotech.et",
    city: "Addis Ababa", tin: "0014-578-200",
    rating: 4.8, orders: 24, totalValue: 2840000,
    paymentTerms: "Net 30", status: "Preferred",
    registeredDate: "2022-01-15",
    qualificationStatus: "Qualified",
  },
  {
    id: "SUP-002", name: "Addis Trading PLC",
    category: "General Supplies", contact: "Marta Haile",
    phone: "+251 911 222 333", email: "marta@addistrading.et",
    city: "Addis Ababa", tin: "0014-889-401",
    rating: 4.2, orders: 38, totalValue: 1920000,
    paymentTerms: "Net 15", status: "Active",
    registeredDate: "2021-06-10",
    qualificationStatus: "Qualified",
  },
  {
    id: "SUP-003", name: "National Supply Corp.",
    category: "Industrial Equipment", contact: "Tesfaye Bekele",
    phone: "+251 911 333 444", email: "tesfaye@natsupply.et",
    city: "Adama", tin: "0016-220-155",
    rating: 3.9, orders: 16, totalValue: 3150000,
    paymentTerms: "Net 45", status: "Active",
    registeredDate: "2020-03-20",
    qualificationStatus: "Qualified",
  },
  {
    id: "SUP-004", name: "Office Max Ethiopia",
    category: "Office Supplies", contact: "Almaz Tadesse",
    phone: "+251 911 444 555", email: "almaz@officemax.et",
    city: "Addis Ababa", tin: "0014-331-720",
    rating: 4.5, orders: 52, totalValue: 980000,
    paymentTerms: "Net 30", status: "Preferred",
    registeredDate: "2021-09-05",
    qualificationStatus: "Qualified",
  },
  {
    id: "SUP-005", name: "Meseret Fuel Depot",
    category: "Fuel & Energy", contact: "Girma Mekonen",
    phone: "+251 911 555 666", email: "girma@meseretfuel.et",
    city: "Addis Ababa", tin: "0014-770-990",
    rating: 4.1, orders: 60, totalValue: 4200000,
    paymentTerms: "Net 15", status: "Active",
    registeredDate: "2019-11-01",
    qualificationStatus: "Qualified",
  },
  {
    id: "SUP-006", name: "Tigray Logistics Ltd",
    category: "Transport & Logistics", contact: "Alem Tesfay",
    phone: "+251 914 666 777", email: "alem@tigraylogistics.et",
    city: "Mekele", tin: "0018-004-321",
    rating: 3.7, orders: 8, totalValue: 620000,
    paymentTerms: "Net 30", status: "Probation",
    registeredDate: "2023-05-12",
    qualificationStatus: "Pending Review",
  },
]

// ─── Contracts ────────────────────────────────────────────────────────────────
export const contracts = [
  {
    id: "CON-2025-001", supplier: "Ethio Tech Solutions",
    type: "Annual Maintenance Agreement", value: 450000,
    startDate: "2025-01-01", endDate: "2025-12-31",
    status: "Active", renewalAlert: false, renewalDays: null,
    signedBy: "Abebe Girma", description: "On-site maintenance of all ICT equipment",
  },
  {
    id: "CON-2025-002", supplier: "Meseret Fuel Depot",
    type: "Fuel Supply Framework", value: 1800000,
    startDate: "2025-04-01", endDate: "2025-09-30",
    status: "Active", renewalAlert: true, renewalDays: 68,
    signedBy: "Tigist Bekele", description: "Exclusive fuel supply — generator and fleet",
  },
  {
    id: "CON-2024-008", supplier: "National Supply Corp.",
    type: "Equipment Supply Contract", value: 2200000,
    startDate: "2024-07-01", endDate: "2025-06-30",
    status: "Expired", renewalAlert: false, renewalDays: null,
    signedBy: "Abebe Girma", description: "Industrial equipment — procurement framework",
  },
  {
    id: "CON-2025-003", supplier: "Tigray Logistics Ltd",
    type: "Transport Service Agreement", value: 360000,
    startDate: "2025-02-01", endDate: "2026-01-31",
    status: "Active", renewalAlert: false, renewalDays: null,
    signedBy: "Selamawit Nega", description: "Field office logistics and courier services",
  },
]

// ─── Budgets ──────────────────────────────────────────────────────────────────
export const budgets = [
  { department: "ICT Infrastructure", allocated: 1200000, committed: 800000,  spent: 645000  },
  { department: "Procurement",         allocated: 4500000, committed: 3200000, spent: 2890000 },
  { department: "Warehouse",           allocated: 980000,  committed: 750000,  spent: 620000  },
  { department: "Administration",      allocated: 380000,  committed: 220000,  spent: 175000  },
  { department: "Sales & CRM",         allocated: 740000,  committed: 450000,  spent: 380000  },
  { department: "Finance",             allocated: 280000,  committed: 180000,  spent: 142000  },
  { department: "R&D",                 allocated: 920000,  committed: 670000,  spent: 420000  },
]

// ─── Status config ────────────────────────────────────────────────────────────
export const statusConfig: Record<string, { color: string; bg: string }> = {
  Approved:              { color: "#16A34A", bg: "#F0FDF4" },
  Pending:               { color: "#D97706", bg: "#FFFBEB" },
  Rejected:              { color: "#C8102E", bg: "#FFF1F3" },
  "Finance Review":      { color: "#7C3AED", bg: "#F5F3FF" },
  "PO Issued":           { color: "#2563EB", bg: "#EEF2FF" },
  Delivered:             { color: "#16A34A", bg: "#F0FDF4" },
  "In Transit":          { color: "#2563EB", bg: "#EEF2FF" },
  Processing:            { color: "#D97706", bg: "#FFFBEB" },
  Confirmed:             { color: "#0B1E3D", bg: "#F0F4FF" },
  Issued:                { color: "#0B1E3D", bg: "#EEF2FF" },
  Paid:                  { color: "#16A34A", bg: "#F0FDF4" },
  Active:                { color: "#16A34A", bg: "#F0FDF4" },
  Preferred:             { color: "#2563EB", bg: "#EEF2FF" },
  Probation:             { color: "#D97706", bg: "#FFFBEB" },
  Expired:               { color: "#64748B", bg: "#F1F5F9" },
  Normal:                { color: "#0B1E3D", bg: "#F0F4FF" },
  High:                  { color: "#D97706", bg: "#FFFBEB" },
  Urgent:                { color: "#C8102E", bg: "#FFF1F3" },
  Passed:                { color: "#16A34A", bg: "#F0FDF4" },
  Failed:                { color: "#C8102E", bg: "#FFF1F3" },
  Draft:                 { color: "#64748B", bg: "#F8FAFC" },
  Published:             { color: "#2563EB", bg: "#EEF2FF" },
  Closed:                { color: "#64748B", bg: "#F1F5F9" },
  Awarded:               { color: "#16A34A", bg: "#F0FDF4" },
  "Not Awarded":         { color: "#64748B", bg: "#F1F5F9" },
  "Pending Evaluation":  { color: "#D97706", bg: "#FFFBEB" },
  Qualified:             { color: "#16A34A", bg: "#F0FDF4" },
  "Pending Review":      { color: "#D97706", bg: "#FFFBEB" },
}

export const workflowSteps = [
  { label: "Purchase Request",  desc: "Dept. submits PR",         icon: "01" },
  { label: "HOD Approval",      desc: "Head of Dept. reviews",    icon: "02" },
  { label: "Finance Review",    desc: "Budget & fund check",      icon: "03" },
  { label: "RFQ & Quotation",   desc: "Competitive sourcing",     icon: "04" },
  { label: "Purchase Order",    desc: "PO issued to supplier",    icon: "05" },
  { label: "Goods Receipt",     desc: "Receive & inspect",        icon: "06" },
  { label: "Invoice & Payment", desc: "FMS processes payment",    icon: "07" },
]

// ─── Chart data ───────────────────────────────────────────────────────────────
export const monthlySpendData = [
  { month: "Feb", spend: 420000,  orders: 3 },
  { month: "Mar", spend: 890000,  orders: 6 },
  { month: "Apr", spend: 560000,  orders: 4 },
  { month: "May", spend: 1200000, orders: 8 },
  { month: "Jun", spend: 740000,  orders: 5 },
  { month: "Jul", spend: 787000,  orders: 5 },
]

export const categorySpendData = [
  { category: "IT & Electronics",   value: 2840000 },
  { category: "Fuel & Energy",      value: 4200000 },
  { category: "General Supplies",   value: 1920000 },
  { category: "Industrial Equip.",  value: 3150000 },
  { category: "Office Supplies",    value: 980000  },
  { category: "Transport",          value: 620000  },
]

export const prmsRoles = [
  { role: "PROCUREMENT_OFFICER", color: "#1D4ED8",  perms: ["Create RFQ", "Issue PO", "Manage Suppliers", "Manage Contracts"] },
  { role: "APPROVER",            color: "#7C3AED",  perms: ["Approve PRs", "Reject PRs", "Delegate Authority"] },
  { role: "WAREHOUSE_OFFICER",   color: "#16A34A",  perms: ["Receive Goods", "Inspect", "Record GR", "Update Stock"] },
  { role: "AUDITOR",             color: "#94A3B8",  perms: ["Read All", "Export Reports"] },
]
