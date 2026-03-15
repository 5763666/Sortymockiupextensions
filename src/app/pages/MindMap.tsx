import { useState } from 'react';
import { FileNode } from '../types';
import { mockFileTree } from '../data/mockData';
import { MindMapNode } from '../components/MindMapNode';
import { RecommendationSidebar } from '../components/RecommendationSidebar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search, Plus, FolderPlus, Download, Upload } from 'lucide-react';
import { ScrollArea } from '../components/ui/scroll-area';
import { Folder } from 'lucide-react';

export function MindMap() {
  const [fileTree, setFileTree] = useState<FileNode>(mockFileTree);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['root', 'ai-study', 'web-dev']));
  const [selectedNode, setSelectedNode] = useState<FileNode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleToggle = (nodeId: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const handleShowRecommendations = (node: FileNode) => {
    setSelectedNode(node);
  };

  const handleCloseRecommendations = () => {
    setSelectedNode(null);
  };

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="border-b p-4 bg-card shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold">지식 마인드맵</h2>
              <p className="text-sm text-muted-foreground mt-1">
                AI가 자동으로 분류한 지식을 탐색하고 관리하세요
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                가져오기
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                내보내기
              </Button>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                파일 추가
              </Button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="마인드맵에서 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white border-gray-200"
            />
          </div>
        </div>

        {/* Mind Map Tree */}
        <ScrollArea className="flex-1">
          <div className="p-6">
            <div className="bg-card border rounded-xl p-5 shadow-sm">
              <div className="mb-5 pb-4 border-b bg-blue-50 -m-5 p-4 rounded-t-xl">
                <p className="text-sm text-blue-700">
                  💡 노드를 드래그하여 이동하거나, 우클릭하여 유사 자료를 추천받을 수 있습니다
                </p>
              </div>
              <div className="pt-2">
                <MindMapNode
                  node={fileTree}
                  level={0}
                  onToggle={handleToggle}
                  onShowRecommendations={handleShowRecommendations}
                  expanded={expanded}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Folder className="w-4 h-4 text-blue-600" />
                  <p className="text-xs text-blue-700 font-medium">전체 폴더</p>
                </div>
                <p className="text-2xl font-bold text-blue-900">4</p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FolderPlus className="w-4 h-4 text-amber-600" />
                  <p className="text-xs text-amber-700 font-medium">전체 파일</p>
                </div>
                <p className="text-2xl font-bold text-amber-900">8</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 text-purple-600">🖼️</div>
                  <p className="text-xs text-purple-700 font-medium">이미지</p>
                </div>
                <p className="text-2xl font-bold text-purple-900">5</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 border border-cyan-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 text-cyan-600">🔗</div>
                  <p className="text-xs text-cyan-700 font-medium">링크</p>
                </div>
                <p className="text-2xl font-bold text-cyan-900">2</p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Recommendation Sidebar */}
      {selectedNode && (
        <RecommendationSidebar
          node={selectedNode}
          onClose={handleCloseRecommendations}
        />
      )}
    </div>
  );
}