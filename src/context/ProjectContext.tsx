import React, { createContext, useContext, useState, useEffect } from 'react';

export type ProjectType = 'image' | 'video' | 'music';

export interface Project {
  id: string;
  title: string;
  type: ProjectType;
  date: string;
  url: string;
  prompt?: string;
  settings?: any;
  timestamp: number;
}

interface ProjectContextType {
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'date' | 'timestamp'>) => void;
  deleteProject: (id: string) => void;
  clearProjects: () => void;
  toast: { message: string; type: 'success' | 'error' } | null;
  notify: (message: string, type?: 'success' | 'error') => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('erkinjon_projects');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Neon Cyberpunk City', type: 'image', date: '2 hours ago', url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=400', timestamp: Date.now() - 7200000 },
      { id: '2', title: 'Underwater Palace', type: 'video', date: '5 hours ago', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400', timestamp: Date.now() - 18000000 },
      { id: '3', title: 'Lo-fi Study Beats', type: 'music', date: 'Yesterday', url: 'https://images.unsplash.com/photo-1614728263952-84ea206f99b6?auto=format&fit=crop&q=80&w=400', timestamp: Date.now() - 86400000 },
    ];
  });

  useEffect(() => {
    localStorage.setItem('erkinjon_projects', JSON.stringify(projects));
  }, [projects]);

  const notify = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addProject = (projectData: Omit<Project, 'id' | 'date' | 'timestamp'>) => {
    const newProject: Project = {
      ...projectData,
      id: Math.random().toString(36).substr(2, 9),
      date: 'Just now',
      timestamp: Date.now(),
    };
    setProjects(prev => [newProject, ...prev]);
    notify(`New ${projectData.type} added to projects!`);
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    notify('Project deleted', 'error');
  };

  const clearProjects = () => {
    setProjects([]);
    notify('All projects cleared');
  };

  return (
    <ProjectContext.Provider value={{ projects, addProject, deleteProject, clearProjects, toast, notify }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}
