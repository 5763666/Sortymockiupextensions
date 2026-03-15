import { FileNode, Recommendation } from '../types';
import { X, ExternalLink, RefreshCw, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { motion } from 'motion/react';
import { mockRecommendations } from '../data/mockData';
import { useState } from 'react';
import { Card } from './ui/card';

interface RecommendationSidebarProps {
  node: FileNode | null;
  onClose: () => void;
}

export function RecommendationSidebar({ node, onClose }: RecommendationSidebarProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(mockRecommendations);
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!node) return null;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setRecommendations([...mockRecommendations].sort(() => Math.random() - 0.5));
      setIsRefreshing(false);
    }, 800);
  };

  const tagColors = [
    'bg-blue-100 text-blue-700 border-blue-200',
    'bg-purple-100 text-purple-700 border-purple-200',
    'bg-green-100 text-green-700 border-green-200',
  ];

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: 'spring', damping: 25 }}
      className="w-96 border-l bg-card h-full flex flex-col shadow-lg"
    >
      {/* Header */}
      <div className="p-4 border-b space-y-3 bg-gradient-to-br from-blue-50 to-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-bold text-primary">유사 자료 추천</h3>
            </div>
            <p className="text-sm text-muted-foreground truncate ml-9">
              {node.name}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-white">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {node.tags && node.tags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap ml-9">
            {node.tags.map((tag, idx) => (
              <span
                key={tag}
                className={`text-xs px-2 py-0.5 rounded-full border ${tagColors[idx % tagColors.length]}`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="w-full ml-9 mr-9 bg-white"
        >
          <RefreshCw className={`w-3 h-3 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          새로고침
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {/* 분석 정보 */}
          <Card className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">분석 정보</span>
            </div>
            <p className="text-xs text-blue-700">
              {node.type === 'folder' 
                ? `폴더 내 ${node.children?.length || 0}개 자료를 분석하여 공통 태그와 주제를 추출했습니다.`
                : '파일 내용의 유사도를 측정하여 관련성 높은 자료를 찾았습니다.'
              }
            </p>
          </Card>

          <Separator />

          {/* 추천 목록 */}
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-3 hover:shadow-md transition-all cursor-pointer group border-gray-200 bg-white hover:border-blue-200">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-sm leading-tight flex-1 group-hover:text-primary transition-colors">
                        {rec.title}
                      </h4>
                      {rec.type === 'external' && (
                        <ExternalLink className="w-3 h-3 text-blue-500 flex-shrink-0 mt-0.5" />
                      )}
                    </div>

                    {rec.thumbnail && (
                      <img
                        src={rec.thumbnail}
                        alt={rec.title}
                        className="w-full h-24 object-cover rounded border"
                      />
                    )}

                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {rec.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-1 flex-wrap">
                        {rec.tags?.slice(0, 2).map((tag, idx) => (
                          <span
                            key={tag}
                            className={`text-xs px-2 py-0.5 rounded-full border ${tagColors[idx % tagColors.length]}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs font-bold text-primary bg-blue-50 px-2 py-0.5 rounded">
                        {Math.round(rec.similarity * 100)}%
                      </span>
                    </div>

                    {rec.source && (
                      <p className="text-xs text-muted-foreground pt-1 border-t">
                        출처: {rec.source}
                      </p>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </motion.div>
  );
}