import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';

const StatusBadge = ({ status, className }) => {
  const getStatusConfig = (status) => {
    switch (status.toLowerCase()) {
      case 'success':
        return {
          variant: 'success',
          icon: CheckCircle,
          className: 'status-success'
        };
      case 'failed':
      case 'error':
        return {
          variant: 'destructive', 
          icon: XCircle,
          className: 'status-danger'
        };
      case 'running':
        return {
          variant: 'default',
          icon: Clock,
          className: 'status-running'
        };
      case 'warning':
        return {
          variant: 'secondary',
          icon: AlertCircle,
          className: 'status-warning'
        };
      case 'stopped':
        return {
          variant: 'outline',
          icon: XCircle,
          className: 'bg-muted text-muted-foreground'
        };
      default:
        return {
          variant: 'secondary',
          icon: null,
          className: ''
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge 
      variant={config.variant}
      className={cn(
        'flex items-center gap-1 px-2 py-1 text-xs font-medium',
        config.className,
        className
      )}
    >
      {Icon && <Icon className="h-3 w-3" />}
      {status}
    </Badge>
  );
};

export default StatusBadge;