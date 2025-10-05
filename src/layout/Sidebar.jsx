import { NavLink, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  GitBranch, 
  Container, 
  Activity,
  Menu,
  Server,
  Box,
  Database
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/',
      icon: BarChart3
    },
    {
      name: 'Pipelines', 
      href: '/pipelines',
      icon: GitBranch
    },
    {
      name: 'Containers',
      href: '/containers', 
      icon: Container
    },
    {
      name: 'Monitoring',
      href: '/monitoring',
      icon: Activity
    },
    {
      name: 'Kubernetes',
      href: '/kubernetes',
      icon: Activity
    }

  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className={cn(
      'flex flex-col bg-card border-r border-border transition-all duration-300',
      isCollapsed ? 'w-16' : 'w-64'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-glow rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">DevOps</span>
          </div>
        )}
        <Button
          variant="ghost" 
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  active 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                  isCollapsed && 'justify-center'
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.name}</span>}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className={cn(
          'text-xs text-muted-foreground',
          isCollapsed ? 'text-center' : ''
        )}>
          {isCollapsed ? 'v2.1' : 'DevOps Dashboard v2.1.0'}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;