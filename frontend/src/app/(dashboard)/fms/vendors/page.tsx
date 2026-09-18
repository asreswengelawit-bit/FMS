import { listVendors } from "@/features/fms/api/vendors";
import VendorManager from "@/features/fms/components/VendorManager";

export default async function VendorsPage() {
  const vendors = await listVendors();

  return <VendorManager initialVendors={vendors.content ?? []} />;
}
