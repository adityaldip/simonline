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
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Plus, Trash2, LogIn } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';
import {
  listOrganizations,
  listAllAdmins,
  createAdmin,
  deactivateAdmin,
  type OrganizationRecord,
} from '@/lib/api';
import { useState } from 'react';

export default function AdminsPage() {
  const { token, switchContext } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [openCreateAdmin, setOpenCreateAdmin] = useState(false);
  const [adminForm, setAdminForm] = useState({ organizationId: '', name: '', email: '', password: '' });

  const organizationsQuery = useQuery({
    queryKey: ['superadmin-organizations', ''],
    queryFn: () => listOrganizations(token!),
    enabled: Boolean(token),
  });
  const organizations: OrganizationRecord[] = organizationsQuery.data ?? [];

  const adminsQuery = useQuery({
    queryKey: ['all-admins'],
    queryFn: () => listAllAdmins(token!),
    enabled: Boolean(token),
  });
  const admins = adminsQuery.data ?? [];

  const createAdminMutation = useMutation({
    mutationFn: () =>
      createAdmin(token!, adminForm.organizationId, {
        name: adminForm.name,
        email: adminForm.email,
        password: adminForm.password,
      }),
    onSuccess: () => {
      toast.success('Admin berhasil dibuat');
      setOpenCreateAdmin(false);
      setAdminForm({ organizationId: '', name: '', email: '', password: '' });
      queryClient.invalidateQueries({ queryKey: ['all-admins'] });
    },
    onError: (error: Error) => toast.error(error.message || 'Gagal membuat admin'),
  });

  const deactivateAdminMutation = useMutation({
    mutationFn: ({ organizationId, userId }: { organizationId: string; userId: string }) =>
      deactivateAdmin(token!, organizationId, userId),
    onSuccess: () => {
      toast.success('Admin dinonaktifkan');
      queryClient.invalidateQueries({ queryKey: ['all-admins'] });
    },
    onError: (error: Error) => toast.error(error.message || 'Gagal menonaktifkan admin'),
  });

  const enterAsAdminMutation = useMutation({
    mutationFn: (organizationId: string) => switchContext(organizationId),
    onSuccess: () => {
      toast.success('Masuk sebagai admin organisasi');
      navigate('/admin');
    },
    onError: (error: Error) => toast.error(error.message || 'Gagal masuk sebagai admin'),
  });

  return (
    <AdminLayout role="SUPERADMIN">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin</h1>
          <p className="text-muted-foreground">Kelola akun admin untuk semua organisasi</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Daftar Admin</CardTitle>
                <CardDescription>Semua admin di seluruh organisasi</CardDescription>
              </div>
              <Dialog open={openCreateAdmin} onOpenChange={setOpenCreateAdmin}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Tambah Admin
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tambah Admin Organisasi</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label>Organisasi</Label>
                      <Select
                        value={adminForm.organizationId}
                        onValueChange={(v) => setAdminForm((p) => ({ ...p, organizationId: v }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih organisasi" />
                        </SelectTrigger>
                        <SelectContent>
                          {organizations.map((org) => (
                            <SelectItem key={org.id} value={org.id}>
                              {org.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label>Nama</Label>
                      <Input
                        value={adminForm.name}
                        onChange={(e) => setAdminForm((p) => ({ ...p, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={adminForm.email}
                        onChange={(e) => setAdminForm((p) => ({ ...p, email: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Password</Label>
                      <Input
                        type="password"
                        value={adminForm.password}
                        onChange={(e) => setAdminForm((p) => ({ ...p, password: e.target.value }))}
                        placeholder="Min. 8 karakter"
                      />
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => createAdminMutation.mutate()}
                      disabled={
                        createAdminMutation.isPending ||
                        !adminForm.organizationId ||
                        !adminForm.name.trim() ||
                        !adminForm.email.trim() ||
                        adminForm.password.length < 8
                      }
                    >
                      {createAdminMutation.isPending ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Organisasi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[220px]">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminsQuery.isLoading && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Memuat admin...
                    </TableCell>
                  </TableRow>
                )}
                {!adminsQuery.isLoading && admins.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Belum ada admin. Tambahkan admin untuk sebuah organisasi.
                    </TableCell>
                  </TableRow>
                )}
                {admins.map((row) => {
                  const active =
                    row.membership.status === 'ACTIVE' && (row.user?.isActive ?? false);
                  return (
                    <TableRow key={row.membership.id}>
                      <TableCell className="font-medium">{row.user?.name ?? '-'}</TableCell>
                      <TableCell className="text-sm">{row.user?.email ?? '-'}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{row.organization.name}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className={active ? 'text-success' : 'text-muted-foreground'}>
                          {active ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5"
                            onClick={() => enterAsAdminMutation.mutate(row.organization.id)}
                            disabled={enterAsAdminMutation.isPending}
                          >
                            <LogIn className="h-3.5 w-3.5" />
                            Masuk sebagai Admin
                          </Button>
                          {active && row.user && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                  disabled={deactivateAdminMutation.isPending}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Nonaktifkan admin?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    {row.user.name} ({row.user.email}) tidak akan bisa login ke{' '}
                                    {row.organization.name}.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Batal</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    onClick={() =>
                                      deactivateAdminMutation.mutate({
                                        organizationId: row.organization.id,
                                        userId: row.user!.id,
                                      })
                                    }
                                  >
                                    Nonaktifkan
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
