import { useState } from 'react';
import { Recommendation } from '../types';
import { mockPersonalizedRecommendations, mockFileTree } from '../data/mockData';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ScrollArea } from '../components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Sparkles, 
  RefreshCw, 
  ExternalLink, 
  TrendingUp, 
  Clock,
  Eye,
  Heart,
  Folder
} from 'lucide-react';
import { motion } from 'motion/react';

export function Recommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(
    mockPersonalizedRecommendations
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setRecommendations([...mockPersonalizedRecommendations].sort(() => Math.random() - 0.5));
      setIsRefreshing(false);
    }, 1000);
  };

  const userStats = {
    totalAccess: 132,
    favoriteTopics: ['React', 'AI', '디자인'],
    recentlyViewed: 23,
    savedItems: 45,
  };

  const tagColors = [
    'bg-blue-100 text-blue-700 border-blue-200',
    'bg-purple-100 text-purple-700 border-purple-200',
    'bg-green-100 text-green-700 border-green-200',
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b p-4 bg-gradient-to-br from-blue-50 to-white shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">개인 맞춤 추천</h2>
              <p className="text-sm text-muted-foreground">
                AI가 사용자 활동을 분석하여 추천합니다
              </p>
            </div>
          </div>
          <Button onClick={handleRefresh} disabled={isRefreshing} className="bg-primary hover:bg-primary/90">
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            새로고침
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* User Activity Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-blue-700 font-medium">총 조회수</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">{userStats.totalAccess}</p>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-green-600" />
                <span className="text-xs text-green-700 font-medium">최근 조회</span>
              </div>
              <p className="text-2xl font-bold text-green-900">{userStats.recentlyViewed}</p>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-pink-600" />
                <span className="text-xs text-pink-700 font-medium">저장한 자료</span>
              </div>
              <p className="text-2xl font-bold text-pink-900">{userStats.savedItems}</p>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span className="text-xs text-purple-700 font-medium">관심 주제</span>
              </div>
              <p className="text-2xl font-bold text-purple-900">{userStats.favoriteTopics.length}</p>
            </Card>
          </div>

          {/* Interest Profile */}
          <Card className="p-5 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-primary/20 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-primary">관심 프로필</h3>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                주요 관심 주제를 분석하여 유사한 자료를 추천합니다
              </p>
              <div className="flex flex-wrap gap-2">
                {userStats.favoriteTopics.map((topic, idx) => (
                  <span
                    key={topic}
                    className={`px-3 py-1.5 rounded-full border font-medium ${tagColors[idx % tagColors.length]}`}
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </Card>

          {/* Folder Filter */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Folder className="w-4 h-4 text-primary" />
              폴더별 추천
            </h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedFolder === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFolder(null)}
                className={selectedFolder === null ? 'bg-primary' : ''}
              >
                전체
              </Button>
              {mockFileTree.children?.map((folder) => (
                <Button
                  key={folder.id}
                  variant={selectedFolder === folder.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedFolder(folder.id)}
                  className={selectedFolder === folder.id ? 'bg-primary' : ''}
                >
                  {folder.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">전체 추천</TabsTrigger>
              <TabsTrigger value="external">외부 자료</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.map((rec, index) => (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer group h-full">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-sm leading-tight flex-1 group-hover:text-primary transition-colors">
                            {rec.title}
                          </h3>
                          {rec.type === 'external' && (
                            <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          )}
                        </div>

                        {rec.thumbnail && (
                          <img
                            src={rec.thumbnail}
                            alt={rec.title}
                            className="w-full h-40 object-cover rounded"
                          />
                        )}

                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {rec.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex gap-1 flex-wrap">
                            {rec.tags?.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-primary">
                              {Math.round(rec.similarity * 100)}% 일치
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t">
                          <span className="text-xs text-muted-foreground">
                            {rec.type === 'external' ? `출처: ${rec.source}` : '내부 자료'}
                          </span>
                          <Badge variant={rec.type === 'external' ? 'outline' : 'secondary'}>
                            {rec.type === 'external' ? '외부' : '내부'}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="external" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations
                  .filter((rec) => rec.type === 'external')
                  .map((rec, index) => (
                    <motion.div
                      key={rec.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer group h-full">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-sm leading-tight flex-1 group-hover:text-primary transition-colors">
                              {rec.title}
                            </h3>
                            <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          </div>

                          {rec.thumbnail && (
                            <img
                              src={rec.thumbnail}
                              alt={rec.title}
                              className="w-full h-40 object-cover rounded"
                            />
                          )}

                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {rec.description}
                          </p>

                          <div className="flex gap-1 flex-wrap">
                            {rec.tags?.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t">
                            <span className="text-xs text-muted-foreground">
                              출처: {rec.source}
                            </span>
                            <span className="text-xs font-medium text-primary">
                              {Math.round(rec.similarity * 100)}% 일치
                            </span>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Info Box */}
          <Card className="p-4 bg-muted/50 border-dashed">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">추천 시스템 정보</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• 자주 열어본 자료와 검색 키워드를 분석합니다</li>
                <li>• KoSimCSE, BGE-M3, CLIP 임베딩을 활용한 벡터 유사도 기반</li>
                <li>• 코사인 유사도로 관련성이 높은 자료를 우선 추천합니다</li>
                <li>• 특정 폴더를 선택하여 해당 폴더 기반 추천도 가능합니다</li>
              </ul>
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}