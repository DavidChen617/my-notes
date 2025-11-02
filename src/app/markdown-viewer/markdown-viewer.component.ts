import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import MarkdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';
import Prism from 'prismjs';
import { Subscription } from 'rxjs';

const slugifyHeading = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const escapeHtml = (code: string): string =>
  code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const highlightWithPrism = (code: string, lang?: string): string => {
  if (!lang) {
    return escapeHtml(code);
  }

  const normalized = lang.toLowerCase();
  const grammar = Prism.languages[normalized];

  if (!grammar) {
    return escapeHtml(code);
  }

  try {
    return Prism.highlight(code, grammar, normalized);
  } catch {
    return escapeHtml(code);
  }
};

@Component({
  selector: 'app-markdown-viewer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="markdown-viewer" [innerHTML]="content"></div>
  `
})
export class MarkdownViewerComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) public src = '';

  public content: SafeHtml | null = null;

  private readonly markdownIt = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: highlightWithPrism
  }).use(markdownItAnchor, {
    slugify: slugifyHeading,
    tabIndex: false
  });

  private requestSub?: Subscription;

  constructor(
    private readonly http: HttpClient,
    private readonly sanitizer: DomSanitizer,
    private readonly host: ElementRef<HTMLElement>
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['src']) {
      const nextSrc = changes['src'].currentValue as string;

      if (!nextSrc) {
        this.content = null;
        this.cancelRequest();
        return;
      }

      if (nextSrc === changes['src'].previousValue) {
        return;
      }

      this.loadMarkdown(nextSrc);
    }
  }

  public ngOnDestroy(): void {
    this.cancelRequest();
  }

  private loadMarkdown(path: string): void {
    this.cancelRequest();

    this.requestSub = this.http
      .get(path, { responseType: 'text' })
      .subscribe({
        next: markdown => this.renderMarkdown(markdown),
        error: () => {
          this.content = this.sanitizer.bypassSecurityTrustHtml('<p>無法載入 Markdown 內容</p>');
        }
      });
  }

  private renderMarkdown(markdown: string): void {
    const html = this.markdownIt.render(markdown);
    this.content = this.sanitizer.bypassSecurityTrustHtml(html);
    this.highlightCode();
  }

  private highlightCode(): void {
    if (typeof window === 'undefined') {
      return;
    }

    queueMicrotask(() => {
      Prism.highlightAllUnder(this.host.nativeElement);
    });
  }

  private cancelRequest(): void {
    if (this.requestSub) {
      this.requestSub.unsubscribe();
      this.requestSub = undefined;
    }
  }
}
