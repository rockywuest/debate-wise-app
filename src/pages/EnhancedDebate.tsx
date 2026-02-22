
import React, { useState, useEffect } from 'react';
import { useDebates } from '@/hooks/useDebates';
import { CreateDebateForm } from '@/components/CreateDebateForm';
import { DebateCard } from '@/components/DebateCard';
import { TrendingDebates } from '@/components/TrendingDebates';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLocalizedText, useTranslation } from '@/utils/i18n';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc,
  Clock,
  Users,
  TrendingUp,
  Star
} from 'lucide-react';

type SortOption = 'newest' | 'oldest' | 'most_active' | 'most_arguments';
type FilterOption = 'all' | 'active' | 'recent' | 'popular';

const EnhancedDebate = () => {
  const { debates, loading } = useDebates();
  const { t, language } = useTranslation();
  const text = useLocalizedText();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredAndSortedDebates = React.useMemo(() => {
    let filtered = debates.filter(debate => 
      debate.titel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (debate.beschreibung && debate.beschreibung.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Apply filters
    const now = new Date();
    switch (filterBy) {
      case 'recent':
        filtered = filtered.filter(debate => {
          const debateDate = new Date(debate.erstellt_am);
          const daysDiff = (now.getTime() - debateDate.getTime()) / (1000 * 60 * 60 * 24);
          return daysDiff <= 7;
        });
        break;
      case 'active':
        // This would need argument data to properly filter active debates
        break;
      case 'popular':
        // This would need engagement metrics
        break;
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'newest':
        case 'oldest':
          comparison = new Date(a.erstellt_am).getTime() - new Date(b.erstellt_am).getTime();
          if (sortBy === 'newest') comparison = -comparison;
          break;
        case 'most_active':
          // Would need activity metrics
          comparison = 0;
          break;
        case 'most_arguments':
          // Would need argument counts
          comparison = 0;
          break;
      }
      
      return sortOrder === 'desc' ? comparison : -comparison;
    });

    return filtered;
  }, [debates, searchTerm, sortBy, filterBy, sortOrder]);

  const getSortIcon = () => {
    return sortOrder === 'desc' ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />;
  };

  const getSortLabel = (option: SortOption) => {
    const labels = {
      newest: text('Newest', 'Neueste'),
      oldest: text('Oldest', 'Alteste'),
      most_active: text('Most active', 'Aktivste'),
      most_arguments: text('Most arguments', 'Meiste Argumente')
    };
    return labels[option];
  };

  const getFilterLabel = (option: FilterOption) => {
    const labels = {
      all: text('All', 'Alle'),
      active: text('Active', 'Aktiv'),
      recent: text('Last 7 days', 'Letzte 7 Tage'),
      popular: text('Popular', 'Beliebt')
    };
    return labels[option];
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              {t('debates.title')}
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              {t('debates.subtitle')}
            </p>
            <CreateDebateForm />
          </div>

          {/* Trending Section */}
          <TrendingDebates />

          {/* Search and Filter Section */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                {text('Search all debates', 'Alle Debatten durchsuchen')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder={text('Search debates...', 'Debatte suchen...')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filters and Sorting */}
                <div className="flex flex-wrap gap-2 items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      {text('Filter:', 'Filter:')}
                    </span>
                    {(['all', 'active', 'recent', 'popular'] as FilterOption[]).map((filter) => (
                      <Badge
                        key={filter}
                        variant={filterBy === filter ? 'default' : 'secondary'}
                        className="cursor-pointer hover:bg-primary/80"
                        onClick={() => setFilterBy(filter)}
                      >
                        {getFilterLabel(filter)}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      {text('Sort:', 'Sortieren:')}
                    </span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="text-sm border rounded px-2 py-1"
                    >
                      {(['newest', 'oldest', 'most_active', 'most_arguments'] as SortOption[]).map((option) => (
                        <option key={option} value={option}>
                          {getSortLabel(option)}
                        </option>
                      ))}
                    </select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                    >
                      {getSortIcon()}
                    </Button>
                  </div>
                </div>

                {/* Results Count */}
                <div className="text-sm text-muted-foreground">
                  {filteredAndSortedDebates.length} {text('debates found', 'Debatten gefunden')}
                  {searchTerm && (
                    <span> {text('for', 'fur')} "{searchTerm}"</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Debates Grid */}
          <div className="space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : filteredAndSortedDebates.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  {searchTerm ? (
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {text('No results found', 'Keine Ergebnisse gefunden')}
                      </h3>
                      <p className="text-muted-foreground">
                        {text(
                          `No debates found for "${searchTerm}". Try different search terms.`,
                          `Keine Debatten fur "${searchTerm}" gefunden. Versuchen Sie andere Suchbegriffe.`
                        )}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {t('debates.empty')}
                      </h3>
                      <CreateDebateForm />
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedDebates.map((debate) => (
                  <DebateCard
                    key={debate.id}
                    id={debate.id}
                    title={debate.titel}
                    description={debate.beschreibung}
                    createdAt={debate.erstellt_am}
                    language={language}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDebate;
