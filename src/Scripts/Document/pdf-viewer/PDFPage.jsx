import React, { useEffect, useState, useRef, useCallback } from 'react';
import { renderTextLayer } from 'pdfjs-dist';
import { debounce } from 'lodash';

const PDFPage = ({ page, scale, containerWidth, highlightData = [], onError }) => {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const textLayerRef = useRef(null);
    const renderTaskRef = useRef(null);
    const [rendered, setRendered] = useState(false);
    const [pageWidth, setPageWidth] = useState(0);
    const lastScaleRef = useRef(null);
    const [transform, setTransform] = useState('');

    // Only calculate scale when we actually need it
    const getScale = useCallback(() => {
        if (!page || !containerRef.current) return scale;
        const viewport = page.getViewport({ scale: 1.0 });
        const parentScale = containerRef.current.clientWidth / viewport.width;
        return parentScale * scale;
    }, [page, scale]);

    const renderPage = useCallback(async (forcedScale = null) => {
        if (!page || !canvasRef.current || !textLayerRef.current) return;
        
        // Cancel any existing render
        if (renderTaskRef.current?.cancel) {
            renderTaskRef.current.cancel();
        }

        try {
            const currentScale = forcedScale || getScale();
            // Store the scale we're rendering at
            lastScaleRef.current = currentScale;
            setTransform(''); // Reset any transform

            const viewport = page.getViewport({ scale: currentScale });
            setPageWidth(viewport.width);

            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d', { alpha: false });
            const pixelRatio = window.devicePixelRatio || 1;
            
            canvas.width = Math.floor(viewport.width * pixelRatio);
            canvas.height = Math.floor(viewport.height * pixelRatio);
            canvas.style.width = `${Math.floor(viewport.width)}px`;
            canvas.style.height = `${Math.floor(viewport.height)}px`;
            ctx.scale(pixelRatio, pixelRatio);

            const textLayer = textLayerRef.current;
            textLayer.innerHTML = '';
            textLayer.style.width = `${Math.floor(viewport.width)}px`;
            textLayer.style.height = `${Math.floor(viewport.height)}px`;
            textLayer.style.setProperty('--scale-factor', viewport.scale);

            renderTaskRef.current = page.render({
                canvasContext: ctx,
                viewport,
                enableWebGL: true,
                renderInteractiveForms: true,
            });

            await renderTaskRef.current.promise;

            const textContent = await page.getTextContent();
            await renderTextLayer({
                textContentSource: textContent,
                container: textLayer,
                viewport,
                textDivs: []
            });

            setRendered(true);
        } catch (error) {
            if (error.name !== 'RenderingCancelled') {
                console.error('Error rendering PDF page:', error);
                onError?.(error);
            }
        }
    }, [page, getScale, onError]);

    // Handle initial render and resize
    useEffect(() => {
        if (!page || !containerRef.current) return;

        // Initial render
        renderPage();

        // Debounced full render for significant size changes
        const debouncedFullRender = debounce(() => {
            renderPage();
        }, 500);

        // Immediate scale adjustment using transform
        const handleResize = () => {
            if (!lastScaleRef.current) return;
            
            const newScale = getScale();
            const scaleFactor = newScale / lastScaleRef.current;
            
            // If scale change is significant, do a full re-render
            if (Math.abs(1 - scaleFactor) > 0.2) {
                debouncedFullRender();
            } else {
                // Otherwise just transform
                setTransform(`scale(${scaleFactor})`);
            }
        };

        // Debounced resize handler
        const debouncedResize = debounce(handleResize, 100);

        // Set up resize observer
        const observer = new ResizeObserver(debouncedResize);
        observer.observe(containerRef.current);

        return () => {
            observer.disconnect();
            if (renderTaskRef.current?.cancel) {
                renderTaskRef.current.cancel();
            }
            debouncedFullRender.cancel();
            debouncedResize.cancel();
        };
    }, [page, renderPage, getScale]);

    return (
        <div ref={containerRef} className="relative mb-4">
            <div 
                style={{ 
                    width: pageWidth,
                    transform,
                    transformOrigin: 'top left',
                    transition: transform ? 'transform 0.1s ease-out' : 'none'
                }}
                className="relative"
            >
                <canvas 
                    ref={canvasRef}
                    className="block w-full h-auto"
                />
                <div 
                    ref={textLayerRef}
                    className="absolute top-0 left-0 w-full h-full pdf-text-layer"
                />
                {rendered && highlightData.map((highlight, index) => {
                    const currentScale = lastScaleRef.current || getScale();
                    return (
                        <div
                            key={`highlight-${index}`}
                            title={highlight.hoverLabel || 'Highlighted text'}
                            className="absolute pointer-events-none"
                            style={{
                                left: highlight.x1 * currentScale,
                                top: highlight.y1 * currentScale,
                                width: (highlight.x2 - highlight.x1) * currentScale,
                                height: (highlight.y2 - highlight.y1) * currentScale,
                                backgroundColor: highlight.color || 'rgba(255, 255, 0, 0.3)',
                                mixBlendMode: 'multiply'
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default PDFPage;