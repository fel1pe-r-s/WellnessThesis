import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Header />
      <main className="container mx-auto px-6 py-20 max-w-4xl">
        <h1 className="text-4xl font-black font-serif mb-8 text-slate-900 border-b pb-4">Terms of Use</h1>
        <div className="space-y-6 text-lg leading-relaxed">
          <p>
            By accessing the WellnessThesis website, you agree to be bound by these terms of use, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
          </p>
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Use License</h2>
            <p>Permission is granted to temporarily download one copy of the materials on WellnessThesis&apos;s website for personal, non-commercial transitory viewing only.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Disclaimer</h2>
            <p>The materials on WellnessThesis&apos;s website are provided on an &apos;as is&apos; basis. WellnessThesis makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Limitations</h2>
            <p>In no event shall WellnessThesis or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on WellnessThesis&apos;s website.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
