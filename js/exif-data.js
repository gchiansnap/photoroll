// Static EXIF data, read once from the original files on Greg's
// computer using ExifTool and pasted in here — Cloudinary's plan
// doesn't expose embedded metadata, so this sidesteps that entirely.
//
// Keyed by camera frame number (e.g. "EM50253"), which appears in
// both the original filenames and the Cloudinary public IDs. This
// means the data survives even if Cloudinary re-generates public IDs
// on a future re-upload.
//
// Fill in real values here, e.g.:
// "EM50253": { focalLength: "25mm", aperture: "f/4", shutterSpeed: "1/640s", iso: "200" },

const EXIF_DATA = {};

// Extracts the frame-number key (e.g. "EM50253") from a Cloudinary
// public ID and looks up its EXIF data, if any was provided above.
function exifForPublicId(publicId) {
  const match = publicId.match(/EM\d+/i);
  if (!match) return null;
  return EXIF_DATA[match[0]] || null;
}
