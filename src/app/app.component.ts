import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { NgIf } from '@angular/common';
import { SidebarResizeComponent } from './sidebar-resize/sidebar-resize/sidebar-resize.component';
import { FileTreeComponent } from './file-tree/file-tree.component';
import { FileNode, FileTreeBuilder, NoteItem } from './models/file-tree.model';
import { MarkdownViewerComponent } from './markdown-viewer/markdown-viewer.component';

type NotePack = {
  items: NoteItem[];
}

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NgIf,
    SidebarResizeComponent,
    FileTreeComponent,
    MarkdownViewerComponent
  ],
  template: `
    <sidebar-resize>
      <div slot-sidebar>
        <app-file-tree
          [treeData]="treeData"
          (fileSelected)="onFileSelected($event)">
        </app-file-tree>
      </div>
      <div slot-main class="max-w-4xl mx-auto">
        <div *ngIf="!markdownPath" class="text-center py-20">
          <p class="text-dark-text-secondary text-lg">選擇左側檔案開始閱讀</p>
        </div>
        <article *ngIf="markdownPath" class="prose prose-lg max-w-none">
          <app-markdown-viewer [src]="markdownPath"></app-markdown-viewer>
        </article>
        <router-outlet />
      </div>
    </sidebar-resize>
  `,
  styles: [],
  providers: []
})
export class AppComponent implements OnInit {
  private readonly MANIFEST_URL = 'manifest.json';
  private readonly STORAGE_KEY = 'selected-file-path';

  public markdownPath = "";
  public treeData: FileNode[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getManifest().subscribe(items => {
      this.treeData = FileTreeBuilder.buildTree(items);

      // 從 localStorage 讀取上次選中的檔案並自動載入
      const savedPath = localStorage.getItem(this.STORAGE_KEY);
      if (savedPath) {
        this.updateMarkdownPath(savedPath, false);
      }
    });
  }

  public onFileSelected(node: FileNode): void {
    this.updateMarkdownPath(node.path, true);
  }

  private getManifest(): Observable<NoteItem[]> {
    return this.getNotePack().pipe(map(res => res.items));
  }

  private getNotePack(): Observable<NotePack> {
    return this.http.get(this.MANIFEST_URL) as Observable<NotePack>;
  }

  private updateMarkdownPath(path: string, persist: boolean): void {
    this.markdownPath = path;

    if (persist) {
      localStorage.setItem(this.STORAGE_KEY, path);
    }
  }
}
