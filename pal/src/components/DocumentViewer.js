import { useEffect, useState } from "react";
import { getFileUrl } from "../utils/noteHelpers";
import { isOfficeFile, isPdfFile } from "../utils/fileHelpers";
import "../styles/DocumentViewer.css";

function DocumentViewer({ note }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fileUrl = getFileUrl(note?.fileUrl);
  const isPdf = isPdfFile(note);
  const isOffice = isOfficeFile(note);

  useEffect(() => {
    let objectUrl = null;
    let cancelled = false;

    const loadPreview = async () => {
      if (!fileUrl || !note?.fileUrl) {
        setPreviewUrl(null);
        setLoading(false);
        setError("No file attached to this note.");
        return;
      }

      try {
        setLoading(true);
        setError("");
        setPreviewUrl(null);

        const response = await fetch(fileUrl);
        if (!response.ok) {
          throw new Error("Could not load the document. Check that the API server is running.");
        }

        const blob = await response.blob();
        if (cancelled) return;

        objectUrl = URL.createObjectURL(blob);
        setPreviewUrl(objectUrl);
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || "Failed to load document preview.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadPreview();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [fileUrl, note?.fileUrl]);

  if (loading) {
    return (
      <div className="document-viewer-state">
        <p>Loading document...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="document-viewer-state document-viewer-error">
        <p>{error}</p>
        {fileUrl && (
          <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="inline-action-link">
            Open file in new tab
          </a>
        )}
      </div>
    );
  }

  if (isPdf && previewUrl) {
    return (
      <iframe
        title={`${note.title} PDF preview`}
        src={previewUrl}
        className="document-frame"
      />
    );
  }

  if (isOffice && previewUrl) {
    const officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;

    return (
      <div className="office-preview-wrap">
        <iframe
          title={`${note.title} presentation preview`}
          src={officeViewerUrl}
          className="document-frame office-frame"
        />
        <p className="office-preview-fallback">
          If the preview stays blank (common on localhost), use Download or{" "}
          <a href={previewUrl} target="_blank" rel="noopener noreferrer">
            open the file
          </a>{" "}
          on your device.
        </p>
      </div>
    );
  }

  if (previewUrl) {
    return (
      <div className="document-viewer-state">
        <p>Preview is not supported for this file type in the browser.</p>
        <a href={previewUrl} download={note.fileName} className="inline-action-link">
          Download to view
        </a>
      </div>
    );
  }

  return (
    <div className="document-viewer-state">
      <p>No preview available.</p>
    </div>
  );
}

export default DocumentViewer;
