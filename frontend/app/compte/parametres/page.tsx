"use client";

import { useState } from "react";
import { Bell, Mail, MessageSquare, Globe, Moon, Shield, Trash2, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [prefs, setPrefs] = useState({
    orderEmails: true,
    promoEmails: false,
    newsletter: true,
    orderSms: true,
    deliverySms: true,
    darkMode: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggle = (key: keyof typeof prefs) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors ${
        checked ? "bg-primary" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
          checked ? "translate-x-5" : ""
        }`}
      />
    </button>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Paramètres</h1>
        <p className="text-gray-500 mt-1">Personnalisez votre expérience</p>
      </div>

      {/* Notifications email */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
            <Mail className="h-5 w-5" /> Notifications par email
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Choisissez les emails que vous souhaitez recevoir
          </p>

          <div className="space-y-3">
            {[
              { key: "orderEmails" as const, label: "Confirmations de commande", sub: "Statut de vos commandes" },
              { key: "promoEmails" as const, label: "Offres promotionnelles", sub: "Réductions exclusives" },
              { key: "newsletter" as const, label: "Newsletter", sub: "Nouveautés et conseils" },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div>
                  <p className="font-medium text-sm">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.sub}</p>
                </div>
                <Toggle checked={prefs[item.key]} onChange={() => toggle(item.key)} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notifications SMS */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
            <MessageSquare className="h-5 w-5" /> Notifications par SMS
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Recevez des alertes sur votre téléphone
          </p>

          <div className="space-y-3">
            {[
              { key: "orderSms" as const, label: "Confirmations de commande", sub: "Par SMS" },
              { key: "deliverySms" as const, label: "Suivi de livraison", sub: "Notifications de passage du livreur" },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div>
                  <p className="font-medium text-sm">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.sub}</p>
                </div>
                <Toggle checked={prefs[item.key]} onChange={() => toggle(item.key)} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Préférences d'affichage */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
            <Globe className="h-5 w-5" /> Préférences
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Langue et apparence
          </p>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium text-sm">Langue</p>
                <p className="text-xs text-gray-500">Langue de l&apos;interface</p>
              </div>
              <select className="border rounded-md px-3 py-1.5 text-sm bg-white">
                <option>Français</option>
                <option>English</option>
                <option>العربية</option>
              </select>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-sm flex items-center gap-1">
                  <Moon className="h-4 w-4" /> Mode sombre
                </p>
                <p className="text-xs text-gray-500">Bientôt disponible</p>
              </div>
              <Toggle checked={prefs.darkMode} onChange={() => toggle("darkMode")} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sécurité */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
            <Shield className="h-5 w-5" /> Sécurité
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Protégez votre compte
          </p>

          <div className="space-y-2">
            <Button variant="outline" className="w-full sm:w-auto">
              Activer la double authentification
            </Button>
            <Button variant="outline" className="w-full sm:w-auto">
              Voir les appareils connectés
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Zone dangereuse */}
      <Card className="border-destructive/30">
        <CardContent className="p-6">
          <h2 className="text-lg font-bold mb-1 text-destructive">Zone dangereuse</h2>
          <p className="text-sm text-gray-500 mb-4">
            Actions irréversibles sur votre compte
          </p>

          <Button variant="outline" className="text-destructive border-destructive/30">
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer mon compte
          </Button>
        </CardContent>
      </Card>

      {/* Save button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} size="lg">
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Enregistrement...
            </>
          ) : saved ? (
            "✓ Enregistré"
          ) : (
            "Enregistrer les modifications"
          )}
        </Button>
      </div>
    </div>
  );
}
