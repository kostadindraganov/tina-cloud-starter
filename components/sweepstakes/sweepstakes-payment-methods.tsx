import React from "react";
import { BsInfoCircle, BsCreditCard2Front } from "react-icons/bs";
import { FaApplePay, FaCcVisa, FaCcMastercard, FaCcPaypal, FaBitcoin, FaUniversity } from "react-icons/fa";
import { TbCashBanknote } from "react-icons/tb";

// Define local interfaces matching what we need
interface WithdrawalMethod {
  count?: number | null;
  all_withdrawal_methods?: string | null;
  withdrawal_limit_per_month?: string | null;
  withdrawal_limit_per_week?: string | null;
  withdrawal_limit_per_day?: string | null;
}

interface DepositMethod {
  count?: number | null;
  all_deposit_methods?: string | null;
}

interface Currency {
  count?: number | null;
  all_currencies?: string | null;
}

interface SweepstakesPaymentMethodsProps {
  withdrawal_methods?: any[] | null; // Use any to accept TinaCMS generated types
  deposit_methods?: any[] | null;
  currencies?: any[] | null;
}

export const SweepstakesPaymentMethods: React.FC<SweepstakesPaymentMethodsProps> = ({
  withdrawal_methods,
  deposit_methods,
  currencies
}) => {
  return (
    <>
      {/* Withdrawal Methods */}
      <div className="p-6">
        <div className="flex justify-between gap-4 items-center mb-4">
          <h3 className="text-lg font-bold text-purple-600 dark:text-white uppercase">withdrawal methods</h3>
        </div>
        
        {/* Withdrawal Limits */}
        {(withdrawal_methods?.[0]?.withdrawal_limit_per_day || 
          withdrawal_methods?.[0]?.withdrawal_limit_per_week || 
          withdrawal_methods?.[0]?.withdrawal_limit_per_month) && (
          <div className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {withdrawal_methods?.[0]?.withdrawal_limit_per_day && (
                <div className="flex flex-col items-center justify-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Daily</span>
                  <span className="text-xl font-bold text-gray-800 dark:text-white">{withdrawal_methods[0].withdrawal_limit_per_day}</span>
                </div>
              )}
              
              {withdrawal_methods?.[0]?.withdrawal_limit_per_week && (
                <div className="flex flex-col items-center justify-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Weekly</span>
                  <span className="text-xl font-bold text-gray-800 dark:text-white">{withdrawal_methods[0].withdrawal_limit_per_week}</span>
                </div>
              )}
              
              {withdrawal_methods?.[0]?.withdrawal_limit_per_month && (
                <div className="flex flex-col items-center justify-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Monthly</span>
                  <span className="text-xl font-bold text-gray-800 dark:text-white">{withdrawal_methods[0].withdrawal_limit_per_month}</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="p-6 border-t border-purple-200 dark:border-gray-700 bg-white my-4">
          <h4 className="text-lg text-gray-600 dark:text-gray-300 uppercase">      
            {withdrawal_methods?.[0]?.all_withdrawal_methods} 
          </h4> 
        </div>
      </div>
      
      {/* Deposit Methods */}
      <div className="p-6">
        <div className="flex justify-between gap-4 items-center mb-4">
          <h3 className="text-lg font-bold text-purple-600 dark:text-white uppercase">deposit methods</h3>
        </div>
        
        <div className="p-6 border-t border-purple-200 dark:border-gray-700 bg-white">
          <h4 className="text-lg text-gray-600 dark:text-gray-300 uppercase">      
            {deposit_methods?.[0]?.all_deposit_methods} 
          </h4> 
        </div>
      </div>

      {/* Currencies Section */}
      <div className="p-6">
        <div className="flex justify-between gap-4 items-center mb-4">
          <h3 className="text-lg font-bold text-purple-600 dark:text-white uppercase">Currencies</h3>
        </div>
        
        {/* Currency Icons */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex -space-x-3">
            <div className="w-12 h-12 flex items-center justify-center bg-purple-50 dark:bg-purple-900/20 rounded-full border-2 border-white dark:border-gray-700 shadow-sm">
              <TbCashBanknote className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="w-12 h-12 flex items-center justify-center bg-purple-50 dark:bg-purple-900/20 rounded-full border-2 border-white dark:border-gray-700 shadow-sm">
              <FaUniversity className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="w-12 h-12 flex items-center justify-center bg-purple-50 dark:bg-purple-900/20 rounded-full border-2 border-white dark:border-gray-700 shadow-sm">
              <FaBitcoin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="w-12 h-12 flex items-center justify-center bg-purple-50 dark:bg-purple-900/20 rounded-full border-2 border-white dark:border-gray-700 shadow-sm">
              <BsCreditCard2Front className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
        
        {/* Display currencies from data */}
        <div className="p-6 border-t border-purple-200 dark:border-gray-700 bg-white">
          {currencies && currencies.length > 0 ? (
            <div>
              {/* All currencies from data */}
              <div>
                <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-4">All Supported Currencies:</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {currencies[0]?.all_currencies}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No currency information available for this sweepstakes.</p>
          )}
        </div>
      </div>
    </>
  );
}; 