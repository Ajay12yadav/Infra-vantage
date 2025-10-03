import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default function GitHub() {
  const { state } = useLocation();
  
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">GitHub Dashboard</h1>
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={state?.avatarUrl} />
            <AvatarFallback>{state?.username?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <Badge variant="outline" className="text-sm">
            {state?.username}
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Repositories</CardTitle>
        </CardHeader>
        <CardContent>
          {!state?.repositories?.length ? (
            <div className="text-center py-6 text-gray-500">
              No repositories found
            </div>
          ) : (
            <ScrollArea className="h-[600px] pr-4">
              <div className="grid gap-4">
                {state.repositories.map((repo) => (
                  <Card key={repo.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {repo.fullName}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {repo.description || 'No description provided'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {repo.language && (
                          <Badge variant="secondary">
                            {repo.language}
                          </Badge>
                        )}
                        <Badge>
                          ⭐ {repo.stars}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                      <span>
                        Updated: {new Date(repo.updatedAt).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>
                        {repo.private ? 'Private' : 'Public'}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}