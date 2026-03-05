import React, { useState, useEffect, useRef } from 'react';
import { TargetCard } from './components/TargetCard';
import { AddTargetForm } from './components/AddTargetForm';
import { Skull, RefreshCw, AlertCircle } from 'lucide-react';

interface Target {
  id: number;
  name: string;
  status: string;
  notes: string;
}

export default function App() {
  const [targets, setTargets] = useState<Target[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Entrance state
  const [entered, setEntered] = useState(false);
  const [noBtnScale, setNoBtnScale] = useState(1);
  const [yesBtnScale, setYesBtnScale] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);

  const fetchTargets = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/targets');
      if (!res.ok) throw new Error('Failed to fetch targets');
      const data = await res.json();
      setTargets(data);
      setError(null);
    } catch (err) {
      setError('Failed to load targets. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (entered) {
      fetchTargets();
      // Attempt to play video with sound after user interaction
      if (videoRef.current) {
        videoRef.current.volume = 1.0;
        videoRef.current.play().catch(e => console.error("Video play failed:", e));
      }
    }
  }, [entered]);

  const addTarget = async (target: { name: string; status: string; notes: string }) => {
    try {
      const res = await fetch('/api/targets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(target),
      });
      if (!res.ok) throw new Error('Failed to add target');
      const newTarget = await res.json();
      setTargets([newTarget, ...targets]);
    } catch (err) {
      setError('Failed to add target');
    }
  };

  const updateTarget = async (id: number, updates: Partial<Target>) => {
    try {
      const res = await fetch(`/api/targets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to update target');
      const updatedTarget = await res.json();
      setTargets(targets.map((t) => (t.id === id ? updatedTarget : t)));
    } catch (err) {
      setError('Failed to update target');
    }
  };

  const deleteTarget = async (id: number) => {
    try {
      const res = await fetch(`/api/targets/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete target');
      setTargets(targets.filter((t) => t.id !== id));
    } catch (err) {
      setError('Failed to delete target');
    }
  };

  const handleNoClick = () => {
    setNoBtnScale(prev => Math.max(0.1, prev - 0.2));
    setYesBtnScale(prev => prev + 0.5);
  };

  if (!entered) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-12 animate-pulse">
          Do you want to see the list?
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <button
            onClick={() => setEntered(true)}
            style={{ transform: `scale(${yesBtnScale})` }}
            className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl text-xl transition-all shadow-[0_0_20px_rgba(34,197,94,0.5)]"
          >
            YES
          </button>
          <button
            onClick={handleNoClick}
            style={{ transform: `scale(${noBtnScale})` }}
            className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.5)]"
          >
            NO
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans selection:bg-red-500/30 relative overflow-hidden">
      {/* Video Background */}
      <div className="fixed inset-0 z-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src="https://raw.githubusercontent.com/heil-kaizen/farming-list/main/farm.mp4"
          loop
          playsInline
        />
        {/* Overlay to make text readable */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-red-500/10 rounded-2xl mb-4 ring-1 ring-red-500/20 shadow-lg shadow-red-900/20 backdrop-blur-md">
            <img 
              src="https://raw.githubusercontent.com/heil-kaizen/farming-list/main/image-removebg-preview.png" 
              alt="Logo" 
              className="w-12 h-12 object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2 drop-shadow-lg">Farming Tracker</h1>
          <p className="text-zinc-300 text-lg drop-shadow-md">Manage your list of targets efficiently.</p>
        </header>

        <div className="mb-8">
          <AddTargetForm onAdd={addTarget} />
        </div>

        {error && (
          <div className="bg-red-900/40 border border-red-900/50 text-red-200 p-4 rounded-xl mb-6 flex items-center gap-3 backdrop-blur-md">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
            <button 
              onClick={fetchTargets}
              className="ml-auto px-3 py-1 bg-red-900/40 hover:bg-red-900/60 rounded-lg text-sm font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <RefreshCw className="w-8 h-8 text-zinc-400 animate-spin" />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {targets.length === 0 ? (
              <div className="col-span-2 text-center py-12 border-2 border-dashed border-zinc-700 rounded-xl bg-zinc-900/50 backdrop-blur-sm">
                <p className="text-zinc-400 font-medium">No targets yet. Add someone to the list.</p>
              </div>
            ) : (
              targets.map((target) => (
                <div key={target.id} className="backdrop-blur-sm">
                  <TargetCard
                    target={target}
                    onUpdate={updateTarget}
                    onDelete={deleteTarget}
                  />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
