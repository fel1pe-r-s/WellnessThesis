import React from 'react';
import { ArrowRight } from 'lucide-react';

interface AffiliateCTAProps {
  productName: string;
  description: string;
  link: string;
  buttonText?: string;
}

export default function AffiliateCTA({ 
  productName, 
  description, 
  link, 
  buttonText = "Learn More" 
}: AffiliateCTAProps) {
  return (
    <div className="my-12 p-8 md:p-10 bg-[#FDFDEA] border border-[#FFC857]/30 rounded-2xl text-center relative overflow-hidden group">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFC857]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative z-10">
        <h3 className="text-2xl md:text-3xl font-bold mb-4 font-serif text-gray-900">
          Recommended: {productName}
        </h3>
        <p className="text-gray-700 mb-8 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#4D7C0F] text-white font-bold text-lg py-4 px-10 rounded-full hover:bg-[#3a5e0b] transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl hover:shadow-[#4D7C0F]/20"
        >
          {buttonText} <ArrowRight className="w-5 h-5" />
        </a>
        <p className="mt-4 text-xs text-gray-500 uppercase tracking-wide opacity-80">
          Partner Offer
        </p>
      </div>
    </div>
  );
}
