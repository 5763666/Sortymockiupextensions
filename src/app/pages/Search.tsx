import { useState } from 'react';
import { FileNode } from '../types';
import { mockFileTree, allTags } from '../data/mockData';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ScrollArea } from '../components/ui/scroll-area';
import { Search as SearchIcon, Filter, X, File, Image, Link as LinkIcon, Folder } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

export function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchResults, setSearchResults] = useState<FileNode[]>([]);

  const getAllFiles = (node: FileNode): FileNode[] => {
    let files: FileNode[] = [];
    if (node.type !== 'folder') {
      files.push(node);
    }
    if (node.children) {
      node.children.forEach((child) => {
        files = [...files, ...getAllFiles(child)];
      });
    }
    return files;
  };

  const handleSearch = () => {
    const allFiles = getAllFiles(mockFileTree);
    let results = allFiles;

    // Filter by search query
    if (searchQuery) {
      results = results.filter(
        (file) =>
          file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          file.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by type
    if (selectedType !== 'all') {
      results = results.filter((file) => file.type === selectedType);
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      results = results.filter((file) =>
        selectedTags.some((tag) => file.tags?.includes(tag))
      );
    }

    setSearchResults(results);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setSelectedType('all');
    setSearchResults([]);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'folder':
        return <Folder className="w-4 h-4 text-amber-500" />;
      case 'image':
        return <Image className="w-4 h-4 text-purple-500" />;
      case 'link':
        return <LinkIcon className="w-4 h-4 text-blue-500" />;
      default:
        return <File className="w-4 h-4 text-gray-500" />;
    }
  };

  const typeStats = {
    all: getAllFiles(mockFileTree).length,
    file: getAllFiles(mockFileTree).filter((f) => f.type === 'file').length,
    image: getAllFiles(mockFileTree).filter((f) => f.type === 'image').length,
    link: getAllFiles(mockFileTree).filter((f) => f.type === 'link').length,
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b p-4 bg-card shadow-sm">
        <h2 className="text-xl font-bold mb-1">자료 검색</h2>
        <p className="text-sm text-muted-foreground mb-4">
          파일명, 내용, 태그로 자료를 검색하고 필터링하세요
        </p>

        {/* Search Bar */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="파일명, 내용, 태그로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-9 bg-white border-gray-200"
            />
          </div>
          <Button onClick={handleSearch} className="bg-primary hover:bg-primary/90">
            <SearchIcon className="w-4 h-4 mr-2" />
            검색
          </Button>
        </div>

        {/* Filters */}
        <div className="space-y-3 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">필터</span>
            {(selectedTags.length > 0 || selectedType !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-6 text-xs"
              >
                <X className="w-3 h-3 mr-1" />
                초기화
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">유형:</span>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-40 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 ({typeStats.all})</SelectItem>
                <SelectItem value="file">문서 ({typeStats.file})</SelectItem>
                <SelectItem value="image">이미지 ({typeStats.image})</SelectItem>
                <SelectItem value="link">링크 ({typeStats.link})</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">태그:</p>
            <div className="flex flex-wrap gap-1.5">
              {allTags.slice(0, 15).map((tag, idx) => {
                const tagColors = [
                  'bg-blue-100 text-blue-700 border-blue-200',
                  'bg-purple-100 text-purple-700 border-purple-200',
                  'bg-green-100 text-green-700 border-green-200',
                  'bg-amber-100 text-amber-700 border-amber-200',
                  'bg-pink-100 text-pink-700 border-pink-200',
                  'bg-cyan-100 text-cyan-700 border-cyan-200',
                ];
                const isSelected = selectedTags.includes(tag);
                return (
                  <span
                    key={tag}
                    className={`text-xs px-2.5 py-1 rounded-full border cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-primary text-white border-primary' 
                        : `${tagColors[idx % tagColors.length]} hover:opacity-80`
                    }`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                    {isSelected && (
                      <X className="w-3 h-3 ml-1 inline" />
                    )}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {searchResults.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {searchResults.length}개의 결과를 찾았습니다
                </p>
              </div>

              <Tabs defaultValue="grid" className="w-full">
                <TabsList>
                  <TabsTrigger value="grid">그리드</TabsTrigger>
                  <TabsTrigger value="list">리스트</TabsTrigger>
                </TabsList>

                <TabsContent value="grid" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchResults.map((file) => (
                      <Card key={file.id} className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                        <div className="space-y-3">
                          <div className="flex items-start gap-2">
                            {getIcon(file.type)}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm truncate">
                                {file.name}
                              </h3>
                              <p className="text-xs text-muted-foreground truncate">
                                {file.path}
                              </p>
                            </div>
                          </div>

                          {file.thumbnail && (
                            <img
                              src={file.thumbnail}
                              alt={file.name}
                              className="w-full h-32 object-cover rounded"
                            />
                          )}

                          {file.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {file.description}
                            </p>
                          )}

                          {file.tags && file.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {file.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {file.accessCount && (
                            <p className="text-xs text-muted-foreground">
                              조회 {file.accessCount}회
                            </p>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="list" className="mt-4">
                  <div className="space-y-2">
                    {searchResults.map((file) => (
                      <Card key={file.id} className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-center gap-3">
                          {getIcon(file.type)}
                          {file.thumbnail && (
                            <img
                              src={file.thumbnail}
                              alt={file.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm truncate">
                              {file.name}
                            </h3>
                            <p className="text-xs text-muted-foreground truncate">
                              {file.path}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {file.tags && file.tags.length > 0 && (
                              <div className="flex gap-1">
                                {file.tags.slice(0, 2).map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            {file.accessCount && (
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {file.accessCount}회
                              </span>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          ) : searchQuery || selectedTags.length > 0 || selectedType !== 'all' ? (
            <div className="text-center py-12">
              <SearchIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">검색 결과가 없습니다</p>
              <Button variant="outline" onClick={clearFilters} className="mt-4">
                필터 초기화
              </Button>
            </div>
          ) : (
            <div className="text-center py-12">
              <SearchIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">
                검색어를 입력하거나 필터를 선택하세요
              </p>
              <p className="text-sm text-muted-foreground">
                파일명, 내용, 태그로 검색하고 유형별로 필터링할 수 있습니다
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}