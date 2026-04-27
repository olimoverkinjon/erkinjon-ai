import { useState } from 'react';
import { Play, Calendar, Search, Filter, MoreVertical, Download, ExternalLink, Trash2, X } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { motion, AnimatePresence } from 'motion/react';

export default function Projects() {
  const { projects, deleteProject } = useProjects();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const filteredProjects = projects
    .filter(p => filter === 'all' || p.type === filter)
    .filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleDownload = (p: any) => {
    // Simulated download
    const link = document.createElement('a');
    link.href = p.url;
    link.download = `${p.title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2 text-gradient">Your Creative Archive</h1>
          <p className="text-text-secondary text-sm">Manage and export your AI-generated gems ({projects.length} items).</p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-brand-card border border-brand-border rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-accent w-full md:w-64"
            />
          </div>
          <button className="p-2.5 glass rounded-xl hover:bg-white/5 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-brand-card border border-brand-border rounded-2xl w-fit">
        {['all', 'image', 'video', 'music'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              filter === f ? 'bg-accent text-white' : 'text-text-secondary hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div 
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              className="glass rounded-[2rem] overflow-hidden group hover:border-accent/40 transition-all flex flex-col h-full relative"
            >
              <div className="relative aspect-video overflow-hidden">
                <img src={project.url} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/20 shadow-lg ${
                     project.type === 'image' ? 'bg-blue-500/50' : 
                     project.type === 'video' ? 'bg-purple-500/50' : 'bg-green-500/50'
                  }`}>
                    {project.type}
                  </span>
                </div>
                {project.type !== 'image' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform">
                      <Play size={20} fill="currentColor" />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-start justify-between mb-4 relative">
                  <div>
                    <h3 className="font-bold mb-1 line-clamp-1">{project.title}</h3>
                    <div className="flex items-center gap-2 text-[10px] text-text-secondary font-bold uppercase">
                      <Calendar size={12} />
                      {project.date}
                    </div>
                  </div>
                  <div className="relative">
                    <button 
                      onClick={() => setActiveMenuId(activeMenuId === project.id ? null : project.id)}
                      className="text-text-secondary hover:text-white transition-colors p-1"
                    >
                      <MoreVertical size={18} />
                    </button>
                    
                    <AnimatePresence>
                      {activeMenuId === project.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)} />
                          <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 top-8 w-40 glass border border-white/10 rounded-2xl p-2 z-20 shadow-2xl"
                          >
                            <button 
                              onClick={() => { deleteProject(project.id); setActiveMenuId(null); }}
                              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-text-secondary hover:bg-white/5 transition-colors">
                              <ExternalLink size={14} /> Details
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                
                <div className="mt-auto pt-6 border-t border-white/5 flex gap-2">
                  <button 
                    onClick={() => handleDownload(project)}
                    className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-accent hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <Download size={14} /> Download
                  </button>
                  <button className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-accent hover:text-white transition-all text-xs font-bold flex items-center justify-center">
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-20 glass rounded-[3rem] border border-dashed border-white/5">
          <p className="text-text-secondary font-bold uppercase tracking-widest mb-2">No discoveries found</p>
          <p className="text-xs text-white/20">Try adjusting your filter or search terms</p>
        </div>
      )}
    </div>
  );
}
