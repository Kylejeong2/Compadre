import {
  FAQ,
  Featured,
  FinancialFuture,
  FinancialFreedom,
  HeroSection,
  IntroSection,
  JoinSection,
  OffersSection,
} from '@/components/';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <Featured />
      <OffersSection />
      <FinancialFreedom />
      <FinancialFuture />
      <IntroSection />
      <JoinSection />
      <FAQ />
    </main>
  );
}