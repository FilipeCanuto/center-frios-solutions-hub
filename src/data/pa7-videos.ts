// Vídeos da landing do PA7 recomprimidos para web (H.264 540p, faststart).
// Os originais (até 74 MB, um deles em HEVC) seguem no storage do Lovable;
// estes ficam em /public e somam ~18 MB. Cada vídeo tem um pôster em JPG.
const v = (name: string) => ({
  src: `/videos/pa7/${name}.mp4`,
  poster: `/videos/pa7/${name}.jpg`,
});

export const PA7_VIDEOS = {
  circuito: v("circuito-experience"),
  versatilidade: v("versatilidade"),
  calabresa: v("calabresa"),
  batata: v("batata-fatiada"),
  thomas: v("thomas-burguer"),
};
