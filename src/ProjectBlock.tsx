import React, { useState, useEffect } from 'react';
import AddProjectForm from './AddProjectForm';

interface Project {
  file: string;
  text: string;
  link: string;
}

interface ProjectsBlockProps {
  language: string;
  accessToken: string | null;
  onSuccess: (message: string) => void; 
  userValue: string;
  chatInstance: string;
  chatType: string;
  authDate: string;
  hashFinal: string;
  queryId: string;
}

const ProjectsBlock: React.FC<ProjectsBlockProps> = ({ language, accessToken,onSuccess,userValue,chatInstance,chatType,authDate,hashFinal,queryId }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchProjects = async () => {
    try {
        const response = await fetch(`https://tontelega-410f0443bf5d.herokuapp.com/rest/services/yel_TelegramWebService/getProjects?user=${encodeURIComponent(userValue as string)}&chat_instance=${chatInstance}&chat_type=${chatType}&auth_date=${authDate}&hash=${hashFinal}&query_id=${queryId}`, {
        method: 'GET',
        headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });

      const projectsData = await response.json();
      console.log('Fetched projects:', projectsData); // Log the response
      setProjects(projectsData);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchProjects();
    }
  }, [accessToken]);

  const handleProjectAdded = () => {
    setIsFormOpen(false);
    fetchProjects();  // Refresh the project list after adding a project
  };

  if (isLoading) {
    return <p>{language === 'ru' ? 'Загрузка проектов...' : 'Loading projects...'}</p>;
  }

  return (
    <div className="mt-4 bg-[#1f1f1f] p-4 rounded-lg">
      <h2 className="text-lg text-white mb-4">
        {language === 'ru' ? 'Проекты' : 'Projects'}
      </h2>
      <ul className="space-y-4">
        {projects.map((project, index) => (
          <li key={index} className="flex items-center justify-between p-4 bg-[#272727] rounded-lg">
            <div className="flex items-center">
              <img src={project.file} alt="Project Icon" className="w-12 h-12 rounded-full" />
              <div className="ml-4">
                <p className="text-white font-bold">{project.text}</p>
              </div>
            </div>
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-4 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition"
            >
              {language === 'ru' ? 'Перейти' : 'Go'}
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <button
          onClick={() => setIsFormOpen(true)}
         className="text-sm text-white focus:outline-none"
        >
          {language === 'ru' ? 'Добавить мой проект' : 'Add my project'}
        </button>
      </div>
      {isFormOpen && (
        <AddProjectForm
          language={language}
          accessToken={accessToken}
          onClose={handleProjectAdded}
          onSuccess={onSuccess}
          userValue={userValue}
          chatInstance={chatInstance}
          chatType={chatType}
          authDate={authDate}
          hashFinal={hashFinal}
          queryId={queryId}
        />
      )}
    </div>
  );
};

export default ProjectsBlock;
