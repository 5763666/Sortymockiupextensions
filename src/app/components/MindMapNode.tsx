import { useState } from 'react';
import { FileNode } from '../types';
import { ChevronRight, ChevronDown, Folder, File, Image, Link as LinkIcon, MoreVertical, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from './ui/context-menu';
import { Badge } from './ui/badge';

interface MindMapNodeProps {
  node: FileNode;
  level: number;
  onToggle: (nodeId: string) => void;
  onShowRecommendations: (node: FileNode) => void;
  expanded: Set<string>;
}

const tagColors = [
  'bg-blue-100 text-blue-700 border-blue-200',
  'bg-purple-100 text-purple-700 border-purple-200',
  'bg-green-100 text-green-700 border-green-200',
  'bg-amber-100 text-amber-700 border-amber-200',
  'bg-pink-100 text-pink-700 border-pink-200',
  'bg-cyan-100 text-cyan-700 border-cyan-200',
];

export function MindMapNode({ node, level, onToggle, onShowRecommendations, expanded }: MindMapNodeProps) {
  const [isDragging, setIsDragging] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expanded.has(node.id);

  const getIcon = () => {
    switch (node.type) {
      case 'folder':
        return <Folder className="w-4 h-4 text-blue-500" />;
      case 'image':
        return <Image className="w-4 h-4 text-purple-500" />;
      case 'link':
        return <LinkIcon className="w-4 h-4 text-cyan-500" />;
      default:
        return <FileText className="w-4 h-4 text-amber-600" />;
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify(node));
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (node.type === 'folder') {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const draggedNode = JSON.parse(e.dataTransfer.getData('application/json'));
    console.log(`Moving ${draggedNode.name} to ${node.name}`);
  };

  return (
    <div style={{ paddingLeft: `${level * 20}px` }}>
      <ContextMenu>
        <ContextMenuTrigger>
          <motion.div
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`
              flex items-center gap-2 py-2.5 px-3 rounded-lg cursor-pointer
              hover:bg-blue-50 transition-colors group relative
              ${isDragging ? 'opacity-50' : ''}
              ${isExpanded && hasChildren ? 'bg-blue-50/50' : ''}
            `}
            whileHover={{ x: 4 }}
            transition={{ duration: 0.15 }}
          >
            {hasChildren && (
              <button
                onClick={() => onToggle(node.id)}
                className="hover:bg-blue-100 rounded p-0.5 transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-blue-600" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-blue-600" />
                )}
              </button>
            )}
            {!hasChildren && <div className="w-5" />}
            
            {getIcon()}
            
            <span className="flex-1 truncate text-sm">{node.name}</span>
            
            {node.accessCount && (
              <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-0.5 rounded">
                {node.accessCount}회
              </span>
            )}

            <button className="opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </button>
          </motion.div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48">
          <ContextMenuItem onClick={() => console.log('열기')}>
            열기
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onShowRecommendations(node)}>
            유사 자료 추천
          </ContextMenuItem>
          <ContextMenuItem onClick={() => console.log('이름 변경')}>
            이름 변경
          </ContextMenuItem>
          <ContextMenuItem onClick={() => console.log('삭제')} className="text-red-600">
            삭제
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {node.tags && node.tags.length > 0 && isExpanded && (
        <div className="flex gap-1.5 flex-wrap ml-14 mb-2 mt-1">
          {node.tags.slice(0, 4).map((tag, idx) => (
            <span
              key={tag}
              className={`text-xs px-2 py-0.5 rounded-full border ${tagColors[idx % tagColors.length]}`}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {isExpanded && hasChildren && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          {node.children!.map((child) => (
            <MindMapNode
              key={child.id}
              node={child}
              level={level + 1}
              onToggle={onToggle}
              onShowRecommendations={onShowRecommendations}
              expanded={expanded}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}