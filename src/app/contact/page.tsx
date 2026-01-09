import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, MapPin, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Header />
      <main className="container mx-auto px-6 py-20 max-w-4xl">
        <header className="text-center mb-16 space-y-4">
          <h1 className="text-5xl font-black font-serif text-slate-900 tracking-tight">Get in <span className="text-lime-700 italic">Touch</span></h1>
          <p className="text-xl text-slate-500 font-medium">Have questions or want to share your journey? We&apos;re here for you.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-start gap-6">
              <div className="w-12 h-12 bg-lime-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-lime-700" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 uppercase text-[10px] tracking-[0.2em]">Email Us</h3>
                <p className="text-lg font-medium text-slate-600">wellnessthesis@contato.com</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-start gap-6">
              <div className="w-12 h-12 bg-lime-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-6 h-6 text-lime-700" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 uppercase text-[10px] tracking-[0.2em]">Feedback</h3>
                <p className="text-lg font-medium text-slate-600 font-serif italic">&ldquo;Your voice matters in our community.&rdquo;</p>
              </div>
            </div>
          </div>

          {/* Sidebar decorative / About */}
          <div className="bg-slate-900 p-10 rounded-[3rem] text-white space-y-6 flex flex-col justify-center shadow-xl shadow-slate-200">
            <h2 className="text-3xl font-black font-serif">A community built on <span className="text-lime-400 italic">shared discovery</span>.</h2>
            <p className="text-slate-300 font-medium leading-relaxed">
              We&apos;re committed to sharing the most interesting and helpful content about wellness and healthy living. Reach out if you have any suggestions!
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
