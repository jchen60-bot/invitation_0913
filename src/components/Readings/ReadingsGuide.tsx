import React from 'react';
import { BookOpen, CheckCircle, ArrowRight, Layers, Sparkles, HelpCircle } from 'lucide-react';

export const ReadingsGuide: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200">
            UC Berkeley MDes Readings Synthesis &bull; Step 1
          </span>
          <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
            Theoretical Foundations
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Systems Thinking Companion: Donella Meadows &amp; Albert Rutherford
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
          A dedicated structural review mapping the course readings directly to our stem cell and bone marrow donation cluster model and tabling campaign.
        </p>
      </div>

      {/* Grid of the Two Core Texts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Text 1: Donella Meadows */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Thinking in Systems (pp. 11–17)
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                Donella Meadows: Foundations of Systems
              </h3>
            </div>
            <BookOpen className="w-6 h-6 text-emerald-600" />
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Donella Meadows defines a system as: <strong className="text-slate-900">&ldquo;an interconnected set of elements coherently organized in a way that achieves something (its function or purpose).&rdquo;</strong> (p. 11)
          </p>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center">1</span>
                Elements vs. Interconnections vs. Purpose
              </h4>
              <p className="text-slate-600 leading-relaxed">
                <strong>Elements</strong> are tangible parts: volunteer donors, buccal swabs, HLA typing machines, and leukemia patients. But changing elements alone does not change the system. It is the <strong>interconnections</strong> (information flows, genetic compatibility rules, and social trust) that govern behavior.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center">2</span>
                Stocks &amp; Flows (Meadows pp. 14–16)
              </h4>
              <p className="text-slate-600 leading-relaxed">
                A <strong>Stock</strong> is the accumulation of material or information built over time. In our model, the <em>NMDP Registry Stock</em> (41M volunteers) is fed by <strong>Inflows</strong> (campus swab drives, online orders) and drained by <strong>Outflows</strong> (aging past 44, medical deferrals, and contact attrition).
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center">3</span>
                Balancing vs. Reinforcing Feedback Loops
              </h4>
              <p className="text-slate-600 leading-relaxed">
                <strong>Balancing Loops (B1)</strong> create resistance and delays: fear of painful surgery suppresses follow-through. <strong>Reinforcing Loops (R1)</strong> generate virtue spirals: diverse student tabling enriches minority HLA markers, raising match probabilities and deepening community trust.
              </p>
            </div>
          </div>
        </div>

        {/* Text 2: Albert Rutherford */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                Tools for Systems Thinkers (Chapter 3)
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                Albert Rutherford: Page 51 Cluster Map Rules
              </h3>
            </div>
            <Layers className="w-6 h-6 text-purple-600" />
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Page 51 outlines the concrete methodology for clustering systemic actors, identifying boundary conditions, and avoiding linear oversimplification.
          </p>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200">
              <h4 className="font-bold text-purple-950 mb-1 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-purple-600" />
                Rule 1: Centered Focus Subject
              </h4>
              <p className="text-purple-900 leading-relaxed">
                Place the core problem statement at the geometric and conceptual center: <em>Stem Cell &amp; Bone Marrow Donations for Blood Cancers or Disorders</em>.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200">
              <h4 className="font-bold text-purple-950 mb-1 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-purple-600" />
                Rule 2: Thematic Clustering &amp; Color Coding
              </h4>
              <p className="text-purple-900 leading-relaxed">
                Group interconnected variables into macro-clusters with distinct color palettes and an explicit color key (Rutherford emphasizes that colors clarify boundaries without isolating systems).
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200">
              <h4 className="font-bold text-purple-950 mb-1 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-purple-600" />
                Rule 3: Directional Influence &amp; Polarities
              </h4>
              <p className="text-purple-900 leading-relaxed">
                Every arrow must carry explicit direction and polarity: indicating whether a change in variable A amplifies (+) or dampens (-) variable B, alongside highlighting critical bottlenecks and leverage points.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Synthesis Table: How Our Assignment Bridge Connects Everything */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-3">
          Crosswalk: Linking Course Readings to Our NMDP Tabling Campaign
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <th className="p-3 font-bold">Systems Concept</th>
                <th className="p-3 font-bold">Reading Reference</th>
                <th className="p-3 font-bold">Manifestation in Bone Marrow System</th>
                <th className="p-3 font-bold">Our Tabling Intervention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="p-3 font-semibold text-slate-900">Stock &amp; Flow Dynamics</td>
                <td className="p-3">Meadows pp. 14–16</td>
                <td className="p-3">NMDP Registry Stock depleted by donor age-out and attrition.</td>
                <td className="p-3 text-emerald-700 font-medium">Amazon Locker pop-up injects high-vitality 18–40 inflow.</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-900">Information Flow Delay</td>
                <td className="p-3">Meadows Leverage #6</td>
                <td className="p-3">Students believe marrow donation is a painful spinal drill.</td>
                <td className="p-3 text-emerald-700 font-medium">Clarifying that 85% is non-surgical blood apheresis.</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-900">Disparity / Bottleneck</td>
                <td className="p-3">Rutherford p. 51 (Influence links)</td>
                <td className="p-3">Black patients face 29% match odds vs 79% for White patients.</td>
                <td className="p-3 text-emerald-700 font-medium">Leveraging UC Berkeley&apos;s ethnic diversity to expand rare HLA alleles.</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-900">Feedback Measurement</td>
                <td className="p-3">Rutherford Ch. 3</td>
                <td className="p-3">Interventions require continuous tracking of community responsiveness.</td>
                <td className="p-3 text-emerald-700 font-medium">Instrumented QR codes and live click/view/RSVP analytics.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
