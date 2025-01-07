// PDFViewer.jsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  GlobalWorkerOptions,
  getDocument,
  renderTextLayer
} from 'pdfjs-dist';
import { debounce } from 'lodash';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import PDFToolbar from './PDFToolbar';

// Import worker as URL
import pdfWorker from 'pdfjs-dist/build/pdf.worker.js?url';
import './PDFStyles.css';
import PDFPage from './PDFPage';
// Set the workerSrc
GlobalWorkerOptions.workerSrc = pdfWorker;

const PDFViewer = ({ pdfUrl, highlightData = [], containerWidth }) => {
  const [pdf, setPdf] = useState(null);
  const [pages, setPages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(1.0);
  // Add new state for current page
  const [currentPage, setCurrentPage] = useState(1);
  const pageContainerRef = useRef(null);

  // Add scroll to page function
  const scrollToPage = useCallback((pageNumber) => {
    const pageElement = document.querySelector(`[data-page-number="${pageNumber}"]`);
    if (pageElement && pageContainerRef.current) {
      pageElement.scrollIntoView({ behavior: 'smooth' });
      setCurrentPage(pageNumber);
    }
  }, []);

  const loadPDF = useCallback(async () => {
    if (!pdfUrl) {
      setError('No PDF URL provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const loadingTask = getDocument(pdfUrl);
      const loadedPdf = await loadingTask.promise;
      
      setPdf(loadedPdf);
      
      // Load all pages
      const pagesPromises = Array.from(
        { length: loadedPdf.numPages },
        (_, i) => loadedPdf.getPage(i + 1)
      );
      
      const loadedPages = await Promise.all(pagesPromises);
      setPages(loadedPages);
    } catch (err) {
      console.error('Error loading PDF:', err);
      setError(err.message || 'Failed to load PDF');
    } finally {
      setLoading(false);
    }
  }, [pdfUrl]);

  // Add intersection observer to track current page
  useEffect(() => {
    if (!pageContainerRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const pageNum = parseInt(entry.target.getAttribute('data-page-number'));
            setCurrentPage(pageNum);
          }
        });
      },
      { threshold: 0.5 }
    );

    // Observe all page elements
    document.querySelectorAll('[data-page-number]').forEach(page => {
      observer.observe(page);
    });

    return () => observer.disconnect();
  }, [pages]);

  useEffect(() => {
    loadPDF();

    return () => {
      // Cleanup PDF document
      if (pdf) {
        pdf.destroy();
      }
    };
  }, [loadPDF]);

  const handleZoomIn = () => setScale(prev => Math.min(3.0, prev + 0.2));
  const handleZoomOut = () => setScale(prev => Math.max(0.2, prev - 0.2));

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>
          Error loading PDF: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4">
        {loading && (
          <div className="text-sm text-gray-600">
            Loading PDF...
          </div>
        )}
        {pages.map((page, idx) => (
          <PDFPage
            key={`page-${idx + 1}`}
            page={page}
            scale={scale}
            containerWidth={containerWidth}
            highlightData={highlightData.filter(h => h.pageNumber === idx + 1)}
            onError={(err) => setError(err.message)}
          />
        ))}
      </div>
    </div>
  );
};

export default PDFViewer;