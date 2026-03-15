import { useState, useRef, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { FileNode, CanvasItem as CanvasItemType, CanvasConnection } from '../types';
import { mockFileTree } from '../data/mockData';
import { CanvasItem } from '../components/CanvasItem';
import { Button } from '../components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';
import { 
  PanelLeftOpen, 
  Trash2, 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Download,
  Link as LinkIcon,
  File,
  Image,
  Folder
} from 'lucide-react';
import { Badge } from '../components/ui/badge';

export function Canvas() {
  const [items, setItems] = useState<CanvasItemType[]>([
    { id: 'canvas-1', nodeId: 'file-1', x: 100, y: 100, width: 200, height: 150 },
    { id: 'canvas-2', nodeId: 'img-1', x: 400, y: 150, width: 200, height: 150 },
    { id: 'canvas-3', nodeId: 'file-3', x: 250, y: 350, width: 200, height: 150 },
  ]);
  const [connections, setConnections] = useState<CanvasConnection[]>([
    { id: 'conn-1', from: 'canvas-1', to: 'canvas-2' },
    { id: 'conn-2', from: 'canvas-1', to: 'canvas-3' },
  ]);
  const [zoom, setZoom] = useState(1);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop({
    accept: 'CANVAS_ITEM',
    drop: (item: any, monitor) => {
      const offset = monitor.getClientOffset();
      if (offset && canvasRef.current) {
        const canvasRect = canvasRef.current.getBoundingClientRect();
        const x = (offset.x - canvasRect.left) / zoom;
        const y = (offset.y - canvasRect.top) / zoom;
        handleMoveItem(item.id, x, y);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const handleMoveItem = (id: string, x: number, y: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, x, y } : item
      )
    );
  };

  const handleAddToCanvas = (node: FileNode) => {
    const newItem: CanvasItemType = {
      id: `canvas-${Date.now()}`,
      nodeId: node.id,
      x: 50 + items.length * 30,
      y: 50 + items.length * 30,
      width: 200,
      height: 150,
    };
    setItems([...items, newItem]);
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.5));
  const handleResetZoom = () => setZoom(1);

  const getNodeById = (nodeId: string): FileNode | null => {
    const findNode = (node: FileNode): FileNode | null => {
      if (node.id === nodeId) return node;
      if (node.children) {
        for (const child of node.children) {
          const found = findNode(child);
          if (found) return found;
        }
      }
      return null;
    };
    return findNode(mockFileTree);
  };

  const renderConnections = () => {
    return connections.map((conn) => {
      const fromItem = items.find((i) => i.id === conn.from);
      const toItem = items.find((i) => i.id === conn.to);
      if (!fromItem || !toItem) return null;

      const x1 = fromItem.x + fromItem.width / 2;
      const y1 = fromItem.y + fromItem.height / 2;
      const x2 = toItem.x + toItem.width / 2;
      const y2 = toItem.y + toItem.height / 2;

      return (
        <line
          key={conn.id}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          opacity="0.5"
          markerEnd="url(#arrowhead)"
        />
      );
    });
  };

  const FileTreeItem = ({ node, level = 0 }: { node: FileNode; level?: number }) => {
    const getIcon = () => {
      switch (node.type) {
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

    return (
      <div style={{ paddingLeft: `${level * 12}px` }}>
        <button
          onClick={() => node.type !== 'folder' && handleAddToCanvas(node)}
          className="w-full flex items-center gap-2 p-2 hover:bg-accent rounded text-left text-sm"
          disabled={node.type === 'folder'}
        >
          {getIcon()}
          <span className="flex-1 truncate">{node.name}</span>
        </button>
        {node.children?.map((child) => (
          <FileTreeItem key={child.id} node={child} level={level + 1} />
        ))}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="border-b p-4 flex items-center justify-between bg-card shadow-sm">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-xl font-bold">캔버스</h2>
            <p className="text-sm text-muted-foreground mt-1">
              자유롭게 지식을 연결하고 시각화하세요
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm min-w-[60px] text-center font-medium">
              {Math.round(zoom * 100)}%
            </span>
            <Button variant="outline" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleResetZoom}>
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <PanelLeftOpen className="w-4 h-4 mr-2" />
                자료 추가
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>캔버스에 자료 추가</SheetTitle>
              </SheetHeader>
              <Separator className="my-4" />
              <ScrollArea className="h-[calc(100vh-120px)]">
                <div className="space-y-1">
                  <FileTreeItem node={mockFileTree} />
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>

          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            내보내기
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setItems([])}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            전체 삭제
          </Button>
        </div>
      </div>

      {/* Info */}
      <div className="border-b p-3 bg-blue-50">
        <p className="text-sm text-blue-700 text-center">
          💡 좌측에서 자료를 선택하여 캔버스에 추가하고, 드래그하여 자유롭게 배치할 수 있습니다. 원본 파일 경로는 변경되지 않습니다.
        </p>
      </div>

      {/* Canvas */}
      <div
        ref={(node) => {
          drop(node);
          canvasRef.current = node;
        }}
        className={`flex-1 overflow-auto relative ${
          isOver ? 'bg-blue-50/50' : 'bg-white'
        }`}
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(66, 133, 244, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(66, 133, 244, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      >
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: '0 0',
            minWidth: '100%',
            minHeight: '100%',
            position: 'relative',
          }}
        >
          {/* SVG for connections */}
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
            }}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="hsl(var(--primary))"
                  opacity="0.5"
                />
              </marker>
            </defs>
            {renderConnections()}
          </svg>

          {/* Canvas Items */}
          {items.map((item) => {
            const node = getNodeById(item.nodeId);
            if (!node) return null;
            return (
              <CanvasItem
                key={item.id}
                node={node}
                x={item.x}
                y={item.y}
                onMove={handleMoveItem}
              />
            );
          })}

          {items.length === 0 && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-muted-foreground mb-2">
                캔버스가 비어있습니다
              </p>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">
                    <PanelLeftOpen className="w-4 h-4 mr-2" />
                    자료 추가하기
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>자료 추가</SheetTitle>
                  </SheetHeader>
                  <Separator className="my-4" />
                  <ScrollArea className="h-[calc(100vh-120px)]">
                    <div className="space-y-1">
                      <FileTreeItem node={mockFileTree} />
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </div>
          )}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="border-t p-2 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex gap-4">
          <span>캔버스 아이템: {items.length}개</span>
          <span>연결선: {connections.length}개</span>
        </div>
        <div>
          Zoom: {Math.round(zoom * 100)}%
        </div>
      </div>
    </div>
  );
}