import { getFileUrl } from "./noteHelpers";

export const isPdfFile = (note) => {
  if (!note) return false;
  if (note.fileType === "application/pdf") return true;
  const name = (note.fileName || note.fileUrl || "").toLowerCase();
  return name.endsWith(".pdf");
};

export const isOfficeFile = (note) => {
  if (!note) return false;
  const name = (note.fileName || note.fileUrl || "").toLowerCase();
  const type = (note.fileType || "").toLowerCase();
  return (
    name.endsWith(".ppt") ||
    name.endsWith(".pptx") ||
    name.endsWith(".doc") ||
    name.endsWith(".docx") ||
    type.includes("powerpoint") ||
    type.includes("wordprocessing") ||
    type.includes("msword")
  );
};

export const canEmbedPreview = (note) => Boolean(note?.fileUrl) && (isPdfFile(note) || isOfficeFile(note));

export const downloadNoteToDevice = async (note, { recordOnServer } = {}) => {
  const url = getFileUrl(note.fileUrl);
  if (!url) {
    throw new Error("No file attached to this note.");
  }

  const noteId = note.id || note._id;
  if (recordOnServer && noteId) {
    const { notesAPI } = await import("../api/apiService");
    await notesAPI.recordDownload(noteId);
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Could not fetch the file. Please try again.");
  }

  const blob = await response.blob();
  const fileName = note.fileName || `${note.title || "study-note"}.pdf`;
  const objectUrl = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);

  const downloadedNotes = JSON.parse(localStorage.getItem("downloadedNotes") || "[]");
  const exists = downloadedNotes.some((item) => (item.id || item._id) === noteId);
  if (!exists) {
    localStorage.setItem("downloadedNotes", JSON.stringify([...downloadedNotes, note]));
  }
};

export const syncLocalDownloadedNotes = async () => {
  const downloadedNotes = JSON.parse(localStorage.getItem("downloadedNotes") || "[]");
  const noteIds = [
    ...new Set(
      downloadedNotes
        .map((note) => note?.id || note?._id)
        .filter(Boolean)
    ),
  ];

  if (noteIds.length === 0 || !localStorage.getItem("token")) {
    return;
  }

  const { notesAPI } = await import("../api/apiService");
  await Promise.allSettled(noteIds.map((id) => notesAPI.recordDownload(id)));
};
