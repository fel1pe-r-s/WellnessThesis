export default function Footer() {
  return (
    <footer className="bg-slate-50 text-slate-500 py-12 text-center text-sm border-t border-slate-100">
      <div className="container mx-auto px-6">
        <p>&copy; {new Date().getFullYear()} HealthThesis. All rights reserved.</p>
        <div className="mt-4 space-x-4">
          </div>
      </div>
    </footer>
  );
}
