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
    <div className="bg-gray-50 font-sans text-gray-800 min-h-screen flex flex-col">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <UrlForm onAnalyze={handleAnalyze} />
        
        {mutation.isPending && <LoadingState />}
        
        {mutation.isError && (
          <ErrorState 
            message={mutation.error?.message || "Failed to analyze the website. Please check the URL and try again."}
            onTryAgain={handleTryAgain} 
          />
        )}
        
        {mutation.isSuccess && results && (
          <div className="space-y-8">
            <ScoreOverview 
              analyzedUrl={results.url}
              scoreData={results.scoreData}
            />
            
            <PreviewTabs 
              googlePreview={results.googlePreview}
              facebookPreview={results.facebookPreview}
              twitterPreview={results.twitterPreview} 
            />
            
            <MetaTagsList tags={results.foundTags} />
            
            <Recommendations recommendations={results.recommendations} />
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
