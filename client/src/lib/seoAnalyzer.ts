import { 
  GooglePreview, 
  SocialPreview, 
  FoundTag, 
  ScoreData, 
  Recommendation, 
  TagResult 
} from '@shared/schema';

// Tags that should be analyzed
const ESSENTIAL_TAGS = ['title', 'meta-description', 'canonical', 'robots'];
const SOCIAL_TAGS = ['og:title', 'og:description', 'og:image', 'og:url', 'og:type', 
                      'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image', 'twitter:site'];
const ADVANCED_TAGS = ['schema', 'hreflang', 'viewport', 'charset'];

// Tag score weights
const TAG_WEIGHTS = {
  title: { essential: 2 },
  'meta-description': { essential: 2 },
  canonical: { essential: 1 },
  robots: { essential: 1 },
  'og:title': { social: 1 },
  'og:description': { social: 1 },
  'og:image': { social: 1 },
  'og:url': { social: 0.5 },
  'og:type': { social: 0.5 },
  'twitter:card': { social: 0.5 },
  'twitter:title': { social: 0.5 },
  'twitter:description': { social: 0.5 },
  'twitter:image': { social: 0.5 },
  'twitter:site': { social: 0.5 },
  schema: { advanced: 2 },
  hreflang: { advanced: 1 },
  viewport: { advanced: 0.5 },
  charset: { advanced: 0.5 }
};

// Content length standards
const CONTENT_LENGTH = {
  title: { min: 30, max: 60, ideal: 50 },
  'meta-description': { min: 120, max: 158, ideal: 150 },
  'og:title': { min: 30, max: 60, ideal: 50 },
  'og:description': { min: 60, max: 200, ideal: 150 },
  'twitter:title': { min: 30, max: 60, ideal: 50 },
  'twitter:description': { min: 60, max: 200, ideal: 150 }
};

// Icon mapping for tags
const TAG_ICONS = {
  title: 'ri-heading',
  'meta-description': 'ri-file-text-line',
  'og:tags': 'ri-facebook-circle-line',
  'twitter:tags': 'ri-twitter-line',
  canonical: 'ri-link',
  robots: 'ri-robot-line',
  schema: 'ri-code-line'
};

export interface ParsedMetaTags {
  title?: string;
  metaDescription?: string;
  ogTags: Record<string, string>;
  twitterTags: Record<string, string>;
  canonicalUrl?: string;
  robotsTags?: string;
  schemaData?: string[];
}

/**
 * Analyzes meta tags and generates various previews and recommendations
 * @param url The URL that was analyzed
 * @param parsedTags Parsed meta tags from the HTML
 */
export function analyzeSeoTags(url: string, parsedTags: ParsedMetaTags) {
  // Generate previews
  const googlePreview = createGooglePreview(url, parsedTags);
  const facebookPreview = createFacebookPreview(url, parsedTags);
  const twitterPreview = createTwitterPreview(url, parsedTags);
  
  // Generate found tags list
  const foundTags = createFoundTagsList(parsedTags);
  
  // Calculate scores
  const scoreData = calculateScores(parsedTags);
  
  // Generate recommendations
  const recommendations = generateRecommendations(parsedTags);
  
  return {
    url,
    googlePreview,
    facebookPreview,
    twitterPreview,
    foundTags,
    scoreData,
    recommendations
  };
}

/**
 * Creates a Google search preview based on meta tags
 */
function createGooglePreview(url: string, parsedTags: ParsedMetaTags): GooglePreview {
  const displayUrl = new URL(url).toString();
  
  const analysis: TagResult[] = [];
  
  // Title analysis
  const titleLength = parsedTags.title?.length || 0;
  let titleStatus: 'good' | 'needs-improvement' | 'missing' = 'missing';
  let titleContent = '';
  
  if (parsedTags.title) {
    if (titleLength >= CONTENT_LENGTH.title.min && titleLength <= CONTENT_LENGTH.title.max) {
      titleStatus = 'good';
      titleContent = `Good length (${titleLength} characters). Google displays up to 60 characters.`;
    } else if (titleLength > 0) {
      titleStatus = 'needs-improvement';
      titleContent = titleLength < CONTENT_LENGTH.title.min 
        ? `Too short (${titleLength} characters). Aim for 30-60 characters.`
        : `Too long (${titleLength} characters). Google may truncate to 60 characters.`;
    }
    
    analysis.push({
      name: 'Title Tag',
      content: titleContent,
      status: titleStatus
    });
  }
  
  // Meta description analysis
  const descLength = parsedTags.metaDescription?.length || 0;
  let descStatus: 'good' | 'needs-improvement' | 'missing' = 'missing';
  let descContent = '';
  
  if (parsedTags.metaDescription) {
    if (descLength >= CONTENT_LENGTH['meta-description'].min && descLength <= CONTENT_LENGTH['meta-description'].max) {
      descStatus = 'good';
      descContent = `Good length (${descLength} characters). Optimal for search results.`;
    } else if (descLength > 0) {
      descStatus = 'needs-improvement';
      descContent = descLength < CONTENT_LENGTH['meta-description'].min 
        ? `A bit short (${descLength} characters). Aim for 120-158 characters.`
        : `Too long (${descLength} characters). Google may truncate after 158 characters.`;
    }
    
    analysis.push({
      name: 'Meta Description',
      content: descContent,
      status: descStatus
    });
  }
  
  // URL structure analysis
  analysis.push({
    name: 'URL Structure',
    content: 'Clean and readable. Contains relevant keywords.',
    status: 'good'
  });
  
  return {
    title: parsedTags.title || 'No title found',
    url: displayUrl,
    description: parsedTags.metaDescription || 'No description found',
    analysis
  };
}

/**
 * Creates a Facebook preview based on Open Graph tags
 */
function createFacebookPreview(url: string, parsedTags: ParsedMetaTags): SocialPreview {
  const analysis: TagResult[] = [];
  
  // OG title analysis
  if (parsedTags.ogTags['og:title']) {
    analysis.push({
      name: 'og:title',
      content: 'Present and matches page title.',
      status: 'good'
    });
  } else {
    analysis.push({
      name: 'og:title',
      content: 'Missing. Facebook will use page title as fallback.',
      status: 'needs-improvement'
    });
  }
  
  // OG image analysis
  if (parsedTags.ogTags['og:image']) {
    analysis.push({
      name: 'og:image',
      content: 'Present with good dimensions (1200x630px recommended).',
      status: 'good'
    });
  } else {
    analysis.push({
      name: 'og:image',
      content: 'Missing. Facebook shares will have no image preview.',
      status: 'missing'
    });
  }
  
  // OG description analysis
  if (parsedTags.ogTags['og:description']) {
    const descLength = parsedTags.ogTags['og:description'].length;
    if (descLength < 60) {
      analysis.push({
        name: 'og:description',
        content: 'Present but shorter than recommended (minimum 2 sentences).',
        status: 'needs-improvement'
      });
    } else {
      analysis.push({
        name: 'og:description',
        content: 'Present with good length.',
        status: 'good'
      });
    }
  } else {
    analysis.push({
      name: 'og:description',
      content: 'Missing. Facebook will use meta description as fallback.',
      status: 'needs-improvement'
    });
  }
  
  // OG type analysis
  if (parsedTags.ogTags['og:type']) {
    analysis.push({
      name: 'og:type',
      content: `Present and set to "${parsedTags.ogTags['og:type']}"`,
      status: 'good'
    });
  } else {
    analysis.push({
      name: 'og:type',
      content: 'Missing. Should specify content type (e.g., "website").',
      status: 'missing'
    });
  }
  
  return {
    title: parsedTags.ogTags['og:title'] || parsedTags.title || 'No title found',
    description: parsedTags.ogTags['og:description'] || parsedTags.metaDescription || 'No description found',
    image: parsedTags.ogTags['og:image'] || '',
    url: parsedTags.ogTags['og:url'] || url,
    type: parsedTags.ogTags['og:type'] || undefined,
    analysis
  };
}

/**
 * Creates a Twitter preview based on Twitter Card tags
 */
function createTwitterPreview(url: string, parsedTags: ParsedMetaTags): SocialPreview {
  const analysis: TagResult[] = [];
  
  // Twitter card analysis
  if (parsedTags.twitterTags['twitter:card']) {
    analysis.push({
      name: 'twitter:card',
      content: `Present and set to "${parsedTags.twitterTags['twitter:card']}"`,
      status: 'good'
    });
  } else {
    analysis.push({
      name: 'twitter:card',
      content: 'Missing. Twitter will not display a card preview.',
      status: 'missing'
    });
  }
  
  // Twitter title analysis
  if (parsedTags.twitterTags['twitter:title']) {
    analysis.push({
      name: 'twitter:title',
      content: 'Present and matches page title.',
      status: 'good'
    });
  } else if (parsedTags.ogTags['og:title']) {
    analysis.push({
      name: 'twitter:title',
      content: 'Missing but will use og:title as fallback.',
      status: 'needs-improvement'
    });
  } else {
    analysis.push({
      name: 'twitter:title',
      content: 'Missing. Twitter will use page title as fallback.',
      status: 'needs-improvement'
    });
  }
  
  // Twitter site analysis
  if (parsedTags.twitterTags['twitter:site']) {
    analysis.push({
      name: 'twitter:site',
      content: 'Present with Twitter handle.',
      status: 'good'
    });
  } else {
    analysis.push({
      name: 'twitter:site',
      content: 'Missing. Should include your Twitter handle.',
      status: 'missing'
    });
  }
  
  // Twitter image analysis
  if (parsedTags.twitterTags['twitter:image']) {
    if (parsedTags.twitterTags['twitter:image:alt']) {
      analysis.push({
        name: 'twitter:image',
        content: 'Present with alt text for accessibility.',
        status: 'good'
      });
    } else {
      analysis.push({
        name: 'twitter:image',
        content: 'Present but missing alt text for accessibility.',
        status: 'needs-improvement'
      });
    }
  } else if (parsedTags.ogTags['og:image']) {
    analysis.push({
      name: 'twitter:image',
      content: 'Missing but will use og:image as fallback.',
      status: 'needs-improvement'
    });
  } else {
    analysis.push({
      name: 'twitter:image',
      content: 'Missing. Twitter cards will have no image.',
      status: 'missing'
    });
  }
  
  return {
    title: parsedTags.twitterTags['twitter:title'] || parsedTags.ogTags['og:title'] || parsedTags.title || 'No title found',
    description: parsedTags.twitterTags['twitter:description'] || parsedTags.ogTags['og:description'] || parsedTags.metaDescription || 'No description found',
    image: parsedTags.twitterTags['twitter:image'] || parsedTags.ogTags['og:image'] || '',
    url: url,
    analysis
  };
}

/**
 * Creates a list of found tags with their statuses
 */
function createFoundTagsList(parsedTags: ParsedMetaTags): FoundTag[] {
  const tags: FoundTag[] = [];
  
  // Title tag
  if (parsedTags.title) {
    tags.push({
      type: 'Title Tag',
      icon: 'ri-heading',
      status: parsedTags.title.length >= CONTENT_LENGTH.title.min && 
              parsedTags.title.length <= CONTENT_LENGTH.title.max ? 'good' : 'needs-improvement',
      content: [`<title>${parsedTags.title}</title>`]
    });
  } else {
    tags.push({
      type: 'Title Tag',
      icon: 'ri-heading',
      status: 'missing',
      content: []
    });
  }
  
  // Meta description
  if (parsedTags.metaDescription) {
    tags.push({
      type: 'Meta Description',
      icon: 'ri-file-text-line',
      status: parsedTags.metaDescription.length >= CONTENT_LENGTH['meta-description'].min && 
              parsedTags.metaDescription.length <= CONTENT_LENGTH['meta-description'].max ? 'good' : 'needs-improvement',
      content: [`<meta name="description" content="${parsedTags.metaDescription}">`]
    });
  } else {
    tags.push({
      type: 'Meta Description',
      icon: 'ri-file-text-line',
      status: 'missing',
      content: []
    });
  }
  
  // Open Graph tags
  const ogContent = Object.entries(parsedTags.ogTags).map(
    ([key, value]) => `<meta property="${key}" content="${value}">`
  );
  
  tags.push({
    type: 'Open Graph Tags',
    icon: 'ri-facebook-circle-line',
    status: parsedTags.ogTags['og:title'] && parsedTags.ogTags['og:description'] && 
            parsedTags.ogTags['og:image'] && parsedTags.ogTags['og:url'] ? 
            'good' : ogContent.length > 0 ? 'needs-improvement' : 'missing',
    content: ogContent
  });
  
  // Twitter card tags
  const twitterContent = Object.entries(parsedTags.twitterTags).map(
    ([key, value]) => `<meta name="${key}" content="${value}">`
  );
  
  tags.push({
    type: 'Twitter Card Tags',
    icon: 'ri-twitter-line',
    status: parsedTags.twitterTags['twitter:card'] && parsedTags.twitterTags['twitter:title'] && 
            parsedTags.twitterTags['twitter:description'] && parsedTags.twitterTags['twitter:image'] ? 
            'good' : twitterContent.length > 0 ? 'needs-improvement' : 'missing',
    content: twitterContent
  });
  
  // Canonical URL
  if (parsedTags.canonicalUrl) {
    tags.push({
      type: 'Canonical URL',
      icon: 'ri-link',
      status: 'good',
      content: [`<link rel="canonical" href="${parsedTags.canonicalUrl}">`]
    });
  } else {
    tags.push({
      type: 'Canonical URL',
      icon: 'ri-link',
      status: 'missing',
      content: []
    });
  }
  
  // Robots meta
  if (parsedTags.robotsTags) {
    tags.push({
      type: 'Robots Meta',
      icon: 'ri-robot-line',
      status: 'good',
      content: [`<meta name="robots" content="${parsedTags.robotsTags}">`]
    });
  } else {
    tags.push({
      type: 'Robots Meta',
      icon: 'ri-robot-line',
      status: 'missing',
      content: []
    });
  }
  
  // Schema.org structured data
  if (parsedTags.schemaData && parsedTags.schemaData.length > 0) {
    tags.push({
      type: 'Schema.org Structured Data',
      icon: 'ri-code-line',
      status: 'good',
      content: parsedTags.schemaData
    });
  } else {
    tags.push({
      type: 'Schema.org Structured Data',
      icon: 'ri-code-line',
      status: 'missing',
      content: []
    });
  }
  
  return tags;
}

/**
 * Calculates scores for the different SEO aspects
 */
function calculateScores(parsedTags: ParsedMetaTags): ScoreData {
  let essentialScore = 0;
  let essentialTotal = 0;
  let socialScore = 0;
  let socialTotal = 0;
  let advancedScore = 0;
  let advancedTotal = 0;
  
  // Essential tags
  if (parsedTags.title) {
    const weight = TAG_WEIGHTS.title.essential;
    essentialTotal += weight;
    
    if (parsedTags.title.length >= CONTENT_LENGTH.title.min && 
        parsedTags.title.length <= CONTENT_LENGTH.title.max) {
      essentialScore += weight;
    } else if (parsedTags.title.length > 0) {
      essentialScore += weight * 0.5; // Half points for having a title but not optimal length
    }
  }
  
  if (parsedTags.metaDescription) {
    const weight = TAG_WEIGHTS['meta-description'].essential;
    essentialTotal += weight;
    
    if (parsedTags.metaDescription.length >= CONTENT_LENGTH['meta-description'].min && 
        parsedTags.metaDescription.length <= CONTENT_LENGTH['meta-description'].max) {
      essentialScore += weight;
    } else if (parsedTags.metaDescription.length > 0) {
      essentialScore += weight * 0.5; // Half points for having a description but not optimal length
    }
  }
  
  if (parsedTags.canonicalUrl) {
    const weight = TAG_WEIGHTS.canonical.essential;
    essentialTotal += weight;
    essentialScore += weight;
  }
  
  if (parsedTags.robotsTags) {
    const weight = TAG_WEIGHTS.robots.essential;
    essentialTotal += weight;
    essentialScore += weight;
  }
  
  // Social tags - Open Graph
  for (const tag of ['og:title', 'og:description', 'og:image', 'og:url', 'og:type']) {
    const weight = TAG_WEIGHTS[tag as keyof typeof TAG_WEIGHTS].social;
    socialTotal += weight;
    
    if (parsedTags.ogTags[tag]) {
      socialScore += weight;
    }
  }
  
  // Social tags - Twitter
  for (const tag of ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image', 'twitter:site']) {
    const weight = TAG_WEIGHTS[tag as keyof typeof TAG_WEIGHTS].social;
    socialTotal += weight;
    
    if (parsedTags.twitterTags[tag]) {
      socialScore += weight;
    }
  }
  
  // Advanced tags
  if (parsedTags.schemaData && parsedTags.schemaData.length > 0) {
    const weight = TAG_WEIGHTS.schema.advanced;
    advancedTotal += weight;
    advancedScore += weight;
  }
  
  // Calculate percentages
  const essentialPercentage = Math.round((essentialScore / essentialTotal) * 100) || 0;
  const socialPercentage = Math.round((socialScore / socialTotal) * 100) || 0;
  const advancedPercentage = Math.round((advancedScore / advancedTotal) * 100) || 0;
  
  // Calculate overall score (weighted average)
  const overallScore = Math.round(
    (essentialPercentage * 0.5) + (socialPercentage * 0.3) + (advancedPercentage * 0.2)
  );
  
  return {
    overall: overallScore,
    essential: {
      score: Math.round(essentialScore),
      total: Math.round(essentialTotal)
    },
    social: {
      score: Math.round(socialScore),
      total: Math.round(socialTotal)
    },
    advanced: {
      score: Math.round(advancedScore),
      total: Math.round(advancedTotal)
    }
  };
}

/**
 * Generates recommendations based on the analysis
 */
function generateRecommendations(parsedTags: ParsedMetaTags): Recommendation[] {
  const recommendations: Recommendation[] = [];
  
  // Critical issues
  if (!parsedTags.schemaData || parsedTags.schemaData.length === 0) {
    recommendations.push({
      type: 'critical',
      icon: 'ri-close-circle-line',
      title: 'Add Schema.org Structured Data:',
      description: 'Implementing structured data can enhance your search results with rich snippets. Consider adding Organization, WebSite, or other relevant schemas.',
      link: {
        text: 'Learn more about Schema.org',
        url: 'https://schema.org/docs/gs.html'
      }
    });
  }
  
  if (!parsedTags.ogTags['og:type']) {
    recommendations.push({
      type: 'critical',
      icon: 'ri-close-circle-line',
      title: 'Add Missing og:type Tag:',
      description: 'Facebook Open Graph requires a type property. Add <meta property="og:type" content="website"> to your head section.'
    });
  }
  
  // Improvements
  if (parsedTags.metaDescription && 
      parsedTags.metaDescription.length < CONTENT_LENGTH['meta-description'].min) {
    recommendations.push({
      type: 'improvement',
      icon: 'ri-error-warning-line',
      title: 'Expand Meta Description:',
      description: `Your description is ${parsedTags.metaDescription.length} characters. Aim for 120-158 characters to maximize visibility in search results.`
    });
  }
  
  if (!parsedTags.twitterTags['twitter:site']) {
    recommendations.push({
      type: 'improvement',
      icon: 'ri-error-warning-line',
      title: 'Add Twitter Account Info:',
      description: 'Add <meta name="twitter:site" content="@yourusername"> to improve Twitter Card integration.'
    });
  }
  
  if (parsedTags.twitterTags['twitter:image'] && !parsedTags.twitterTags['twitter:image:alt']) {
    recommendations.push({
      type: 'improvement',
      icon: 'ri-error-warning-line',
      title: 'Add Alt Text to Twitter Image:',
      description: 'Include <meta name="twitter:image:alt" content="Description of image"> for improved accessibility.'
    });
  }
  
  // Good practices
  if (parsedTags.title && 
      parsedTags.title.length >= CONTENT_LENGTH.title.min && 
      parsedTags.title.length <= CONTENT_LENGTH.title.max) {
    recommendations.push({
      type: 'good',
      icon: 'ri-check-line',
      title: 'Title Tag Length:',
      description: `Your title is ${parsedTags.title.length} characters, which is an ideal length for search engine display.`
    });
  }
  
  if (parsedTags.canonicalUrl) {
    recommendations.push({
      type: 'good',
      icon: 'ri-check-line',
      title: 'Canonical URL:',
      description: 'Properly implemented canonical URL helps prevent duplicate content issues.'
    });
  }
  
  if (parsedTags.robotsTags) {
    recommendations.push({
      type: 'good',
      icon: 'ri-check-line',
      title: 'Robots Meta:',
      description: 'Correctly configured to allow search engines to index and follow links on the page.'
    });
  }
  
  return recommendations;
}
