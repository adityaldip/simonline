import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  FileText,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Eye,
  MoreHorizontal,
} from 'lucide-react';
import { mockRegistrations, mockOrganizations } from '@/data/mockData';
import { APPLICATION_TYPE_LABELS, SIM_CATEGORY_LABELS } from '@/types/registration';

export default function AdminDashboard() {
  // Filter for org-1 (simulating logged in admin for Semarang, Jawa Tengah)
  const orgId = 'org-1';
  const organization = mockOrganizations.find(org => org.id === orgId);
  const registrations = mockRegistrations.filter(reg => reg.organizationId === orgId);

  const pendingCount = registrations.filter(r => r.status === 'PENDING').length;
  const approvedCount = registrations.filter(r => r.status === 'APPROVED').length;
  const completedCount = registrations.filter(r => r.status === 'COMPLETED').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge className="status-badge status-pending">Menunggu</Badge>;
      case 'APPROVED':
        return <Badge className="status-badge status-approved">Disetujui</Badge>;
      case 'REJECTED':
        return <Badge className="status-badge status-rejected">Ditolak</Badge>;
      case 'COMPLETED':
        return <Badge variant="default">Selesai</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AdminLayout role="ADMIN">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Selamat datang, Admin {organization?.name}
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Pendaftaran
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{registrations.length}</div>
              <p className="text-xs text-muted-foreground">Hari ini</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Menunggu Review
              </CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">{pendingCount}</div>
              <p className="text-xs text-muted-foreground">Perlu ditinjau</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Disetujui
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">{approvedCount}</div>
              <p className="text-xs text-muted-foreground">Siap proses</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Selesai
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{completedCount}</div>
              <p className="text-xs text-muted-foreground">Bulan ini</p>
            </CardContent>
          </Card>
        </div>

        {/* Registrations Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Daftar Pendaftaran</CardTitle>
                <CardDescription>
                  Kelola pendaftaran SIM di {organization?.name}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Cari pendaftar..." className="pl-9 w-[200px]" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="PENDING">Menunggu</SelectItem>
                    <SelectItem value="APPROVED">Disetujui</SelectItem>
                    <SelectItem value="REJECTED">Ditolak</SelectItem>
                    <SelectItem value="COMPLETED">Selesai</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No. Registrasi</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Golongan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="w-[100px]">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.map((reg) => (
                  <TableRow key={reg.id}>
                    <TableCell className="font-medium font-mono text-sm">
                      {reg.registrationNumber}
                    </TableCell>
                    <TableCell>{reg.formData.nama}</TableCell>
                    <TableCell className="text-sm">
                      {APPLICATION_TYPE_LABELS[reg.formData.jenisPermohonan]}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {SIM_CATEGORY_LABELS[reg.formData.golonganSIM]}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(reg.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(reg.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {registrations.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Belum ada pendaftaran
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
