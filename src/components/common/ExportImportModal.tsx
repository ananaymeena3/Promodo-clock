import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { exportUserDataJSON, importUserDataJSON } from '../../services/localStorageSync';
import { X, Download, Upload, Check, AlertCircle } from 'lucide-react';
import { soundEngine } from '../../services/soundGenerator';

export const ExportImportModal: React.FC = () => {
  const { isBackupModalOpen, toggleBackupModal } = useAppStore();
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isBackupModalOpen) return null;

  const handleExport = () => {
    soundEngine.playClickSound();
    exportUserDataJSON();
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    soundEngine.playClickSound();
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      const success = importUserDataJSON(content);
      if (success) {
        setImportStatus('Backup restored successfully! Reloading...');
        setTimeout(() => window.location.reload(), 1200);
      } else {
        setImportStatus('Failed to import backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="glass-panel w-full max-w-md rounded-3xl border border-white/10 shadow-2xl p-6 relative animate-fade-in">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Download className="w-5 h-5 text-purple-400" /> Export & Import Data Backup
          </h3>
          <button onClick={toggleBackupModal} className="p-1 rounded-xl text-slate-400 hover:text-white bg-white/5">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 pt-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-purple-400" /> Export Backup
            </h4>
            <p className="text-xs text-slate-400">Download all tasks, habits, notes, timer stats, and goals to a JSON file.</p>
            <button
              onClick={handleExport}
              className="w-full mt-2 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-purple-600/30 transition-all"
            >
              Export JSON Backup
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-400" /> Import Backup
            </h4>
            <p className="text-xs text-slate-400">Restore your saved configuration and workspace data.</p>
            <label className="block w-full text-center mt-2 py-2 bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 rounded-xl text-xs font-semibold cursor-pointer transition-all">
              Choose JSON File
              <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
            </label>
          </div>

          {importStatus && (
            <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-200 text-xs text-center font-medium">
              {importStatus}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
