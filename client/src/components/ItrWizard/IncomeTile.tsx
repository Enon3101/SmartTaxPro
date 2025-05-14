import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface IncomeTileProps {
  code: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  selected: boolean;
  onClick: (code: string) => void;
}

export function IncomeTile({
  code,
  label,
  description,
  icon,
  selected,
  onClick
}: IncomeTileProps) {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
      onClick={() => onClick(code)}
      className={`border rounded-xl p-5 cursor-pointer relative transition-all duration-200
                 ${selected 
                   ? 'border-blue-500 bg-blue-50 shadow-md' 
                   : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
    >
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-full ${selected ? 'bg-blue-100' : 'bg-gray-100'}`}>
          {icon}
        </div>
        
        <div className="flex-1">
          <h3 className={`font-semibold text-lg ${selected ? 'text-blue-700' : 'text-gray-800'}`}>
            {label}
          </h3>
          <p className={`text-sm ${selected ? 'text-blue-600' : 'text-gray-500'}`}>
            {description}
          </p>
        </div>
        
        {selected && (
          <div className="absolute top-3 right-3">
            <CheckCircle className="h-5 w-5 text-blue-500 fill-blue-100" />
          </div>
        )}
      </div>
    </motion.div>
  );
}