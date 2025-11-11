import DOMPurify from 'dompurify';
import './HTMLContent.css';

const HTMLContent = ({ content, className = '' }) => {
  const createMarkup = () => {
    return { __html: DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'blockquote', 'code', 'pre', 'span', 'div', 'img'],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'style', 'class', 'align', 'src', 'alt', 'width', 'height']
    }) };
  };

  return (
    <div
      className={`html-content prose prose-lg max-w-none dark:prose-invert ${className}`}
      dangerouslySetInnerHTML={createMarkup()}
      style={{
        wordBreak: 'break-word',
        overflowWrap: 'break-word'
      }}
    />
  );
};

export default HTMLContent;
