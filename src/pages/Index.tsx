import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Beaker, BarChart3, Leaf, MapPin, Quote, ArrowRight, FlaskConical, Sprout, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import heroImg from "@/assets/hero-farm.jpg";

const cardSpring = { type: "spring" as const, stiffness: 300, damping: 30 };

const Index = () => {
  const { t } = useTranslation();

  const steps = [
    { icon: Beaker, ...t("features.step1", { returnObjects: true }) as { title: string; desc: string } },
    { icon: BarChart3, ...t("features.step2", { returnObjects: true }) as { title: string; desc: string } },
    { icon: Sprout, ...t("features.step3", { returnObjects: true }) as { title: string; desc: string } },
  ];

  const benefits = [
    { icon: FlaskConical, ...t("benefits.b1", { returnObjects: true }) as { title: string; desc: string } },
    { icon: TrendingUp, ...t("benefits.b2", { returnObjects: true }) as { title: string; desc: string } },
    { icon: Leaf, ...t("benefits.b3", { returnObjects: true }) as { title: string; desc: string } },
    { icon: MapPin, ...t("benefits.b4", { returnObjects: true }) as { title: string; desc: string } },
  ];

  const testimonials = ["t1", "t2", "t3"].map((key) => t(`testimonials.${key}`, { returnObjects: true }) as { quote: string; name: string; role: string });

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Agricultural farmland" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-foreground/30" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl" style={{ letterSpacing: "-0.03em" }}>
              {t("hero.title")}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-primary-foreground/80">
              {t("hero.subtitle")}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/recommend">
                <Button size="lg" className="bg-gold text-gold-foreground font-bold text-base px-8 py-6 rounded-lg hover:bg-gold/90 active:scale-95 transition-transform">
                  {t("hero.cta")} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground font-semibold text-base px-8 py-6 rounded-lg color bg bg-red-700">
                  {t("hero.cta2")}
                </Button>
              </a>
            </div>
            {/* Trust badge */}
            <div className="mt-10 flex items-center gap-3 text-sm text-primary-foreground/60">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-8 w-8 rounded-full border-2 border-primary-foreground/20 bg-primary/60" />
                ))}
              </div>
              <span>Based on 1,200+ soil samples across 8 states</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{t("features.title")}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">{t("features.subtitle")}</p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...cardSpring, delay: i * 0.15 }}
                className="relative rounded-xl border border-border bg-card p-8 shadow-ceramic"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <step.icon className="h-7 w-7 text-primary" strokeWidth={2} />
                </div>
                <div className="absolute -top-3 right-6 flex h-7 w-7 items-center justify-center rounded-full bg-gold font-mono text-sm font-bold text-gold-foreground">
                  {i + 1}
                </div>
                <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-secondary/50 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{t("benefits.title")}</h2>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...cardSpring, delay: i * 0.1 }}
                className="rounded-xl border border-border bg-card p-6 shadow-ceramic"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <b.icon className="h-6 w-6 text-primary" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold text-foreground">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{t("testimonials.title")}</h2>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {testimonials.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...cardSpring, delay: i * 0.15 }}
                className="rounded-xl border border-border bg-card p-8 shadow-ceramic"
              >
                <Quote className="mb-4 h-8 w-8 text-gold" strokeWidth={2} />
                <p className="text-foreground leading-relaxed italic">"{item.quote}"</p>
                <div className="mt-6 border-t border-border pt-4">
                  <p className="font-bold text-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary-foreground sm:text-4xl">
            {t("hero.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
            {t("hero.subtitle")}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/recommend">
              <Button size="lg" className="bg-gold text-gold-foreground font-bold text-base px-8 py-6 rounded-lg hover:bg-gold/90 active:scale-95 transition-transform">
                {t("hero.cta")} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
