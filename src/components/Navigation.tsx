import React from 'react';
import { Network, Mail, BarChart3, BookOpen, HeartPulse } from 'lucide-react';
import { CampaignStats } from '../types';

interface NavigationProps {
  activeTab: 'clustermap' | 'invitation' | 'analytics' | 'readings';
  setActiveTab: (tab: 'clustermap' | 'invitation' | 'analytics' | 'readings') => void;
  stats: CampaignStats;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab, stats }) => {
  const totalInteractions =
    stats.pageViews +
    stats.qrScans +
    stats.calendarAdds +
    stats.rsvps +
    stats.swabChecks +
    stats.linkShares +
    stats.directionsClicks;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between py-3 gap-3">
          {/* Brand & Project Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-rose-200 shrink-0">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                  UC Berkeley MDes
                </span>
                <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
                  Systems Thinking &times; NMDP
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Blood Stem Cell & Marrow Systems Studio
              </h1>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 overflow-x-auto max-w-full">
            <button
              id="nav-tab-clustermap"
              onClick={() => setActiveTab('clustermap')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'clustermap'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Network className="w-4 h-4 text-emerald-600" />
              <span>1. Systems Cluster Map</span>
            </button>

            <button
              id="nav-tab-invitation"
              onClick={() => setActiveTab('invitation')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'invitation'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Mail className="w-4 h-4 text-rose-600" />
              <span>2. NMDP Tabling Invitation</span>
            </button>

            <button
              id="nav-tab-analytics"
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span>3. Interaction Tracker</span>
              <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-1.5 py-0.2 rounded-full">
                {totalInteractions}
              </span>
            </button>

            <button
              id="nav-tab-readings"
              onClick={() => setActiveTab('readings')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'readings'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-purple-600" />
              <span>Readings Guide</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
