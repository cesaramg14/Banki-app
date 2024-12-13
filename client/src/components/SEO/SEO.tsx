import { Helmet } from "react-helmet-async";
import { SEOVariables } from "../types/SEOVariables";
  
export function SEO({
    title,
    description,
    keywords,
    image,
    url,
    type,
  }: SEOVariables) {
    return (
    <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        {keywords && <meta name="keywords" content={keywords.join(', ')} />}
        <meta property="og:type" content={type} />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
    </Helmet>
    );  
  }