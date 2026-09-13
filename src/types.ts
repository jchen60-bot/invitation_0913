export type ClusterCategory =
  | 'registry'
  | 'medical'
  | 'equity'
  | 'infrastructure'
  | 'cultural'
  | 'policy';

export interface ClusterInfo {
  id: ClusterCategory;
  name: string;
  color: string;
  bgLight: string;
  borderColor: string;
  textColor: string;
  description: string;
  meadowsStockOrFlow: string;
}

export type LinkType = 'reinforcing' | 'balancing' | 'bottleneck' | 'leverage';

export interface ClusterNode {
  id: string;
  cluster: ClusterCategory | 'core';
  label: string;
  shortDesc: string;
  detailedAnalysis: string;
  meadowsElement: 'Stock' | 'Flow' | 'Feedback Loop' | 'Balancing Loop' | 'Reinforcing Loop' | 'Information Link' | 'Core Goal';
  leveragePoint?: string;
  stats?: string;
  x: number;
  y: number;
}

export interface ClusterEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  type: LinkType;
  polarity: '+' | '-' | 'delay' | 'critical';
  description: string;
}

export interface FeedbackLoop {
  id: string;
  name: string;
  type: 'reinforcing' | 'balancing';
  nodes: string[];
  narrative: string;
  impactOnPatients: string;
}

export interface InteractionLogItem {
  id: string;
  timestamp: string;
  action: 'page_view' | 'qr_scan' | 'calendar_add' | 'rsvp' | 'swab_check' | 'link_share' | 'directions_click';
  label: string;
  source?: string;
}

export interface CampaignStats {
  pageViews: number;
  qrScans: number;
  calendarAdds: number;
  rsvps: number;
  swabChecks: number;
  linkShares: number;
  directionsClicks: number;
}
