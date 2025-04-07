import { useParams } from '@tanstack/react-router';

//TODO: add project detail UI components
const ProjectDetailPage = () => {
  const { projectId } = useParams({ strict: false });

  return (
    <div>
      <h1>Project Details</h1>
      <p>ID: {projectId}</p>
    </div>
  );
};

export default ProjectDetailPage;