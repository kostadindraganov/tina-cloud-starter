import React from 'react'

interface CasinoProsConsProps {
  positives_negatives?: Array<{
    __typename: "CasinoPositives_negativesPositives" | "CasinoPositives_negativesNegatives";
    pros?: string | null;
    cons?: string | null;
  } | null> | null;
}

export function CasinoProsCons({ positives_negatives }: CasinoProsConsProps) {
  // Separate positives and negatives
  const positives = positives_negatives?.filter(
    (item): item is { __typename: "CasinoPositives_negativesPositives"; pros?: string | null } => 
      item?.__typename === 'CasinoPositives_negativesPositives'
  ) || []
  
  const negatives = positives_negatives?.filter(
    (item): item is { __typename: "CasinoPositives_negativesNegatives"; cons?: string | null } => 
      item?.__typename === 'CasinoPositives_negativesNegatives'
  ) || []

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
      {/* Positives Section */}
      <div className="border border-green-100 dark:border-green-900/30 rounded-xl p-7 bg-gradient-to-br from-white to-green-50 dark:from-gray-900 dark:to-gray-900/95 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-100/30 dark:bg-green-900/10 rounded-bl-[70%] -z-10 rotate-12 group-hover:rotate-0 transition-transform duration-700"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-50/50 dark:bg-green-900/5 rounded-tr-[60%] -z-10 group-hover:scale-110 transition-transform duration-700"></div>
        
        <h3 className="text-xl font-bold mb-5 text-gray-800 dark:text-gray-200 border-b pb-3 border-green-100 dark:border-green-800/30 flex items-center">
          <span className="bg-clip-text text-green-600 dark:text-green-400 bg-gradient-to-r from-green-600 to-emerald-500 dark:from-green-400 dark:to-emerald-300">POSITIVES</span>
          <div className="ml-4 h-px flex-grow bg-gradient-to-r from-green-200 to-transparent dark:from-green-800/30"></div>
        </h3>
        
        <ul className="space-y-4">
          {positives.map((positive, index) => (
            <li key={index} className="flex items-start gap-3 group/item hover:translate-x-1 transition-transform duration-200 animate-fadeIn" style={{ animationDelay: `${index * 150}ms` }}>
              <div className="flex-shrink-0 mt-1">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800/60 dark:to-green-700/40 flex items-center justify-center shadow-sm group-hover/item:shadow-green-200 dark:group-hover/item:shadow-green-900/40 transition-all">
                  <span className="text-green-600 dark:text-green-400 text-lg font-bold">+</span>
                </div>
              </div>
              <span className="text-gray-700 dark:text-gray-300 group-hover/item:text-green-700 dark:group-hover/item:text-green-400 transition-colors">{positive.pros || ''}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Negatives Section */}
      <div className="border border-red-100 dark:border-red-900/30 rounded-xl p-7 bg-gradient-to-br from-white to-red-50 dark:from-gray-900 dark:to-gray-900/95 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-100/30 dark:bg-red-900/10 rounded-bl-[70%] -z-10 rotate-12 group-hover:rotate-0 transition-transform duration-700"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-red-50/50 dark:bg-red-900/5 rounded-tr-[60%] -z-10 group-hover:scale-110 transition-transform duration-700"></div>
        
        <h3 className="text-xl font-bold mb-5 text-gray-800 dark:text-gray-200 border-b pb-3 border-red-100 dark:border-red-800/30 flex items-center">
          <span className="bg-clip-text text-red-600 bg-gradient-to-r from-red-600 to-rose-500 dark:from-red-400 dark:to-rose-300">NEGATIVES</span>
          <div className="ml-4 h-px flex-grow bg-gradient-to-r from-red-200 to-transparent dark:from-red-800/30"></div>
        </h3>
        
        <ul className="space-y-4">
          {negatives.map((negative, index) => (
            <li key={index} className="flex items-start gap-3 group/item hover:translate-x-1 transition-transform duration-200 animate-fadeIn" style={{ animationDelay: `${index * 150}ms` }}>
              <div className="flex-shrink-0 mt-1">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-red-100 to-red-200 dark:from-red-800/60 dark:to-red-700/40 flex items-center justify-center shadow-sm group-hover/item:shadow-red-200 dark:group-hover/item:shadow-red-900/40 transition-all">
                  <span className="text-red-600 dark:text-red-400 text-lg font-bold">-</span>
                </div>
              </div>
              <span className="text-gray-700 dark:text-gray-300 group-hover/item:text-red-700 dark:group-hover/item:text-red-400 transition-colors">{negative.cons || ''}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          opacity: 0;
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
} 