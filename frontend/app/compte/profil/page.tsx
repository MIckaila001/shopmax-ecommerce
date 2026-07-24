"use client";

import { useState } from "react";
import { User, Mail, Phone, Save, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/hooks/use-auth";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // TODO: PATCH /api/users/me
    await new Promise((resolve) => setTimeout(resolve, 800));
    updateUser(form);
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const getInitials = () => {
    return `${form.firstName[0] ?? ""}${form.lastName[0] ?? ""}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Informations personnelles</h1>
        <p className="text-gray-500 mt-1">
          Mettez à jour vos informations de profil
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b">
            <div className="w-20 h-20 rounded-full bg-primary text-dark font-bold flex items-center justify-center text-2xl">
              {getInitials()}
            </div>
            <div>
              <p className="font-bold">
                {form.firstName} {form.lastName}
              </p>
              <p className="text-sm text-gray-500">{form.email}</p>
              <Button size="sm" variant="outline" className="mt-2">
                Changer la photo
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1.5">Prénom</label>
                <Input
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5">Nom</label>
                <Input
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1.5">Téléphone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="pl-10"
                  placeholder="+237 6 XX XX XX XX"
                />
              </div>
            </div>

            {saved && (
              <div className="p-3 bg-success/10 border border-success/20 rounded-md">
                <p className="text-sm text-success font-medium">
                  ✓ Vos informations ont été enregistrées
                </p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Section sécurité */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-bold mb-1">Sécurité</h2>
          <p className="text-sm text-gray-500 mb-4">
            Gérez votre mot de passe et la sécurité de votre compte
          </p>

          <Button variant="outline">Changer le mot de passe</Button>
        </CardContent>
      </Card>
    </div>
  );
}
