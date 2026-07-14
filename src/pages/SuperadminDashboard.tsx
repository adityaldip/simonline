import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Building2, Users, FileText, TrendingUp } from 'lucide-react';
import { mockOrganizations, mockAdmins, mockRegistrations } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { listOrganizations, type OrganizationRecord } from '@/lib/api';

export default function SuperadminDashboard() {
  const { token } = useAuth();

  const organizationsQuery = useQuery({
    queryKey: ['superadmin-organizations', ''],
    queryFn: () => listOrganizations(token!),
    enabled: Boolean(token),
  });

  const organizations: OrganizationRecord[] =
    organizationsQuery.data ??
    mockOrganizations.map((org) => ({
      ...org,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

  const totalOrganizations = organizations.length;
  const activeOrganizations = organizations.filter((org) => org.isActive).length;
  const totalRegistrations = mockRegistrations.length;
  const totalAdmins = mockAdmins.filter((a) => a.role === 'ADMIN').length;

  return (
    <AdminLayout role="SUPERADMIN">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard Super Admin</h1>
          <p className="text-muted-foreground">
            Ringkasan pendaftaran dan organisasi di seluruh wilayah
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link to="/superadmin/organizations">
              <Button variant="outline">Kelola Organisasi</Button>
            </Link>
            <Link to="/superadmin/admins">
              <Button variant="outline">Kelola Admin</Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-primary-foreground opacity-90">Total Pendaftaran</CardTitle>
              <FileText className="h-4 w-4 opacity-75" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalRegistrations}</div>
              <p className="text-xs opacity-75 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +12% dari bulan lalu
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Organisasi</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalOrganizations}</div>
              <p className="text-xs text-muted-foreground">{activeOrganizations} aktif</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Admin</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalAdmins}</div>
              <p className="text-xs text-muted-foreground">Tersebar di {activeOrganizations} lokasi</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Rata-rata/Hari</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">Pendaftaran</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
