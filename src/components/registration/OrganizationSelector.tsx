import { Building2, MapPin, Phone, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Organization, AvailabilitySlot } from '@/types/registration';
import { cn } from '@/lib/utils';

interface OrganizationSelectorProps {
  organizations: Organization[];
  slots: AvailabilitySlot[];
  selectedOrgId: string | null;
  selectedSlotId: string | null;
  onSelectOrganization: (orgId: string) => void;
  onSelectSlot: (slotId: string) => void;
}

export function OrganizationSelector({
  organizations,
  slots,
  selectedOrgId,
  selectedSlotId,
  onSelectOrganization,
  onSelectSlot,
}: OrganizationSelectorProps) {
  const activeOrganizations = organizations.filter(org => org.isActive);
  const selectedOrgSlots = slots.filter(slot => slot.organizationId === selectedOrgId);

  // Group slots by date
  const slotsByDate = selectedOrgSlots.reduce((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = [];
    }
    acc[slot.date].push(slot);
    return acc;
  }, {} as Record<string, AvailabilitySlot[]>);

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
    <div className="space-y-6">
      {/* Organization Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-foreground">Pilih Polres</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {activeOrganizations.map((org) => (
            <Card
              key={org.id}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-card-hover",
                selectedOrgId === org.id
                  ? "ring-2 ring-primary shadow-glow bg-primary/5"
                  : "hover:border-primary/50"
              )}
              onClick={() => onSelectOrganization(org.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{org.name}</CardTitle>
                      <CardDescription className="text-xs">{org.code}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={selectedOrgId === org.id ? "default" : "secondary"} className="text-xs">
                    {org.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="space-y-1.5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="text-xs">{org.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" />
                    <span className="text-xs">{org.phone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Availability Slots */}
      {selectedOrgId && (
        <div className="animate-fade-in">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Pilih Jadwal Kedatangan</h3>
          {Object.keys(slotsByDate).length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">Tidak ada jadwal tersedia untuk lokasi ini.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {Object.entries(slotsByDate).map(([date, dateSlots]) => (
                <div key={date}>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    {formatDate(date)}
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {dateSlots.map((slot) => {
                      const isFull = slot.booked >= slot.capacity;
                      const availability = slot.capacity - slot.booked;
                      const availabilityPercent = (slot.booked / slot.capacity) * 100;

                      return (
                        <div
                          key={slot.id}
                          className={cn(
                            "availability-slot",
                            isFull ? "full" : selectedSlotId === slot.id ? "selected" : "available"
                          )}
                          onClick={() => !isFull && onSelectSlot(slot.id)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-foreground">{slot.time}</span>
                            <Badge 
                              variant={isFull ? "secondary" : availability <= 10 ? "destructive" : "default"}
                              className="text-xs"
                            >
                              {isFull ? 'Penuh' : `${availability} slot`}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <Users className="h-3.5 w-3.5" />
                            <span>{slot.booked} / {slot.capacity} terdaftar</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5">
                            <div
                              className={cn(
                                "h-1.5 rounded-full transition-all",
                                isFull ? "bg-destructive" : availabilityPercent > 80 ? "bg-warning" : "bg-success"
                              )}
                              style={{ width: `${availabilityPercent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
