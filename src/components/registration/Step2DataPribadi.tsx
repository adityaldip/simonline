import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EDUCATION_OPTIONS } from '@/types/registration';
import type { RegistrationFormData, Gender, YesNo, HasOrNot } from '@/types/registration';
import { User } from 'lucide-react';

interface Step2DataPribadiProps {
  formData: Partial<RegistrationFormData>;
  onChange: (field: keyof RegistrationFormData, value: string) => void;
}

export function Step2DataPribadi({ formData, onChange }: Step2DataPribadiProps) {
  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>Data Pribadi</CardTitle>
            <CardDescription>Informasi data diri pemohon</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Nama */}
        <div className="space-y-2">
          <Label htmlFor="nama" className="text-base font-medium">Nama Lengkap *</Label>
          <Input
            id="nama"
            placeholder="Masukkan nama lengkap sesuai KTP"
            value={formData.nama || ''}
            onChange={(e) => onChange('nama', e.target.value)}
            className="h-12"
          />
        </div>

        {/* Jenis Kelamin */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Jenis Kelamin *</Label>
          <RadioGroup
            value={formData.jenisKelamin}
            onValueChange={(value) => onChange('jenisKelamin', value as Gender)}
            className="grid gap-2 sm:grid-cols-2"
          >
            <Label
              htmlFor="gender-male"
              className="flex items-center space-x-3 rounded-lg border-2 border-muted p-3 cursor-pointer hover:border-primary/50 transition-colors [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5"
            >
              <RadioGroupItem value="LAKI_LAKI" id="gender-male" />
              <span className="text-sm">Laki-laki</span>
            </Label>
            <Label
              htmlFor="gender-female"
              className="flex items-center space-x-3 rounded-lg border-2 border-muted p-3 cursor-pointer hover:border-primary/50 transition-colors [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5"
            >
              <RadioGroupItem value="PEREMPUAN" id="gender-female" />
              <span className="text-sm">Perempuan</span>
            </Label>
          </RadioGroup>
        </div>

        {/* Tempat & Tanggal Lahir */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="tempatLahir" className="text-base font-medium">Tempat Lahir *</Label>
            <Input
              id="tempatLahir"
              placeholder="Kota kelahiran"
              value={formData.tempatLahir || ''}
              onChange={(e) => onChange('tempatLahir', e.target.value)}
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tanggalLahir" className="text-base font-medium">Tanggal Lahir *</Label>
            <Input
              id="tanggalLahir"
              type="date"
              value={formData.tanggalLahir || ''}
              onChange={(e) => onChange('tanggalLahir', e.target.value)}
              className="h-12"
            />
          </div>
        </div>

        {/* Tinggi Badan & Pekerjaan */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="tinggiBadan" className="text-base font-medium">Tinggi Badan (cm) *</Label>
            <Input
              id="tinggiBadan"
              type="number"
              placeholder="Contoh: 170"
              value={formData.tinggiBadan || ''}
              onChange={(e) => onChange('tinggiBadan', e.target.value)}
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pekerjaan" className="text-base font-medium">Pekerjaan *</Label>
            <Input
              id="pekerjaan"
              placeholder="Contoh: Karyawan Swasta"
              value={formData.pekerjaan || ''}
              onChange={(e) => onChange('pekerjaan', e.target.value)}
              className="h-12"
            />
          </div>
        </div>

        {/* Telepon */}
        <div className="space-y-2">
          <Label htmlFor="telepon" className="text-base font-medium">Nomor Telepon/HP *</Label>
          <Input
            id="telepon"
            type="tel"
            placeholder="Contoh: 081234567890"
            value={formData.telepon || ''}
            onChange={(e) => onChange('telepon', e.target.value)}
            className="h-12"
          />
        </div>

        {/* Alamat */}
        <div className="space-y-2">
          <Label htmlFor="alamat" className="text-base font-medium">Alamat Lengkap *</Label>
          <Textarea
            id="alamat"
            placeholder="Masukkan alamat lengkap sesuai KTP"
            value={formData.alamat || ''}
            onChange={(e) => onChange('alamat', e.target.value)}
            className="min-h-[100px] resize-none"
          />
        </div>

        {/* Pendidikan Terakhir */}
        <div className="space-y-2">
          <Label htmlFor="pendidikan" className="text-base font-medium">Pendidikan Terakhir *</Label>
          <Select value={formData.pendidikanTerakhir} onValueChange={(value) => onChange('pendidikanTerakhir', value)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Pilih pendidikan terakhir" />
            </SelectTrigger>
            <SelectContent>
              {EDUCATION_OPTIONS.map((edu) => (
                <SelectItem key={edu} value={edu}>{edu}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Yes/No Questions */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Foto KTP */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Foto Copy KTP *</Label>
            <RadioGroup
              value={formData.fotoKTP}
              onValueChange={(value) => onChange('fotoKTP', value as HasOrNot)}
              className="flex gap-4"
            >
              <Label
                htmlFor="ktp-ada"
                className="flex items-center space-x-2 rounded-lg border-2 border-muted px-4 py-2 cursor-pointer hover:border-primary/50 transition-colors [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5"
              >
                <RadioGroupItem value="ADA" id="ktp-ada" />
                <span className="text-sm">Ada</span>
              </Label>
              <Label
                htmlFor="ktp-tidak"
                className="flex items-center space-x-2 rounded-lg border-2 border-muted px-4 py-2 cursor-pointer hover:border-primary/50 transition-colors [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5"
              >
                <RadioGroupItem value="TIDAK_ADA" id="ktp-tidak" />
                <span className="text-sm">Tidak Ada</span>
              </Label>
            </RadioGroup>
          </div>

          {/* Berkacamata */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Berkacamata *</Label>
            <RadioGroup
              value={formData.berkacamata}
              onValueChange={(value) => onChange('berkacamata', value as YesNo)}
              className="flex gap-4"
            >
              <Label
                htmlFor="kacamata-ya"
                className="flex items-center space-x-2 rounded-lg border-2 border-muted px-4 py-2 cursor-pointer hover:border-primary/50 transition-colors [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5"
              >
                <RadioGroupItem value="YA" id="kacamata-ya" />
                <span className="text-sm">Ya</span>
              </Label>
              <Label
                htmlFor="kacamata-tidak"
                className="flex items-center space-x-2 rounded-lg border-2 border-muted px-4 py-2 cursor-pointer hover:border-primary/50 transition-colors [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5"
              >
                <RadioGroupItem value="TIDAK" id="kacamata-tidak" />
                <span className="text-sm">Tidak</span>
              </Label>
            </RadioGroup>
          </div>

          {/* Cacat Fisik */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Cacat Fisik *</Label>
            <RadioGroup
              value={formData.cacatFisik}
              onValueChange={(value) => onChange('cacatFisik', value as YesNo)}
              className="flex gap-4"
            >
              <Label
                htmlFor="cacat-ya"
                className="flex items-center space-x-2 rounded-lg border-2 border-muted px-4 py-2 cursor-pointer hover:border-primary/50 transition-colors [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5"
              >
                <RadioGroupItem value="YA" id="cacat-ya" />
                <span className="text-sm">Ya</span>
              </Label>
              <Label
                htmlFor="cacat-tidak"
                className="flex items-center space-x-2 rounded-lg border-2 border-muted px-4 py-2 cursor-pointer hover:border-primary/50 transition-colors [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5"
              >
                <RadioGroupItem value="TIDAK" id="cacat-tidak" />
                <span className="text-sm">Tidak</span>
              </Label>
            </RadioGroup>
          </div>

          {/* Sertifikat Mengemudi */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Sertifikat Mengemudi *</Label>
            <RadioGroup
              value={formData.sertifikatMengemudi}
              onValueChange={(value) => onChange('sertifikatMengemudi', value as HasOrNot)}
              className="flex gap-4"
            >
              <Label
                htmlFor="sertifikat-ada"
                className="flex items-center space-x-2 rounded-lg border-2 border-muted px-4 py-2 cursor-pointer hover:border-primary/50 transition-colors [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5"
              >
                <RadioGroupItem value="ADA" id="sertifikat-ada" />
                <span className="text-sm">Ada</span>
              </Label>
              <Label
                htmlFor="sertifikat-tidak"
                className="flex items-center space-x-2 rounded-lg border-2 border-muted px-4 py-2 cursor-pointer hover:border-primary/50 transition-colors [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5"
              >
                <RadioGroupItem value="TIDAK_ADA" id="sertifikat-tidak" />
                <span className="text-sm">Tidak Ada</span>
              </Label>
            </RadioGroup>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
