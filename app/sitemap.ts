import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://frameapp.uk',
      lastModified: new Date(),
    },
    {
      url: 'https://frameapp.uk/privacy',
      lastModified: new Date(),
    },
    {
      url: 'https://frameapp.uk/terms',
      lastModified: new Date(),
    },
    {
      url: 'https://frameapp.uk/eula',
      lastModified: new Date(),
    },
    {
      url: 'https://frameapp.uk/contact',
      lastModified: new Date(),
    },
    {
      url: 'https://frameapp.uk/delete-account',
      lastModified: new Date(),
    },
    {
      url: 'https://frameapp.uk/change-email',
      lastModified: new Date(),
    },
    {
      url: 'https://frameapp.uk/child-safety',
      lastModified: new Date(),
    },
  ];
}