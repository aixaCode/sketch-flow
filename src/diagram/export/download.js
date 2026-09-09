function filename(value, extension) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError('filename must be a non-empty string');
  }
  return value.toLowerCase().endsWith(extension) ? value : `${value}${extension}`;
}

export function downloadBlob(blob, requestedFilename, extension, environment = globalThis) {
  const document = environment?.document;
  const URL = environment?.URL;
  if (!document?.createElement || !URL?.createObjectURL) {
    throw new TypeError('download requires browser document and object URL APIs');
  }
  const objectUrl = URL.createObjectURL(blob);
  try {
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = filename(requestedFilename, extension);
    anchor.style.display = 'none';
    document.body?.append(anchor);
    anchor.click();
    anchor.remove();
  } catch (error) {
    URL.revokeObjectURL(objectUrl);
    throw error;
  }
  const schedule = environment.setTimeout ?? globalThis.setTimeout;
  schedule(() => URL.revokeObjectURL(objectUrl), 0);
}
