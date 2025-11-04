import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  article = false,
  noindex = false
}) => {
  const siteName = 'Gaste';
  const defaultDescription = 'Watch YouTube channels, read and write news articles. All your news in one place.';
  const defaultImage = '/logo512.png';
  const siteUrl = 'https://gaste.com'; // Replace with your actual domain

  const metaTitle = title ? `${title} | ${siteName}` : siteName;
  const metaDescription = description || defaultDescription;
  const metaImage = image || defaultImage;
  const metaUrl = url || siteUrl;
  const fullImageUrl = metaImage.startsWith('http') ? metaImage : `${siteUrl}${metaImage}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}

      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={article ? 'article' : type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="tr_TR" />

      {/* Article specific tags */}
      {article && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {article && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {article && author && (
        <meta property="article:author" content={author} />
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={fullImageUrl} />
      {/* Add your Twitter handle: <meta name="twitter:site" content="@yourtwitterhandle" /> */}

      {/* Additional SEO */}
      <link rel="canonical" href={metaUrl} />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  type: PropTypes.string,
  author: PropTypes.string,
  publishedTime: PropTypes.string,
  modifiedTime: PropTypes.string,
  article: PropTypes.bool,
  noindex: PropTypes.bool
};

export default SEO;
