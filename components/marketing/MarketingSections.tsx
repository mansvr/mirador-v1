"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MiradorMark } from "@/components/brand/MiradorMark";
import { ScrollReveal } from "@/components/marketing/ScrollReveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DEMO_SCENE = "scene_best50000";

const SOLUTIONS = [
  {
    num: "01",
    title: "CAPTURE",
    subtitle: "Espacios reales",
    body: "Recorre propiedades listadas con la misma claridad que una visita presencial. Ideal para agentes que compiten con fotos planas.",
    meta: "Tour · Listing",
  },
  {
    num: "02",
    title: "RENDER",
    subtitle: "Diseños caminables",
    body: "Preventa y arquitectura antes de obra. Los compradores entienden volumen, luz y circulación sin interpretar planos.",
    meta: "Obra nueva · Arquitectos",
  },
  {
    num: "03",
    title: "PROCESAMOS",
    subtitle: "Listo para publicar",
    body: "Convertimos captura en tour ligero para web y móvil. Medidas y hotspots cuando el proyecto lo requiere.",
    meta: "Escala · 3DGS",
  },
  {
    num: "04",
    title: "EMBED",
    subtitle: "En tu canal",
    body: "Snippet para portales, micrositios de agente y WhatsApp. Un enlace, un recorrido coherente con tu marca.",
    meta: "API · iframe",
  },
] as const;

const STEPS = [
  { label: "Capturas", detail: "Móvil o cámara 360 según el plan." },
  { label: "Procesamos", detail: "Tour optimizado para carga rápida." },
  { label: "Compartes", detail: "Link, embed o listing en mirador.homes." },
] as const;

const TRUST = [
  { title: "Medidas verificadas", body: "Specs claros en listing y tour cuando aplica." },
  { title: "Soporte humano", body: "Onboarding para equipos y constructoras." },
  { title: "Embed confiable", body: "Funciona en móvil Colombia, sin plugins raros." },
] as const;

function SectionGrid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("mx-auto max-w-[90rem] px-4 md:px-6 lg:px-8", className)}>{children}</div>
  );
}

export function SystemBand() {
  return (
    <section className="border-b border-mirador-border bg-mirador-surface">
      <SectionGrid className="py-14 md:py-20">
        <ScrollReveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mirador-text-muted">
            Sistema
          </p>
          <h2 className="mt-3 max-w-3xl text-2xl font-medium leading-snug md:text-3xl lg:text-4xl">
            El recorrido que convierte curiosidad en visita
          </h2>
          <p className="mt-4 max-w-2xl text-mirador-text-muted">
            Industrializamos la experiencia espacial: captura, procesado y publicación con
            control, sin sacrificar la simplicidad que pide un listing.
          </p>
        </ScrollReveal>
      </SectionGrid>
    </section>
  );
}

export function SolutionsSection() {
  return (
    <section aria-labelledby="solutions-heading" className="border-b border-mirador-border">
      <SectionGrid className="py-4 md:py-6">
        <ScrollReveal className="border-b border-mirador-border py-8 md:py-10">
          <h2 id="solutions-heading" className="sr-only">
            Soluciones
          </h2>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mirador-text-muted">
            Soluciones
          </p>
        </ScrollReveal>

        {SOLUTIONS.map((item, index) => (
          <ScrollReveal
            key={item.num}
            delay={index * 0.05}
            className="grid gap-6 border-b border-mirador-border py-10 md:grid-cols-12 md:gap-8 md:py-14"
          >
            <p className="font-mono text-4xl font-medium tabular-nums text-mirador-border md:col-span-2 md:text-5xl">
              {item.num}
            </p>
            <div className="md:col-span-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-mirador-text-muted">
                {item.subtitle}
              </p>
              <h3 className="mt-1 text-xl font-medium md:text-2xl">{item.title}</h3>
              <p className="mt-2 font-mono text-xs text-mirador-text-muted">{item.meta}</p>
            </div>
            <p className="text-mirador-text-muted md:col-span-5 md:text-lg">{item.body}</p>
            <div className="flex items-end md:col-span-1 md:justify-end">
              <span className="text-mirador-text-muted" aria-hidden>
                →
              </span>
            </div>
          </ScrollReveal>
        ))}
      </SectionGrid>
    </section>
  );
}

export function ProcessSection() {
  return (
    <section className="border-b border-mirador-border">
      <SectionGrid className="grid gap-10 py-14 lg:grid-cols-12 lg:gap-16 lg:py-20">
        <ScrollReveal className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mirador-text-muted">
            Cómo funciona
          </p>
          <h2 className="mt-3 text-2xl font-medium md:text-3xl">Tres pasos, un enlace</h2>
          <p className="mt-3 text-mirador-text-muted">
            Sin curva de aprendizaje larga. Publicas cuando el tour está listo.
          </p>
        </ScrollReveal>

        <ol className="space-y-0 lg:col-span-8">
          {STEPS.map((step, index) => (
            <ScrollReveal
              key={step.label}
              delay={index * 0.06}
              className="border-t border-mirador-border py-8 first:border-t-0 lg:first:border-t"
            >
              <p className="font-mono text-sm text-mirador-text-muted">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 text-lg font-medium">{step.label}</h3>
              <p className="mt-1 text-mirador-text-muted">{step.detail}</p>
            </ScrollReveal>
          ))}
        </ol>
      </SectionGrid>
    </section>
  );
}

export function DemoSection() {
  return (
    <section className="border-b border-mirador-border bg-mirador-surface">
      <SectionGrid className="py-14 md:py-20">
        <ScrollReveal>
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
            <div>
              <p className="font-mono text-xs text-mirador-text-muted">Demo · P-001</p>
              <h2 className="mt-2 text-2xl font-medium md:text-3xl">Abre un tour en vivo</h2>
              <p className="mt-3 text-mirador-text-muted">
                Navega un espacio de ejemplo con el mismo visor que verán tus clientes.
              </p>
              <Link
                href={`/v/${DEMO_SCENE}`}
                className={cn(buttonVariants({ size: "lg" }), "mt-6 inline-flex min-h-11 gap-2")}
              >
                Abrir demo
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>

            <div className="overflow-hidden rounded-sm border border-mirador-border bg-mirador-viewer shadow-sm">
              <div className="relative aspect-[16/10] bg-gradient-to-br from-[#3d3a36] via-mirador-viewer to-black">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center text-white">
                  <MiradorMark className="h-12 w-12 text-[#E7E6DC]" />
                  <p className="text-xs uppercase tracking-widest text-white/60">
                    Vista previa · tour espacial
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 bg-black/40 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-white/50">
                <span>Escena demo</span>
                <span>Escala 1:1</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </SectionGrid>
    </section>
  );
}

export function TrustSection() {
  return (
    <section className="border-b border-mirador-border">
      <SectionGrid className="py-14 md:py-20">
        <ScrollReveal className="mb-10 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mirador-text-muted">
            Confianza
          </p>
          <h2 className="mt-3 text-2xl font-medium md:text-3xl">
            Control y claridad en cada publicación
          </h2>
        </ScrollReveal>

        <div className="grid gap-px border border-mirador-border bg-mirador-border md:grid-cols-3">
          {TRUST.map((item, index) => (
            <ScrollReveal
              key={item.title}
              delay={index * 0.05}
              className="bg-mirador-bg p-6 md:p-8"
            >
              <h3 className="font-medium">{item.title}</h3>
              <p className="mt-2 text-sm text-mirador-text-muted">{item.body}</p>
            </ScrollReveal>
          ))}
        </div>
      </SectionGrid>
    </section>
  );
}

export function CtaBand() {
  return (
    <section className="bg-mirador-text text-[#F5F6F2]">
      <SectionGrid className="flex flex-col items-start justify-between gap-6 py-12 md:flex-row md:items-center md:py-14">
        <ScrollReveal>
          <h2 className="text-xl font-medium md:text-2xl">¿Listo para un recorrido piloto?</h2>
          <p className="mt-2 max-w-md text-sm text-[#F5F6F2]/75">
            Cuéntanos tu proyecto: CAPTURE, RENDER o embed. Respondemos con alcance y tiempos.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.08}>
          <div className="flex flex-wrap gap-3">
            <a
              href="mailto:letstalk@mirador.lat"
              className={cn(
                buttonVariants({ size: "lg" }),
                "min-h-11 border-[#F5F6F2] bg-[#F5F6F2] text-mirador-text hover:bg-[#E7E6DC]"
              )}
            >
              Solicitar cotización
            </a>
            <Link
              href={`/v/${DEMO_SCENE}`}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "min-h-11 border-[#F5F6F2]/40 text-[#F5F6F2] hover:bg-white/10"
              )}
            >
              Ver demo
            </Link>
          </div>
        </ScrollReveal>
      </SectionGrid>
    </section>
  );
}
