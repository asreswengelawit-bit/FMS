import { listPeriods } from "@/features/fms/api/journals";
import PeriodManager from "@/features/fms/components/PeriodManager";

export default async function PeriodsPage() {
  const periods = await listPeriods();

  return <PeriodManager initialPeriods={periods} />;
}