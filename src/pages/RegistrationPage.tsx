import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FormSteps } from '@/components/registration/FormSteps';
import { Step1DataPeserta } from '@/components/registration/Step1DataPeserta';
import { Step2DataPribadi } from '@/components/registration/Step2DataPribadi';
import { Step3Confirmation } from '@/components/registration/Step3Confirmation';
import { OrganizationSelector } from '@/components/registration/OrganizationSelector';
import { RegistrationSuccess } from '@/components/registration/RegistrationSuccess';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Send, Building2, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockOrganizations, mockAvailabilitySlots } from '@/data/mockData';
import type { RegistrationFormData } from '@/types/registration';
import { toast } from 'sonner';

const STEPS = [
  { id: 1, title: 'Pilih Lokasi', description: 'Jadwal kedatangan' },
  { id: 2, title: 'Data Permohonan', description: 'Jenis & golongan SIM' },
  { id: 3, title: 'Data Pribadi', description: 'Informasi pemohon' },
  { id: 4, title: 'Konfirmasi', description: 'Verifikasi data' },
];

export default function RegistrationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<RegistrationFormData>>({});
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [registrationNumber, setRegistrationNumber] = useState('');

  const handleFieldChange = (field: keyof RegistrationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectOrganization = (orgId: string) => {
    setSelectedOrgId(orgId);
    setSelectedSlotId(null);
  };

  const handleSelectSlot = (slotId: string) => {
    setSelectedSlotId(slotId);
    setFormData(prev => ({ ...prev, organizationId: selectedOrgId!, selectedSlot: slotId }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    // Generate registration number
    const regNumber = `SIM-2026-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`;
    setRegistrationNumber(regNumber);
    setIsSubmitted(true);
    toast.success('Pendaftaran berhasil!');
  };

  const handleNewRegistration = () => {
    setFormData({});
    setSelectedOrgId(null);
    setSelectedSlotId(null);
    setCurrentStep(1);
    setIsSubmitted(false);
    setRegistrationNumber('');
  };

  const selectedOrganization = mockOrganizations.find(org => org.id === selectedOrgId);
  const selectedSlot = mockAvailabilitySlots.find(slot => slot.id === selectedSlotId);

  if (isSubmitted) {
    return (
      <RegistrationSuccess
        registrationNumber={registrationNumber}
        organization={selectedOrganization}
        slot={selectedSlot}
        onNewRegistration={handleNewRegistration}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-hero-gradient text-white">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/10">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">DITLANTAS POLDA JATENG</h1>
                <p className="text-sm text-white/90">Pendaftaran SIM Online</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/admin">
                <Button variant="ghost" size="sm" className="text-white/90 hover:text-white hover:bg-white/10">
                  <Building2 className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-hero-gradient text-white pb-24 pt-8">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Formulir Pendaftaran SIM</h2>
          <p className="text-white/90 max-w-2xl mx-auto">
            Daftarkan permohonan SIM baru atau perpanjangan dengan mudah dan cepat
          </p>
        </div>
      </div>

      {/* Main Form */}
      <main className="container -mt-16 pb-12">
        <Card className="shadow-xl">
          <CardHeader className="border-b">
            <FormSteps steps={STEPS} currentStep={currentStep} />
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            {/* Step 1: Pilih Lokasi */}
            {currentStep === 1 && (
              <div className="animate-slide-up">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle>Pilih Lokasi & Jadwal</CardTitle>
                        <CardDescription>Pilih Polres dan jadwal kedatangan yang tersedia</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <OrganizationSelector
                      organizations={mockOrganizations}
                      slots={mockAvailabilitySlots}
                      selectedOrgId={selectedOrgId}
                      selectedSlotId={selectedSlotId}
                      onSelectOrganization={handleSelectOrganization}
                      onSelectSlot={handleSelectSlot}
                    />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 2: Data Permohonan */}
            {currentStep === 2 && (
              <Step1DataPeserta formData={formData} onChange={handleFieldChange} />
            )}

            {/* Step 3: Data Pribadi */}
            {currentStep === 3 && (
              <Step2DataPribadi formData={formData} onChange={handleFieldChange} />
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <Step3Confirmation
                formData={formData}
                organization={selectedOrganization}
                slot={selectedSlot}
              />
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </Button>

              {currentStep < 4 ? (
                <Button
                  onClick={handleNext}
                  disabled={currentStep === 1 && !selectedSlotId}
                  className="gap-2"
                  size="lg"
                >
                  Lanjut
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="gap-2"
                  size="lg"
                  variant="hero"
                >
                  <Send className="h-4 w-4" />
                  Kirim Pendaftaran
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <div className="container">
          <p>© 2026 DITLANTAS POLDA JATENG. Semua hak dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}
