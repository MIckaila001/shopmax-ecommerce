"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock, Send, Loader2, Check, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    // TODO: POST /api/contact
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSending(false);
    setSent(true);
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Téléphone",
      lines: ["+237 6 00 00 00 00", "+237 6 11 11 11 11"],
      color: "text-blue-600 bg-blue-50",
    },
    {
      icon: Mail,
      title: "Email",
      lines: ["contact@shopmax.cm", "support@shopmax.cm"],
      color: "text-green-600 bg-green-50",
    },
    {
      icon: MapPin,
      title: "Adresse",
      lines: ["Yaoundé, Cameroun", "Carrefour Bastos"],
      color: "text-red-600 bg-red-50",
    },
    {
      icon: Clock,
      title: "Horaires",
      lines: ["Lun - Sam : 8h - 20h", "Dim : 10h - 18h"],
      color: "text-purple-600 bg-purple-50",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">Accueil</Link>
        <span className="mx-2">/</span>
        <span className="text-dark font-medium">Contact</span>
      </nav>

      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Contactez-nous</h1>
        <p className="text-gray-500">
          Une question ? Notre équipe est là pour vous aider.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Infos de contact */}
        <div className="lg:col-span-1 space-y-3">
          {contactInfo.map((info) => {
            const Icon = info.icon;
            return (
              <Card key={info.title}>
                <CardContent className="p-4 flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg ${info.color} flex items-center justify-center shrink-0`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{info.title}</p>
                    {info.lines.map((line) => (
                      <p key={line} className="text-xs text-gray-500 mt-0.5">{line}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-600 text-white flex items-center justify-center shrink-0">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-sm">WhatsApp</p>
                <p className="text-xs text-gray-600 mt-0.5">
                  Réponse rapide par message
                </p>
                <a
                  href="https://wa.me/237600000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-green-600 font-medium hover:underline"
                >
                  Discuter sur WhatsApp →
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Formulaire */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Envoyez-nous un message</h2>

              {sent && (
                <div className="mb-4 p-3 bg-success/10 border border-success/20 rounded-md flex items-start gap-2">
                  <Check className="h-5 w-5 text-success shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-success">
                      Message envoyé avec succès !
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Nous vous répondrons dans les plus brefs délais.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-1.5">Nom complet</label>
                    <Input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Votre nom"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1.5">Email</label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="email@exemple.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1.5">Sujet</label>
                  <Input
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Sujet de votre message"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1.5">Message</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={6}
                    placeholder="Écrivez votre message ici..."
                    className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <Button type="submit" size="lg" disabled={isSending}>
                  {isSending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Envoyer le message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
