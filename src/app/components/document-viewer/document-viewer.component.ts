import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';

// Set worker path for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrl: './document-viewer.component.css'
})
export class DocumentViewerComponent implements OnInit, OnDestroy, OnChanges {
  @Input() documentUrl: string = '';
  isPdf = false;
  pdfPages: string[] = [];
  isLoading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.checkDocumentType();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['documentUrl'] && !changes['documentUrl'].firstChange) {
      this.checkDocumentType();
    }
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  checkDocumentType(): void {
    if (!this.documentUrl) {
      return;
    }

    // Check if URL ends with .pdf or contains pdf
    const urlLower = this.documentUrl.toLowerCase();
    this.isPdf = urlLower.includes('.pdf') || urlLower.includes('pdf');

    if (this.isPdf) {
      this.loadPdf();
    }
  }

  async loadPdf(): Promise<void> {
    this.isLoading = true;
    this.error = null;
    this.pdfPages = [];

    try {
      const loadingTask = pdfjsLib.getDocument({ url: this.documentUrl });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;

      // Render all pages
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better quality

        // Create canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) {
          throw new Error('Could not get canvas context');
        }

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page to canvas
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
          canvas: canvas
        };

        await page.render(renderContext).promise;

        // Convert canvas to image data URL
        const imageDataUrl = canvas.toDataURL('image/png');
        this.pdfPages.push(imageDataUrl);
      }

      this.isLoading = false;
    } catch (err) {
      console.error('Error loading PDF:', err);
      this.error = 'Failed to load PDF document';
      this.isLoading = false;
    }
  }
}

