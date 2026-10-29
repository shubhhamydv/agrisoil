import { Layout } from "@/components/Layout";
import { useTranslation } from "react-i18next";
import { Leaf, Users, Globe, Target } from "lucide-react";

export default function AboutPage() {
  const { t } = useTranslation();
  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">{t("nav.about")}</h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          AgriSoil is an intelligent agriculture technology platform that delivers precision fertilizer recommendations to farmers across India. Our mission is to help every farmer maximize their yield while minimizing costs and environmental impact.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {[
            { icon: Target, title: "Mission", desc: "Democratize agricultural science by making soil analysis accessible to every farmer, regardless of their technical literacy." },
            { icon: Users, title: "Built for Farmers", desc: "Designed with large buttons, simple language, and voice assistance for farmers with varying levels of digital literacy." },
            { icon: Globe, title: "Multilingual", desc: "Available in 8 Indian languages to ensure accessibility across all regions." },
            { icon: Leaf, title: "Sustainable", desc: "Every recommendation includes organic alternatives to promote sustainable farming practices." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl border border-border bg-card p-6 shadow-ceramic">
              <Icon className="mb-4 h-8 w-8 text-primary" strokeWidth={2} />
              <h3 className="text-lg font-bold text-foreground">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
