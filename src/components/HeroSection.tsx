"use client";

import GlitchText from "@/components/animations/GlitchText";
import DecryptedText from "@/components/animations/DecryptedText";

const ASCII_LOGO = `
 ███████╗████████╗ █████╗  ██████╗██╗  ██╗
 ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
 ███████╗   ██║   ███████║██║     █████╔╝
 ╚════██║   ██║   ██╔══██║██║     ██╔═██╗
 ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
 ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
      O V E R V I B E`.trimStart();

export function HeroSection() {
  return (
    <section className="text-center mb-8 pt-4">
      <GlitchText autoGlitch autoGlitchInterval={5000}>
        <pre
          className="text-[var(--color-primary)] text-[0.35rem] sm:text-[0.5rem] md:text-xs leading-tight font-[family-name:var(--font-code)] neon-text select-none overflow-hidden"
          aria-hidden="true"
        >
          {ASCII_LOGO}
        </pre>
      </GlitchText>

      <p className="text-sm text-[var(--color-text-muted)] mt-3 font-[family-name:var(--font-code)]">
        <DecryptedText
          text="база знаний по вайбкодингу // гайды, инструменты, вопросы"
          animateOn="view"
          speed={30}
          sequential
        />
      </p>
    </section>
  );
}
