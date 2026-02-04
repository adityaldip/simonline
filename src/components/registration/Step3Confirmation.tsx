import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  APPLICATION_TYPE_LABELS,
  SIM_CATEGORY_LABELS,
  LOCATION_TYPE_LABELS,
} from '@/types/registration';
import type { RegistrationFormData, Organization, AvailabilitySlot } from '@/types/registration';
import { CheckCircle2, FileCheck, Calendar, MapPin, User } from 'lucide-react';

interface Step3ConfirmationProps {
  formData: Partial<RegistrationFormData>;
  organization: Organization | undefined;
  slot: AvailabilitySlot | undefined;
}

export function Step3Confirmation({ formData, organization, slot }: Step3ConfirmationProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Summary Header */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary text-primary-foreground">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-lg">Konfirmasi Pendaftaran</CardTitle>
              <CardDescription>Periksa kembali data Anda sebelum mengirim</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Application Data */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Data Permohonan</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Jenis Permohonan</p>
              <p className="font-medium">{formData.jenisPermohonan && APPLICATION_TYPE_LABELS[formData.jenisPermohonan]}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Golongan SIM</p>
              <Badge variant="secondary" className="mt-1">
                {formData.golonganSIM && SIM_CATEGORY_LABELS[formData.golonganSIM]}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{formData.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">POLDA Kedatangan</p>
              <p className="font-medium">{formData.polda}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-sm text-muted-foreground">Lokasi Kedatangan</p>
              <p className="font-medium">
                {formData.lokasiKedatangan && LOCATION_TYPE_LABELS[formData.lokasiKedatangan]}
                {formData.lokasiLainnya && ` - ${formData.lokasiLainnya}`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Data */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Data Pribadi</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <p className="text-sm text-muted-foreground">Nama Lengkap</p>
              <p className="font-medium text-lg">{formData.nama}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Jenis Kelamin</p>
              <p className="font-medium">{formData.jenisKelamin === 'LAKI_LAKI' ? 'Laki-laki' : 'Perempuan'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tempat, Tanggal Lahir</p>
              <p className="font-medium">{formData.tempatLahir}, {formData.tanggalLahir && formatDate(formData.tanggalLahir)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tinggi Badan</p>
              <p className="font-medium">{formData.tinggiBadan} cm</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pekerjaan</p>
              <p className="font-medium">{formData.pekerjaan}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Telepon</p>
              <p className="font-medium">{formData.telepon}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pendidikan Terakhir</p>
              <p className="font-medium">{formData.pendidikanTerakhir}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-sm text-muted-foreground">Alamat</p>
              <p className="font-medium">{formData.alamat}</p>
            </div>
          </div>
          <Separator />
          <div className="grid gap-4 sm:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">Foto KTP</p>
              <Badge variant={formData.fotoKTP === 'ADA' ? 'default' : 'secondary'}>
                {formData.fotoKTP === 'ADA' ? 'Ada' : 'Tidak Ada'}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Berkacamata</p>
              <Badge variant="secondary">
                {formData.berkacamata === 'YA' ? 'Ya' : 'Tidak'}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cacat Fisik</p>
              <Badge variant="secondary">
                {formData.cacatFisik === 'YA' ? 'Ya' : 'Tidak'}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sertifikat Mengemudi</p>
              <Badge variant={formData.sertifikatMengemudi === 'ADA' ? 'default' : 'secondary'}>
                {formData.sertifikatMengemudi === 'ADA' ? 'Ada' : 'Tidak Ada'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule & Location */}
      {organization && slot && (
        <Card className="border-success/30 bg-success/5">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-success" />
              <CardTitle className="text-base">Jadwal & Lokasi Kedatangan</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Lokasi</p>
                <p className="font-medium">{organization.name}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {organization.address}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tanggal & Waktu</p>
                <p className="font-medium">{formatDate(slot.date)}</p>
                <p className="text-lg font-bold text-primary">{slot.time} WIB</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
