import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface AddTargetFormProps {
  onAdd: (target: { name: string; status: string; notes: string }) => void;
}

export const AddTargetForm: React.FC<AddTargetFormProps> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('Active');
  const [notes, setNotes] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name, status, notes });
    setName('');
    setStatus('Active');
    setNotes('');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-3 border-2 border-dashed border-zinc-800 rounded-xl text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/50 transition-all flex items-center justify-center gap-2 font-medium"
      >
        <Plus size={20} />
        Add New Target
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-lg animate-in fade-in zoom-in-95 duration-200">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1 uppercase tracking-wider">Target Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-zinc-600"
            placeholder="Enter name..."
            autoFocus
          />
        </div>
        
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1 uppercase tracking-wider">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="Active">Active (Ready to Farm)</option>
            <option value="Farmed">Farmed (Done)</option>
            <option value="Safe">Safe (Do Not Touch)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1 uppercase tracking-wider">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-zinc-600"
            placeholder="Add details..."
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-500 rounded-lg shadow-lg shadow-red-900/20 transition-all"
          >
            Add Target
          </button>
        </div>
      </div>
    </form>
  );
};
