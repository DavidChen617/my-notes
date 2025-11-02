export interface NoteItem {
  name: string;
  parentPath: string;
}

export interface FileNode {
  name: string;
  path: string;
  children?: FileNode[];
  isFile: boolean;
}

export class FileTreeBuilder {
  static buildTree(items: NoteItem[]): FileNode[] {
    const root: Map<string, FileNode> = new Map();

    items.forEach(item => {
      const fullPath = `${item.parentPath}/${item.name}`;
      const parts = fullPath.split('/').filter(p => p.length > 0);

      this.insertNode(root, parts, fullPath);
    });

    return this.mapToArray(root);
  }

  private static insertNode(parent: Map<string, FileNode>, parts: string[], fullPath: string): void {
    if (parts.length === 0) return;

    const [current, ...rest] = parts;
    const isFile = rest.length === 0;

    if (!parent.has(current)) {
      parent.set(current, {
        name: current,
        path: isFile ? fullPath : parts.slice(0, parts.length - rest.length).join('/'),
        isFile,
        children: isFile ? undefined : []
      });
    }

    const node = parent.get(current)!;

    if (!isFile && rest.length > 0) {
      const childrenMap = this.arrayToMap(node.children || []);
      this.insertNode(childrenMap, rest, fullPath);
      node.children = this.mapToArray(childrenMap);
    }
  }

  private static arrayToMap(nodes: FileNode[]): Map<string, FileNode> {
    const map = new Map<string, FileNode>();
    nodes.forEach(node => map.set(node.name, node));
    return map;
  }

  private static mapToArray(map: Map<string, FileNode>): FileNode[] {
    return Array.from(map.values()).sort((a, b) => {
      // Folders first, then files
      if (a.isFile !== b.isFile) {
        return a.isFile ? 1 : -1;
      }
      return a.name.localeCompare(b.name);
    });
  }
}
