import rss from '@astrojs/rss';

import { SITE_CONFIG, METADATA_CONFIG, APP_BLOG_CONFIG, I18N_CONFIG } from '~/utils/config';
import { fetchPosts } from '~/utils/blog';
import { getPermalink } from '~/utils/permalinks';

export const get = async () => {
  if (!APP_BLOG_CONFIG.isEnabled) {
    return new Response(null, {
      status: 404,
      statusText: 'Not found',
    });
  }

  const posts = await fetchPosts(I18N_CONFIG.defaultLocale);

  const { body } = await rss({
    title: `${SITE_CONFIG.name}’s Blog`,
    description: METADATA_CONFIG?.description || "",
    site: import.meta.env.SITE,

    items: posts.map((post) => ({
      link: getPermalink(post.permalink, 'post'),
      title: post.title,
      description: post.excerpt,
      pubDate: post.publishDate,
    })),

    trailingSlash: SITE_CONFIG.trailingSlash,
  });

  return new Response(body, {
    status: 200,
    statusText: "OK",
  });
};
