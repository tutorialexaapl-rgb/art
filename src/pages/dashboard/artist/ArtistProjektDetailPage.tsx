import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ProjectDashboard } from '@/components/features/ProjectDashboard';
import { useProjectData } from '@/hooks/useProjectData';

export function ArtistProjektDetailPage() {
  const { id } = useParams();
  const { getProject } = useProjectData();
  const project = getProject(id ?? '');

  if (!project) {
    return (
      <div className="text-center py-20">
        <h1 className="font-display text-2xl text-graphite-600">Projekt nie znaleziony</h1>
        <Link to="/dashboard/artist/projekty" className="mt-4 inline-flex"><Button variant="secondary">Wróć</Button></Link>
      </div>
    );
  }

  return <ProjectDashboard project={project} viewer="artist" />;
}
