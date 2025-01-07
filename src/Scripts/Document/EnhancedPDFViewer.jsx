import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Maximize,
  Search,
  Printer
} from "lucide-react";
import * as pdfjs from 'pdfjs-dist';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

// Sample highlight data
const sampleHighlights = [
  {
    pageNumber: 1,
    coordinates: { x1: 50, y1: 100, x2: 300, y2: 120 },
    color: '#ffeb3b'
  },
  {
    pageNumber: 1,
    coordinates: { x1: 50, y1: 150, x2: 400, y2: 170 },
    color: '#a5d6a7'
  }
];

const EnhancedPDFViewer = ({
  url,
  highlights = sampleHighlights,
  onPageChange,
}) => {
  const canvasRef = useRef(null);
  const textLayerRef = useRef(null);
  const highlightLayerRef = useRef(null);
  const containerRef = useRef(null);
  const [pdf, setPdf] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [pageInputValue, setPageInputValue] = useState('1');
  const [zoomLevels] = useState([0.5, 0.75, 1, 1.25, 1.5, 2]);
  const [viewport, setViewport] = useState(null);

  // Calculate initial scale based on container width
  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const desiredWidth = containerWidth * 0.9; // 90% of container width
      if (viewport) {
        const newScale = desiredWidth / viewport.width;
        setScale(newScale);
      }
    }
  }, [viewport]);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        const loadingTask = pdfjs.getDocument(url);
        const loadedPdf = await loadingTask.promise;
        setPdf(loadedPdf);
        setNumPages(loadedPdf.numPages);
        setLoading(false);
      } catch (error) {
        console.error('Error loading PDF:', error);
        setLoading(false);
      }
    };

    loadPDF();
  }, [url]);

  const renderTextLayer = async (page, viewport) => {
    if (!textLayerRef.current) return;

    // Clear previous text layer content
    textLayerRef.current.innerHTML = '';

    try {
      const textContent = await page.getTextContent();
      
      // Set text layer dimensions
      textLayerRef.current.style.height = `${viewport.height}px`;
      textLayerRef.current.style.width = `${viewport.width}px`;

      // Create text layer with PDF.js
      pdfjs.renderTextLayer({
        textContent: textContent,
        container: textLayerRef.current,
        viewport: viewport,
        textDivs: []
      });
    } catch (error) {
      console.error('Error rendering text layer:', error);
    }
  };

  const renderHighlights = (pageViewport) => {
    if (!highlightLayerRef.current) return;

    highlightLayerRef.current.innerHTML = '';
    const pageHighlights = highlights.filter(h => h.pageNumber === currentPage);

    pageHighlights.forEach(highlight => {
      const highlightDiv = document.createElement('div');
      
      const [x1, y1] = pageViewport.convertToViewportPoint(
        highlight.coordinates.x1,
        highlight.coordinates.y1
      );
      const [x2, y2] = pageViewport.convertToViewportPoint(
        highlight.coordinates.x2,
        highlight.coordinates.y2
      );

      const left = Math.min(x1, x2);
      const top = Math.min(y1, y2);
      const width = Math.abs(x2 - x1);
      const height = Math.abs(y2 - y1);

      Object.assign(highlightDiv.style, {
        position: 'absolute',
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: highlight.color || '#ffeb3b',
        opacity: '0.3',
        pointerEvents: 'none',
        mixBlendMode: 'multiply',
        transform: `rotate(${rotation}deg)`
      });

      highlightLayerRef.current.appendChild(highlightDiv);
    });
  };

  const renderPage = async (pageNumber) => {
    if (!pdf) return;

    try {
      const page = await pdf.getPage(pageNumber);
      const pageViewport = page.getViewport({ scale, rotation });
      setViewport(pageViewport);
      
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // Set canvas dimensions
      canvas.height = pageViewport.height;
      canvas.width = pageViewport.width;

      // Position highlight and text layers
      if (highlightLayerRef.current) {
        highlightLayerRef.current.style.height = `${pageViewport.height}px`;
        highlightLayerRef.current.style.width = `${pageViewport.width}px`;
      }

      // Render PDF page
      const renderContext = {
        canvasContext: context,
        viewport: pageViewport,
        enhanceTextSelection: true
      };

      await page.render(renderContext).promise;
      await renderTextLayer(page, pageViewport);
      renderHighlights(pageViewport);

    } catch (error) {
      console.error('Error rendering page:', error);
    }
  };

  useEffect(() => {
    if (!loading && pdf) {
      renderPage(currentPage);
    }
  }, [currentPage, scale, loading, pdf, rotation]);

  const changePage = (delta) => {
    const newPage = currentPage + delta;
    if (newPage >= 1 && newPage <= numPages) {
      setCurrentPage(newPage);
      setPageInputValue(newPage.toString());
      onPageChange?.(newPage);
    }
  };

  // Handle scroll-based page navigation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (!viewport) return;
      
      const pageHeight = viewport.height * scale;
      const scrollTop = container.scrollTop;
      const newPage = Math.floor(scrollTop / pageHeight) + 1;
      
      if (newPage !== currentPage && newPage >= 1 && newPage <= numPages) {
        setCurrentPage(newPage);
        setPageInputValue(newPage.toString());
        onPageChange?.(newPage);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [viewport, scale, currentPage, numPages]);

  const handlePageInputChange = (e) => {
    const value = e.target.value;
    setPageInputValue(value);
    const pageNumber = parseInt(value, 10);
    if (pageNumber >= 1 && pageNumber <= numPages) {
      setCurrentPage(pageNumber);
      onPageChange?.(pageNumber);
    }
  };

  const handleZoomSelect = (e) => {
    setScale(parseFloat(e.target.value));
  };

  const rotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Main toolbar */}
      <div className="bg-gray-800 text-white p-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-gray-700"
            onClick={() => window.open(url, '_blank')}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-gray-700"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4" />
          <input
            type="text"
            placeholder="Search document"
            className="bg-gray-700 px-2 py-1 rounded text-sm"
          />
        </div>
      </div>

      {/* Secondary toolbar */}
      <div className="bg-white border-b p-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => changePage(-1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center space-x-1">
            <input
              type="text"
              value={pageInputValue}
              onChange={handlePageInputChange}
              className="w-12 text-center border rounded p-1"
            />
            <span>/ {numPages}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => changePage(1)}
            disabled={currentPage >= numPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={scale}
            onChange={handleZoomSelect}
            className="border rounded p-1"
          >
            {zoomLevels.map(level => (
              <option key={level} value={level}>
                {Math.round(level * 100)}%
              </option>
            ))}
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={rotate}
          >
            <RotateCw className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* PDF Viewer */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto p-4 bg-gray-200"
      >
        <div className="relative inline-block mx-auto">
          <canvas ref={canvasRef} className="shadow-lg bg-white" />
          <div 
            ref={textLayerRef}
            className="absolute top-0 left-0"
            style={{ 
              opacity: 1,
              transform: `rotate(${rotation}deg)`,
              transformOrigin: 'top left'
            }}
          />
          <div 
            ref={highlightLayerRef} 
            className="absolute top-0 left-0"
            style={{ 
              transform: `rotate(${rotation}deg)`,
              transformOrigin: 'top left'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EnhancedPDFViewer;