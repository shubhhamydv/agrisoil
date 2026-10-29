import { Layout } from "@/components/Layout";
import { useTranslation } from "react-i18next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "How accurate are the recommendations?", a: "Our recommendations are calibrated against 1,200+ soil samples across 8 Indian states. The confidence score reflects the match quality. For best results, use lab-tested N-P-K values." },
  { q: "Can I use this on my phone?", a: "Yes! AgriSoil is fully responsive and designed with large buttons and readable fonts for use on any smartphone." },
  { q: "Is there a cost to use this?", a: "The basic recommendation engine is completely free for all farmers. Premium features like historical tracking and PDF reports may require an account." },
  { q: "What languages are supported?", a: "We support English, Hindi, Marathi, Bengali, Tamil, Telugu, Punjabi, and Gujarati. Use the globe icon in the navbar to switch languages." },
  { q: "How does the voice feature work?", a: "Click the 'Read Aloud' button on any recommendation to have it spoken in your device's default language using built-in text-to-speech." },
  { q: "Can I save my past recommendations?", a: "Yes, click 'Save to Field Log' on any recommendation. You'll need to create a free account to access saved history." },
];

export default function HelpPage() {
  const { t } = useTranslation();
  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">{t("nav.help")}</h1>
        <p className="mt-4 text-lg text-muted-foreground">Frequently asked questions about AgriSoil</p>
        <Accordion type="single" collapsible className="mt-8">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-foreground font-semibold">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Layout>
  );
}
