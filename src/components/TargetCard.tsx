import React, { useState } from 'react';
import { Trash2, Edit2, Check, X } from 'lucide-react';

interface Target {
  id: number;
  name: string;
  status: string;
  notes: string;
}

interface TargetCardProps {
  target: Target;
  onUpdate: (id: number, updates: Partial<Target>) => void;
  onDelete: (id: number) => void;
}

export const TargetCard: React.FC<TargetCardProps> = ({ target, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(target.name);
  const [editedStatus, setEditedStatus] = useState(target.status);
  const [editedNotes, setEditedNotes] = useState(target.notes);

  const handleSave = () => {
    onUpdate(target.id, { name: editedName, status: editedStatus, notes: editedNotes });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(target.name);
    setEditedStatus(target.status);
    setEditedNotes(target.notes);
    setIsEditing(false);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Target Name"
          />
          <select
            value={editedStatus}
            onChange={(e) => setEditedStatus(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="Active">Active</option>
            <option value="Farmed">Farmed</option>
            <option value="Safe">Safe</option>
          </select>
          <textarea
            value={editedNotes}
            onChange={(e) => setEditedNotes(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Notes"
            rows={2}
          />
          <div className="flex justify-end gap-2">
            <button onClick={handleCancel} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg">
              <X size={18} />
            </button>
            <button onClick={handleSave} className="p-2 text-green-400 hover:text-green-300 hover:bg-zinc-800 rounded-lg">
              <Check size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-white">{target.name}</h3>
            <div className="flex gap-1">
              <button onClick={() => setIsEditing(true)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg">
                <Edit2 size={16} />
              </button>
              <button onClick={() => onDelete(target.id)} className="p-1.5 text-red-400 hover:text-red-300 hover:bg-zinc-800 rounded-lg">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              target.status === 'Active' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
              target.status === 'Farmed' ? 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20' :
              'bg-green-500/10 text-green-400 border border-green-500/20'
            }`}>
              {target.status}
            </span>
          </div>
          {target.notes && (
            <p className="text-sm text-zinc-400 bg-zinc-950/50 p-2 rounded-lg border border-zinc-800/50">
              {target.notes}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
