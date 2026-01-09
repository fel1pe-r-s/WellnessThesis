import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Header />
      <main className="container mx-auto px-6 py-20 max-w-4xl">
        <h1 className="text-4xl font-black font-serif mb-8 text-slate-900 border-b pb-4">Privacy Policy</h1>
        <div className="space-y-6 text-lg leading-relaxed">
          <p>
            Welcome to WellnessThesis. Your privacy is critically important to us.
          </p>
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Information We Collect</h2>
            <p>We only collect information about you if we have a reason to do so—for example, to provide our services, to communicate with you, or to make our services better.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Use of Information</h2>
            <p>We use the information we collect to maintain and improve our services, and to provide you with insights on wellness and healthy living.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Cookies & Ads</h2>
            <p>We use cookies to analyze site traffic and personalize your experience. We also display advertisements through Google AdSense, which may use cookies to serve ads based on your prior visits to our website or other websites on the Internet.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at <span className="font-bold text-lime-700">wellnessthesis@contato.com</span>.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
