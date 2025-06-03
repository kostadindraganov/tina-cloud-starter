import React from 'react'

interface SweepstakesProsConsProps {
  positives_negatives?: Array<{
    __typename: "SweepstakesPositives_negativesPositives" | "SweepstakesPositives_negativesNegatives";
    pros?: string | null;
    cons?: string | null;
  } | null> | null;
}

export function SweepstakesProsCons({ positives_negatives }: SweepstakesProsConsProps) {
  // Separate positives and negatives
  const positives = positives_negatives?.filter(
    (item): item is { __typename: "SweepstakesPositives_negativesPositives"; pros?: string | null } => 
      item?.__typename === 'SweepstakesPositives_negativesPositives'
  ) || []
  
  const negatives = positives_negatives?.filter(
    (item): item is { __typename: "SweepstakesPositives_negativesNegatives"; cons?: string | null } => 
      item?.__typename === 'SweepstakesPositives_negativesNegatives'
  ) || []

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
      {/* Positives Section */}
      <div className="border border-purple-100 dark:border-purple-900/30 rounded-xl p-7 bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-gray-900/95 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
        <h4 className="text-xl font-bold mb-5 text-gray-800 dark:text-gray-200 border-b pb-3 border-purple-100 dark:border-purple-800/30 flex items-center">
          <span className="bg-clip-text text-purple-600 dark:text-purple-400 bg-gradient-to-r from-purple-600 to-violet-500 dark:from-purple-400 dark:to-violet-300">POSITIVES</span>
        </h4>
        
        <ul className="space-y-4 p-0">
          {positives.map((positive, index) => (
            <li key={index} className="flex items-start gap-3 group/item hover:translate-x-1 transition-transform duration-200 animate-fadeIn" style={{ animationDelay: `${index * 150}ms` }}>
              <div className="flex-shrink-0 mt-1">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-800/60 dark:to-purple-700/40 flex items-center justify-center shadow-sm group-hover/item:shadow-purple-200 dark:group-hover/item:shadow-purple-900/40 transition-all">
                  <span className="text-purple-600 dark:text-purple-400 text-lg font-bold">+</span>
                </div>
              </div>
              <span className="text-gray-700 dark:text-gray-300 group-hover/item:text-purple-700 dark:group-hover/item:text-purple-400 transition-colors">{positive.pros || ''}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Negatives Section */}
      <div className="border border-red-100 dark:border-red-900/30 rounded-xl p-7 bg-gradient-to-br from-white to-red-50 dark:from-gray-900 dark:to-gray-900/95 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
          <h4 className="text-xl font-bold mb-5 text-gray-800 dark:text-gray-200 border-b pb-3 border-red-100 dark:border-red-800/30 flex items-center">
          <span className="bg-clip-text text-red-600 bg-gradient-to-r from-red-600 to-rose-500 dark:from-red-400 dark:to-rose-300">NEGATIVES</span>
        </h4>
        
        <ul className="space-y-4 p-0">
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