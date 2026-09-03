// Ice Breaker Game 03 — Who Is It? Evergreen Edition · 나는 누구일까요? (한/영/서 3개 언어)
// 실행: npm run icebreaker:03  → out/icebreaker/icebreaker-03-whoisit.pptx
// 대상자 데이터는 아래 PEOPLE 배열 — 한 사람 = 힌트 7개(7문항 답 전부, 넓게→구체적으로) + 어릴 적 사진(장당 한 슬라이드) + 정답.
// 사진은 scripts/icebreaker/people/<id>/ (gitignore — 공개 repo 이므로 개인 사진 커밋 금지).
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { C, F, W, newDeck, frame, headline, trilingual, rulesSlide, cueSlide, hintSlide, photoSlide, revealSlide } from './theme.mjs';

const ROOT = path.resolve(import.meta.dirname, '../..');
const OUT = path.join(ROOT, 'out/icebreaker');
await mkdir(path.join(OUT, 'people'), { recursive: true });
const logoPng = path.join(OUT, 'evergreen-logo-white.png');
await sharp(path.join(ROOT, 'public/evergreen-logo.webp')).png().toFile(logoPng);
const emblem = path.join(ROOT, 'public/retreat-emblem-2026.png');
const asset = (name) => path.join(import.meta.dirname, 'assets', `emoji-${name}.png`);

/** 개인 사진을 1600px 로 줄여 out/ 에 저장하고 { path, ratio } 반환 (pptx 용량 + 레이아웃 계산용). */
async function photo(id, file) {
  const src = path.join(import.meta.dirname, 'people', id, file);
  const dst = path.join(OUT, 'people', `${id}-${path.parse(file).name}.jpg`);
  const { width, height } = await sharp(src).rotate().resize({ width: 1600, withoutEnlargement: true }).jpeg({ quality: 85 }).toFile(dst);
  return { path: dst, ratio: width / height };
}

// ─── 대상자 ──────────────────────────────────────────────────────────────────
// 질문지(7문항): 1 좋아하는 음식 · 2 태어난 곳 · 3 성도들이 모를 의외의 사실 · 4 처음 온 때 · 5 봉사/소속 · 6 좋아하는 장소·시간 · 7 삶의 모토
// 7문항 답을 전부 힌트로 쓴다. 순서만 여러 사람에 해당될 만한 것부터 → 아는 사람이면 맞힐 것으로.
const PEOPLE = [
  {
    id: '01-kim-jimi',
    label: { ko: '첫 번째', en: 'Person 1', es: 'Persona 1' },
    hints: [
      { ko: '제 삶의 모토는 — “현재에 만족하고 최선을 다하자”', en: 'My life motto: “Be content with today, and give it my best.”', es: 'Mi lema: «Estar en paz con el presente y dar lo mejor de mí».' },
      { ko: '가장 좋아하는 음식은 냉면입니다.', en: 'My favorite food is naengmyeon — Korean cold noodles.', es: 'Mi comida favorita es el naengmyeon, fideos fríos coreanos.' },
      { ko: '경기도 안성에서 태어났습니다.', en: 'I was born in Anseong, Gyeonggi Province, Korea.', es: 'Nací en Anseong, provincia de Gyeonggi, Corea.' },
      { ko: '좋아하는 곳은 시온성전, 좋아하는 시간은 점심 교제와 구역예배입니다.', en: 'Favorite place: the Zion Sanctuary. Favorite time: lunch fellowship and district worship.', es: 'Lugar favorito: el Santuario Sion. Momento favorito: el almuerzo y el culto de distrito.' },
      { ko: '지금은 관리부에서 봉사하고 있습니다.', en: 'I currently serve on the Facilities Team.', es: 'Actualmente sirvo en el equipo de mantenimiento.' },
      { ko: '늘푸른교회에 처음 온 것은 2018년 8월입니다.', en: 'I first came to Evergreen in August 2018.', es: 'Llegué a Evergreen por primera vez en agosto de 2018.' },
      { ko: '미국 사람과 결혼해서 영어를 잘할 것 같지만… 사실 잘 못 합니다!', en: 'I married an American, so you’d think my English is great… it’s not!', es: 'Me casé con un estadounidense — pensarías que hablo bien inglés… ¡pues no!' },
    ],
    photos: ['family.jpg', 'solo.jpg'], // 마지막 힌트들 — 한 장당 한 슬라이드
    reveal: { file: 'solo.jpg', name: { ko: '김지미 집사님', en: 'Deacon Jimi Kim', es: 'Diaconisa Jimi Kim' } },
  },
];

const EYEBROW = 'ICE BREAKER · GAME 03';
const pres = newDeck();
const perPerson = (p) => p.hints.length + p.photos.length + 1; // 힌트들 + 사진들 + 정답
const TOTAL = 3 + PEOPLE.reduce((a, p) => a + perPerson(p), 0) + 1;
let n = 0;
const meta = () => ({ eyebrow: EYEBROW, pageNo: ++n, total: TOTAL });

// 1. 표지
{
  const s = frame(pres, meta());
  const d = 4.2, cx = 0.9, cy = 1.55;
  s.addShape(pres.ShapeType.ellipse, { x: cx, y: cy, w: d, h: d, fill: { color: C.ivory }, line: { color: C.ivory } });
  s.addImage({ path: emblem, x: cx + 0.55, y: cy + 0.5, w: 3.1, h: 3.1 * (1402 / 1335), sizing: { type: 'contain', w: 3.1, h: 3.25 } });
  const tx = 5.8, tw = W - 0.6 - tx;
  s.addText('GAME 03', { x: tx, y: 1.6, w: tw, h: 0.5, fontFace: F.latin, fontSize: 22, color: C.gold, charSpacing: 4 });
  headline(
    s,
    { ko: '나는 누구일까요?', en: 'Who Is It? — Evergreen Edition', es: '¿Quién será? — Edición Evergreen' },
    { x: tx, y: 2.05, w: tw, scale: 1.05, sizes: { ko: 52, en: 30, es: 26 } },
  );
  trilingual(
    s,
    { ko: '힌트를 하나씩 보고 — 우리 늘푸른 가족 다섯 분이 누구인지 맞혀 보세요!', en: 'Clue by clue — can you guess which five members of our Evergreen family these are?', es: 'Pista a pista — ¿adivinas quiénes son estos cinco miembros de nuestra familia Evergreen?' },
    { x: tx, y: 5.0, w: tw, h: 1.6, size: 17, gap: 2 },
  );
  s.addImage({ path: logoPng, x: W - 0.6 - 2.2, y: 6.9, w: 2.2, h: 2.2 * (353 / 1500) });
}

// 2. 방식
cueSlide(pres, meta(), {
  kicker: 'HOW IT WORKS · 방식 · CÓMO FUNCIONA',
  items: [
    { image: asset('mag'), word: 'HINT', sub: '힌트가 하나씩 공개됩니다\nLas pistas salen una a una' },
    { image: asset('hand'), word: 'GUESS', sub: '손 들기 → MC 지목 → 이름!\nMano arriba → el MC elige → ¡nombre!' },
    { image: asset('camera'), word: 'REVEAL', sub: '정답 공개 — 앞으로 나와 주세요!\nSe revela — ¡pase al frente!' },
  ],
  footer: {
    ko: '정답을 맞힌 분에게 Gift Card 한 장! 힌트마다 2~3명만 기회가 있으니 신중하게 손드세요.',
    en: 'A correct guess wins a Gift Card! Only 2–3 guesses per hint — raise your hand wisely.',
    es: '¡Quien acierte gana una Gift Card! Solo 2–3 intentos por pista — levanta la mano con cuidado.',
  },
});

// 3. 규칙 (3개)
rulesSlide(pres, meta(), {
  kicker: 'RULES · 규칙 · REGLAS',
  rules: [
    { n: 1, ko: '손을 들고, MC가 지목한 뒤에만 이름을 말합니다.', en: 'Raise your hand — say the name only when the MC calls on you.', es: 'Levanta la mano — di el nombre solo cuando el MC te elija.' },
    { n: 2, ko: '한 사람당 한 번만! 틀리면 그 문제는 끝 — 다음 문제에서 리셋.', en: 'ONE guess each. Wrong? You’re out for this person only — reset next round.', es: 'UN intento. ¿Fallaste? Fuera solo en esta ronda — vuelves en la siguiente.' },
    { n: 3, ko: '객석에서 이름을 외치거나 힌트 주기 금지. 본인·가족은 조용히!', en: 'No shouting names or hints from your seat. Family — shhh!', es: 'No griten nombres ni den pistas. Familiares — ¡silencio!' },
  ],
});

// 4~. 대상자별: 힌트 7개 → 어릴 적 사진(장당 한 슬라이드) → 정답
for (const p of PEOPLE) {
  const kicker = p.label.en.toUpperCase();
  const total = p.hints.length + p.photos.length;
  for (let i = 1; i <= p.hints.length; i++) hintSlide(pres, meta(), { kicker, hints: p.hints, current: i });
  for (let j = 0; j < p.photos.length; j++) {
    photoSlide(pres, meta(), {
      kicker, current: p.hints.length + j + 1, total,
      title: { ko: '어릴 적 모습입니다!', en: 'Childhood photo', es: 'Foto de la infancia' },
      photo: await photo(p.id, p.photos[j]),
    });
  }
  revealSlide(pres, meta(), {
    kicker: `${kicker} · 정답은 · LA RESPUESTA`,
    photo: await photo(p.id, p.reveal.file),
    name: p.reveal.name,
    cheer: { ko: '큰 박수! 앞으로 나와 주세요', en: 'Applause! Please come up', es: '¡Aplausos! Pase al frente' },
  });
}

// 마지막. 마무리
{
  const s = frame(pres, meta());
  s.addText('CLOSING · 마무리 · CIERRE', { x: 0.6, y: 0.95, w: 8, h: 0.45, fontFace: F.latin, fontSize: 18, color: C.gold, charSpacing: 3 });
  headline(
    s,
    { ko: '복된 만남', en: 'Blessed Encounter', es: 'Encuentro Bendito' },
    { x: 0.6, y: 1.4, w: W - 1.2, scale: 1.1 },
  );
  s.addText('“거기서 내가 이스라엘 자손을 만나리니” — 출애굽기 29:43', {
    x: 0.6, y: 4.3, w: W - 1.2, h: 0.5, fontFace: F.ko, fontSize: 18, italic: true, color: C.goldSoft,
  });
  trilingual(
    s,
    {
      ko: '같은 교회 안에도 아직 모르는 이야기가 참 많지요? 이번 수련회 동안 익숙한 분에게도 한 번 더 말을 걸어 보세요.',
      en: 'Even in one church, there are so many stories we don’t know yet. This retreat, go start one more conversation.',
      es: 'Aun en la misma iglesia hay tantas historias que no conocemos. En este retiro, ¡inicia una conversación más!',
    },
    { x: 0.6, y: 4.9, w: W - 1.2, h: 1.9, size: 17, gap: 4 },
  );
}

if (n !== TOTAL) throw new Error(`slide count ${n} != TOTAL ${TOTAL}`);
const file = path.join(OUT, 'icebreaker-03-whoisit.pptx');
await pres.writeFile({ fileName: file });
console.log('wrote', path.relative(ROOT, file), `(${n} slides)`);
