import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Download, QrCode, Calendar, MapPin, Copy } from 'lucide-react';
import { toast } from 'sonner';
import type { Organization, AvailabilitySlot } from '@/types/registration';

interface RegistrationSuccessProps {
  registrationNumber: string;
  organization: Organization | undefined;
  slot: AvailabilitySlot | undefined;
  onNewRegistration: () => void;
}

export function RegistrationSuccess({
  registrationNumber,
  organization,
  slot,
  onNewRegistration,
}: RegistrationSuccessProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(registrationNumber);
    toast.success('Nomor registrasi berhasil disalin!');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-lg w-full animate-scale-in shadow-xl">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
          <CardTitle className="text-2xl">Pendaftaran Berhasil!</CardTitle>
          <CardDescription>
            Simpan nomor registrasi Anda untuk keperluan verifikasi
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Registration Number */}
          <div className="p-4 rounded-lg bg-primary/5 border-2 border-primary/20">
            <p className="text-sm text-muted-foreground text-center mb-2">Nomor Registrasi</p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-2xl font-bold tracking-wider text-primary">
                {registrationNumber}
              </p>
              <Button variant="ghost" size="icon" onClick={handleCopy} className="h-8 w-8">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* QR Code Placeholder */}
          <div className="flex justify-center">
            <div className="p-6 rounded-lg border-2 border-dashed border-muted flex flex-col items-center gap-2">
              <QrCode className="h-24 w-24 text-muted-foreground/50" />
              <p className="text-xs text-muted-foreground">QR Code akan dikirim via email</p>
            </div>
          </div>

          {/* Schedule Info */}
          {organization && slot && (
            <div className="space-y-3 p-4 rounded-lg bg-muted/50">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">{organization.name}</p>
                  <p className="text-sm text-muted-foreground">{organization.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">{formatDate(slot.date)}</p>
                  <Badge variant="default" className="mt-1">{slot.time} WIB</Badge>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button size="lg" className="w-full gap-2">
              <Download className="h-4 w-4" />
              Unduh Bukti Registrasi
            </Button>
            <Button variant="outline" size="lg" className="w-full" onClick={onNewRegistration}>
              Daftar Lagi
            </Button>
          </div>

          {/* Info */}
          <p className="text-xs text-center text-muted-foreground">
            Bukti registrasi juga telah dikirim ke email Anda. Mohon tunjukkan QR code saat kedatangan.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
