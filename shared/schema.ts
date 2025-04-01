import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define the SEO analysis result model
export const seoAnalyses = pgTable("seo_analyses", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  title: text("title"),
  metaDescription: text("meta_description"),
  ogTags: jsonb("og_tags"),
  twitterTags: jsonb("twitter_tags"),
  canonicalUrl: text("canonical_url"),
  robotsTags: text("robots_tags"),
  schemaData: jsonb("schema_data"),
  essentialScore: integer("essential_score"),
  socialScore: integer("social_score"),
  advancedScore: integer("advanced_score"),
  overallScore: integer("overall_score"),
  recommendations: jsonb("recommendations"),
});

export const insertSeoAnalysisSchema = createInsertSchema(seoAnalyses).omit({ 
  id: true 
});

export type InsertSeoAnalysis = z.infer<typeof insertSeoAnalysisSchema>;
export type SeoAnalysis = typeof seoAnalyses.$inferSelect;

// Define tag type schemas for validation
export const metaTagSchema = z.object({
  name: z.string(),
  content: z.string(),
});

export const seoAnalysisRequest = z.object({
  url: z.string().url()
});

export type SeoAnalysisRequest = z.infer<typeof seoAnalysisRequest>;

// Types for the SEO analysis components
export interface TagResult {
  name: string;
  content: string;
  status: 'good' | 'needs-improvement' | 'missing' | 'error';
}

export interface GooglePreview {
  title: string;
  url: string;
  description: string;
  analysis: TagResult[];
}

export interface SocialPreview {
  title: string;
  description: string;
  image: string;
  url: string;
  type?: string;
  analysis: TagResult[];
}

export interface FoundTag {
  type: string;
  icon: string;
  status: 'good' | 'needs-improvement' | 'missing' | 'error';
  content: string[];
}

export interface ScoreData {
  overall: number;
  essential: { score: number, total: number };
  social: { score: number, total: number };
  advanced: { score: number, total: number };
}

export interface Recommendation {
  type: 'critical' | 'improvement' | 'good';
  icon: string;
  title: string;
  description: string;
  link?: { text: string, url: string };
}
