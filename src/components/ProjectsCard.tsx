import React from "react";
import Card from "./ui/Card";

interface ProjectCardProps {
  id: string;
  title: string;
  keyCode: string;
  description: string;
  onClick: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  keyCode,
  description,
  onClick,
}) => {
  return (
    <div
      onClick={() => onClick(id)}
      className="cursor-pointer transform transition hover:scale-[1.02]"
    >
      <Card className="h-full">
        <div className="mb-2">
          <span className="text-blue-600 font-bold">{keyCode}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        <p
          className="text-gray-600 mt-2 line-clamp-3"
          title={description} // shows full text on hover
        >
          {description}
        </p>
      </Card>
    </div>
  );
};

export default ProjectCard;
