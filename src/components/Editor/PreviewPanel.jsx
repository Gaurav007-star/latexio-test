/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?url";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

import { LuZoomIn, LuZoomOut } from "react-icons/lu";
import {
  MdFullscreen,
  MdFullscreenExit,
  MdOutlineFileDownload,
  MdSave
} from "react-icons/md";
import { Spinner } from "../ui/kibo-ui/spinner";

const A4_WIDTH_POINTS = 595.28; // 210mm at 72dpi

/**
 * Custom hook: load PDF document with loading + error states
 */
function usePdfLoader(pdfUrl) {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!pdfUrl) {
      setPdfDoc(null);
      setPages([]);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const loadPdf = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        if (cancelled) return;
        setPdfDoc(pdf);
        setPages(Array.from({ length: pdf.numPages }, (_, i) => i + 1));
      } catch (err) {
        if (cancelled) return;
        console.error("Error loading PDF:", err);
        setError(err);
        setPdfDoc(null);
        setPages([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadPdf();

    return () => {
      cancelled = true;
    };
  }, [pdfUrl]);

  return { pdfDoc, pages, loading, error };
}

/**
 * Custom hook: render PDF pages
 */
function usePdfRenderer(pdfDoc, pages, zoom, canvasRefs) {
  useEffect(() => {
    if (!pdfDoc || pages.length === 0) return;

    let cancelled = false;
    const renderTasks = [];

    const cancelAll = () => {
      // cancel tasks tracked in array
      for (const t of renderTasks) {
        try {
          if (t && typeof t.cancel === "function") t.cancel();
        } catch (e) {}
      }
      // also cancel any per-canvas stored task
      try {
        (canvasRefs.current || []).forEach((c) => {
          if (
            c &&
            c._renderTask &&
            typeof c._renderTask.cancel === "function"
          ) {
            try {
              c._renderTask.cancel();
            } catch (e) {}
            delete c._renderTask;
          }
        });
      } catch (e) {}
    };

    const renderAllPages = async () => {
      for (let i = 0; i < pages.length; i++) {
        if (cancelled) return;
        const pageNumber = pages[i];

        try {
          const page = await pdfDoc.getPage(pageNumber);
          const canvas = canvasRefs.current[i];
          if (!canvas) {
            console.log(`Skipping page ${pageNumber}: canvas not ready`);
            continue;
          }
          const ctx = canvas.getContext("2d");

          // --- A4 scaling logic with DPI conversion ---
          const CSS_PX_PER_PDF_POINT = 96 / 72; // convert PDF pts (72dpi) -> CSS px (96dpi)
          const A4_CSS_WIDTH = A4_WIDTH_POINTS * CSS_PX_PER_PDF_POINT; // ~793.7px

          const unscaledViewport = page.getViewport({ scale: 1 });

          let baseScale =
            unscaledViewport && unscaledViewport.width
              ? A4_CSS_WIDTH / unscaledViewport.width
              : 1;
          if (!isFinite(baseScale) || baseScale <= 0) baseScale = 1;

          const targetScale = Math.max(0.1, Math.min(baseScale * zoom, 10));
          const viewport = page.getViewport({ scale: targetScale });

          const outputScale = window.devicePixelRatio || 1;

          // set backing store (pixel) size BEFORE rendering
          canvas.width = Math.floor(viewport.width * outputScale);
          canvas.height = Math.floor(viewport.height * outputScale);

          // set CSS size for layout
          canvas.style.width = `${Math.floor(viewport.width)}px`;
          canvas.style.height = `${Math.floor(viewport.height)}px`;

          // reset / clear / white bg
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // apply DPR transform for drawing
          ctx.setTransform(outputScale, 0, 0, outputScale, 0, 0);

          const renderContext = { canvasContext: ctx, viewport };

          // If a previous render is in progress for this canvas, cancel it first
          if (
            canvas._renderTask &&
            typeof canvas._renderTask.cancel === "function"
          ) {
            try {
              canvas._renderTask.cancel();
            } catch (e) {}
            delete canvas._renderTask;
          }

          const renderTask = page.render(renderContext);
          // track per-canvas and globally so we can cancel on new renders / cleanup
          canvas._renderTask = renderTask;
          renderTasks.push(renderTask);

          console.log(
            `Rendering page ${pageNumber} (targetScale=${targetScale.toFixed(
              3
            )}, viewportW=${Math.round(viewport.width)}, dpr=${outputScale})`
          );

          // wait for completion; if cancelled, pdf.js will throw — handle it
          try {
            await renderTask.promise;
          } catch (err) {
            // ignore cancellations
            if (!/cancel|interrupted/i.test(String(err?.message || err))) {
              console.error("Error during renderTask.promise", pageNumber, err);
            } else {
              console.log(`Render for page ${pageNumber} was cancelled.`);
            }
          } finally {
            // cleanup per-canvas stored task if it's the same one
            if (canvas._renderTask === renderTask) delete canvas._renderTask;
          }
        } catch (err) {
          console.error("Error rendering page", pageNumber, err);
        }
      }
    };

    const checkAndRender = () => {
      const allReady =
        canvasRefs.current.length === pages.length &&
        canvasRefs.current.every((c) => c instanceof HTMLCanvasElement);

      if (allReady) {
        // Cancel any leftover tasks just before starting a fresh render pass
        cancelAll();
        renderAllPages();
      } else {
        setTimeout(checkAndRender, 30);
      }
    };

    checkAndRender();

    return () => {
      cancelled = true;
      cancelAll();
    };
  }, [pdfDoc, pages, zoom, canvasRefs]);
}

const PreviewPanel = ({
  pdfUrl,
  saveHandler,
  expandPanel,
  collapsePanel,
  isLoading,
  errorLog
}) => {

  const {
    pdfDoc,
    pages,
    loading: loaderLoading,
    error: loaderError
  } = usePdfLoader(pdfUrl);
  const [zoom, setZoom] = useState(1);
  const [pageInput, setPageInput] = useState("");

  const canvasRefs = useRef([]);
  const containerRef = useRef(null);

  usePdfRenderer(pdfDoc, pages, zoom, canvasRefs);

  // Derived UI states
  const showLoading = Boolean(isLoading) || Boolean(loaderLoading);
  const showError = !showLoading && Boolean(loaderError);
  const hasPdf = !showLoading && !showError && pdfDoc && pages.length > 0;

  /** Actions */
  const zoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.25));

  const downloadPdf = () => {
    if (!pdfUrl) return;
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "document.pdf";
    link.click();
  };

  const goToPage = useCallback(() => {
    const pageNumber = parseInt(pageInput, 10);
    if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > pages.length)
      return;

    const targetCanvas = canvasRefs.current[pageNumber - 1];
    if (targetCanvas && containerRef.current) {
      const container = containerRef.current;
      const targetOffset = targetCanvas.offsetTop - container.offsetTop;
      container.scrollTo({ top: targetOffset - 10, behavior: "smooth" });
    }
  }, [pageInput, pages]);

  useEffect(() => {
    goToPage();
  }, [pageInput, goToPage]);

  // Top-level loading state: show spinner and skip rendering error/empty UI until loading finishes
  if (showLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-shade">
        <div className="flex flex-col items-center gap-4">
          <Spinner className={`text-primary`} size={48} />
          <span className="text-primary">Loading PDF...</span>
        </div>
      </div>
    );
  }

  if (errorLog) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500 p-4 text-center">
        <div>
          <h1 className="text-lg font-semibold mb-2">PDF generation failed</h1>
          <p className="text-sm text-gray-500">
            There was a problem loading the PDF. Please try again or check the
            file source.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-shade overflow-hidden">
      {hasPdf && (
        <>
          {/* Toolbar */}
          <div className="flex justify-between items-center p-2 max-[450px]:p-1 bg-gray-100 space-x-2">
            {/* Zoom Controls */}
            <div className="flex items-center space-x-2 max-[450px]:space-x-1">
              <button
                onClick={zoomOut}
                className="px-2 py-1 rounded bg-shadow flex items-center space-x-1 cursor-pointer hover:scale-105 transition-transform duration-200"
              >
                <LuZoomOut className="w-5 h-5" />
              </button>
              <span>{Math.round(zoom * 100)}%</span>
              <button
                onClick={zoomIn}
                className="px-2 py-1 rounded bg-shadow flex items-center space-x-1 cursor-pointer hover:scale-105 transition-transform duration-200"
              >
                <LuZoomIn className="w-5 h-5" />
              </button>
            </div>

            {/* Page Navigation */}
            <form
              className="flex items-center space-x-1 ml-4 max-[450px]:m-0"
              onSubmit={(e) => {
                e.preventDefault();
                goToPage();
              }}
            >
              <div className="flex items-center rounded-full border border-shadow px-4 py-1.5 bg-white focus-within:shadow-md transition">
                <input
                  type="number"
                  min="1"
                  max={pages.length}
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  placeholder="Pg"
                  className="no-spinner w-5 text-center bg-transparent outline-none text-sm"
                />
                <span className="text-sm text-gray-500 max-[400px]:hidden">
                  / {pages.length}
                </span>
              </div>
            </form>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button className="px-4 py-1 flex items-center gap-2 rounded-full bg-shadow transition-transform duration-200 cursor-pointer">
                <MdFullscreen
                  className="w-6 h-6 hover:scale-110 transition-all"
                  onClick={collapsePanel}
                />
                <MdFullscreenExit
                  className="w-6 h-6 hover:scale-110 transition-all"
                  onClick={expandPanel}
                />
                <MdOutlineFileDownload
                  className="w-6 h-6 hover:scale-110 transition-all"
                  onClick={downloadPdf}
                />
                <MdSave
                  className="w-6 h-6 hover:scale-110 transition-all"
                  onClick={saveHandler}
                />
              </button>
            </div>
          </div>

          {/* Pages */}
          <div
            ref={containerRef}
            className="flex-1 overflow-y-auto file-scrollbar flex flex-col items-center p-4 space-y-6 bg-gray-200"
            style={{ width: "100%", height: "100%" }}
          >
            {pages.map((pageNumber, i) => (
              <canvas
                key={pageNumber}
                ref={(el) => (canvasRefs.current[i] = el)}
                className="shadow-lg border bg-white"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PreviewPanel;
