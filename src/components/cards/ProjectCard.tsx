import React from 'react';
import { Project, Testimonial } from '../../types';
import { Icon } from '../Icons';

interface ProjectCardProps {
  item: Project | Testimonial;
  type: 'project' | 'testimonial';
}

const ProjectCard: React.FC<ProjectCardProps> = ({ item, type }) => {
  if (type === 'testimonial') {
    const testimonial = item as Testimonial;
    return (
      <div className="bg-white/70 dark:bg-neutral-800/70 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-white/20 dark:border-neutral-700/30 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center mb-4">
          <img
            src={testimonial.avatarUrl}
            alt={testimonial.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-orange-200 dark:border-orange-600"
          />
          <div className="ml-4">
            <h4 className="font-semibold text-neutral-800 dark:text-neutral-100">
              {testimonial.name}
            </h4>
            <p className="text-sm text-orange-600 dark:text-orange-400">
              {testimonial.projectName}
            </p>
          </div>
        </div>
        <p className="text-neutral-600 dark:text-neutral-300 italic mb-4">
          "{testimonial.quote}"
        </p>
        {testimonial.projectImageUrl && (
          <img
            src={testimonial.projectImageUrl}
            alt={testimonial.projectName}
            className="w-full h-32 object-cover rounded-lg"
          />
        )}
      </div>
    );
  }

  const project = item as Project;
  return (
    <div className="bg-white/70 dark:bg-neutral-800/70 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 dark:border-neutral-700/30 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
      <img
        src={project.imageUrl}
        alt={project.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-2">
          {project.name}
        </h3>
        <p className="text-neutral-600 dark:text-neutral-300 text-sm mb-3">
          {project.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
            {project.aiModelUsed}
          </span>
          {project.tags && (
            <div className="flex flex-wrap gap-1">
              {project.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;