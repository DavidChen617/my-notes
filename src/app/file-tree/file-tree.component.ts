import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FileNode } from '../models/file-tree.model';

@Component({
  selector: 'app-file-tree',
  imports: [MatTreeModule, MatIconModule, MatButtonModule],
  template: `
    <mat-tree [dataSource]="dataSource" [treeControl]="treeControl" class="p-4 text-sm">
      <mat-tree-node *matTreeNodeDef="let node" matTreeNodeToggle>
        <li class="w-full flex items-center py-1 px-2 min-h-[28px] rounded hover:bg-dark-hover transition-colors cursor-pointer"
            [class.bg-blue-600]="isSelected(node)"
            [class.bg-opacity-20]="isSelected(node)"
            (click)="onFileClick(node)">
          <mat-icon class="!w-4 !h-4 !text-base !leading-none mr-2 text-dark-text-secondary flex items-center">description</mat-icon>
          <span class="flex-1 leading-none"
                [class.text-blue-300]="isSelected(node)"
                [class.text-dark-text-primary]="!isSelected(node)">
            {{ node.name }}
          </span>
        </li>
      </mat-tree-node>

      <mat-nested-tree-node *matTreeNodeDef="let node; when: hasChild">
        <li>
          <button
            matTreeNodeToggle
            class="flex items-center w-full py-1 px-2 min-h-[28px] text-left border-0 bg-transparent cursor-pointer hover:bg-dark-hover rounded transition-colors">
            <mat-icon class="!w-4 !h-4 !text-base !leading-none text-amber-500 mr-2 flex-shrink-0">
              {{ treeControl.isExpanded(node) ? 'folder_open' : 'folder' }}
            </mat-icon>
            <span class="flex-1 text-dark-text-primary leading-none">{{ node.name }}</span>
          </button>
          <ul [class.hidden]="!treeControl.isExpanded(node)" class="pl-5">
            <ng-container matTreeNodeOutlet></ng-container>
          </ul>
        </li>
      </mat-nested-tree-node>
    </mat-tree>
  `,
  styles: `
    ::ng-deep {
      ul, li {
        margin: 0;
        padding: 0;
        list-style: none !important;
        list-style-type: none !important;
      }

      /* 強制移除 li 的 ::before 和 ::marker 偽元素 */
      ul li::before,
      ul li::marker {
        content: none !important;
        display: none !important;
      }

      mat-tree {
        ul, li {
          list-style: none !important;
          list-style-type: none !important;
        }

        li::before,
        li::marker {
          content: none !important;
          display: none !important;
        }
      }

      mat-tree-node {
        display: block;
        width: 100%;
      }

      mat-tree-node li::before,
      mat-tree-node li::marker {
        content: none !important;
        display: none !important;
      }

      mat-icon {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  `
})
export class FileTreeComponent implements OnInit {
  @Input() set treeData(data: FileNode[]) {
    this.dataSource.data = data;

    // 當 tree 資料載入後，如果有保存的選中路徑，自動展開
    if (this.selectedNodePath) {
      this.expandToPath(this.selectedNodePath);
    }
  }

  @Output() fileSelected = new EventEmitter<FileNode>();

  treeControl = new NestedTreeControl<FileNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FileNode>();
  selectedNodePath: string | null = null;

  private readonly STORAGE_KEY = 'selected-file-path';

  hasChild = (_: number, node: FileNode) => !!node.children && node.children.length > 0;

  ngOnInit(): void {
    // 從 localStorage 讀取上次選中的檔案路徑
    this.selectedNodePath = localStorage.getItem(this.STORAGE_KEY);
  }

  onFileClick(node: FileNode): void {
    if (node.isFile) {
      // 更新選中狀態
      this.selectedNodePath = node.path;

      // 保存到 localStorage
      localStorage.setItem(this.STORAGE_KEY, node.path);

      // 發出事件
      this.fileSelected.emit(node);
    }
  }

  isSelected(node: FileNode): boolean {
    return this.selectedNodePath === node.path;
  }

  /**
   * 自動展開包含指定路徑的所有父資料夾
   */
  private expandToPath(path: string): void {
    const nodesToExpand: FileNode[] = [];

    // 遞迴尋找路徑並收集所有父節點
    const findAndCollectParents = (nodes: FileNode[], targetPath: string): boolean => {
      for (const node of nodes) {
        if (node.path === targetPath) {
          // 找到目標檔案
          return true;
        }

        if (node.children && node.children.length > 0) {
          // 遞迴搜尋子節點
          if (findAndCollectParents(node.children, targetPath)) {
            // 如果在子節點中找到，將當前節點加入展開列表
            nodesToExpand.push(node);
            return true;
          }
        }
      }
      return false;
    };

    // 開始搜尋
    findAndCollectParents(this.dataSource.data, path);

    // 展開所有收集到的父節點
    nodesToExpand.forEach(node => {
      this.treeControl.expand(node);
    });
  }
}
