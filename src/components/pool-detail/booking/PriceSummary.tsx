
import React from 'react';

interface PriceSummaryProps {
  basePrice: number;
  extrasPrice: number;
  selectedExtras: string[];
}

const PriceSummary = ({ basePrice, extrasPrice, selectedExtras }: PriceSummaryProps) => {
  const totalPrice = basePrice + extrasPrice;

  return (
    <div className="border-t border-gray-200 pt-4 mb-4">
      <div className="flex justify-between mb-2">
        <span>Base price</span>
        <span>£{basePrice}</span>
      </div>
      {selectedExtras.length > 0 && (
        <div className="flex justify-between mb-2">
          <span>Extras</span>
          <span>£{extrasPrice}</span>
        </div>
      )}
      <div className="flex justify-between font-semibold">
        <span>Total</span>
        <span>£{totalPrice}</span>
      </div>
    </div>
  );
};

export default PriceSummary;
