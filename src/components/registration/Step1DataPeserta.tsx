import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ApplicationType,
  SIMCategory,
  LocationType,
  APPLICATION_TYPE_LABELS,
  SIM_CATEGORY_LABELS,
  LOCATION_TYPE_LABELS,
} from '@/types/registration';
import type { RegistrationFormData } from '@/types/registration';
import { FileText } from 'lucide-react';

interface Step1DataPesertaProps {
  formData: Partial<RegistrationFormData>;
  onChange: (field: keyof RegistrationFormData, value: string) => void;
}

export function Step1DataPeserta({ formData, onChange }: Step1DataPesertaProps) {
  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>Data Peserta Uji</CardTitle>
            <CardDescription>Informasi permohonan SIM Anda</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Jenis Permohonan */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Jenis Permohonan *</Label>
          <RadioGroup
            value={formData.jenisPermohonan}
            onValueChange={(value) => onChange('jenisPermohonan', value)}
            className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3"
          >
            {Object.entries(APPLICATION_TYPE_LABELS).map(([value, label]) => (
              <Label
                key={value}
                htmlFor={`jenis-${value}`}
                className="flex items-center space-x-3 rounded-lg border-2 border-muted p-3 cursor-pointer hover:border-primary/50 transition-colors [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5"
              >
                <RadioGroupItem value={value} id={`jenis-${value}`} />
                <span className="text-sm">{label}</span>
              </Label>
            ))}
          </RadioGroup>
        </div>

        {/* Golongan SIM */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Golongan SIM *</Label>
          <Select value={formData.golonganSIM} onValueChange={(value) => onChange('golonganSIM', value)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Pilih golongan SIM" />
            </SelectTrigger>
            <SelectContent>
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">SIM Perseorangan</div>
              {(['A', 'BI'] as SIMCategory[]).map((cat) => (
                <SelectItem key={cat} value={cat}>{SIM_CATEGORY_LABELS[cat]}</SelectItem>
              ))}
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t mt-1 pt-2">SIM Umum</div>
              {(['A_UMUM', 'BI_UMUM', 'BII', 'BII_UMUM', 'C', 'D', 'DI'] as SIMCategory[]).map((cat) => (
                <SelectItem key={cat} value={cat}>{SIM_CATEGORY_LABELS[cat]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-base font-medium">Alamat Email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="contoh@email.com"
            value={formData.email || ''}
            onChange={(e) => onChange('email', e.target.value)}
            className="h-12"
          />
        </div>

        {/* POLDA */}
        <div className="space-y-2">
          <Label htmlFor="polda" className="text-base font-medium">POLDA Kedatangan *</Label>
          <Input
            id="polda"
            placeholder="Contoh: POLDA Jawa Tengah"
            value={formData.polda || ''}
            onChange={(e) => onChange('polda', e.target.value)}
            className="h-12"
          />
        </div>

        {/* Lokasi Kedatangan */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Lokasi Kedatangan *</Label>
          <RadioGroup
            value={formData.lokasiKedatangan}
            onValueChange={(value) => onChange('lokasiKedatangan', value)}
            className="grid gap-2 sm:grid-cols-4"
          >
            {Object.entries(LOCATION_TYPE_LABELS).map(([value, label]) => (
              <Label
                key={value}
                htmlFor={`lokasi-${value}`}
                className="flex items-center space-x-3 rounded-lg border-2 border-muted p-3 cursor-pointer hover:border-primary/50 transition-colors [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5"
              >
                <RadioGroupItem value={value} id={`lokasi-${value}`} />
                <span className="text-sm">{label}</span>
              </Label>
            ))}
          </RadioGroup>
          {formData.lokasiKedatangan === 'LAINNYA' && (
            <Input
              placeholder="Sebutkan lokasi lainnya"
              value={formData.lokasiLainnya || ''}
              onChange={(e) => onChange('lokasiLainnya', e.target.value)}
              className="h-12 mt-2 animate-fade-in"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
