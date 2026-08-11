import React from 'react';
import { Check } from 'lucide-react';

export default function Toast({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className="toast">
          <Check size={18} color="#10b981" />
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
