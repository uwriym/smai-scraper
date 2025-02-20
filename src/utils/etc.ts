/**
 * Convert string to kebab case
 * @param str {string}
 * @returns {string}
 * @example
 * convertToKebabCase('MomCookingScraper') // mom-cooking-scraper
 */
export const convertToKebabCase = (str: string): string => {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}