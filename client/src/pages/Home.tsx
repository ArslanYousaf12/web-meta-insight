import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  SeoAnalysis, 
  SeoAnalysisRequest, 
  GooglePreview, 
  SocialPreview, 
  FoundTag, 
  ScoreData, 
  Recommendation 
} from "@shared/schema";

import Header from "@/components/Header";
import UrlForm from "@/components/UrlForm";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import ScoreOverview from "@/components/ScoreOverview";
import PreviewTabs from "@/components/PreviewTabs";
import MetaTagsList from "@/components/MetaTagsList";
import Recommendations from "@/components/Recommendations";
import Footer from "@/components/Footer";

export default function Home() {
  const { toast } = useToast();
  const [url, setUrl] = useState<string>("");
  const [results, setResults] = useState<{
    url: string;
    googlePreview: GooglePreview;
    facebookPreview: SocialPreview;
    twitterPreview: SocialPreview;
    foundTags: FoundTag[];
    scoreData: ScoreData;
    recommendations: Recommendation[];
  } | null>(null);

  const mutation = useMutation({
    mutationFn: async (data: SeoAnalysisRequest) => {
      const response = await apiRequest("POST", "/api/analyze", data);
      return response.json();
    },
    onSuccess: (data) => {
      setResults(data);
      toast({
        title: "Analysis complete",
        description: `Successfully analyzed SEO tags for ${data.url}`,
      });
      // Scroll to results
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    },
    onError: (error) => {
      toast({
        title: "Analysis failed",
        description: error.message || "Failed to analyze the website. Please check the URL and try again.",
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = (url: string) => {
    setUrl(url);
    mutation.mutate({ url });
  };

  const handleTryAgain = () => {
    mutation.reset();
  };

  return (
    <div className="font-sans text-gray-800 min-h-screen flex flex-col">
      <Header />
      
      {/* Hero section */}
      <div className="hero-pattern py-12 md:py-20 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-heading">
              SEO Meta Tag Analysis
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Analyze any website's SEO meta tags and get instant insights to improve your search engine visibility
            </p>
          </div>
          
          <UrlForm onAnalyze={handleAnalyze} />
        </div>
      </div>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        {mutation.isPending && (
          <div className="my-8">
            <LoadingState />
          </div>
        )}
        
        {mutation.isError && (
          <div className="my-8">
            <ErrorState 
              message={mutation.error?.message || "Failed to analyze the website. Please check the URL and try again."}
              onTryAgain={handleTryAgain} 
            />
          </div>
        )}
        
        {mutation.isSuccess && results && (
          <div id="results" className="space-y-8 my-8">
            <ScoreOverview 
              analyzedUrl={results.url}
              scoreData={results.scoreData}
            />
            
            <PreviewTabs 
              googlePreview={results.googlePreview}
              facebookPreview={results.facebookPreview}
              twitterPreview={results.twitterPreview} 
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <MetaTagsList tags={results.foundTags} />
              <Recommendations recommendations={results.recommendations} />
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
