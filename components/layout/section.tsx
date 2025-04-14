import React from 'react';
import { useLayout } from '../layout/layout-context';

interface SectionProps {
  children: React.ReactNode;
  color?: string | null;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({ children, color = '', className = '' }) => {
  const { theme } = useLayout();
  const sectionColor = {
    default: 'text-gray-800 dark:text-gray-50 bg-gradient-to-tl from-gray-50 dark:from-gray-900 via-transparent to-transparent',
    white: 'text-gray-800 dark:text-gray-50 bg-white',
    tint: 'text-gray-900 dark:text-gray-100 bg-gradient-to-br from-gray-100 dark:from-gray-1000 to-transparent',
    green: 'text-gray-900 dark:text-gray-100 bg-gradient-to-br from-green-500 dark:from-gray-1000 to-green-600',
    blue: "text-white bg-blue-500 hover:bg-blue-600 bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-400 hover:to-blue-500 dark:from-blue-500 dark:to-blue-700 dark:hover:from-blue-500 dark:hover:to-blue-600",
    teal: "text-white bg-teal-500 hover:bg-teal-600 bg-gradient-to-r from-teal-400 to-teal-600 hover:from-teal-400 hover:to-teal-500 dark:from-teal-500 dark:to-teal-700 dark:hover:from-teal-500 dark:hover:to-teal-600",
    red: "text-white bg-red-500 hover:bg-red-600 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 dark:from-red-500 dark:to-red-700 dark:hover:from-red-500 dark:hover:to-red-600",
    pink: "text-white bg-pink-500 hover:bg-pink-600 bg-gradient-to-r from-pink-400 to-pink-600 hover:from-pink-400 hover:to-pink-500 dark:from-pink-500 dark:to-pink-700 dark:hover:from-pink-500 dark:hover:to-pink-600",
    purple:
      "text-white bg-purple-500 hover:bg-purple-600 bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-400 hover:to-purple-500 dark:from-purple-500 dark:to-purple-700 dark:hover:from-purple-500 dark:hover:to-purple-600",
    orange:
      "text-white bg-orange-500 hover:bg-orange-600 bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-400 hover:to-orange-500 dark:from-orange-500 dark:to-orange-700 dark:hover:from-orange-500 dark:hover:to-orange-600",
    yellow:
      "text-gray-800 bg-yellow-500 hover:bg-yellow-600 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 dark:text-gray-900 dark:from-yellow-300 dark:to-yellow-500 dark:hover:from-yellow-300 dark:hover:to-yellow-400",

    primary: {
      blue: 'text-white bg-blue-500 bg-gradient-to-br from-blue-500 to-blue-600',
      teal: 'text-white bg-teal-500 bg-gradient-to-br from-teal-500 to-teal-600',
      green: 'text-white bg-green-600 bg-gradient-to-br from-green-600 to-green-700',
      red: 'text-white bg-red-500 bg-gradient-to-br from-red-500 to-red-600',
      pink: 'text-white bg-pink-500 bg-gradient-to-br from-pink-500 to-pink-600',
      purple: 'text-white bg-purple-500 bg-gradient-to-br from-purple-500 to-purple-600',
      orange: 'text-white bg-orange-500 bg-gradient-to-br from-orange-500 to-orange-600',
      yellow: 'text-white bg-yellow-500 bg-gradient-to-br from-yellow-500 to-yellow-600',
    },
  };
  const sectionColorCss = color === 'primary' ? sectionColor.primary[theme!.color!] : sectionColor[color || 'default'];

  return <section className={`flex-1 relative transition duration-150 ease-out body-font overflow-hidden ${sectionColorCss} ${className}`}>{children}</section>;
};
