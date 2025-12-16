// Dashboard stats interface
export interface DashboardStats {
  totalUsers: number;
  ActiveResearcherCount: number;
  PendingResearcherCount:number;
  totalSpecimens: number;
  userMonth:number
  specimenMonth: number;
  systemStatus: string;
  plantFamilies: number
  collectionSites: number
  activeCollectors: number
}



export interface Activity {
  id:string
  title: string;
  description: string;
  type: string;
  timestamp:string
}