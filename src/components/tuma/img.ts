/** Serve a file from /public/img directly (fallback when Netlify CDN is disabled). */
export const cdnImg = (file: string) => `/img/${file}`
