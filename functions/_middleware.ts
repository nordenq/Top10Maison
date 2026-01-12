// Cloudflare Pages Function to Redirect Old 2-Level URLs to New 3-Level URLs
// Catch-all: /category/appliances/[slug] => /category/kitchen/small-appliances/[slug]

export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  const pathname = url.pathname;

  if (pathname.startsWith("/category/appliances/")) {
    const targetPath = pathname.replace(
      "/category/appliances/",
      "/category/kitchen/small-appliances/"
    );
    return Response.redirect(targetPath, 301);
  }

  return await context.next();
};
