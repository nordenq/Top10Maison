// Cloudflare Pages Function to Redirect Old 2-Level URLs to New 3-Level URLs
// Place this file at: functions/_middleware.ts (for global middleware)

export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  const pathname = url.pathname;

  // Redirect: /category/appliances/air-fryers => /category/kitchen/appliances/air-fryers
  if (pathname === "/category/appliances/air-fryers") {
    return Response.redirect("/category/kitchen/appliances/air-fryers", 301);
  }

  // More redirects can go here:
  // if (pathname === "/category/appliances/toasters") {
  //   return Response.redirect("/category/kitchen/appliances/toasters", 301);
  // }

  // Default: pass through
  return await context.next();
};
