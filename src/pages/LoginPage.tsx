import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // Prefill dev credentials so you don't retype them every login. Dev builds only.
  const [email, setEmail] = useState(import.meta.env.DEV ? "superadmin@ditlantas.poldajateng.go.id" : "");
  const [password, setPassword] = useState(import.meta.env.DEV ? "ChangeMe123!" : "");
  const [activeTenantId, setActiveTenantId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const claims = await login({
        email,
        password,
        activeTenantId: activeTenantId.trim() || undefined,
      });
      toast.success("Login berhasil");
      const from = (location.state as { from?: string } | null)?.from;
      const fallback = claims.globalRole === "SUPERADMIN" ? "/superadmin" : "/admin";
      navigate(from ?? fallback, { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login gagal";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Login Admin</CardTitle>
              <CardDescription>Masuk sebagai superadmin atau admin organisasi</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="superadmin@ditlantas.poldajateng.go.id"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="********"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tenantId">Organization ID (opsional)</Label>
              <Input
                id="tenantId"
                value={activeTenantId}
                onChange={(event) => setActiveTenantId(event.target.value)}
                placeholder="org-1"
              />
              <p className="text-xs text-muted-foreground">
                Untuk superadmin: isi agar langsung masuk ke konteks admin organisasi.
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Memproses..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
