export const departments = [
  { id: "D01", code: "ICT", name: "ICT Infrastructure",        head: "Abebe Girma",    employees: 24, budget: 4200000 },
  { id: "D02", code: "CYB", name: "Cybersecurity",             head: "Meron Tadesse",  employees: 18, budget: 3800000 },
  { id: "D03", code: "SOC", name: "Security Operations",       head: "Dawit Bekele",   employees: 12, budget: 2900000 },
  { id: "D04", code: "HRM", name: "Human Resources",           head: "Tigist Alemu",   employees: 8,  budget: 1600000 },
  { id: "D05", code: "FIN", name: "Finance",                   head: "Yohannes Haile", employees: 10, budget: 1900000 },
  { id: "D06", code: "PRO", name: "Procurement",               head: "Selamawit Nega", employees: 7,  budget: 1200000 },
  { id: "D07", code: "RND", name: "Research & Development",    head: "Biruk Desta",    employees: 15, budget: 3100000 },
  { id: "D08", code: "TRN", name: "Training & Capacity",       head: "Hiwot Girma",    employees: 9,  budget: 1800000 },
]

export const positions = [
  { id: "P01", title: "Director General",          dept: "ICT Infrastructure", level: "Management", grade: "G-15", headcount: 1 },
  { id: "P02", title: "Deputy Director",           dept: "ICT Infrastructure", level: "Management", grade: "G-14", headcount: 2 },
  { id: "P03", title: "Senior Security Analyst",   dept: "Cybersecurity",      level: "Senior",     grade: "G-12", headcount: 4 },
  { id: "P04", title: "Security Analyst",          dept: "Cybersecurity",      level: "Mid-Level",  grade: "G-10", headcount: 8 },
  { id: "P05", title: "Junior Analyst",            dept: "Security Operations",level: "Entry",      grade: "G-8",  headcount: 6 },
  { id: "P06", title: "HR Manager",                dept: "Human Resources",    level: "Senior",     grade: "G-12", headcount: 1 },
  { id: "P07", title: "HR Officer",                dept: "Human Resources",    level: "Mid-Level",  grade: "G-9",  headcount: 3 },
  { id: "P08", title: "Finance Officer",           dept: "Finance",            level: "Mid-Level",  grade: "G-10", headcount: 4 },
  { id: "P09", title: "Procurement Officer",       dept: "Procurement",        level: "Mid-Level",  grade: "G-9",  headcount: 3 },
  { id: "P10", title: "Research Engineer",         dept: "R&D",                level: "Senior",     grade: "G-11", headcount: 5 },
  { id: "P11", title: "Training Coordinator",      dept: "Training & Capacity",level: "Mid-Level",  grade: "G-9",  headcount: 4 },
  { id: "P12", title: "IT Support Specialist",     dept: "ICT Infrastructure", level: "Mid-Level",  grade: "G-8",  headcount: 8 },
  { id: "P13", title: "Network Engineer",          dept: "ICT Infrastructure", level: "Senior",     grade: "G-11", headcount: 3 },
  { id: "P14", title: "SOC Analyst",               dept: "Security Operations",level: "Mid-Level",  grade: "G-10", headcount: 5 },
]

export const employees = [
  { id: "EMP-001", name: "Abebe Girma",    dept: "ICT Infrastructure", position: "Director General",       status: "ACTIVE",   joinDate: "2018-03-15", phone: "+251911234567", salary: 28000 },
  { id: "EMP-002", name: "Meron Tadesse",  dept: "Cybersecurity",      position: "Senior Security Analyst", status: "ACTIVE",   joinDate: "2019-06-01", phone: "+251922345678", salary: 22000 },
  { id: "EMP-003", name: "Dawit Bekele",   dept: "Security Operations", position: "SOC Analyst",            status: "ACTIVE",   joinDate: "2020-01-10", phone: "+251933456789", salary: 18000 },
  { id: "EMP-004", name: "Tigist Alemu",   dept: "Human Resources",    position: "HR Manager",             status: "ACTIVE",   joinDate: "2017-09-20", phone: "+251944567890", salary: 20000 },
  { id: "EMP-005", name: "Yohannes Haile", dept: "Finance",            position: "Finance Officer",        status: "ACTIVE",   joinDate: "2021-03-05", phone: "+251955678901", salary: 16000 },
  { id: "EMP-006", name: "Selamawit Nega", dept: "Procurement",        position: "Procurement Officer",    status: "INACTIVE", joinDate: "2019-11-15", phone: "+251966789012", salary: 14000 },
  { id: "EMP-007", name: "Biruk Desta",    dept: "Research & Development", position: "Research Engineer",  status: "ACTIVE",   joinDate: "2020-07-22", phone: "+251977890123", salary: 21000 },
  { id: "EMP-008", name: "Hiwot Girma",    dept: "Training & Capacity",position: "Training Coordinator",   status: "On Leave", joinDate: "2022-01-08", phone: "+251988901234", salary: 15000 },
]

export const leaveTypes = [
  { id: "LT-01", name: "Annual Leave",      days: 20, paid: true,  carryOver: 5  },
  { id: "LT-02", name: "Sick Leave",        days: 15, paid: true,  carryOver: 0  },
  { id: "LT-03", name: "Maternity Leave",   days: 90, paid: true,  carryOver: 0  },
  { id: "LT-04", name: "Paternity Leave",   days: 5,  paid: true,  carryOver: 0  },
  { id: "LT-05", name: "Emergency Leave",   days: 3,  paid: true,  carryOver: 0  },
  { id: "LT-06", name: "Study Leave",       days: 10, paid: false, carryOver: 0  },
  { id: "LT-07", name: "Unpaid Leave",      days: 30, paid: false, carryOver: 0  },
]

export const leaveRequests = [
  { id: "LR-001", employee: "Hiwot Girma",    type: "Annual Leave",    from: "2025-07-21", to: "2025-07-25", days: 5,  status: "APPROVED", reason: "Family vacation" },
  { id: "LR-002", employee: "Dawit Bekele",   type: "Sick Leave",      from: "2025-07-22", to: "2025-07-22", days: 1,  status: "PENDING",  reason: "Medical appointment" },
  { id: "LR-003", employee: "Biruk Desta",    type: "Study Leave",     from: "2025-08-01", to: "2025-08-10", days: 10, status: "PENDING",  reason: "Certification exam" },
  { id: "LR-004", employee: "Meron Tadesse",  type: "Emergency Leave", from: "2025-07-18", to: "2025-07-18", days: 1,  status: "APPROVED", reason: "Family emergency" },
  { id: "LR-005", employee: "Yohannes Haile", type: "Annual Leave",    from: "2025-08-15", to: "2025-08-22", days: 8,  status: "PENDING",  reason: "Personal travel" },
  { id: "LR-006", employee: "Tigist Alemu",   type: "Sick Leave",      from: "2025-07-10", to: "2025-07-11", days: 2,  status: "APPROVED", reason: "Illness" },
  { id: "LR-007", employee: "Abebe Girma",    type: "Annual Leave",    from: "2025-09-01", to: "2025-09-05", days: 5,  status: "PENDING",  reason: "Annual leave" },
]

export const dailyAttendance = [
  { id: "EMP-001", name: "Abebe Girma",    dept: "ICT Infrastructure", status: "PRESENT",  checkIn: "08:02", checkOut: "17:05" },
  { id: "EMP-002", name: "Meron Tadesse",  dept: "Cybersecurity",      status: "PRESENT",  checkIn: "07:55", checkOut: "17:00" },
  { id: "EMP-003", name: "Dawit Bekele",   dept: "Security Operations", status: "ABSENT",   checkIn: "—",     checkOut: "—" },
  { id: "EMP-004", name: "Tigist Alemu",   dept: "Human Resources",    status: "PRESENT",  checkIn: "08:10", checkOut: "17:08" },
  { id: "EMP-005", name: "Yohannes Haile", dept: "Finance",            status: "LATE",     checkIn: "09:45", checkOut: "17:30" },
  { id: "EMP-006", name: "Selamawit Nega", dept: "Procurement",        status: "ABSENT",   checkIn: "—",     checkOut: "—" },
  { id: "EMP-007", name: "Biruk Desta",    dept: "Research & Development", status: "PRESENT", checkIn: "08:00", checkOut: "17:00" },
  { id: "EMP-008", name: "Hiwot Girma",    dept: "Training & Capacity","status": "ON LEAVE", checkIn: "—",   checkOut: "—" },
]

export const payrollProfiles = [
  { id: "EMP-001", name: "Abebe Girma",    grade: "G-15", basic: 28000, allowances: 8400, deductions: 5600, net: 30800, method: "Bank Transfer", status: "Paid" },
  { id: "EMP-002", name: "Meron Tadesse",  grade: "G-12", basic: 22000, allowances: 6600, deductions: 4400, net: 24200, method: "Bank Transfer", status: "Paid" },
  { id: "EMP-003", name: "Dawit Bekele",   grade: "G-10", basic: 18000, allowances: 5400, deductions: 3600, net: 19800, method: "Bank Transfer", status: "Processing" },
  { id: "EMP-004", name: "Tigist Alemu",   grade: "G-12", basic: 20000, allowances: 6000, deductions: 4000, net: 22000, method: "Bank Transfer", status: "Paid" },
  { id: "EMP-005", name: "Yohannes Haile", grade: "G-10", basic: 16000, allowances: 4800, deductions: 3200, net: 17600, method: "Bank Transfer", status: "Processing" },
  { id: "EMP-006", name: "Selamawit Nega", grade: "G-9",  basic: 14000, allowances: 4200, deductions: 2800, net: 15400, method: "Cheque",        status: "Hold" },
  { id: "EMP-007", name: "Biruk Desta",    grade: "G-11", basic: 21000, allowances: 6300, deductions: 4200, net: 23100, method: "Bank Transfer", status: "Paid" },
  { id: "EMP-008", name: "Hiwot Girma",    grade: "G-9",  basic: 15000, allowances: 4500, deductions: 3000, net: 16500, method: "Bank Transfer", status: "Paid" },
]

export const assignmentHistory = [
  { id: "ASN-001", employee: "Abebe Girma",    from: "Deputy Director",         to: "Director General",        dept: "ICT Infrastructure", date: "2022-01-01", type: "Promotion" },
  { id: "ASN-002", employee: "Meron Tadesse",  from: "Security Analyst",        to: "Senior Security Analyst", dept: "Cybersecurity",      date: "2021-07-15", type: "Promotion" },
  { id: "ASN-003", employee: "Dawit Bekele",   from: "Junior Analyst",          to: "SOC Analyst",             dept: "Security Operations", date: "2022-06-01", type: "Promotion" },
  { id: "ASN-004", employee: "Hiwot Girma",    from: "Cybersecurity",           to: "Training & Capacity",     dept: "Training & Capacity", date: "2023-03-10", type: "Transfer" },
  { id: "ASN-005", employee: "Yohannes Haile", from: "",                        to: "Finance Officer",         dept: "Finance",            date: "2021-03-05", type: "Onboarding" },
  { id: "ASN-006", employee: "Selamawit Nega", from: "Procurement Officer",     to: "—",                       dept: "Procurement",        date: "2024-11-01", type: "Separation" },
  { id: "ASN-007", employee: "Biruk Desta",    from: "SOC Analyst",             to: "Research Engineer",       dept: "R&D",                date: "2022-09-20", type: "Reassignment" },
]

export const auditLog = [
  { id: "AUD-001", user: "admin",         action: "CREATE",  module: "Employee",    record: "EMP-008 Hiwot Girma",    timestamp: "2025-07-22 09:12" },
  { id: "AUD-002", user: "tigist.alemu",  action: "APPROVE", module: "Leave",       record: "LR-001 Annual Leave",    timestamp: "2025-07-21 14:30" },
  { id: "AUD-003", user: "abebe.girma",   action: "UPDATE",  module: "Department",  record: "D07 R&D budget updated", timestamp: "2025-07-21 11:00" },
  { id: "AUD-004", user: "tigist.alemu",  action: "REJECT",  module: "Leave",       record: "LR-003 Study Leave",     timestamp: "2025-07-20 16:45" },
  { id: "AUD-005", user: "admin",         action: "DELETE",  module: "Position",    record: "P-OLD Deputy role",      timestamp: "2025-07-19 10:20" },
  { id: "AUD-006", user: "yohannes.h",    action: "VIEW",    module: "Payroll",     record: "EMP-005 payroll slip",   timestamp: "2025-07-19 09:05" },
  { id: "AUD-007", user: "abebe.girma",   action: "EXPORT",  module: "Reports",     record: "Dept headcount PDF",     timestamp: "2025-07-18 17:00" },
  { id: "AUD-008", user: "tigist.alemu",  action: "CREATE",  module: "Leave Type",  record: "LT-07 Unpaid Leave",     timestamp: "2025-07-17 13:30" },
  { id: "AUD-009", user: "admin",         action: "UPDATE",  module: "Employee",    record: "EMP-006 status change",  timestamp: "2025-07-16 11:10" },
  { id: "AUD-010", user: "meron.t",       action: "LOGIN",   module: "System",      record: "Successful login",       timestamp: "2025-07-16 08:02" },
  { id: "AUD-011", user: "admin",         action: "CREATE",  module: "Position",    record: "P14 SOC Analyst",        timestamp: "2025-07-15 14:00" },
  { id: "AUD-012", user: "dawit.b",       action: "VIEW",    module: "Attendance",  record: "July attendance sheet",  timestamp: "2025-07-15 09:30" },
]

export const auditColors: Record<string, { color: string; bg: string }> = {
  CREATE:  { color: "#16A34A", bg: "#F0FDF4" },
  UPDATE:  { color: "#2563EB", bg: "#EEF2FF" },
  DELETE:  { color: "#C8102E", bg: "#FFF1F3" },
  APPROVE: { color: "#7C3AED", bg: "#F5F3FF" },
  REJECT:  { color: "#D97706", bg: "#FFFBEB" },
  VIEW:    { color: "#64748B", bg: "#F1F5F9" },
  EXPORT:  { color: "#0891B2", bg: "#ECFEFF" },
  LOGIN:   { color: "#64748B", bg: "#F1F5F9" },
}

export const deptChartData = departments.map(d => ({ dept: d.code, count: d.employees }))

export const attendanceChartData = [
  { month: "Feb", present: 88, absent: 5, late: 7 },
  { month: "Mar", present: 91, absent: 4, late: 5 },
  { month: "Apr", present: 86, absent: 8, late: 6 },
  { month: "May", present: 93, absent: 3, late: 4 },
  { month: "Jun", present: 89, absent: 6, late: 5 },
  { month: "Jul", present: 75, absent: 2, late: 1 },
]

export const joinersLeaversData = [
  { month: "Feb", joiners: 2, leavers: 0 },
  { month: "Mar", joiners: 1, leavers: 1 },
  { month: "Apr", joiners: 3, leavers: 0 },
  { month: "May", joiners: 0, leavers: 2 },
  { month: "Jun", joiners: 2, leavers: 1 },
  { month: "Jul", joiners: 1, leavers: 0 },
]
