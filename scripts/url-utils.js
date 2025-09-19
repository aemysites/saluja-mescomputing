/**
 * URL utility functions for handling German category names
 * These functions help convert German category names to URL-safe formats
 * and back, ensuring proper routing and display.
 * 
 * Uses a simple approach that converts German characters to dashes,
 * which works reliably with the site's routing system.
 */

import { getTheTheme } from './shared.js';

/**
 * Creates a URL-safe slug from a category name
 * Converts German characters to English equivalents for better readability
 * @param {string} categoryName - The category name to convert
 * @returns {string} - URL-safe slug with English character equivalents
 */
export function createCategorySlug(categoryName) {
  if (!categoryName) return '';
  
  // First normalize the category name
  let normalized = categoryName
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
  
  // Replace & with 'und' only for German sites, otherwise replace with '-'
  if (getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de') {
    normalized = normalized.replace(/&/g, 'und');
  } else {
    normalized = normalized.replace(/&/g, '-');
  }
  
  // Convert German characters to English equivalents
  const germanToEnglish = normalized
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/Ä/g, 'Ae')
    .replace(/Ö/g, 'Oe')
    .replace(/Ü/g, 'Ue');
  
  // Convert to lowercase and replace remaining non-alphanumeric characters with dashes
  return germanToEnglish
    .toLowerCase()
    .replace(/[^0-9a-z]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Converts a URL slug back to a readable category name
 * This is a basic implementation - for exact matching, you'd need the original data
 * @param {string} slug - The URL slug to convert
 * @returns {string} - Readable category name
 */
export function slugToCategoryName(slug) {
  if (!slug) return '';
  
  return slug
    // Convert dashes back to spaces
    .replace(/-/g, ' ')
    // Capitalize first letter of each word
    .replace(/\w\S*/g, (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase())
    // Capitalize letters after ampersands
    .replace(/&[a-z]/g, (match) => match.toUpperCase());
}

/**
 * Gets the original category/tag name from a slug by looking it up in the data
 * This is more accurate than trying to reverse-engineer the slug
 * @param {string} slug - The URL slug
 * @param {string} type - 'category' or 'tag'
 * @returns {Promise<string>} - The original name
 */
export async function getOriginalNameFromSlug(slug, type = 'category') {
  if (!slug) return '';
  
  // Manual mappings for specific cases where the URL exists but the tag doesn't
  const manualMappings = {
    'ki-und-ml': 'KI & ML',
    'ki-ml': 'KI & ML'
  };
  
  // Add German-specific mappings only for German sites
  if (getTheTheme() === 'crn-de' || getTheTheme() === 'computing-de') {
    manualMappings['artificial-intelligence'] = 'KI & ML';
  } else {
    // Add English-specific mappings for English sites
    manualMappings['m-a'] = 'M&A';
  }
  
  if (manualMappings[slug]) {
    return manualMappings[slug];
  }
  
  // Handle special cases within longer slugs (e.g., "finance-and-m-a" -> "Finance And M&A")
  if (!getTheTheme() || getTheTheme() !== 'crn-de' && getTheTheme() !== 'computing-de') {
    // For English sites, replace "m-a" with "M&A" in the slug before processing
    if (slug.includes('-m-a-') || slug.endsWith('-m-a')) {
      const processedSlug = slug.replace(/-m-a-/g, '-m&a-').replace(/-m-a$/, '-m&a');
      return slugToCategoryName(processedSlug);
    }
  }
  
  try {
    // Fetch the article data to find the original name
    const response = await fetch('/article-query-index.json?limit=1000');
    const data = await response.json();
    
    if (!data.data || data.data.length === 0) {
      return slugToCategoryName(slug); // Fallback to basic conversion
    }
    
    // Look for the original name that would generate this slug
    const field = type === 'category' ? 'category' : 'tag';
    const allNames = data.data
      .map(article => article[field])
      .filter(name => name && name !== '0')
      .flatMap(name => name.split(',').map(n => n.trim()))
      .filter((name, index, array) => array.indexOf(name) === index);
    
    // Find the name that generates this slug
    const originalName = allNames.find(name => createCategorySlug(name) === slug);
    
    return originalName || slugToCategoryName(slug); // Fallback if not found
    
  } catch (error) {
    // Silently handle error - fallback to basic conversion
    return slugToCategoryName(slug);
  }
}

/**
 * Handles category name from URL slug
 * @param {string} slugFromUrl - The slug from the URL
 * @returns {string} - The category name to match against JSON data
 */
export function getCategoryNameFromSlug(slugFromUrl) {
  if (!slugFromUrl) return '';
  
  // Convert the slug back to the original category name
  return slugToCategoryName(slugFromUrl);
}

// Legacy functions for backward compatibility
export function encodeCategoryForUrl(categoryName) {
  return createCategorySlug(categoryName);
}

export function createUrlSlug(categoryName) {
  return createCategorySlug(categoryName);
}

export function getCategoryNameFromUrl(categoryFromUrl) {
  return getCategoryNameFromSlug(categoryFromUrl);
}