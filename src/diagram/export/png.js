function positive(value, name) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new TypeError(`${name} must be a positive number`);
  }
  return value;
}

function browserEnvironment(environment) {
  const document = environment?.document;
  const Image = environment?.Image;
  const URL = environment?.URL;
  const Blob = environment?.Blob;
  if (!document?.createElement || !Image || !URL?.createObjectURL || !Blob) {
    throw new TypeError('PNG export requires browser Canvas, Image, Blob and object URL APIs');
  }
  return { document, Image, URL, Blob };
}

function loadImage(Image, source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('the browser could not decode the exported SVG'));
    image.src = source;
  });
}

function canvasBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('the browser could not encode the PNG'));
    }, 'image/png');
  });
}

export async function svgToPng(svg, {
  width,
  height,
  scale = 2,
  environment = globalThis,
} = {}) {
  if (typeof svg !== 'string' || svg.trim() === '') {
    throw new TypeError('svg must be a non-empty string');
  }
  positive(width, 'width');
  positive(height, 'height');
  positive(scale, 'scale');
  const browser = browserEnvironment(environment);

  if (browser.document.fonts?.ready) await browser.document.fonts.ready;
  const sourceBlob = new browser.Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const sourceUrl = browser.URL.createObjectURL(sourceBlob);
  try {
    const image = await loadImage(browser.Image, sourceUrl);
    const canvas = browser.document.createElement('canvas');
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const context = canvas.getContext('2d');
    if (!context) throw new Error('the browser could not create a 2D canvas context');
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return await canvasBlob(canvas);
  } finally {
    browser.URL.revokeObjectURL(sourceUrl);
  }
}
