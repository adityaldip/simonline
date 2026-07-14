import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfilePage() {
  const { claims } = useAuth();

  const roleLabel = claims?.globalRole === "SUPERADMIN" ? "Superadmin" : "Admin Organisasi";

  return (
    <AdminLayout role={claims?.globalRole === "SUPERADMIN" ? "SUPERADMIN" : "ADMIN"}>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Profil</h1>
          <p className="text-muted-foreground">Informasi sesi login aktif</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detail Akses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Role:</span>
              <Badge>{roleLabel}</Badge>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">User ID:</span> {claims?.sub ?? "-"}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Tenant Aktif:</span>{" "}
              {claims?.activeTenantId ?? "Tidak ada"}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Mode:</span> {claims?.actingMode ?? "-"}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
