import { useEffect, useRef } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  type?: "website" | "article";
  image?: string;
  url?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

const defaultMeta = {
  title: "DarkWave Studios | Premium Web Development Agency - Custom Apps & Websites",
  description: "Full-service web development agency delivering custom websites, web applications, and AI-powered solutions. Save 60%+ compared to traditional agencies.",
};

export function SEOHead({
  title,
  description,
  keywords,
  type = "website",
  image = "https://replit.com/public/images/opengraph.png",
  url,
  author = "DarkWave Studios",
  publishedTime,
  modifiedTime,
  section,
  tags = [],
}: SEOHeadProps) {
  const previousValuesRef = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    const fullTitle = `${title} | DarkWave Studios`;
    const previousValues = new Map<string, string>();
    
    const setMetaTag = (name: string, content: string, property = false) => {
      const attr = property ? "property" : "name";
      let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      
      if (meta) {
        previousValues.set(`${attr}:${name}`, meta.content);
      } else {
        meta = document.createElement("meta");
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
        previousValues.set(`${attr}:${name}`, "");
      }
      meta.content = content;
    };

    const prevTitle = document.title;
    document.title = fullTitle;

    setMetaTag("title", fullTitle);
    setMetaTag("description", description);
    if (keywords) setMetaTag("keywords", keywords);

    setMetaTag("og:title", fullTitle, true);
    setMetaTag("og:description", description, true);
    setMetaTag("og:type", type, true);
    setMetaTag("og:image", image, true);
    if (url) setMetaTag("og:url", url, true);

    setMetaTag("twitter:title", fullTitle);
    setMetaTag("twitter:description", description);
    setMetaTag("twitter:image", image);

    if (type === "article") {
      setMetaTag("article:author", author, true);
      if (publishedTime) setMetaTag("article:published_time", publishedTime, true);
      if (modifiedTime) setMetaTag("article:modified_time", modifiedTime, true);
      if (section) setMetaTag("article:section", section, true);
    }

    previousValuesRef.current = previousValues;

    return () => {
      document.title = prevTitle || defaultMeta.title;
      
      previousValues.forEach((value, key) => {
        const [attr, name] = key.split(":");
        const meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
        if (meta) {
          if (value === "") {
            meta.remove();
          } else {
            meta.content = value;
          }
        }
      });
    };
  }, [title, description, keywords, type, image, url, author, publishedTime, modifiedTime, section, tags]);

  return null;
}

interface ArticleSchemaProps {
  title: string;
  description: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  image?: string;
  url?: string;
  tags?: string[];
}

export function ArticleSchema({
  title,
  description,
  author = "DarkWave Studios",
  publishedTime,
  modifiedTime,
  image,
  url,
  tags = [],
}: ArticleSchemaProps) {
  useEffect(() => {
    const existingScript = document.getElementById("seo-article-schema");
    if (existingScript) existingScript.remove();

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "seo-article-schema";
    
    const schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": title,
      "description": description,
      "author": {
        "@type": "Person",
        "name": author,
      },
      "publisher": {
        "@type": "Organization",
        "name": "DarkWave Studios",
        "logo": {
          "@type": "ImageObject",
          "url": "https://darkwavestudios.com/favicon.png"
        }
      },
      ...(publishedTime && { "datePublished": publishedTime }),
      ...(modifiedTime && { "dateModified": modifiedTime }),
      ...(image && { "image": image }),
      ...(url && { "mainEntityOfPage": { "@type": "WebPage", "@id": url } }),
      ...(tags.length > 0 && { "keywords": tags.join(", ") }),
    };
    
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const toRemove = document.getElementById("seo-article-schema");
      if (toRemove) toRemove.remove();
    };
  }, [title, description, author, publishedTime, modifiedTime, image, url, tags]);

  return null;
}

interface BreadcrumbSchemaProps {
  items: { name: string; url: string }[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  useEffect(() => {
    const existingScript = document.getElementById("seo-breadcrumb-schema");
    if (existingScript) existingScript.remove();

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "seo-breadcrumb-schema";
    
    const schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url
      }))
    };
    
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const toRemove = document.getElementById("seo-breadcrumb-schema");
      if (toRemove) toRemove.remove();
    };
  }, [items]);

  return null;
}

interface FAQSchemaProps {
  faqs: { question: string; answer: string }[];
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  useEffect(() => {
    const existingScript = document.getElementById("seo-faq-schema");
    if (existingScript) existingScript.remove();

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "seo-faq-schema";
    
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
    
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const toRemove = document.getElementById("seo-faq-schema");
      if (toRemove) toRemove.remove();
    };
  }, [faqs]);

  return null;
}
