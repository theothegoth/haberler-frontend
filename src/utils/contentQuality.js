/**
 * Strip HTML tags and get plain text length
 */
export function getPlainTextLength(html) {
  if (!html) return 0;
  // Create a temporary div to parse HTML
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return (temp.textContent || temp.innerText || '').trim().length;
}

/**
 * Count paragraphs by splitting on double line breaks or block-level HTML elements
 */
export function countParagraphs(content) {
  if (!content) return 0;

  // Create a temporary div to parse HTML
  const temp = document.createElement('div');
  temp.innerHTML = content;
  const text = temp.textContent || temp.innerText || '';

  // Split by multiple newlines (2 or more)
  const paragraphs = text
    .split(/\n{2,}/)
    .filter(p => p.trim().length > 10); // Filter out very short "paragraphs"

  // Also count <p> tags as indicators
  const pTags = (content.match(/<p[^>]*>.*?<\/p>/gi) || []).length;

  // Return the maximum of the two counts
  return Math.max(paragraphs.length, pTags);
}

/**
 * Analyze content quality and return stats + warnings
 * Returns translation keys instead of hardcoded messages
 */
export function analyzeContentQuality(title, content) {
  const warnings = [];
  const plainTextLength = getPlainTextLength(content);
  const paragraphCount = countParagraphs(content);

  // Title warnings
  if (title.length < 20) {
    warnings.push({
      type: 'title',
      severity: 'error',
      messageKey: 'contentQuality.titleTooShort',
      params: { current: title.length, min: 20 }
    });
  } else if (title.length < 30) {
    warnings.push({
      type: 'title',
      severity: 'warning',
      messageKey: 'contentQuality.titleShort',
      params: { current: title.length }
    });
  }

  // Content length warnings
  if (plainTextLength < 500) {
    warnings.push({
      type: 'content_length',
      severity: 'error',
      messageKey: 'contentQuality.contentTooShort',
      params: { current: plainTextLength, min: 500 }
    });
  } else if (plainTextLength < 800) {
    warnings.push({
      type: 'content_length',
      severity: 'warning',
      messageKey: 'contentQuality.contentShort',
      params: { current: plainTextLength, recommended: 800 }
    });
  }

  // Paragraph warnings
  if (paragraphCount < 2) {
    warnings.push({
      type: 'paragraphs',
      severity: 'error',
      messageKey: 'contentQuality.paragraphsTooFew',
      params: { current: paragraphCount, min: 2 }
    });
  } else if (paragraphCount < 3) {
    warnings.push({
      type: 'paragraphs',
      severity: 'warning',
      messageKey: 'contentQuality.paragraphsFew',
      params: {}
    });
  }

  const hasErrors = warnings.some(w => w.severity === 'error');
  const hasWarnings = warnings.some(w => w.severity === 'warning');

  return {
    stats: {
      titleLength: title.length,
      contentLength: plainTextLength,
      paragraphCount: paragraphCount
    },
    warnings: warnings,
    hasErrors: hasErrors,
    hasWarnings: hasWarnings,
    passesMinimum: !hasErrors
  };
}

/**
 * Get quality badge based on content analysis
 * Returns translation key instead of hardcoded text
 */
export function getQualityBadge(analysis) {
  if (analysis.hasErrors) {
    return {
      textKey: 'contentQuality.needsWork',
      color: 'red',
      icon: '⚠️'
    };
  } else if (analysis.hasWarnings) {
    return {
      textKey: 'contentQuality.good',
      color: 'yellow',
      icon: '✓'
    };
  } else if (analysis.stats.contentLength >= 1500) {
    return {
      textKey: 'contentQuality.excellent',
      color: 'green',
      icon: '★'
    };
  } else {
    return {
      textKey: 'contentQuality.veryGood',
      color: 'blue',
      icon: '✓✓'
    };
  }
}
