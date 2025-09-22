export const getURL = () => {
  let url = process.env.REACT_APP_SITE_URL || 'http://localhost:3000';

  if (!url.startsWith('http')) {
    url = `https://${url}`;
  }
  if (!url.endsWith('/')) {
    url = `${url}/`;
  }
  return url;
};

/*
README (important):
- In Supabase Dashboard > Authentication > URL Configuration:
  - Site URL: your production domain (e.g., https://yourapp.com)
  - Redirect URLs (add both):
    * http://localhost:3000/**
    * https://yourapp.com/**
- Ensure REACT_APP_SITE_URL is set in your environment for correct redirect handling.
*/
