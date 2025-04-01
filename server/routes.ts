import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import fetch from "node-fetch";
import { load } from "cheerio";
import { seoAnalysisRequest } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { analyzeSeoTags, ParsedMetaTags } from "../client/src/lib/seoAnalyzer";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create API routes for the SEO analyzer
  app.post("/api/analyze", async (req, res) => {
    try {
      // Validate the request
      const validatedData = seoAnalysisRequest.parse(req.body);
      const url = validatedData.url;
      
      try {
        // Fetch the HTML from the URL
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; SEOTagAnalyzer/1.0; +https://seotaganalyzer.com)'
          }
        });
        
        if (!response.ok) {
          return res.status(400).json({ 
            message: `Failed to fetch the URL: ${response.statusText}` 
          });
        }
        
        const html = await response.text();
        
        // Parse the HTML to extract meta tags
        const parsedTags = parseMetaTags(html);
        
        // Analyze the tags
        const analysisResult = analyzeSeoTags(url, parsedTags);
        
        // Store the analysis result in the database
        await storage.saveSeoAnalysis({
          url,
          title: parsedTags.title,
          metaDescription: parsedTags.metaDescription,
          ogTags: parsedTags.ogTags,
          twitterTags: parsedTags.twitterTags,
          canonicalUrl: parsedTags.canonicalUrl,
          robotsTags: parsedTags.robotsTags,
          schemaData: parsedTags.schemaData,
          essentialScore: analysisResult.scoreData.essential.score,
          socialScore: analysisResult.scoreData.social.score,
          advancedScore: analysisResult.scoreData.advanced.score,
          overallScore: analysisResult.scoreData.overall,
          recommendations: analysisResult.recommendations
        });
        
        // Return the analysis result
        return res.json(analysisResult);
        
      } catch (error) {
        console.error("Error analyzing website:", error);
        return res.status(500).json({ 
          message: "Failed to analyze the website. Please try again later." 
        });
      }
      
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      return res.status(400).json({ 
        message: "Invalid request. Please provide a valid URL." 
      });
    }
  });

  // Get recent analyses
  app.get("/api/recent-analyses", async (req, res) => {
    try {
      const analyses = await storage.getRecentAnalyses();
      return res.json(analyses);
    } catch (error) {
      console.error("Error fetching recent analyses:", error);
      return res.status(500).json({
        message: "Failed to fetch recent analyses. Please try again later."
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

/**
 * Parses HTML to extract meta tags and other SEO-relevant information
 * @param html HTML content to parse
 * @returns Parsed meta tags
 */
function parseMetaTags(html: string): ParsedMetaTags {
  const $ = load(html);
  const parsedTags: ParsedMetaTags = {
    ogTags: {},
    twitterTags: {},
    schemaData: []
  };
  
  // Extract title
  parsedTags.title = $('title').text().trim();
  
  // Extract meta description
  parsedTags.metaDescription = $('meta[name="description"]').attr('content');
  
  // Extract canonical URL
  parsedTags.canonicalUrl = $('link[rel="canonical"]').attr('href');
  
  // Extract robots meta
  parsedTags.robotsTags = $('meta[name="robots"]').attr('content');
  
  // Extract Open Graph tags
  $('meta[property^="og:"]').each((_, element) => {
    const property = $(element).attr('property');
    const content = $(element).attr('content');
    if (property && content) {
      parsedTags.ogTags[property] = content;
    }
  });
  
  // Extract Twitter Card tags
  $('meta[name^="twitter:"]').each((_, element) => {
    const name = $(element).attr('name');
    const content = $(element).attr('content');
    if (name && content) {
      parsedTags.twitterTags[name] = content;
    }
  });
  
  // Extract Schema.org structured data
  $('script[type="application/ld+json"]').each((_, element) => {
    try {
      const schemaText = $(element).html();
      if (schemaText) {
        parsedTags.schemaData?.push(schemaText.trim());
      }
    } catch (error) {
      console.error("Error parsing schema data:", error);
    }
  });
  
  return parsedTags;
}
