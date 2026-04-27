/**
 * Image Hosts Configuration (add your image hosts here)
 */

const appwriteEndpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const appwriteHost = appwriteEndpoint ? new URL(appwriteEndpoint).hostname : null;

export const imageHosts = [
    {
        protocol: 'https',
        hostname: 'images.unsplash.com',
    },
    {
        protocol: 'https',
        hostname: 'images.pexels.com',
    },
    {
        protocol: 'https',
        hostname: 'images.pixabay.com',
    },
    {
        protocol: 'https',
        hostname: 'img.rocket.new',
    },
    ...(appwriteHost
      ? [
          {
            protocol: 'https',
            hostname: appwriteHost,
          },
        ]
      : []),
];
