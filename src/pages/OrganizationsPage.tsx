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
import { toast } from 'sonner';
import { Search, Plus, Edit, MapPin, Phone, Sparkles, Trash2 } from 'lucide-react';
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
import { generateOrganizationCode } from '@/lib/org-code';
import { mockOrganizations } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import {
  createOrganization,
  listOrganizations,
  updateOrganization,
  updateOrganizationStatus,
  deleteOrganization,
  type OrganizationRecord,
} from '@/lib/api';
import { useState } from 'react';

export default function OrganizationsPage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingOrg, setEditingOrg] = useState<OrganizationRecord | null>(null);
  const [form, setForm] = useState({
    name: '',
    code: '',
    type: 'POLRES' as 'POLDA' | 'POLRES' | 'POLSEK',
    address: '',
    phone: '',
    isActive: true,
  });

  const organizationsQuery = useQuery({
    queryKey: ['superadmin-organizations', search],
    queryFn: () => listOrganizations(token!, search || undefined),
    enabled: Boolean(token),
  });

  const organizations: OrganizationRecord[] =
    organizationsQuery.data ??
    mockOrganizations.map((org) => ({
      ...org,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

  const resetForm = () => {
    setForm({
      name: '',
      code: '',
      type: 'POLRES',
      address: '',
      phone: '',
      isActive: true,
    });
  };

  const handleGenerateCode = () => {
    setForm((prev) => ({
      ...prev,
      code: generateOrganizationCode(prev.type, prev.name),
    }));
  };

  const createMutation = useMutation({
    mutationFn: () => createOrganization(token!, { ...form }),
    onSuccess: () => {
      toast.success('Organisasi berhasil ditambahkan');
      setOpenCreate(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['superadmin-organizations'] });
    },
    onError: (error: Error) => toast.error(error.message || 'Gagal menambah organisasi'),
  });

  const updateMutation = useMutation({
    mutationFn: () => {
      if (!editingOrg) throw new Error('Organization not selected');
      const { name, code, type, address, phone } = form;
      return updateOrganization(token!, editingOrg.id, { name, code, type, address, phone });
    },
    onSuccess: () => {
      toast.success('Organisasi berhasil diperbarui');
      setOpenEdit(false);
      setEditingOrg(null);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['superadmin-organizations'] });
    },
    onError: (error: Error) => toast.error(error.message || 'Gagal memperbarui organisasi'),
  });

  const statusMutation = useMutation({
    mutationFn: ({ organizationId, isActive }: { organizationId: string; isActive: boolean }) =>
      updateOrganizationStatus(token!, organizationId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin-organizations'] });
    },
    onError: (error: Error) => toast.error(error.message || 'Gagal mengubah status organisasi'),
  });

  const deleteMutation = useMutation({
    mutationFn: (organizationId: string) => deleteOrganization(token!, organizationId),
    onSuccess: (result) => {
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: ['superadmin-organizations'] });
    },
    onError: (error: Error) => toast.error(error.message || 'Gagal menghapus organisasi'),
  });

  const openEditDialog = (org: OrganizationRecord) => {
    setEditingOrg(org);
    setForm({
      name: org.name,
      code: org.code,
      type: org.type,
      address: org.address,
      phone: org.phone,
      isActive: org.isActive,
    });
    setOpenEdit(true);
  };

  return (
    <AdminLayout role="SUPERADMIN">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Organisasi</h1>
          <p className="text-muted-foreground">Kelola Polres dan unit pelayanan SIM</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Daftar Organisasi</CardTitle>
                <CardDescription>Kelola Polres dan unit pelayanan SIM</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari organisasi..."
                    className="pl-9 w-[200px]"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>
                <Dialog open={openCreate} onOpenChange={setOpenCreate}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Tambah
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Tambah Organisasi</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label>Nama</Label>
                        <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
                      </div>
                      <div className="space-y-1">
                        <Label>Tipe</Label>
                        <Select value={form.type} onValueChange={(v) => setForm((p) => ({ ...p, type: v as 'POLDA' | 'POLRES' | 'POLSEK' }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="POLDA">POLDA</SelectItem>
                            <SelectItem value="POLRES">POLRES</SelectItem>
                            <SelectItem value="POLSEK">POLSEK</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label>Kode</Label>
                        <div className="flex gap-2">
                          <Input
                            className="flex-1 font-mono"
                            value={form.code}
                            onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                            placeholder="POLRES-SMG"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            className="shrink-0 gap-1.5"
                            onClick={handleGenerateCode}
                          >
                            <Sparkles className="h-4 w-4" />
                            Generate
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Generate dari tipe + nama, atau kode acak jika nama kosong.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <Label>Alamat</Label>
                        <Input value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} />
                      </div>
                      <div className="space-y-1">
                        <Label>Telepon</Label>
                        <Input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
                      </div>
                      <Button className="w-full" onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>
                        {createMutation.isPending ? 'Menyimpan...' : 'Simpan'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
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
                {organizationsQuery.isLoading && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Memuat organisasi...
                    </TableCell>
                  </TableRow>
                )}
                {organizations.map((org) => (
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
                        <Switch
                          checked={org.isActive}
                          onCheckedChange={(checked) =>
                            statusMutation.mutate({ organizationId: org.id, isActive: checked })
                          }
                        />
                        <span className={org.isActive ? 'text-success' : 'text-muted-foreground'}>
                          {org.isActive ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(org)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Hapus organisasi?</AlertDialogTitle>
                              <AlertDialogDescription>
                                {org.name} ({org.code}) akan dihapus. Jika masih ada admin atau
                                pendaftaran terkait, organisasi hanya dinonaktifkan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={() => deleteMutation.mutate(org.id)}
                              >
                                Hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={openEdit} onOpenChange={setOpenEdit}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Organisasi</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label>Nama</Label>
                <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label>Kode</Label>
                <Input value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label>Tipe</Label>
                <Select value={form.type} onValueChange={(v) => setForm((p) => ({ ...p, type: v as 'POLDA' | 'POLRES' | 'POLSEK' }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="POLDA">POLDA</SelectItem>
                    <SelectItem value="POLRES">POLRES</SelectItem>
                    <SelectItem value="POLSEK">POLSEK</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Alamat</Label>
                <Input value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label>Telepon</Label>
                <Input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
              </div>
              <Button className="w-full" onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
