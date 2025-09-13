import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const MetricCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  variant = 'default',
  className 
}) => {
  const getVariantClasses = (variant) => {
    switch (variant) {
      case 'success':
        return 'metric-card-success';
      case 'warning': 
        return 'metric-card-warning';
      case 'primary':
        return 'metric-card-primary';
      default:
        return 'card-devops';
    }
  };

  return (
    <Card className={cn(
      'transition-all duration-300',
      getVariantClasses(variant),
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium opacity-90">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-5 w-5 opacity-75" />}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-1">{value}</div>
        {subtitle && (
          <p className="text-sm opacity-75">
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;