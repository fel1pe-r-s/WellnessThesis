import { Post, Product, Category } from './types';

const API_URL = process.env.WORDPRESS_API_URL;

// Helper to extract the first link from HTML content
function extractFirstLink(html: string): string {
    const match = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/i.exec(html);
    return match ? match[2] : '#';
}

// Helper to decode HTML Entities often returned by WordPress REST API
function decodeHtmlEntities(text: string): string {
    if (!text) return text;
    const entities: Record<string, string> = {
        '&#8211;': '-',
        '&#8212;': '--',
        '&#8216;': "'",
        '&#8217;': "'",
        '&#8220;': '"',
        '&#8221;': '"',
        '&#8243;': '"',
        '&#038;': '&',
        '&#8230;': '...',
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'",
        '&nbsp;': ' ',
    };

    // Replace twice to handle double encoding (e.g. &amp;#8220; -> &#8220; -> ")
    let decoded = text.replace(/&[#a-zA-Z0-9]+;/g, match => entities[match] || match);
    decoded = decoded.replace(/&[#a-zA-Z0-9]+;/g, match => entities[match] || match);
    return decoded;
}

// Convert WP Post to our Normalized Post
function wpToPost(wpPost: any): Post {
    const featuredImage = wpPost.featured_media_url || wpPost._embedded?.['wp:featuredmedia']?.[0]?.source_url;

    // Extract up to 2 categories
    const categoriesArray = wpPost._embedded?.['wp:term']?.[0] || [];
    let displayCategory = 'Geral';
    if (categoriesArray.length > 0) {
        const names = categoriesArray.map((c: any) => decodeHtmlEntities(c.name));
        if (names.length <= 2) {
            displayCategory = names.join(', ');
        } else {
            displayCategory = `${names[0]}, ${names[1]}...`;
        }
    }

    let strippedExcerpt = decodeHtmlEntities((wpPost.excerpt?.rendered || '').replace(/<[^>]*>?/gm, '')).trim();
    if (strippedExcerpt.length < 5) {
        // Fallback to the main content if excerpt is practically empty (e.g. '<p>:</p>')
        const strippedContent = decodeHtmlEntities((wpPost.content?.rendered || '').replace(/<[^>]*>?/gm, '')).trim();
        strippedExcerpt = strippedContent.substring(0, 150) + (strippedContent.length > 150 ? '...' : '');
    }

    return {
        id: wpPost.id,
        title: decodeHtmlEntities(wpPost.title?.rendered || ''),
        content: decodeHtmlEntities(wpPost.content?.rendered || ''),
        excerpt: strippedExcerpt,
        slug: wpPost.slug,
        createdAt: wpPost.date,
        updatedAt: wpPost.modified,
        imageUrl: featuredImage || 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=600',
        category: displayCategory,
        // Example check: custom field or logic to determine if popular/featured
        isFeatured: wpPost.sticky || false,
    };
}

export async function getPosts(limit = 10, offset = 0): Promise<Post[]> {
    try {
        const res = await fetch(`${API_URL}/posts?_embed&per_page=${limit}&offset=${offset}`, { next: { revalidate: 60 } });
        if (!res.ok) throw new Error('Failed to fetch posts');
        const data = await res.json();
        return data.map(wpToPost);
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getProducts(categorySlug?: string): Promise<Product[]> {
    try {
        const url = `${API_URL}/produtos?_embed&per_page=30`;
        const res = await fetch(url, { next: { revalidate: 60 } });
        if (!res.ok) throw new Error('Failed to fetch products from /produtos');

        const data = await res.json();

        const products = data
            .map((wpPost: any) => {
                const featuredImage = wpPost.featured_media_url || wpPost._embedded?.['wp:featuredmedia']?.[0]?.source_url;

                // Extract up to 2 categories
                const categoriesArray = wpPost._embedded?.['wp:term']?.[0] || [];
                let displayCategory = 'Geral';
                let primarySlug = '';
                if (categoriesArray.length > 0) {
                    primarySlug = categoriesArray[0].slug;
                    const names = categoriesArray.map((c: any) => decodeHtmlEntities(c.name));
                    if (names.length <= 2) {
                        displayCategory = names.join(', ');
                    } else {
                        displayCategory = `${names[0]}, ${names[1]}...`;
                    }
                }

                // ACF fields usually come in wpPost.acf
                // Adjust the property name 'link_afiliado' to whatever you named it in ACF
                let affiliateUrl = '#';
                if (wpPost.acf && wpPost.acf.link_afiliado) {
                    affiliateUrl = wpPost.acf.link_afiliado;
                } else if (wpPost.acf && wpPost.acf.link) {
                    affiliateUrl = wpPost.acf.link;
                } else {
                    affiliateUrl = extractFirstLink(wpPost.content?.rendered || '');
                }

                let strippedDescription = decodeHtmlEntities((wpPost.excerpt?.rendered || '').replace(/<[^>]*>?/gm, '')).trim();
                if (strippedDescription.length < 5) {
                    const strippedContent = decodeHtmlEntities((wpPost.content?.rendered || '').replace(/<[^>]*>?/gm, '')).trim();
                    strippedDescription = strippedContent.substring(0, 150) + (strippedContent.length > 150 ? '...' : '');
                }

                return {
                    id: wpPost.id,
                    name: decodeHtmlEntities(wpPost.title?.rendered || ''),
                    description: strippedDescription,
                    imageUrl: featuredImage || 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=600',
                    category: displayCategory,
                    categorySlug: primarySlug,
                    affiliateLink: affiliateUrl,
                    isFeatured: wpPost.sticky || false,
                };
            });

        if (categorySlug) {
            return products.filter((p: Product) => p.categorySlug && p.categorySlug.toLowerCase() === categorySlug.toLowerCase());
        }

        return products;
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Fetch posts by a given category slug
export async function getPostsByCategory(slug: string): Promise<{ posts: Post[], categoryName: string }> {
    try {
        // 1. Get the category ID and exact Name from its slug
        const catsRes = await fetch(`${API_URL}/categories?slug=${encodeURIComponent(slug)}`, { next: { revalidate: 60 } });
        if (!catsRes.ok) throw new Error('Failed to fetch category id');
        const cats = await catsRes.json();

        if (!cats || cats.length === 0) {
            return { posts: [], categoryName: slug };
        }

        const catId = cats[0].id;
        const categoryName = decodeHtmlEntities(cats[0].name);

        // 2. Fetch posts belonging to that category ID
        const postsRes = await fetch(`${API_URL}/posts?_embed&categories=${catId}&per_page=15`, { next: { revalidate: 60 } });
        if (!postsRes.ok) throw new Error('Failed to fetch category posts');

        const postsData = await postsRes.json();
        const posts = postsData.map(wpToPost);

        return { posts, categoryName };
    } catch (error) {
        console.error('Error fetching posts by category:', error);
        return { posts: [], categoryName: slug };
    }
}

// Fetch available Categories from WordPress
export async function getCategories(): Promise<Category[]> {
    try {
        const url = `${API_URL}/categories?hide_empty=true`;
        const res = await fetch(url, { next: { revalidate: 600 } });
        if (!res.ok) throw new Error('Failed to fetch categories');

        const data = await res.json();

        // Filter out "Sem categoria" / "Uncategorized" usually ID 1
        return data
            .filter((cat: any) => cat.slug !== 'uncategorized' && cat.slug !== 'sem-categoria')
            .map((cat: any) => ({
                id: cat.id,
                name: decodeHtmlEntities(cat.name),
                slug: cat.slug,
                count: cat.count
            }));
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
    try {
        const res = await fetch(`${API_URL}/posts?_embed&slug=${slug}`, { next: { revalidate: 60 } });
        if (!res.ok) throw new Error('Failed to fetch post');
        const data = await res.json();
        if (data.length === 0) {
            console.log(`No post found for slug: ${slug}`);
            return null;
        }
        return wpToPost(data[0]);
    } catch (error) {
        console.error(`Error in getPostBySlug for slug ${slug}:`, error);
        return null;
    }
}


export async function getFeaturedPost(): Promise<Post | null> {
    try {
        const res = await fetch(`${API_URL}/posts?_embed&sticky=true&per_page=1`, { next: { revalidate: 60 } });
        if (!res.ok) return null;
        const data = await res.json();
        if (data && data.length > 0) {
            return wpToPost(data[0]);
        }
        return null;
    } catch (error) {
        console.error('Error fetching featured post:', error);
        return null;
    }
}

export async function searchPosts(queryText: string): Promise<Post[]> {
    try {
        const urlParam = encodeURIComponent(queryText);

        // 1. Fetch posts matching standard search (title & content)
        const postsRes = fetch(`${API_URL}/posts?_embed&search=${urlParam}&per_page=15`, { next: { revalidate: 60 } });

        // 2. Fetch categories that match the search term
        const catsRes = fetch(`${API_URL}/categories?search=${urlParam}`, { next: { revalidate: 60 } });

        const [pRes, cRes] = await Promise.all([postsRes, catsRes]);

        let allWpPosts: any[] = [];

        if (pRes.ok) {
            const data = await pRes.json();
            if (Array.isArray(data)) allWpPosts = data;
        }

        if (cRes.ok) {
            const cats = await cRes.json();
            if (Array.isArray(cats) && cats.length > 0) {
                const catIds = cats.map((c: any) => c.id).join(',');
                // Fetch posts in those categories
                const catPostsRes = await fetch(`${API_URL}/posts?_embed&categories=${catIds}&per_page=15`, { next: { revalidate: 60 } });
                if (catPostsRes.ok) {
                    const catPosts = await catPostsRes.json();
                    if (Array.isArray(catPosts)) {
                        allWpPosts = [...allWpPosts, ...catPosts];
                    }
                }
            }
        }

        // Deduplicate posts
        const uniquePosts: Post[] = [];
        const seenIds = new Set();
        for (const wpPost of allWpPosts) {
            if (!seenIds.has(wpPost.id)) {
                seenIds.add(wpPost.id);
                uniquePosts.push(wpToPost(wpPost));
            }
        }

        return uniquePosts;
    } catch (error) {
        console.error('Error in searchPosts:', error);
        return [];
    }
}
