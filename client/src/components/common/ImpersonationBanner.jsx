import React from 'react';
import { useImpersonation } from '../../context/ImpersonationContext';
import { AlertCircle, X } from 'lucide-react';

export const ImpersonationBanner = () => {
  const { isImpersonating, impersonatedStudent, endImpersonation } = useImpersonation();

  if (!isImpersonating || !impersonatedStudent) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-achievement to-celebration/80 border-b-2 border-achievement px-4 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3 flex-1">
        <AlertCircle className="w-5 h-5 text-white flex-shrink-0" />
        <div>
          <p className="text-white font-semibold">
            👁️ You are viewing this as <strong>{impersonatedStudent.name}</strong>
          </p>
          <p className="text-white/90 text-sm">
            {impersonatedStudent.grade} • {impersonatedStudent.section}
          </p>
        </div>
      </div>

      <button
        onClick={endImpersonation}
        className="ml-4 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg flex items-center gap-2 transition font-semibold"
      >
        <span>← Back to Admin</span>
      </button>
    </div>
  );
};

export default ImpersonationBanner;
