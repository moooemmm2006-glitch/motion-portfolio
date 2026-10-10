import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAdjacentProjects, getProject, projects } from '@/data/projects';
import { site } from '@/data/site';
import { categoryLabel } from '@/data/categories';
import { ProjectDetail } from '@/components/work/ProjectDetail';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: { title: `${project.title} — ${site.name}`, description: project.summary, images: [project.poster] },
    twitter: { card: 'summary_large_image', images: [project.poster] },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const { prev, next } = getAdjacentProjects(slug);

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.summary,
    genre: categoryLabel(project.category),
    dateCreated: String(project.year),
    image: `${site.url}${project.poster}`,
    creator: { '@type': 'Person', name: site.name, url: site.url },
    sourceOrganization: { '@type': 'Organization', name: project.client },
    video: project.video.type === 'file' || project.video.type === 'hls'
      ? { '@type': 'VideoObject', name: project.title, description: project.summary, thumbnailUrl: `${site.url}${project.poster}`, contentUrl: `${site.url}${project.video.src}`, uploadDate: `${project.year}-01-01` }
      : undefined,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <ProjectDetail project={project} prev={prev} next={next} />
    </>
  );
}
