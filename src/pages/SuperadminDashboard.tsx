import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Building2,
  Users,
  FileText,
  TrendingUp,
  Search,
  Plus,
  Edit,
  MoreHorizontal,
  MapPin,
  Phone,
} from 'lucide-react';
import { mockOrganizations, mockAdmins, mockRegistrations } from '@/data/mockData';

export default function SuperadminDashboard() {
  const totalRegistrations = mockRegistrations.length;
  const totalOrganizations = mockOrganizations.length;
  const activeOrganizations = mockOrganizations.filter(org => org.isActive).length;
  const totalAdmins = mockAdmins.filter(a => a.role === 'ADMIN').length;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <AdminLayout role="SUPERADMIN">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard Super Admin</h1>
          <p className="text-muted-foreground">
            Kelola semua organisasi dan admin di seluruh wilayah
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium opacity-90">
                Total Pendaftaran
              </CardTitle>
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
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Organisasi
              </CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalOrganizations}</div>
              <p className="text-xs text-muted-foreground">
                {activeOrganizations} aktif
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Admin
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalAdmins}</div>
              <p className="text-xs text-muted-foreground">
                Tersebar di {activeOrganizations} lokasi
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Rata-rata/Hari
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">Pendaftaran</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Organizations and Admins */}
        <Tabs defaultValue="organizations" className="space-y-4">
          <TabsList className="bg-muted">
            <TabsTrigger value="organizations" className="gap-2">
              <Building2 className="h-4 w-4" />
              Organisasi
            </TabsTrigger>
            <TabsTrigger value="admins" className="gap-2">
              <Users className="h-4 w-4" />
              Admin
            </TabsTrigger>
          </TabsList>

          {/* Organizations Tab */}
          <TabsContent value="organizations">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Daftar Organisasi</CardTitle>
                    <CardDescription>
                      Kelola Polres dan unit pelayanan SIM
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Cari organisasi..." className="pl-9 w-[200px]" />
                    </div>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Tambah
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Organisasi</TableHead>
                      <TableHead>Kode</TableHead>
                      <TableHead>Tipe</TableHead>
                      <TableHead>Alamat</TableHead>
                      <TableHead>Telepon</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockOrganizations.map((org) => (
                      <TableRow key={org.id}>
                        <TableCell className="font-medium">{org.name}</TableCell>
                        <TableCell className="font-mono text-sm">{org.code}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{org.type}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            <span className="truncate max-w-[200px]">{org.address}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                            {org.phone}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch checked={org.isActive} />
                            <span className={org.isActive ? 'text-success' : 'text-muted-foreground'}>
                              {org.isActive ? 'Aktif' : 'Nonaktif'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admins Tab */}
          <TabsContent value="admins">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Daftar Admin</CardTitle>
                    <CardDescription>
                      Kelola admin untuk setiap organisasi
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Cari admin..." className="pl-9 w-[200px]" />
                    </div>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Tambah Admin
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Organisasi</TableHead>
                      <TableHead>Terdaftar</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockAdmins.map((admin) => {
                      const organization = mockOrganizations.find(org => org.id === admin.organizationId);
                      return (
                        <TableRow key={admin.id}>
                          <TableCell className="font-medium">{admin.name}</TableCell>
                          <TableCell className="text-sm">{admin.email}</TableCell>
                          <TableCell>
                            <Badge variant={admin.role === 'SUPERADMIN' ? 'default' : 'secondary'}>
                              {admin.role === 'SUPERADMIN' ? 'Super Admin' : 'Admin'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {organization?.name || '-'}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(admin.createdAt)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Switch checked={admin.isActive} />
                              <span className={admin.isActive ? 'text-success' : 'text-muted-foreground'}>
                                {admin.isActive ? 'Aktif' : 'Nonaktif'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
