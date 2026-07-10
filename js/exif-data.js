// Static EXIF data, read once from the original files on Greg's
// computer using ExifTool — Cloudinary's plan doesn't expose embedded
// metadata, so this sidesteps that entirely.
//
// Keyed by the original filename (without extension), which appears
// as a substring within the Cloudinary public ID after upload (e.g.
// "20260117-20260117_EM50253" is a substring of the public ID
// "20260117-20260117_EM50253_uxitql"). This means the data survives
// even if Cloudinary re-generates public IDs on a future re-upload.

const EXIF_DATA = {
  "20200707-20200707_EM50574": { focalLength: "60mm", aperture: "f/4", shutterSpeed: "1/320s", iso: "200" },
  "20251211-20251211_EM12476": { focalLength: "12mm", aperture: "f/4", shutterSpeed: "1/800s", iso: "200" },
  "20251213-20251213_EM12696": { focalLength: "29mm", aperture: "f/8", shutterSpeed: "1/1000s", iso: "200" },
  "20260117-20260117_EM50253": { focalLength: "25mm", aperture: "f/4", shutterSpeed: "1/640s", iso: "200" },
  "20260117-20260117_EM50256": { focalLength: "25mm", aperture: "f/4", shutterSpeed: "1/800s", iso: "200" },
  "20260117-20260117_EM50262": { focalLength: "60mm", aperture: "f/4", shutterSpeed: "1/1000s", iso: "200" },
  "20260117-20260117_EM50275": { focalLength: "12mm", aperture: "f/4", shutterSpeed: "1/640s", iso: "200" },
  "20260117-20260117_EM50297": { focalLength: "60mm", aperture: "f/4", shutterSpeed: "1/250s", iso: "200" },
  "20260117-20260117_EM50313": { focalLength: "60mm", aperture: "f/4", shutterSpeed: "1/1250s", iso: "200" },
  "20260117-20260117_EM50319": { focalLength: "60mm", aperture: "f/4", shutterSpeed: "1/1250s", iso: "200" },
  "20260117-20260117_EM50322": { focalLength: "60mm", aperture: "f/4", shutterSpeed: "1/1000s", iso: "200" },
  "20260117-20260117_EM50332": { focalLength: "60mm", aperture: "f/4", shutterSpeed: "1/1250s", iso: "200" },
  "20260117-20260117_EM50343": { focalLength: "25mm", aperture: "f/4", shutterSpeed: "1/1250s", iso: "200" },
  "20260117-20260117_EM50347": { focalLength: "25mm", aperture: "f/5.6", shutterSpeed: "1/500s", iso: "200" },
  "20260117-20260117_EM50356": { focalLength: "25mm", aperture: "f/4", shutterSpeed: "1/1000s", iso: "200" },
  "20260117-20260117_EM50372": { focalLength: "25mm", aperture: "f/4", shutterSpeed: "1/1000s", iso: "200" },
  "20260117-20260117_EM50393": { focalLength: "25mm", aperture: "f/5.6", shutterSpeed: "1/800s", iso: "200" },
  "20260117-20260117_EM50399": { focalLength: "25mm", aperture: "f/2", shutterSpeed: "1/2000s", iso: "200" },
  "20260117-20260117_EM50400": { focalLength: "25mm", aperture: "f/2", shutterSpeed: "1/3200s", iso: "200" },
  "20260117-20260117_EM50401": { focalLength: "25mm", aperture: "f/2", shutterSpeed: "1/1000s", iso: "200" },
  "20260117-20260117_EM50423": { focalLength: "60mm", aperture: "f/4", shutterSpeed: "1/160s", iso: "200" },
  "20260117-20260117_EM50425": { focalLength: "60mm", aperture: "f/4", shutterSpeed: "1/160s", iso: "200" },
  "20260117-20260117_EM50428": { focalLength: "60mm", aperture: "f/4", shutterSpeed: "1/200s", iso: "200" },
  "20260117-20260117_EM50484": { focalLength: "60mm", aperture: "f/4", shutterSpeed: "1/800s", iso: "200" },
  "20260117-20260117_EM50491": { focalLength: "25mm", aperture: "f/18", shutterSpeed: "1/80s", iso: "200" },
  "20260117-20260117_EM50499": { focalLength: "25mm", aperture: "f/18", shutterSpeed: "1/80s", iso: "320" },
  "20260117-20260117_EM50517": { focalLength: "60mm", aperture: "f/4", shutterSpeed: "1/1600s", iso: "200" },
  "20260117-20260117_EM50519": { focalLength: "60mm", aperture: "f/4", shutterSpeed: "1/800s", iso: "200" },
  "20260117-20260117_EM50524": { focalLength: "60mm", aperture: "f/4", shutterSpeed: "1/2000s", iso: "200" },
  "20260117-20260117_EM50532": { focalLength: "60mm", aperture: "f/4", shutterSpeed: "1/500s", iso: "200" },
  "20260117-20260117_EM50536": { focalLength: "60mm", aperture: "f/8", shutterSpeed: "1/125s", iso: "400" },
  "20260117-20260117_EM50594": { focalLength: "60mm", aperture: "f/2.8", shutterSpeed: "1/1000s", iso: "200" },
  "20260117-20260117_EM50599": { focalLength: "60mm", aperture: "f/2.8", shutterSpeed: "1/640s", iso: "200" },
  "20260117-20260117_EM50601": { focalLength: "60mm", aperture: "f/2.8", shutterSpeed: "1/400s", iso: "200" },
  "20260117-20260117_EM50604": { focalLength: "60mm", aperture: "f/2.8", shutterSpeed: "1/640s", iso: "200" },
  "20260117-20260117_EM50618": { focalLength: "25mm", aperture: "f/2.8", shutterSpeed: "1/200s", iso: "200" },
  "20260117-20260117_EM50627": { focalLength: "25mm", aperture: "f/4", shutterSpeed: "1/640s", iso: "200" },
  "20260117-20260117_EM50648": { focalLength: "25mm", aperture: "f/4", shutterSpeed: "1/4000s", iso: "200" },
  "20260117-20260117_EM50660": { focalLength: "25mm", aperture: "f/4", shutterSpeed: "1/4000s", iso: "200" },
  "20260117-20260117_EM50712": { focalLength: "60mm", aperture: "f/8", shutterSpeed: "1/320s", iso: "200" },
  "20260117-20260117_EM50717": { focalLength: "60mm", aperture: "f/3.2", shutterSpeed: "1/400s", iso: "200" },
  "RNI-Films-IMG-6F30B394-C121-4D04-B36B-CFAFEB9CED7B": { focalLength: "60mm", aperture: "f/5.6", shutterSpeed: "1/400s", iso: "200" },
  "RNI-Films-IMG-C5F4729D-E953-4783-A8C3-C45711C79DD6": { focalLength: "100mm", aperture: "f/8", shutterSpeed: "1/500s", iso: "200" },
  "RNI-Films-IMG-C677524F-9814-4BDC-AECF-674198651AF5": { focalLength: "25mm", aperture: "f/4", shutterSpeed: "1/2500s", iso: "200" },
  "RNI-Films-IMG-F80FD7DD-D90A-46F3-A7B7-A5BB4BDDDF98": { focalLength: "66mm", aperture: "f/4", shutterSpeed: "1/400s", iso: "200" },};

// Looks up EXIF data for a Cloudinary public ID by finding which
// EXIF_DATA key it contains as a substring.
function exifForPublicId(publicId) {
  const key = Object.keys(EXIF_DATA).find((k) => publicId.includes(k));
  return key ? EXIF_DATA[key] : null;
}
