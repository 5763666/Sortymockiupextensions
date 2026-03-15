export interface FileNode {
  id: string;
  name: string;
  type: 'folder' | 'file' | 'image' | 'link';
  path: string;
  children?: FileNode[];
  tags?: string[];
  description?: string;
  url?: string;
  thumbnail?: string;
  embedding?: number[];
  createdAt: Date;
  accessCount?: number;
}

export interface CanvasItem {
  id: string;
  nodeId: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CanvasConnection {
  id: string;
  from: string;
  to: string;
}

export interface Recommendation {
  id: string;
  title: string;
  type: 'internal' | 'external';
  source?: string;
  similarity: number;
  description: string;
  url?: string;
  tags?: string[];
  thumbnail?: string;
}
