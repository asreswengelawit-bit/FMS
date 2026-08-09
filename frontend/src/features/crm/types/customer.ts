export type CustomerType =
  | "GOVERNMENT"
  | "INDIVIDUAL"
  | "PRIVATE"
  | "ORGANIZATION"
  | "NGO"
  | "INTERNATIONAL";

export type CustomerStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export type Customer = {
  id: number;
  customerNumber: string;
  customerType: CustomerType;
  companyName: string | null;
  contactName: string | null;
  contactTitle: string | null;
  email: string;
  phone: string | null;
  mobile: string | null;
  website: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  industry: string | null;
  status: CustomerStatus;
  territoryId: number | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type CustomerCreateInput = {
  customerName: string;
  customerType: CustomerType;
  organizationName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  industry?: string;
  website?: string;
  description?: string;
};

export type SpringPage<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  empty: boolean;
};

export type CrmApiResponse<T> = {
  success: boolean;
  message?: string | null;
  data: T;
  errors?: string[] | null;
};
