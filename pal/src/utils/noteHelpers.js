const resolveApiBase = () => {
  const configured = process.env.REACT_APP_API_URL;
  if (configured) return configured.replace(/\/api$/, "");
  if (process.env.NODE_ENV === "production") return "http://localhost:5000";
  return "";
};

const API_BASE = resolveApiBase();

export const getNoteId = (note) => note?._id || note?.id;

export const getUploaderName = (note) => {
  if (!note) return "Unknown";
  if (note.uploader) return note.uploader;
  if (note.uploadedBy && typeof note.uploadedBy === "object") {
    return `${note.uploadedBy.firstName || ""} ${note.uploadedBy.lastName || ""}`.trim() || "Unknown";
  }
  return "Unknown";
};

export const getFileUrl = (fileUrl) => {
  if (!fileUrl) return null;
  if (fileUrl.startsWith("http")) return fileUrl;
  const base =
    API_BASE || (typeof window !== "undefined" ? window.location.origin : "http://localhost:5000");
  return `${base}${fileUrl}`;
};

export const normalizeNote = (note) => {
  if (!note) return null;
  const id = getNoteId(note);
  return {
    ...note,
    id,
    _id: id,
    uploader: getUploaderName(note),
  };
};

export const formatFileSize = (bytes) => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
