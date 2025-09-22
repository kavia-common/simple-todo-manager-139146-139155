export const handleAuthError = (error, routerPush) => {
  // routerPush: function like (url) => void
  // Fallback to console if no routerPush provided
  // eslint-disable-next-line no-console
  console.error('Authentication error:', error);

  const message = (error && error.message) || '';
  if (message.includes('redirect')) {
    routerPush ? routerPush('/auth/error?type=redirect') : null;
  } else if (message.includes('email')) {
    routerPush ? routerPush('/auth/error?type=email') : null;
  } else {
    routerPush ? routerPush('/auth/error') : null;
  }
};
