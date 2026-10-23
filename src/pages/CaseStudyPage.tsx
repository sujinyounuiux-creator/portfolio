import { useParams } from 'react-router-dom'
import { CaseStudyLayout } from '../components/CaseStudyLayout'
import { getProject } from '../data/projects'
import { usePageMeta } from '../hooks/usePageMeta'
import { NotFoundPage } from './NotFoundPage'

export function CaseStudyPage() {
  const { slug = '' } = useParams()
  const project = getProject(slug)
  usePageMeta(project ? `${project.title} case study` : 'Not found', project?.summary ?? 'Page not found.')

  if (!project) return <NotFoundPage />
  // key resets scroll-spy state when moving between projects
  return <CaseStudyLayout key={project.slug} project={project} />
}
