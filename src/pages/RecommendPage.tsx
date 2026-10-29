import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Beaker, Loader2, Volume2, Download, Save, ThumbsUp, ThumbsDown,
  AlertTriangle, CheckCircle, Info, Leaf, TrendingUp, Clock, Shield, DollarSign, Sprout,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Layout } from "@/components/Layout";
import { getRecommendation, type SoilInput, type Recommendation } from "@/lib/recommendation-engine";
import { toast } from "sonner";

const cardSpring = { type: "spring" as const, stiffness: 300, damping: 30 };

type BackendPrediction = {
  recommended_fertilizer: string;
  confidence: number | null;
};

export default function RecommendPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Recommendation | null>(null);
  const [error, setError] = useState<string | null>(null);

const [form, setForm] = useState<SoilInput>({
  soilType: "Loamy",
  cropType: "Wheat",
  nitrogen: 30,
  phosphorus: 25,
  potassium: 28,
  ph: 6.5,
  temperature: 28,
  humidity: 65,
  moisture: 40,
  rainfall: 800,
  season: "Rabi",
  region: "Punjab",
});

  const updateForm = (key: keyof SoilInput, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const soilTypes = ["Clay", "Sandy", "Silt", "Loamy"] as const;
const cropTypes = ["Wheat", "Rice", "Maize", "Cotton", "Sugarcane", "Potato", "Tomato"] as const;
const seasons = ["Kharif", "Rabi", "Zaid"] as const;

  const getNutrientColor = (value: number, optimal: number) => {
    const ratio = value / optimal;
    if (ratio >= 0.9) return "bg-primary";
    if (ratio >= 0.6) return "bg-gold";
    return "bg-terracotta";
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          soil_type: form.soilType,
          crop_type: form.cropType,
          nitrogen: Number(form.nitrogen),
          phosphorus: Number(form.phosphorus),
          potassium: Number(form.potassium),
          ph: Number(form.ph),
          temperature: Number(form.temperature),
          humidity: Number(form.humidity),
          moisture: Number(form.moisture),
          rainfall: Number(form.rainfall),
          season: form.season,
        }),
      });

      if (!response.ok) {
        throw new Error("Backend prediction failed");
      }

      const data: BackendPrediction = await response.json();

      // Keep old logic temporarily for explanation/details in the UI
      const localExplanation = getRecommendation(form);

      const mergedResult: Recommendation = {
        ...localExplanation,
        fertilizer: data.recommended_fertilizer,
        confidence: data.confidence ?? localExplanation.confidence,
      };

      setResult(mergedResult);
      toast.success("ML prediction generated successfully");
    } catch (err) {
      console.error(err);
      setError("Could not connect to backend. Showing local recommendation instead.");

      // Fallback to old TS logic if backend fails
      const fallback = getRecommendation(form);
      setResult(fallback);

      toast.error("Backend unavailable. Used local recommendation logic.");
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = () => {
    if (!result) return;
    const text = `${t("result.fertilizer")}: ${result.fertilizer}. ${result.reason}. ${t("result.dosage")}: ${result.dosage}. ${t("result.timing")}: ${result.timing}.`;
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
    toast.success("Reading aloud...");
  };

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl" style={{ letterSpacing: "-0.03em" }}>
            {t("recommend.title")}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">{t("recommend.subtitle")}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">{t("recommend.soilType")}</Label>
                <Select value={form.soilType} onValueChange={(v) => updateForm("soilType", v)}>
                  <SelectTrigger className="h-14 text-base"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {soilTypes.map((s) => <SelectItem key={s} value={s}>{t(`recommend.soilTypes.${s}`)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">{t("recommend.cropType")}</Label>
                <Select value={form.cropType} onValueChange={(v) => updateForm("cropType", v)}>
                  <SelectTrigger className="h-14 text-base"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {cropTypes.map((c) => <SelectItem key={c} value={c}>{t(`recommend.cropTypes.${c}`)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-ceramic space-y-6">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Beaker className="h-5 w-5 text-primary" strokeWidth={2} /> N-P-K Values
              </h3>
              {([
                { key: "nitrogen" as const, label: t("recommend.nitrogen"), max: 100, optimal: 40 },
                { key: "phosphorus" as const, label: t("recommend.phosphorus"), max: 100, optimal: 35 },
                { key: "potassium" as const, label: t("recommend.potassium"), max: 100, optimal: 35 },
              ]).map(({ key, label, max, optimal }) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-foreground">{label}</Label>
                    <span className={`font-mono-data text-sm font-bold px-2 py-0.5 rounded ${getNutrientColor(form[key] as number, optimal)} text-primary-foreground`}>
                      {form[key]}
                    </span>
                  </div>
                  <Slider value={[form[key] as number]} max={max} step={1} onValueChange={([v]) => updateForm(key, v)} className="py-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Low</span><span>Optimal ({optimal})</span><span>High</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-ceramic space-y-6">
              <h3 className="font-bold text-foreground">Environment</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {([
                  { key: "ph" as const, label: t("recommend.ph"), max: 14, step: 0.1 },
                  { key: "temperature" as const, label: t("recommend.temperature"), max: 50, step: 1 },
                  { key: "humidity" as const, label: t("recommend.humidity"), max: 100, step: 1 },
                  { key: "moisture" as const, label: t("recommend.moisture"), max: 100, step: 1 },
                  { key: "rainfall" as const, label: t("recommend.rainfall"), max: 3000, step: 10 },
                ]).map(({ key, label, max, step }) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-sm font-medium text-foreground">{label}</Label>
                      <span className="font-mono-data text-sm font-semibold text-foreground">{form[key]}</span>
                    </div>
                    <Slider value={[form[key] as number]} max={max} step={step} onValueChange={([v]) => updateForm(key, v)} />
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">{t("recommend.season")}</Label>
                <Select value={form.season} onValueChange={(v) => updateForm("season", v)}>
                  <SelectTrigger className="h-14 text-base"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {seasons.map((s) => <SelectItem key={s} value={s}>{t(`recommend.seasons.${s}`)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading}
              size="lg"
              className="w-full bg-primary text-primary-foreground font-bold text-lg py-6 rounded-lg hover:bg-primary/90 active:scale-95 transition-transform"
            >
              {loading ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> {t("recommend.scanning")}</>
              ) : (
                <>{t("recommend.submit")}</>
              )}
            </Button>

            {error && (
              <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {error}
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-16 shadow-ceramic"
              >
                <div className="relative">
                  <div className="h-20 w-20 rounded-full border-4 border-primary/20 animate-pulse" />
                  <Beaker className="absolute inset-0 m-auto h-10 w-10 text-primary animate-bounce" strokeWidth={2} />
                </div>
                <p className="mt-6 text-lg font-semibold text-foreground">{t("recommend.scanning")}</p>
                <p className="mt-2 text-sm text-muted-foreground">Analyzing using ML backend...</p>
              </motion.div>
            )}

            {!loading && result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={cardSpring}
                className="space-y-4 animate-pulse-green rounded-2xl"
              >
                <div className="rounded-xl border border-border bg-card p-6 shadow-ceramic-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{t("result.fertilizer")}</p>
                      <h2 className="mt-1 text-3xl font-bold text-foreground">{result.fertilizer}</h2>
                      <span className="mt-2 inline-block rounded-full bg-primary/10 px-3 py-1 font-mono-data text-sm font-bold text-primary">
                        {result.formulaCode}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{t("result.confidence")}</p>
                      <p className="font-mono-data text-2xl font-bold text-primary">{result.confidence.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-5 shadow-ceramic">
                  <div className="flex items-center gap-3">
                    {result.soilHealth === "good" ? (
                      <CheckCircle className="h-6 w-6 text-primary" strokeWidth={2} />
                    ) : result.soilHealth === "moderate" ? (
                      <Info className="h-6 w-6 text-gold" strokeWidth={2} />
                    ) : (
                      <AlertTriangle className="h-6 w-6 text-terracotta" strokeWidth={2} />
                    )}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{t("result.soilHealth")}</p>
                      <p className="font-semibold text-foreground">{result.soilHealthDesc}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    {[
                      { label: "N", def: result.nDeficient },
                      { label: "P", def: result.pDeficient },
                      { label: "K", def: result.kDeficient },
                    ].map(({ label, def }) => (
                      <span
                        key={label}
                        className={`rounded-full px-3 py-1 font-mono-data text-xs font-bold ${def ? "bg-terracotta/10 text-terracotta" : "bg-primary/10 text-primary"}`}
                      >
                        {label}: {def ? "Low" : "OK"}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-5 shadow-ceramic">
                  <p className="text-sm font-medium text-muted-foreground">{t("result.reason")}</p>
                  <p className="mt-1 text-foreground leading-relaxed">{result.reason}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { icon: Beaker, label: t("result.dosage"), value: result.dosage },
                    { icon: Clock, label: t("result.timing"), value: result.timing },
                    { icon: Leaf, label: t("result.organic"), value: result.organicAlt },
                    { icon: Shield, label: t("result.precautions"), value: result.precautions },
                    { icon: DollarSign, label: t("result.cost"), value: result.costEffectiveness === "high" ? "★★★ High" : result.costEffectiveness === "medium" ? "★★ Medium" : "★ Low" },
                    { icon: TrendingUp, label: t("result.yield"), value: result.yieldImprovement },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="rounded-xl border border-border bg-card p-4 shadow-ceramic">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Icon className="h-4 w-4" strokeWidth={2} />
                        {label}
                      </div>
                      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" onClick={handleSpeak} className="gap-2">
                    <Volume2 className="h-4 w-4" /> {t("result.speak")}
                  </Button>
                  <Button variant="outline" className="gap-2" onClick={() => toast.success("Saved!")}>
                    <Save className="h-4 w-4" /> {t("result.save")}
                  </Button>
                  <Button variant="outline" className="gap-2" onClick={() => toast.info("PDF download coming soon")}>
                    <Download className="h-4 w-4" /> {t("result.download")}
                  </Button>
                </div>

                <div className="rounded-xl border border-border bg-card p-4 shadow-ceramic">
                  <p className="text-sm font-medium text-muted-foreground">{t("result.feedback")}</p>
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => toast.success("Thank you!")} className="gap-1">
                      <ThumbsUp className="h-4 w-4" /> {t("result.yes")}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => toast("We'll improve!")} className="gap-1">
                      <ThumbsDown className="h-4 w-4" /> {t("result.no")}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {!loading && !result && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 p-16"
              >
                <Sprout className="h-16 w-16 text-muted-foreground/40" strokeWidth={1.5} />
                <p className="mt-4 text-lg font-medium text-muted-foreground">
                  Enter your soil parameters to get a prescription
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}