import { MetadataRoute } from 'next'
import { getJobListingsAction, getWorkerProfilesAction } from '@/lib/supabase/actions'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://workbridge.uk'

  // Static paths
  const staticPaths: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/masters`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ]

  // Dynamic job listing paths
  let jobPaths: MetadataRoute.Sitemap = []
  try {
    const jobs = await getJobListingsAction()
    jobPaths = jobs.map((job) => ({
      url: `${baseUrl}/jobs/${job.id}`,
      lastModified: new Date(job.created_at),
      changeFrequency: 'weekly',
      priority: 0.7,
    }))
  } catch (error) {
    console.error('Error fetching sitemap jobs:', error)
  }

  // Dynamic worker profile paths
  let workerPaths: MetadataRoute.Sitemap = []
  try {
    const workers = await getWorkerProfilesAction()
    workerPaths = workers.map((worker) => ({
      url: `${baseUrl}/masters/${worker.id}`,
      lastModified: new Date(worker.created_at),
      changeFrequency: 'weekly',
      priority: 0.6,
    }))
  } catch (error) {
    console.error('Error fetching sitemap workers:', error)
  }

  return [...staticPaths, ...jobPaths, ...workerPaths]
}
