import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bell, User, Settings, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Navbar = () => {
  const location = useLocation();

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/':
        return 'Dashboard Overview';
      case '/pipelines':
        return 'CI/CD Pipelines';
      case '/containers':
        return 'Container Management';
      case '/monitoring':
        return 'System Monitoring';
      default:
        return 'DevOps Dashboard';
    }
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-card border-b border-border">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            {getPageTitle(location.pathname)}
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor and manage your DevOps infrastructure
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search resources..."
            className="pl-10 w-64 bg-background"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full text-xs flex items-center justify-center text-destructive-foreground">
              3
            </span>
          </Button>
          
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="sm">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;