import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Echtzeit-Charts",
    description:
      "Professionelle Candlestick-Charts mit über 100 Indikatoren, Zeichentools und Multi-Timeframe-Analyse.",
  },
  {
    title: "Marktanalyse",
    description:
      "KI-gestützte Signale, Trendanalysen und Screener helfen dir, Chancen schneller zu erkennen.",
  },
  {
    title: "Portfolio-Tracking",
    description:
      "Behalte alle deine Positionen, P&L und Risiken über alle Märkte hinweg in einem Dashboard im Blick.",
  },
];

const plans = [
  {
    name: "Free",
    price: "0€",
    period: "/ Monat",
    description: "Voller Funktionsumfang für jeden Trader — komplett kostenlos.",
    features: [
      "Echtzeit-Kurse & Charts",
      "Alle Indikatoren & Zeichentools",
      "KI-Marktsignale",
      "Unbegrenzte Watchlists",
      "Portfolio-Analyse",
    ],
    cta: "Kostenlos starten",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Individuell",
    period: "",
    description: "Für Teams und institutionelle Anforderungen.",
    features: ["API-Zugang", "Dedizierter Support", "Individuelle Datenfeeds"],
    cta: "Kontakt aufnehmen",
    highlighted: false,
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-400">
              Z
            </span>
            <span>ZeroTrade</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <Link href="#features" className="transition-colors hover:text-foreground">
              Märkte
            </Link>
            <Link href="#features" className="transition-colors hover:text-foreground">
              Analyse
            </Link>
            <Link href="#pricing" className="transition-colors hover:text-foreground">
              Preise
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="hidden sm:inline-flex">
              Anmelden
            </Button>
            <Button>Kostenlos starten</Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-40 -z-10 h-[36rem] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/20 via-emerald-500/5 to-transparent"
          />
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 py-28 text-center sm:py-36">
            <Badge variant="secondary" className="mb-6 gap-1.5 text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Live-Marktdaten in Echtzeit
            </Badge>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
              Analysiere Märkte. Handle smarter.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground text-balance">
              ZeroTrade vereint Echtzeit-Charts, präzise Marktanalysen und
              Trading-Tools an einem Ort — für Trader, die fundierte
              Entscheidungen treffen wollen.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/dashboard" className={cn(buttonVariants({ size: "lg" }), "px-8")}>
                Kostenlos starten
              </Link>
              <Link
                href="/dashboard"
                className={cn(buttonVariants({ size: "lg", variant: "outline" }), "px-8")}
              >
                Live-Demo ansehen
              </Link>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Keine Kreditkarte erforderlich · Jederzeit kündbar
            </p>
          </div>
        </section>

        <section id="features" className="border-t border-border/60">
          <div className="mx-auto w-full max-w-6xl px-6 py-24">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight">
                Alles, was du für deinen Trading-Alltag brauchst
              </h2>
              <p className="mt-4 text-muted-foreground">
                Von Echtzeit-Daten bis zur tiefgehenden Analyse — ZeroTrade
                gibt dir die Werkzeuge, um Märkte wie ein Profi zu lesen.
              </p>
            </div>
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="bg-card/60">
                  <CardHeader>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="border-t border-border/60">
          <div className="mx-auto w-full max-w-6xl px-6 py-24">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight">
                Preise, die mit dir wachsen
              </h2>
              <p className="mt-4 text-muted-foreground">
                Starte kostenlos und upgrade, sobald du mehr Tiefe brauchst.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-3xl gap-6 sm:grid-cols-2">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={
                    plan.highlighted
                      ? "border-emerald-500/50 bg-card shadow-[0_0_40px_-12px] shadow-emerald-500/30"
                      : "bg-card/60"
                  }
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      {plan.highlighted && (
                        <Badge className="bg-emerald-500/15 text-emerald-400">
                          Beliebt
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-3xl font-semibold tracking-tight">
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-sm text-muted-foreground">
                          {plan.period}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <Separator />
                    <ul className="flex flex-col gap-2.5 text-sm text-muted-foreground">
                      {plan.features.map((item) => (
                        <li key={item} className="flex items-center gap-2.5">
                          <span className="h-1 w-1 rounded-full bg-emerald-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant={plan.highlighted ? "default" : "outline"}
                      className="mt-2 w-full"
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-6 py-10 text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <span className="flex flex-col items-center gap-1 sm:items-start">
            <span>© {new Date().getFullYear()} ZeroTrade. Alle Rechte vorbehalten.</span>
            <span className="text-xs text-muted-foreground/70">Powered by Flux Network</span>
          </span>
          <div className="flex items-center gap-6">
            <Link href="#" className="transition-colors hover:text-foreground">
              Datenschutz
            </Link>
            <Link href="#" className="transition-colors hover:text-foreground">
              Impressum
            </Link>
            <Link href="#" className="transition-colors hover:text-foreground">
              Kontakt
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
