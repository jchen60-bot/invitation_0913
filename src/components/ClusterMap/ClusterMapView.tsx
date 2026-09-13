import React, { useState, useMemo, useRef } from 'react';
import { 
  CLUSTERS, 
  CORE_NODE, 
  NODES, 
  EDGES, 
  FEEDBACK_LOOPS 
} from '../../data/clusterMapData';
import { ClusterCategory, ClusterNode, ClusterEdge, LinkType } from '../../types';
import { 
  Filter, 
  RefreshCw, 
  ZoomIn, 
  ZoomOut, 
  Info, 
  Download, 
  Sliders, 
  Sparkles, 
  Layers, 
  AlertCircle,
  HelpCircle,
  X
} from 'lucide-react';

export const ClusterMapView: React.FC = () => {
  const [selectedCluster, setSelectedCluster] = useState<ClusterCategory | 'all'>('all');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('core-system');
  const [activeLoopId, setActiveLoopId] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showRutherfordRubric, setShowRutherfordRubric] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Filtered nodes
  const activeLoop = useMemo(() => {
    return FEEDBACK_LOOPS.find(l => l.id === activeLoopId) || null;
  }, [activeLoopId]);

  const displayedNodes = useMemo(() => {
    return [CORE_NODE, ...NODES];
  }, []);

  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return null;
    if (selectedNodeId === CORE_NODE.id) return CORE_NODE;
    return NODES.find(n => n.id === selectedNodeId) || null;
  }, [selectedNodeId]);

  // Connected edges and neighbor nodes for inspection
  const nodeConnections = useMemo(() => {
    if (!selectedNodeId) return { incoming: [] as ClusterEdge[], outgoing: [] as ClusterEdge[] };
    const incoming = EDGES.filter(e => e.target === selectedNodeId);
    const outgoing = EDGES.filter(e => e.source === selectedNodeId);
    return { incoming, outgoing };
  }, [selectedNodeId]);

  // Handle Pan & Zoom
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.target === svgRef.current || (e.target as HTMLElement).tagName === 'rect') {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedCluster('all');
    setActiveLoopId(null);
    setSelectedNodeId('core-system');
  };

  // Helper to get node position by ID
  const getNodePos = (id: string) => {
    if (id === CORE_NODE.id) return { x: CORE_NODE.x, y: CORE_NODE.y };
    const node = NODES.find(n => n.id === id);
    return node ? { x: node.x, y: node.y } : { x: 500, y: 350 };
  };

  // Node styles by cluster
  const getNodeColor = (cluster: ClusterCategory | 'core') => {
    if (cluster === 'core') return '#be123c'; // deep rose-700
    return CLUSTERS[cluster]?.color || '#475569';
  };

  const isNodeDimmed = (node: ClusterNode) => {
    if (activeLoop) {
      if (node.id === CORE_NODE.id) return false;
      return !activeLoop.nodes.includes(node.id);
    }
    if (selectedCluster === 'all') return false;
    if (node.id === CORE_NODE.id) return false;
    return node.cluster !== selectedCluster;
  };

  const isEdgeDimmed = (edge: ClusterEdge) => {
    if (activeLoop) {
      const sMatch = activeLoop.nodes.includes(edge.source);
      const tMatch = activeLoop.nodes.includes(edge.target);
      return !(sMatch && tMatch);
    }
    if (selectedCluster === 'all') return false;
    const sourceNode = displayedNodes.find(n => n.id === edge.source);
    const targetNode = displayedNodes.find(n => n.id === edge.target);
    const sCluster = sourceNode?.cluster;
    const tCluster = targetNode?.cluster;
    return sCluster !== selectedCluster && tCluster !== selectedCluster;
  };

  const isEdgeActive = (edge: ClusterEdge) => {
    if (selectedNodeId) {
      return edge.source === selectedNodeId || edge.target === selectedNodeId;
    }
    return false;
  };

  const getEdgeStroke = (type: LinkType, polarity: string) => {
    if (type === 'bottleneck') return '#dc2626'; // Bright red
    if (type === 'leverage') return '#059669'; // Emerald
    if (polarity === '-') return '#d97706'; // Amber balancing
    return '#64748b'; // Slate reinforcing/standard
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top Controls & Systems Thinking Context Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200">
                Albert Rutherford Ch. 3 &bull; Page 51 Guidelines
              </span>
              <span className="text-xs font-medium text-slate-500 hidden sm:inline">
                Donella Meadows Systems Model
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Stem Cell &amp; Bone Marrow Donation Systems Cluster Map
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
              Visualizing the interconnections, stocks, balancing barriers, and leverage points across recruitment, HLA genetics, racial equity gaps, and clinical cold-chains.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              id="btn-rutherford-rubric"
              onClick={() => setShowRutherfordRubric(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Page 51 Instructions</span>
            </button>
            <button
              id="btn-export-map"
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export for Slide Deck</span>
            </button>
            <button
              id="btn-reset-map-view"
              onClick={handleResetView}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
              title="Reset View"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Cluster Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Filter Cluster:
          </span>
          <button
            id="filter-cluster-all"
            onClick={() => { setSelectedCluster('all'); setActiveLoopId(null); }}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              selectedCluster === 'all' && !activeLoopId
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Clusters (Full System)
          </button>
          {(Object.keys(CLUSTERS) as ClusterCategory[]).map(catKey => {
            const cluster = CLUSTERS[catKey];
            const isCurrent = selectedCluster === catKey && !activeLoopId;
            return (
              <button
                key={catKey}
                id={`filter-cluster-${catKey}`}
                onClick={() => { setSelectedCluster(catKey); setActiveLoopId(null); }}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all border ${
                  isCurrent
                    ? `${cluster.bgLight} ${cluster.textColor} ${cluster.borderColor} font-bold shadow-xs`
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span
                  className="inline-block w-2 h-2 rounded-full mr-1.5"
                  style={{ backgroundColor: cluster.color }}
                />
                {cluster.name.split('. ')[1] || cluster.name}
              </button>
            );
          })}
        </div>

        {/* Feedback Loop Selector (Meadows pp. 11-17) */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 bg-slate-50/70 p-2.5 rounded-xl">
          <span className="text-xs font-bold text-purple-800 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Meadows Feedback Loops:
          </span>
          {FEEDBACK_LOOPS.map(loop => {
            const isActive = activeLoopId === loop.id;
            return (
              <button
                key={loop.id}
                id={`btn-loop-${loop.id}`}
                onClick={() => {
                  if (isActive) {
                    setActiveLoopId(null);
                  } else {
                    setActiveLoopId(loop.id);
                    setSelectedCluster('all');
                  }
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border ${
                  isActive
                    ? loop.type === 'reinforcing'
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                      : 'bg-amber-600 text-white border-amber-700 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${loop.type === 'reinforcing' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                <span>{loop.name.split(':')[0]}</span>
              </button>
            );
          })}
          {activeLoopId && (
            <button
              onClick={() => setActiveLoopId(null)}
              className="text-xs text-slate-500 hover:text-slate-800 underline ml-auto"
            >
              Clear Loop Focus
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Map Stage & Details Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SVG Canvas (8 cols on lg) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs p-3 relative overflow-hidden flex flex-col">
          {/* Zoom Controls Overlay */}
          <div className="absolute top-5 right-5 z-20 flex items-center bg-white/95 backdrop-blur-xs p-1 rounded-xl shadow-md border border-slate-200 gap-1">
            <button
              id="btn-zoom-in"
              onClick={() => setZoom(z => Math.min(1.8, z + 0.15))}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              id="btn-zoom-out"
              onClick={() => setZoom(z => Math.max(0.6, z - 0.15))}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              id="btn-zoom-reset"
              onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
              className="px-2 py-1 text-xs font-semibold hover:bg-slate-100 rounded-lg text-slate-700"
            >
              {Math.round(zoom * 100)}%
            </button>
          </div>

          {/* Active Loop Banner */}
          {activeLoop && (
            <div className="absolute top-5 left-5 z-20 max-w-md bg-white/95 backdrop-blur-xs p-3 rounded-xl shadow-md border border-slate-200">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    activeLoop.type === 'reinforcing' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {activeLoop.type === 'reinforcing' ? 'Reinforcing Loop (Virtue/Growth)' : 'Balancing Loop (Resistance/Delay)'}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 mt-1">{activeLoop.name}</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{activeLoop.narrative}</p>
                </div>
                <button
                  onClick={() => setActiveLoopId(null)}
                  className="text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Interactive SVG Diagram */}
          <div className="w-full h-[580px] rounded-xl bg-slate-50/70 border border-slate-100 relative overflow-hidden cursor-grab active:cursor-grabbing select-none">
            <svg
              ref={svgRef}
              id="systems-cluster-map-svg"
              viewBox="0 0 1000 700"
              className="w-full h-full"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              style={{
                cursor: isPanning ? 'grabbing' : 'grab',
              }}
            >
              <defs>
                {/* Arrow markers */}
                <marker
                  id="arrow-reinforcing"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
                </marker>
                <marker
                  id="arrow-balancing"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#d97706" />
                </marker>
                <marker
                  id="arrow-bottleneck"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#dc2626" />
                </marker>
                <marker
                  id="arrow-leverage"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#059669" />
                </marker>

                {/* Glow filter for active elements */}
                <filter id="glow-active" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#be123c" floodOpacity="0.25" />
                </filter>
                <filter id="glow-leverage" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#059669" floodOpacity="0.35" />
                </filter>
              </defs>

              {/* Background Grid Pattern */}
              <g opacity="0.4">
                <pattern id="cluster-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.75" />
                </pattern>
                <rect width="1000" height="700" fill="url(#cluster-grid)" />
              </g>

              {/* Root Transform Group for Pan and Zoom */}
              <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
                {/* Cluster Region Enclosures (Faint background halos grouping the 6 clusters) */}
                <g id="cluster-halos" opacity="0.35">
                  {/* Registry Cluster Halo */}
                  <ellipse cx="260" cy="220" rx="140" ry="100" fill="#a7f3d0" />
                  {/* Medical Cluster Halo */}
                  <ellipse cx="700" cy="170" rx="150" ry="110" fill="#bae6fd" />
                  {/* Equity Cluster Halo */}
                  <ellipse cx="760" cy="460" rx="140" ry="120" fill="#fecdd3" />
                  {/* Infrastructure Halo */}
                  <ellipse cx="420" cy="530" rx="130" ry="90" fill="#ddd6fe" />
                  {/* Cultural Barriers Halo */}
                  <ellipse cx="170" cy="460" rx="130" ry="120" fill="#fde68a" />
                  {/* Policy & Institutional Halo */}
                  <ellipse cx="320" cy="100" rx="180" ry="65" fill="#c7d2fe" />
                </g>

                {/* Cluster Boundary Labels */}
                <g id="cluster-labels" fontSize="11" fontWeight="700" opacity="0.7">
                  <text x="130" y="160" fill="#047857">1. REGISTRY &amp; RECRUITMENT</text>
                  <text x="630" y="70" fill="#0369a1">2. BIOLOGICAL &amp; MATCHING</text>
                  <text x="700" y="620" fill="#be123c">3. EQUITY &amp; ACCESS DISPARITIES</text>
                  <text x="310" y="650" fill="#6d28d9">4. LOGISTICS &amp; INFRASTRUCTURE</text>
                  <text x="50" y="580" fill="#b45309">5. PSYCHOSOCIAL BARRIERS</text>
                  <text x="210" y="45" fill="#4338ca">6. INSTITUTIONAL &amp; POLICY</text>
                </g>

                {/* Render Edges */}
                <g id="cluster-edges">
                  {EDGES.map(edge => {
                    const sourcePos = getNodePos(edge.source);
                    const targetPos = getNodePos(edge.target);
                    const isDimmed = isEdgeDimmed(edge);
                    const isActive = isEdgeActive(edge);
                    const strokeColor = getEdgeStroke(edge.type, edge.polarity);
                    const markerId =
                      edge.type === 'bottleneck'
                        ? 'url(#arrow-bottleneck)'
                        : edge.type === 'leverage'
                        ? 'url(#arrow-leverage)'
                        : edge.polarity === '-'
                        ? 'url(#arrow-balancing)'
                        : 'url(#arrow-reinforcing)';

                    // Calculate curve midpoint
                    const dx = targetPos.x - sourcePos.x;
                    const dy = targetPos.y - sourcePos.y;
                    const midX = (sourcePos.x + targetPos.x) / 2;
                    const midY = (sourcePos.y + targetPos.y) / 2;
                    // slight natural curve offset
                    const cx = midX - dy * 0.08;
                    const cy = midY + dx * 0.08;

                    return (
                      <g
                        key={edge.id}
                        id={`edge-${edge.id}`}
                        opacity={isDimmed ? 0.15 : isActive ? 1 : 0.75}
                        className="transition-opacity duration-200 cursor-pointer"
                        onClick={() => setSelectedNodeId(edge.source)}
                      >
                        <path
                          d={`M ${sourcePos.x} ${sourcePos.y} Q ${cx} ${cy} ${targetPos.x} ${targetPos.y}`}
                          fill="none"
                          stroke={isActive ? '#0f172a' : strokeColor}
                          strokeWidth={isActive ? 3 : edge.type === 'bottleneck' ? 2.5 : 1.75}
                          strokeDasharray={edge.polarity === '-' ? '4,3' : undefined}
                          markerEnd={markerId}
                        />
                        {/* Polarity Tag badge on link */}
                        <circle cx={cx} cy={cy} r="8" fill="white" stroke={strokeColor} strokeWidth="1.5" />
                        <text
                          x={cx}
                          y={cy + 3}
                          textAnchor="middle"
                          fontSize="9"
                          fontWeight="bold"
                          fill={strokeColor}
                        >
                          {edge.polarity === 'critical' ? '!' : edge.polarity}
                        </text>
                      </g>
                    );
                  })}
                </g>

                {/* Render Peripheral Nodes */}
                <g id="cluster-nodes">
                  {NODES.map(node => {
                    const isSelected = selectedNodeId === node.id;
                    const isDimmed = isNodeDimmed(node);
                    const clusterColor = getNodeColor(node.cluster);
                    const isLeverage = !!node.leveragePoint;

                    return (
                      <g
                        key={node.id}
                        id={`node-${node.id}`}
                        transform={`translate(${node.x}, ${node.y})`}
                        onClick={() => setSelectedNodeId(node.id)}
                        className="cursor-pointer transition-all duration-200"
                        opacity={isDimmed ? 0.2 : 1}
                      >
                        {/* Leverage Point Star Halo */}
                        {isLeverage && (
                          <circle
                            r="28"
                            fill="none"
                            stroke="#059669"
                            strokeWidth="2"
                            strokeDasharray="3,3"
                            className="animate-spin-slow"
                          />
                        )}

                        {/* Node Base Circle */}
                        <circle
                          r="22"
                          fill={isSelected ? '#ffffff' : '#ffffff'}
                          stroke={isSelected ? '#0f172a' : clusterColor}
                          strokeWidth={isSelected ? 3.5 : 2.5}
                          filter={isSelected ? 'url(#glow-active)' : undefined}
                        />

                        {/* Inner cluster indicator */}
                        <circle r="9" fill={clusterColor} />

                        {/* Node Label Card */}
                        <g transform="translate(0, 32)">
                          <rect
                            x="-70"
                            y="0"
                            width="140"
                            height="24"
                            rx="5"
                            fill={isSelected ? '#0f172a' : '#ffffff'}
                            stroke={isSelected ? '#0f172a' : '#cbd5e1'}
                            strokeWidth="1"
                            filter="drop-shadow(0 1px 2px rgba(0,0,0,0.06))"
                          />
                          <text
                            x="0"
                            y="15"
                            textAnchor="middle"
                            fontSize="9.5"
                            fontWeight="700"
                            fill={isSelected ? '#ffffff' : '#1e293b'}
                          >
                            {node.label.length > 20 ? node.label.substring(0, 18) + '…' : node.label}
                          </text>
                        </g>

                        {/* Meadows Classification Badge */}
                        <g transform="translate(0, -26)">
                          <rect
                            x="-30"
                            y="-6"
                            width="60"
                            height="12"
                            rx="3"
                            fill={clusterColor}
                          />
                          <text
                            x="0"
                            y="3"
                            textAnchor="middle"
                            fontSize="7.5"
                            fontWeight="700"
                            fill="#ffffff"
                          >
                            {node.meadowsElement}
                          </text>
                        </g>
                      </g>
                    );
                  })}
                </g>

                {/* Central Core Node (Rutherford Page 51 Core Subject) */}
                <g
                  id="node-core-system"
                  transform={`translate(${CORE_NODE.x}, ${CORE_NODE.y})`}
                  onClick={() => setSelectedNodeId(CORE_NODE.id)}
                  className="cursor-pointer"
                >
                  {/* Outer pulse ring */}
                  <circle
                    r="58"
                    fill="#ffe4e6"
                    stroke="#f43f5e"
                    strokeWidth="1.5"
                    strokeDasharray="4,3"
                    className="animate-pulse"
                  />
                  <circle
                    r="48"
                    fill="#be123c"
                    stroke="#881337"
                    strokeWidth="3.5"
                    filter="url(#glow-active)"
                  />
                  <text
                    x="0"
                    y="-8"
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="800"
                    fill="#ffffff"
                  >
                    SYSTEM CORE
                  </text>
                  <text
                    x="0"
                    y="6"
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="600"
                    fill="#fecdd3"
                  >
                    STEM CELL &amp;
                  </text>
                  <text
                    x="0"
                    y="18"
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="600"
                    fill="#fecdd3"
                  >
                    BONE MARROW
                  </text>
                  <text
                    x="0"
                    y="30"
                    textAnchor="middle"
                    fontSize="8"
                    fontWeight="500"
                    fill="#ffe4e6"
                  >
                    DONATIONS
                  </text>
                </g>
              </g>
            </svg>
          </div>

          {/* Color Key & Legend (Mandated by Rutherford page 51 instructions) */}
          <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-600" />
                Cluster Map Color Key &amp; Relational Legend (Albert Rutherford p. 51)
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Click any node to inspect system leverage points
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-[11px]">
              {(Object.keys(CLUSTERS) as ClusterCategory[]).map(catKey => {
                const cluster = CLUSTERS[catKey];
                return (
                  <div key={catKey} className="flex items-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: cluster.color }}
                    />
                    <span className="font-semibold text-slate-700 truncate" title={cluster.name}>
                      {cluster.name.split('. ')[1] || cluster.name}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Relational Links Legend */}
            <div className="flex flex-wrap items-center gap-4 mt-2 pt-2 border-t border-slate-200/60 text-[11px] text-slate-600">
              <div className="flex items-center gap-1">
                <span className="w-4 h-0.5 bg-slate-600 inline-block" />
                <span>Reinforcing Link (+)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-4 h-0.5 bg-amber-500 border-b border-dashed border-amber-600 inline-block" />
                <span>Balancing / Delay (-)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-red-600 text-white text-[8px] font-bold flex items-center justify-center">!</span>
                <span>Critical Bottleneck</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full border border-emerald-600 border-dashed text-emerald-700 text-[9px] font-bold flex items-center justify-center">*</span>
                <span>Meadows Leverage Point</span>
              </div>
            </div>
          </div>
        </div>

        {/* Node Inspector Drawer (4 cols on lg) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {selectedNode ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col gap-4">
              {/* Header */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span
                    className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor:
                        selectedNode.cluster === 'core'
                          ? '#ffe4e6'
                          : CLUSTERS[selectedNode.cluster]?.bgLight || '#f1f5f9',
                      color:
                        selectedNode.cluster === 'core'
                          ? '#be123c'
                          : CLUSTERS[selectedNode.cluster]?.color || '#334155',
                    }}
                  >
                    {selectedNode.cluster === 'core'
                      ? 'System Purpose'
                      : CLUSTERS[selectedNode.cluster]?.name}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {selectedNode.meadowsElement}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 leading-tight">
                  {selectedNode.label}
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  {selectedNode.shortDesc}
                </p>
              </div>

              {/* Statistics highlight */}
              {selectedNode.stats && (
                <div className="bg-rose-50/70 border border-rose-200/80 rounded-xl p-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block mb-0.5">
                    Critical System Data
                  </span>
                  <p className="text-xs font-semibold text-rose-900 leading-relaxed">
                    {selectedNode.stats}
                  </p>
                </div>
              )}

              {/* Deep Systems Thinking Analysis (Donella Meadows pp. 11-17) */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-purple-600" />
                  Systems Dynamics Analysis
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  {selectedNode.detailedAnalysis}
                </p>
              </div>

              {/* Leverage Point (Meadows 12 Leverage Points) */}
              {selectedNode.leveragePoint && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1 mb-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    High-Impact Leverage Intervention
                  </span>
                  <p className="text-xs text-emerald-900 font-medium leading-relaxed">
                    {selectedNode.leveragePoint}
                  </p>
                </div>
              )}

              {/* Relational Interconnections */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  System Interconnections ({nodeConnections.incoming.length + nodeConnections.outgoing.length})
                </h4>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {nodeConnections.incoming.map(edge => {
                    const src = displayedNodes.find(n => n.id === edge.source);
                    return (
                      <div
                        key={edge.id}
                        onClick={() => setSelectedNodeId(edge.source)}
                        className="text-xs p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/60 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-semibold">
                          <span>INFLUENCED BY:</span>
                          <span className="text-slate-900 font-bold">{src?.label}</span>
                        </div>
                        <p className="text-slate-700 text-[11px] mt-0.5">{edge.description}</p>
                      </div>
                    );
                  })}

                  {nodeConnections.outgoing.map(edge => {
                    const tgt = displayedNodes.find(n => n.id === edge.target);
                    return (
                      <div
                        key={edge.id}
                        onClick={() => setSelectedNodeId(edge.target)}
                        className="text-xs p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/60 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-semibold">
                          <span>INFLUENCES:</span>
                          <span className="text-slate-900 font-bold">{tgt?.label}</span>
                        </div>
                        <p className="text-slate-700 text-[11px] mt-0.5">{edge.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
              Select any node on the map to inspect its systems interconnections.
            </div>
          )}

          {/* Quick Context Card: Why Blood Stem Cells Matter */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 text-rose-400 mb-2">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Assignment Prompt Fact</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
              &ldquo;Approximately every 3-4 minutes, someone in the U.S. is diagnosed with a blood cancer or disorder. Blood stem cells live in bone marrow and blood. When donated, these healthy cells start producing new cells to replace damaged ones and restore their blood and immune systems.&rdquo;
            </p>
            <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
              <span>National Marrow Donor Program (NMDP)</span>
              <span className="text-rose-400 font-semibold">UC Berkeley MDes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rutherford Page 51 Rubric Modal */}
      {showRutherfordRubric && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpenIcon className="w-5 h-5 text-purple-600" />
                Albert Rutherford &bull; Page 51 Cluster Map Checklist
              </h3>
              <button
                onClick={() => setShowRutherfordRubric(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs sm:text-sm text-slate-700">
              <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
                <h4 className="font-bold text-purple-900 mb-1">
                  How This Model Fulfills the Page 51 Instructions:
                </h4>
                <p className="text-purple-800 text-xs">
                  Tools for Systems Thinkers Chapter 3 specifies seven sequential steps for building an effective cluster map. Here is how each criterion is implemented:
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">1</span>
                  <div>
                    <h5 className="font-bold text-slate-900">Define Central Core Subject</h5>
                    <p className="text-xs text-slate-600">The red center node &ldquo;Stem Cell &amp; Bone Marrow Donation System&rdquo; anchors all feedback interactions.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">2</span>
                  <div>
                    <h5 className="font-bold text-slate-900">Establish Distinct Thematic Clusters</h5>
                    <p className="text-xs text-slate-600">6 dedicated clusters: Registry Dynamics, Biological/Medical Matching, Equity Disparities, Healthcare Logistics, Psychosocial Barriers, and Institutional Policy.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">3</span>
                  <div>
                    <h5 className="font-bold text-slate-900">Map Inter-Cluster Connections &amp; Polarities</h5>
                    <p className="text-xs text-slate-600">Directional links mapped with (+) reinforcing, (-) balancing/delay, and critical bottleneck flags.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">4</span>
                  <div>
                    <h5 className="font-bold text-slate-900">Provide a Color-Coded Key</h5>
                    <p className="text-xs text-slate-600">A comprehensive color legend is docked beneath the canvas detailing both cluster categories and line types.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">5</span>
                  <div>
                    <h5 className="font-bold text-slate-900">Identify Feedback Loops (Donella Meadows)</h5>
                    <p className="text-xs text-slate-600">Interactive filters highlight Reinforcing Loop R1 (Virtue Spiral of Registry Diversity) and Balancing Loop B1 (Misconception Attrition Drag).</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowRutherfordRubric(false)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl"
                >
                  Got It
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export / Slide Deck Instructions Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Download className="w-5 h-5 text-slate-700" />
                Export Cluster Map for Slide Deck
              </h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs sm:text-sm text-slate-600">
              <p>
                Per Assignment Step 2: <strong className="text-slate-900">&ldquo;Include a scan or photo of your Cluster Map in this assignment page and in this Google Slide deck.&rdquo;</strong>
              </p>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <p className="font-semibold text-slate-800">Tips for Presenting in Google Slides:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Use your system&apos;s native screenshot tool (<strong>Cmd + Shift + 4</strong> on Mac, or <strong>Win + Shift + S</strong> on Windows) to capture the diagram directly with the Color Key.</li>
                  <li>Click <strong>&ldquo;Full System&rdquo;</strong> to capture the complete overview, or focus on <strong>Loop R1</strong> to spotlight racial equity leverage.</li>
                  <li>Copy the 3-6 sentence synthesis from the <em>Interaction Tracker</em> tab to paste directly onto your slide speaker notes!</li>
                </ul>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl"
                >
                  Ready to Capture
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function BookOpenIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  );
}
