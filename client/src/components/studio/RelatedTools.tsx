import { Link } from 'wouter';
import { Calculator, Ruler, Clock } from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  comingSoon?: boolean;
}

const STUDIO_TOOLS: Tool[] = [
  {
    id: 'scale-calculator',
    name: 'Scale Calculator',
    description: 'Convert between architectural scales and calculate dimensions',
    href: '/studio/apps/scale-calculator',
    icon: <Calculator className="w-6 h-6" />
  },
  {
    id: 'dimension-reference',
    name: 'Dimension Reference',
    description: 'Quick reference for architecture, theatre, and event dimensions',
    href: '/studio/apps/dimension-reference',
    icon: <Ruler className="w-6 h-6" />
  },
  {
    id: 'design-history-timeline',
    name: 'Design History Timeline',
    description: 'Explore 30 major design periods from Ancient Egypt to Contemporary',
    href: '/studio/apps/design-history-timeline',
    icon: <Clock className="w-6 h-6" />
  }
];

interface RelatedToolsProps {
  currentToolId: string;
}

export function RelatedTools({ currentToolId }: RelatedToolsProps) {
  const relatedTools = STUDIO_TOOLS.filter(tool => tool.id !== currentToolId);

  if (relatedTools.length === 0) return null;

  return (
    <div className="mt-24 border-t border-black/10 dark:border-white/10 pt-12">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-display italic mb-8">More Studio Tools</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {relatedTools.map(tool => {
            const CardContent = (
              <div className={`group block p-6 bg-neutral-200/60 dark:bg-neutral-900/60 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-3xl transition-all ${tool.comingSoon ? 'opacity-60 cursor-not-allowed' : 'hover:border-black/30 dark:hover:border-white/30 cursor-pointer'}`}>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-black/5 dark:bg-white/5 rounded-2xl group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors">
                    {tool.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-display italic">{tool.name}</h3>
                      {tool.comingSoon && (
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-pink-500/20 text-pink-500 rounded-full border border-pink-500/30">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-black/60 dark:text-white/60">{tool.description}</p>
                  </div>
                </div>
              </div>
            );
            
            return tool.comingSoon ? (
              <div key={tool.id}>{CardContent}</div>
            ) : (
              <Link key={tool.id} href={tool.href}>{CardContent}</Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
