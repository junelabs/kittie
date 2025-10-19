import { DashboardProtection } from '../../components/auth/DashboardProtection';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProtection>
      {children}
    </DashboardProtection>
  );
}
