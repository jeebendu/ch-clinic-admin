
/**
 * Sets the page title with proper format
 * @param pageTitle The title for the current page
 */
export const setPageTitle = (pageTitle?: string): void => {
  if (pageTitle) {
    document.title = `${pageTitle} | ClinicHub.care - Your Health Our Care`;
  } else {
    document.title = "ClinicHub.care - Your Health Our Care";
  }
};

/**
 * Updates meta tags for SEO
 * @param description The meta description for the current page
 * @param keywords Specific keywords for the current page
 */
export const updateMetaTags = (description?: string, keywords?: string): void => {
  // Update description meta tag if provided
  if (description) {
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    } else {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      metaDescription.setAttribute("content", description);
      document.head.appendChild(metaDescription);
    }
  }

  // Update keywords meta tag if provided
  if (keywords) {
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute("content", keywords);
    } else {
      metaKeywords = document.createElement("meta");
      metaKeywords.setAttribute("name", "keywords");
      metaKeywords.setAttribute("content", keywords);
      document.head.appendChild(metaKeywords);
    }
  }
};
