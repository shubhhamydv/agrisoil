import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Leaf className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">AgriSoil</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <Link to="/about" className="hover:text-foreground transition-colors">{t("nav.about")}</Link>
            <Link to="/help" className="hover:text-foreground transition-colors">{t("nav.help")}</Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">{t("nav.contact")}</Link>
            <span>{t("footer.privacy")}</span>
            <span>{t("footer.terms")}</span>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-muted-foreground">
          © {year} AgriSoil. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
