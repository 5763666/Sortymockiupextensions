import { useDrag } from 'react-dnd';
import { FileNode } from '../types';
import { File, Image, Link as LinkIcon, Folder } from 'lucide-react';
import { Card } from './ui/card';

interface CanvasItemProps {
  node: FileNode;
  x: number;
  y: number;
  onMove: (id: string, x: number, y: number) => void;
}

export function CanvasItem({ node, x, y, onMove }: CanvasItemProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'CANVAS_ITEM',
    item: { id: node.id, x, y },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const getIcon = () => {
    switch (node.type) {
      case 'folder':
        return <Folder className="w-4 h-4 text-blue-500" />;
      case 'image':
        return <Image className="w-4 h-4 text-purple-500" />;
      case 'link':
        return <LinkIcon className="w-4 h-4 text-cyan-500" />;
      default:
        return <File className="w-4 h-4 text-amber-600" />;
    }
  };

  const getNodeColor = () => {
    switch (node.type) {
      case 'folder':
        return 'border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100';
      case 'image':
        return 'border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100';
      case 'link':
        return 'border-cyan-200 bg-gradient-to-br from-cyan-50 to-cyan-100';
      default:
        return 'border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100';
    }
  };

  return (
    <div
      ref={drag}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
    >
      <Card className={`p-3 min-w-[180px] max-w-[200px] hover:shadow-lg transition-all border-2 ${getNodeColor()}`}>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {getIcon()}
            <span className="text-sm font-medium truncate flex-1">
              {node.name}
            </span>
          </div>
          
          {node.thumbnail && (
            <img
              src={node.thumbnail}
              alt={node.name}
              className="w-full h-20 object-cover rounded border"
            />
          )}

          {node.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {node.description}
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}