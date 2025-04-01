import { seoAnalyses, type SeoAnalysis, type InsertSeoAnalysis } from "@shared/schema";
import { z } from "zod";

// Modify the storage interface with any CRUD methods needed
export interface IStorage {
  saveSeoAnalysis(analysis: InsertSeoAnalysis): Promise<SeoAnalysis>;
  getSeoAnalysis(id: number): Promise<SeoAnalysis | undefined>;
  getSeoAnalysisByUrl(url: string): Promise<SeoAnalysis | undefined>;
  getRecentAnalyses(limit?: number): Promise<SeoAnalysis[]>;
}

export class MemStorage implements IStorage {
  private analyses: Map<number, SeoAnalysis>;
  private urlToId: Map<string, number>;
  private currentId: number;

  constructor() {
    this.analyses = new Map();
    this.urlToId = new Map();
    this.currentId = 1;
  }

  async saveSeoAnalysis(analysis: InsertSeoAnalysis): Promise<SeoAnalysis> {
    // Check if URL already exists - if so, update instead of creating new
    const normalizedUrl = this.normalizeUrl(analysis.url);
    const existingId = this.urlToId.get(normalizedUrl);
    
    let id: number;
    if (existingId) {
      id = existingId;
    } else {
      id = this.currentId++;
      this.urlToId.set(normalizedUrl, id);
    }
    
    const seoAnalysis: SeoAnalysis = { ...analysis, id };
    this.analyses.set(id, seoAnalysis);
    
    return seoAnalysis;
  }

  async getSeoAnalysis(id: number): Promise<SeoAnalysis | undefined> {
    return this.analyses.get(id);
  }

  async getSeoAnalysisByUrl(url: string): Promise<SeoAnalysis | undefined> {
    const normalizedUrl = this.normalizeUrl(url);
    const id = this.urlToId.get(normalizedUrl);
    if (id) {
      return this.analyses.get(id);
    }
    return undefined;
  }

  async getRecentAnalyses(limit: number = 10): Promise<SeoAnalysis[]> {
    const analyses = Array.from(this.analyses.values());
    // Sort by most recent ID (higher ID = more recent)
    return analyses.sort((a, b) => b.id - a.id).slice(0, limit);
  }

  // Helper method to normalize URLs for comparison
  private normalizeUrl(url: string): string {
    try {
      const parsed = new URL(url);
      // Remove trailing slash and normalize to lowercase
      let normalized = parsed.origin + parsed.pathname.replace(/\/$/, '');
      normalized = normalized.toLowerCase();
      
      // Include query params if present
      if (parsed.search) {
        normalized += parsed.search;
      }
      
      return normalized;
    } catch (error) {
      // If URL parsing fails, return original
      return url.toLowerCase();
    }
  }
}

export const storage = new MemStorage();
