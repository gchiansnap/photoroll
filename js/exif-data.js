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
  "20200707-20200707_EM50574": { camera: "Olympus E-M5 Mark II", lens: "M.Zuiko Digital ED 60mm F2.8 Macro", focalLength: "60mm", aperture: "f/4", shutterSpeed: "1/320s", iso: "200" },
  "20251211-20251211_EM12476": { camera: "Olympus E-M1 Mark II", lens: "M.Zuiko Digital ED 12-100mm F4.0", focalLength: "12mm", aperture: "f/4", shutterSpeed: "1/800s", iso: "200" },
  "20251213-20251213_EM12696": { camera: "Olympus E-M1 Mark II", lens: "M.Zuiko Digital ED 12-100mm F4.0", focalLength: "29mm", aperture: "f/8", shutterSpeed: "1/1000s", iso: "200" },
  "20260117-20260117_EM50253": { camera: "Olympus E-M5 Mark II", lens: "M.Zuiko Digital ED 25mm F1.8", focalLength: "25mm", aperture: "f/4", shutterSpeed: "1/640s", iso: "200" },
  "20260117-20260117_EM50256": { camera: "Olympus E-M5 Mark II", lens: "M.Zuiko Digital ED 25mm F1.8", focalLength: "25mm", aperture: "f/4", shutterSpeed: "1/800s", iso: "200" },
  "20260117-20260117_EM50262": { camera: "Olympus E-M5 Mark II", lens: "M.Zuiko Digital ED 60mm F2.8 Macro", focalLength: "60mm", aperture: "f/4", shutterSpeed: "1/1000s", iso: "200" },
  "20260117-20260117_EM50275": { camera: "Olympus E-M5 Mark II", lens: "M.Zuiko Digital ED 12mm F2.0", focalLength: "12mm", aperture: "f/4", shutterSpeed: "1/640s", iso: "200" },
  "20260117-20260117_EM50297": { camera: "Olympus E-M5 Mark II", lens: "M.Zuiko Digital ED 60mm F2.8 Macro", focalLength: "60mm", aperture: "f/4", shutterSpeed: "1/250s", iso: "200" },
  "20260117-20260117_EM50313": { camera: "Olympus E-M5 Mark II", lens: "M.Zuiko Digital ED 60mm F2.8 Macro", focalLength: "60mm", aperture: "f/4", shutterSpeed: "1/1250s", iso: "200" },
  "20260117-20260117_EM50319": { camera: "Olympus E-M5 Mark II", lens: "M.Zuiko Digital ED 60mm F2.8 Macro", focalLength: "60mm", aperture: "f/4", shutterSpeed: "1/1250s", iso: "200" },
  "20260117-20260117_EM50322": { camera: "Olympus E-M5 Mark II", lens: "M.Zuiko Digital ED 60mm F2.8 Macro", focalLength: "60mm", aperture: "f/4", shutterSpeed: "1/1000s", iso: "200" },
  "20260117-20260117_EM50332": { camera: "Olympus E-M5 Mark II", lens: "M.Zuiko Digital ED 60mm F2.8 Macro", focalLength: "60mm", aperture: "f/4", shutterSpeed: "1/1250s", iso: "200" },
  "20260117-20260117_EM50343": { camera: "Olympus E-M5 Mark II", lens: "M.Zuiko Digital ED 25mm F1.8", focalLength: "25mm", aperture: "f/4", shutterSpeed: "1/1250s", iso: "200" },
  "20260117-20260117_EM50347": { camera: "Olympus E-M5 Mark II", lens: "M.Zuiko Digital ED 25mm F1.8", focalLength: "25mm", aperture: "f/5.6", shutterSpeed: "1/500s", iso: "200" },
  "20260117-20260117_EM50356": { camera: "Olympus E-M5 Mark II", lens: "M.Zuiko Digital ED 25mm F1.8", focalLength: "25mm", aperture: "f/4", shutterSpeed: "1/1000s", iso: "200" },
  "20260117-20260117_EM50372": { camera: "Olympus E-M5 Mark II", lens: "M.Zuiko Digital ED 25mm F1.8", focalLength: "25mm", aperture: "f/4", shutterSpeed: "1/1000s", iso: "200" },
  "20260117-20260117_EM50393": { camera: "Olympus E-M5 Mark II", lens: "M.Zuiko Digital ED 25mm F1.8", focalLength: "25mm", aperture: "f/5.6", shutterSpeed: "1/800s", iso: "200" },
  "20260117-20260117_EM50399": { camera: "Olympus E-M5 Mark II", lens: "M.Zuiko Digital ED 25mm F1.8", focalLength: "25mm", aperture: "f/2", shutterSpeed: "1/2000s", iso: "200" },
  "20260117-20260117_EM50400": { camera: "Olympus E-M5 Mark II", lens: "M.Zuiko Digital ED 25mm F1.8", focalLength: "25mm", aperture: "f/2", shutterSpeed: "1/3200s", iso: "200" },
  "20260117-20260117_EM50401": { camera: "Olympus E-M5 Mark II", lens: "M.Zuiko Digital ED 25mm F1.8", focalLength: "25mm", aperture: "f/2", shutterSpeed: "1/1000s", iso: "200" },
  "20260117-20260117_EM50423": { camera: "Olympus E-M5 Mark II", lens: "M.Zuiko Digital ED 60mm F2.8 Macro", focalLength: "60mm", aperture: "f/4", shutterSpeed: "1/160s", iso: "200" },
  "20260117-20260117_EM50425": { camera: "Olympus E-M5 Mark II", lens: "M.Zuiko Digital ED 60mm F2.8 Macro", focalLength: "60mm", aperture: "f/4", shutterSpeed: "1/160s", iso: "200" },
  "20260117-20260117_EM50428": { camera: "Olympus E-M5 Mark II", lens: "M.Zuiko Digital ED 60mm F2.8 Macro", focalLength: "60mm", aperture: "f/4", shutterSpeed: "1/200s", iso: "200" },
  "20260117-20260117_EM50484": { camera: "Olympus E-M5 Mark II", lens: "M.Zuiko Digital ED 60mm F2.8 Macro", focalLength: "60mm", aperture: "f/4", shutterSpeed: "1/800s", iso: "200" },
  "20260117-20260117_EM50491": { camera: "Olympus E-M5 Mark II", lens: "M.Zuiko Digital ED 25mm F1.8", focalLength: "25mm", aperture: "f/18", shutterSpeed: "1/80s", iso: "200" },
  "20260117-20260117_EM50499": { camera: "Olympus E-M5 Mark II", lens: "M.Zuiko Digital ED 25mm F1.8", focalLength: "25mm", aperture: "f/18", shutterSpeed: "1/80s", iso: "320" },
  "20260117-20260117_EM50517": { camera: "Olympus E-M5 Mark II", lens: "M.Zuiko Digital ED 60mm F2.8 Macro", focalLength: "60mm", aperture: "f/4", shutterSpeed: "1/1600s", iso: "200" },
  "20260117-20260117_EM50519": { camera: "Olympus E-M5 Mark II", lens: "M.Zuiko Digital ED 60mm F2.8 Macro", focalLength: "60mm", aperture: "f/4", shutterSpeed: "1/800s", iso: "200" },
  "20260117-20260117_EM50524": { camera: "Olympus E-M5 Mark II", lens: "M.Zuiko Digital ED 60mm F2.8 Macro", focalLength: "60mm", aperture: "f/4", shutterSpeed: "1/2000s", iso: "200" },
  "20260117-20260117_EM50532": { camera: "Olympus E-M5 Mark II", lens: "M.Zuiko Digital ED 60mm F2.8 Macro", focalLength: "60mm", aperture: "f/4", shutterSpeed: "1/500s", iso: "200" },
  "20260117-20260117_EM50536": { camera: "Olympus E-M5 Mark II", lens: "M.Zuiko Digital ED 60mm F2.8 Macro", focalLength: "60mm", aperture: "f/8", shutterSpeed: "1/125s", iso: "400" },
  "20260117-20260117_EM50594": { camera: "Olympus E-M5 Mark II", lens: "M.Zuiko Digital ED 60mm F2.8 Macro", focalLength: "60mm", aperture: "f/2.8", shutterSpeed: "1/1000s", iso: "200" },
  "20260117-20260117_EM50599": { camera: "Olympus E-M5 Mark II", lens: "M.Zuiko Digital ED 60mm F2.8 Macro", focalLength: "60mm", aperture: "f/2.8", shutterSpeed: "1/640s", iso: "200" },
  "20260117-20260117_EM50601": { camera: "Olympus E-M5 Mark II", lens: "M.Zuiko Digital ED 60mm F2.8 Macro", focalLength: "60mm", aperture: "f/2.8", shutterSpeed: "1/400s", iso: "200" },
  "20260117-20260117_EM50604": { camera: "Olympus E-M5 Mark II", lens: "M.Zuiko Digital ED 60mm F2.8 Macro", focalLength: "60mm", aperture: "f/2.8", shutterSpeed: "1/640s", iso: "200" },
  "20260117-20260117_EM50618": { camera: "Olympus E-M5 Mark II", lens: "M.Zuiko Digital ED 25mm F1.8", focalLength: "25mm", aperture: "f/2.8", shutterSpeed: "1/200s", iso: "200" },
  "20260117-20260117_EM50627": { camera: "Olympus E-M5 Mark II", lens: "M.Zuiko Digital ED 25mm F1.8", focalLength: "25mm", aperture: "f/4", shutterSpeed: "1/640s", iso: "200" },
  "20260117-20260117_EM50648": { camera: "Olympus E-M5 Mark II", lens: "M.Zuiko Digital ED 25mm F1.8", focalLength: "25mm", aperture: "f/4", shutterSpeed: "1/4000s", iso: "200" },
  "20260117-20260117_EM50660": { camera: "Olympus E-M5 Mark II", lens: "M.Zuiko Digital ED 25mm F1.8", focalLength: "25mm", aperture: "f/4", shutterSpeed: "1/4000s", iso: "200" },
  "20260117-20260117_EM50712": { camera: "Olympus E-M5 Mark II", lens: "M.Zuiko Digital ED 60mm F2.8 Macro", focalLength: "60mm", aperture: "f/8", shutterSpeed: "1/320s", iso: "200" },
  "20260117-20260117_EM50717": { camera: "Olympus E-M5 Mark II", lens: "M.Zuiko Digital ED 60mm F2.8 Macro", focalLength: "60mm", aperture: "f/3.2", shutterSpeed: "1/400s", iso: "200" },
  "RNI-Films-IMG-6F30B394-C121-4D04-B36B-CFAFEB9CED7B": { camera: "Olympus E-M1 Mark II", lens: "M.Zuiko Digital ED 60mm F2.8 Macro", focalLength: "60mm", aperture: "f/5.6", shutterSpeed: "1/400s", iso: "200" },
  "RNI-Films-IMG-C5F4729D-E953-4783-A8C3-C45711C79DD6": { camera: "Olympus E-M1 Mark II", lens: "M.Zuiko Digital ED 12-100mm F4.0", focalLength: "100mm", aperture: "f/8", shutterSpeed: "1/500s", iso: "200" },
  "RNI-Films-IMG-C677524F-9814-4BDC-AECF-674198651AF5": { camera: "Olympus E-M1 Mark II", lens: "M.Zuiko Digital ED 12-100mm F4.0", focalLength: "25mm", aperture: "f/4", shutterSpeed: "1/2500s", iso: "200" },
  "RNI-Films-IMG-F80FD7DD-D90A-46F3-A7B7-A5BB4BDDDF98": { camera: "Olympus E-M1 Mark II", lens: "M.Zuiko Digital ED 12-100mm F4.0", focalLength: "66mm", aperture: "f/4", shutterSpeed: "1/400s", iso: "200" },};

// Looks up EXIF data for a Cloudinary public ID by finding which
// EXIF_DATA key it contains as a substring.
function exifForPublicId(publicId) {
  const key = Object.keys(EXIF_DATA).find((k) => publicId.includes(k));
  return key ? EXIF_DATA[key] : null;
}
