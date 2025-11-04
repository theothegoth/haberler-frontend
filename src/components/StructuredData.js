import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

const StructuredData = ({ type, data }) => {
  let structuredData = {};

  switch (type) {
    case 'article':
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: data.title,
        description: data.description || data.content?.substring(0, 160),
        image: data.image || 'https://gaste.com/logo512.png',
        datePublished: data.publishedTime,
        dateModified: data.modifiedTime || data.publishedTime,
        author: {
          '@type': 'Person',
          name: data.author || 'Anonymous',
          url: data.authorUrl
        },
        publisher: {
          '@type': 'Organization',
          name: 'Gaste',
          logo: {
            '@type': 'ImageObject',
            url: 'https://gaste.com/logo192.png'
          }
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': data.url
        }
      };
      break;

    case 'website':
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Gaste',
        description: 'Watch YouTube channels, read and write news articles. All your news in one place.',
        url: 'https://gaste.com',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://gaste.com/explore?q={search_term_string}'
          },
          'query-input': 'required name=search_term_string'
        }
      };
      break;

    case 'organization':
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Gaste',
        url: 'https://gaste.com',
        logo: 'https://gaste.com/logo512.png',
        description: 'News platform for watching, reading, and writing news',
        sameAs: [
          // Add your social media URLs here
          // 'https://twitter.com/gaste',
          // 'https://facebook.com/gaste'
        ]
      };
      break;

    case 'breadcrumb':
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: data.items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url
        }))
      };
      break;

    default:
      return null;
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

StructuredData.propTypes = {
  type: PropTypes.oneOf(['article', 'website', 'organization', 'breadcrumb']).isRequired,
  data: PropTypes.object.isRequired
};

export default StructuredData;
