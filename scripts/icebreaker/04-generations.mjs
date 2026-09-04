// Ice Breaker Game 04 — Evergreen Generations Challenge (Reverse Charades) · 세대 기관 연합 몸으로 말해요 (한/영/서)
// 실행: npm run icebreaker:04  → out/icebreaker/icebreaker-04-generations.pptx
// 3팀 × 7명(설명자 3 고정 + 정답자 4), 팀당 3분, 문제 10개(어려운 문제 뒤에 쉬운 일상/동물 문제를 숨 고르기로 배치).
// 문제 세트는 사용자와 확정(2026-09-03). 3인 합동 연기 아이디어는 슬라이드 노트(발표자 노트)에만.
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { C, F, W, newDeck, frame, headline, trilingual, rulesSlide, promptSlide, bigWordSlide } from './theme.mjs';

const ROOT = path.resolve(import.meta.dirname, '../..');
const OUT = path.join(ROOT, 'out/icebreaker');
await mkdir(OUT, { recursive: true });
const logoPng = path.join(OUT, 'evergreen-logo-white.png');
await sharp(path.join(ROOT, 'public/evergreen-logo.webp')).png().toFile(logoPng);
const emblem = path.join(ROOT, 'public/retreat-emblem-2026.png');
const asset = (name) => path.join(import.meta.dirname, 'assets', `emoji-${name}.png`);

const CAT = {
  bibleEvent: { ko: '성경 이벤트', en: 'Bible Event', es: 'Evento bíblico' },
  church: { ko: '교회 생활', en: 'Church Life', es: 'Vida de iglesia' },
  daily: { ko: '일상', en: 'Everyday Life', es: 'Vida diaria' },
  biblePlace: { ko: '성경 장소', en: 'Bible Place', es: 'Lugar bíblico' },
  sports: { ko: '스포츠', en: 'Sports', es: 'Deportes' },
  animal: { ko: '동물', en: 'Animal', es: 'Animal' },
  biblePerson: { ko: '성경 인물', en: 'Bible Person', es: 'Personaje bíblico' },
  churchEvent: { ko: '교회 행사', en: 'Church Event', es: 'Evento de la iglesia' },
};
const P = (cat, ko, en, es, note) => ({ cat, ko, en, es, note });

const TEAMS = [
  [
    P(CAT.bibleEvent, '홍해 가르기', 'Parting the Red Sea', 'La división del Mar Rojo', '1명 모세가 지팡이 들면 2명이 파도가 되어 양쪽으로 갈라짐'),
    P(CAT.church, '새벽기도', 'Early Morning Prayer', 'Oración de madrugada', '알람 끄고 하품, 어둠 속 운전, 무릎 꿇고 기도'),
    P(CAT.daily, '코스트코 쇼핑', 'Shopping at Costco', 'Compras en Costco', '거대 카트 밀기, 시식 코너, 대용량 박스 둘이 들기'),
    P(CAT.biblePlace, '여리고', 'Jericho', 'Jericó', '둘이 성벽, 1명 나팔 불며 돌다가 성벽 무너짐'),
    P(CAT.daily, '양치질', 'Brushing Teeth', 'Cepillarse los dientes', '쉬운 문제 — 숨 고르기'),
    P(CAT.sports, '컬링', 'Curling', 'Curling', '1명 스톤 밀기, 2명 빗자루로 쓸기'),
    P(CAT.animal, '펭귄', 'Penguin', 'Pingüino', '셋이 붙어 뒤뚱뒤뚱, 배로 미끄러지기'),
    P(CAT.biblePerson, '요셉', 'Joseph', 'José', '채색옷 자랑 → 형들이 구덩이에 던짐 → 바로 앞에서 꿈 해석'),
    P(CAT.animal, '캥거루', 'Kangaroo', 'Canguro', '엄마 점프, 아기가 앞에 붙어 주머니 속, 1명 권투 자세'),
    P(CAT.churchEvent, '김장', 'Kimchi-Making Day', 'Día de hacer kimchi', '배추 절이기, 양념 버무리기, 김치통 나르기'),
  ],
  [
    P(CAT.bibleEvent, '오병이어', 'Feeding the 5,000', 'La multiplicación de los panes', '아이가 도시락 내놓음 → 예수님이 떼어 나눔 → 배부른 군중'),
    P(CAT.church, '성찬식', 'Holy Communion', 'La Santa Cena', '빵 떼기, 잔 돌리기, 줄지어 받기'),
    P(CAT.daily, '공항 보안검색', 'Airport Security', 'Control de seguridad del aeropuerto', '벨트·신발 벗기, 팔 들고 스캐너 통과, 삐 소리에 몸수색'),
    P(CAT.biblePlace, '에덴동산', 'Garden of Eden', 'El jardín del Edén', '1명 나무, 1명 뱀이 유혹, 1명 열매 따 먹고 몸 가림'),
    P(CAT.sports, '봅슬레이', 'Bobsled', 'Bobsleigh', '셋이 한 줄로 밀며 달리다 차례로 올라타 좌우로 기울기'),
    P(CAT.daily, '라면 끓이기', 'Cooking Ramen', 'Cocinar ramen', '쉬운 문제 — 숨 고르기'),
    P(CAT.animal, '문어', 'Octopus', 'Pulpo', '셋이 등을 맞대고 팔 여덟 개 흔들기, 먹물 뿜기'),
    P(CAT.biblePerson, '베드로', 'Peter', 'Pedro', '물 위 걷다 빠짐, 세 번 부인 + 닭 울음, 열쇠'),
    P(CAT.animal, '코끼리', 'Elephant', 'Elefante', '가운데 사람 팔로 코, 양옆 두 명이 큰 귀 펄럭'),
    P(CAT.churchEvent, '성탄 칸타타', 'Christmas Cantata', 'Cantata de Navidad', '지휘자 + 성가대 입 벌리기 + 촛불 들고 입장'),
  ],
  [
    P(CAT.bibleEvent, '예수님 물 위를 걸으심', 'Jesus Walks on Water', 'Jesús camina sobre el agua', '1명 배에서 노 젓기, 1명 물 위 걷기, 1명 무서워 떨기'),
    P(CAT.church, '주차 봉사', 'Parking Ministry', 'Ministerio de estacionamiento', '형광 조끼, 차 유도 손짓, 후진 신호'),
    P(CAT.daily, '이사하기', 'Moving Day', 'Día de mudanza', '셋이 소파 들고 문 통과 못 해 돌리기, 박스 테이프'),
    P(CAT.biblePlace, '베들레헴', 'Bethlehem', 'Belén', '별 따라오는 동방박사, 말구유, 목자'),
    P(CAT.sports, '배구', 'Volleyball', 'Voleibol', '서브 → 리시브 → 세트 → 스파이크 릴레이'),
    P(CAT.animal, '기린', 'Giraffe', 'Jirafa', '1명 어깨 위로 팔 뻗어 긴 목, 높은 나뭇잎 먹기, 다리 벌려 물 마시기'),
    P(CAT.biblePerson, '세례 요한', 'John the Baptist', 'Juan el Bautista', '강에서 세례 주기, 메뚜기·꿀 먹기, 광야에서 외치기'),
    P(CAT.daily, '치과 가기', 'At the Dentist', 'En el dentista', '쉬운 문제 — 숨 고르기'),
    P(CAT.animal, '원숭이', 'Monkey', 'Mono', '나무 타기, 바나나 까기, 서로 벼룩 잡아주기'),
    P(CAT.churchEvent, '교회 바자회', 'Church Bazaar', 'Bazar de la iglesia', '잡채 팔기, 가격표 붙이기, 지갑 열고 사기'),
  ],
];

const EYEBROW = 'ICE BREAKER · GAME 04';
const pres = newDeck();
const TOTAL = 4 + TEAMS.reduce((a, t) => a + t.length + 2, 0) + 3; // 표지·팀·규칙·시범 + 팀별(READY + 문제 + TIME'S UP) + 점수·시상·마무리
let n = 0;
const meta = () => ({ eyebrow: EYEBROW, pageNo: ++n, total: TOTAL });

// 1. 표지
{
  const s = frame(pres, meta());
  const d = 4.2, cx = 0.9, cy = 1.55;
  s.addShape(pres.ShapeType.ellipse, { x: cx, y: cy, w: d, h: d, fill: { color: C.ivory }, line: { color: C.ivory } });
  s.addImage({ path: emblem, x: cx + 0.55, y: cy + 0.5, w: 3.1, h: 3.1 * (1402 / 1335), sizing: { type: 'contain', w: 3.1, h: 3.25 } });
  const tx = 5.8, tw = W - 0.6 - tx;
  s.addText('GAME 04', { x: tx, y: 1.6, w: tw, h: 0.5, fontFace: F.latin, fontSize: 22, color: C.gold, charSpacing: 4 });
  headline(
    s,
    { ko: '몸으로 말해요', en: 'Evergreen Generations Challenge', es: 'Desafío de Generaciones Evergreen' },
    { x: tx, y: 2.05, w: tw, scale: 1.05, sizes: { ko: 52, en: 30, es: 26 } },
  );
  trilingual(
    s,
    { ko: '세대와 직분을 뛰어넘어 — 몸과 표정만으로 3분 안에 최다 정답!', en: 'Across generations and roles — act it out, no words, most answers in 3 minutes!', es: 'Entre generaciones y roles — ¡solo con el cuerpo, más aciertos en 3 minutos!' },
    { x: tx, y: 5.0, w: tw, h: 1.6, size: 17, gap: 2 },
  );
  s.addImage({ path: logoPng, x: W - 0.6 - 2.2, y: 6.9, w: 2.2, h: 2.2 * (353 / 1500) });
}

// 2. 팀 구성 + 역할
{
  const s = frame(pres, meta());
  s.addText('TEAMS · 팀 구성 · EQUIPOS', { x: 0.6, y: 0.95, w: 8, h: 0.45, fontFace: F.latin, fontSize: 18, color: C.gold, charSpacing: 3 });
  s.addText('3 × 7', { x: 0.6, y: 1.5, w: 4.2, h: 1.6, fontFace: F.latin, fontSize: 96, bold: true, color: C.ivory, valign: 'middle' });
  s.addText(
    [
      { text: '3팀 × 7명', options: { fontFace: F.ko, color: C.ivory, fontSize: 22, bold: true, breakLine: true } },
      { text: '3 teams × 7 · 3 equipos × 7', options: { fontFace: F.sans, color: C.mistDim, fontSize: 13 } },
    ],
    { x: 0.6, y: 3.1, w: 4.2, h: 0.8, valign: 'top' },
  );
  // 역할 박스
  const by = 4.2;
  s.addShape(pres.ShapeType.roundRect, { x: 0.6, y: by, w: 4.2, h: 2.3, rectRadius: 0.12, fill: { color: C.gold }, line: { color: C.gold } });
  s.addImage({ path: asset('masks'), x: 0.8, y: by + 0.2, w: 0.8, h: 0.8 });
  s.addText(
    [
      { text: '설명자 3 · 정답자 4', options: { fontFace: F.ko, color: C.pineDeep, fontSize: 22, bold: true, breakLine: true } },
      { text: '3 Actors + 4 Guessers', options: { fontFace: F.latin, color: C.pineDeep, fontSize: 16, breakLine: true } },
      { text: '3 actores + 4 adivinadores', options: { fontFace: F.latin, color: C.pineDeep, fontSize: 14 } },
    ],
    { x: 1.75, y: by + 0.1, w: 2.95, h: 1.35, valign: 'top', lineSpacingMultiple: 1.05 },
  );
  s.addText(
    [
      { text: '역할은 3분 동안 고정', options: { fontFace: F.sans, color: C.pineDeep, fontSize: 13, bold: true, breakLine: true } },
      { text: 'Roles stay fixed for 3 min · Sin cambios durante 3 min', options: { fontFace: F.sans, color: C.pineDeep, fontSize: 11 } },
    ],
    { x: 0.8, y: by + 1.6, w: 3.8, h: 0.65, valign: 'top' },
  );
  s.addShape(pres.ShapeType.line, { x: 5.3, y: 1.6, w: 0, h: 4.9, line: { color: C.goldSoft, width: 0.75, transparency: 60 } });
  const rows = [
    ['목회자', 'Pastor', 'Pastor'], ['장로', 'Elder', 'Anciano'], ['남선교회', "Men's Mission", 'Misión de hombres'], ['여선교회', "Women's Mission", 'Misión de mujeres'],
    ['기드온 (중고등부)', 'Gideon · Youth', 'Gedeón'], ['미가엘 (20대)', 'Michael · 20s', 'Miguel'], ['마하나임 (30대)', 'Mahanaim · 30s', 'Mahanaim'],
  ];
  s.addText('각 팀 = 아래 7명 각 1명 · Each team: one of each · Cada equipo: uno de cada', { x: 5.7, y: 1.45, w: W - 0.6 - 5.7, h: 0.4, fontFace: F.sans, fontSize: 13, color: C.goldSoft });
  rows.forEach((r, i) => {
    const y = 1.95 + i * 0.66;
    s.addShape(pres.ShapeType.ellipse, { x: 5.7, y: y + 0.1, w: 0.42, h: 0.42, fill: { color: C.gold }, line: { color: C.gold } });
    s.addText(String(i + 1), { x: 5.7, y: y + 0.1, w: 0.42, h: 0.42, align: 'center', valign: 'middle', fontFace: F.latin, fontSize: 15, bold: true, color: C.pineDeep });
    s.addText(
      [
        { text: r[0], options: { fontFace: F.sans, color: C.ivory, fontSize: 20, bold: true } },
        { text: `    ${r[1]}  ·  ${r[2]}`, options: { fontFace: F.sans, color: C.mist, fontSize: 14 } },
      ],
      { x: 6.3, y, w: W - 0.6 - 6.3, h: 0.62, valign: 'middle' },
    );
  });
}

// 3. 규칙
rulesSlide(pres, meta(), {
  kicker: 'RULES · 규칙 · REGLAS',
  rules: [
    { n: 1, ko: '말·소리·입모양 금지 — 몸과 표정만!', en: 'No talking, no sounds, no mouthing — body and face only!', es: 'Sin hablar, sin sonidos, sin mover los labios — ¡solo cuerpo y gestos!' },
    { n: 2, ko: '글자 쓰기, 글자 수·철자 힌트 금지.', en: 'No writing letters, no letter-count or spelling clues.', es: 'No escribir letras ni dar pistas de letras o deletreo.' },
    { n: 3, ko: '정답 1점 · 모르면 PASS(0점) · 3분 안에 최다 정답 팀 우승!', en: '1 point per answer · PASS anytime (0) · Most answers in 3 minutes wins!', es: '1 punto por acierto · PASAR (0) · ¡Gana quien más acierte en 3 minutos!' },
  ],
});

// 4. 시범
promptSlide(pres, meta(), {
  heading: 'DEMO · 시범 · PRÁCTICA',
  category: { ko: '시범', en: 'Demo', es: 'Demostración' },
  prompt: { ko: '셀카 찍기', en: 'Taking a Selfie', es: 'Tomarse una selfi' },
});

// 5~. 팀별: READY → 문제 10 → TIME'S UP
TEAMS.forEach((prompts, ti) => {
  const team = ti + 1;
  bigWordSlide(pres, meta(), {
    kicker: `TEAM ${team} · READY`,
    image: asset('timer'),
    big: `TEAM ${team}`,
    lines: {
      ko: '설명자 3명은 화면 앞에, 정답자 4명은 화면을 등지고 서세요.',
      en: '3 Actors face the screen. 4 Guessers turn your backs to it.',
      es: '3 actores frente a la pantalla. 4 adivinadores de espaldas.',
    },
    sub: '3:00 — READY?  준비되셨나요?  ¿LISTOS?',
  });
  prompts.forEach((p, i) => {
    const s = promptSlide(pres, meta(), { team, n: i + 1, total: prompts.length, category: p.cat, prompt: { ko: p.ko, en: p.en, es: p.es } });
    if (p.note) s.addNotes(`3인 합동 아이디어: ${p.note}`);
  });
  bigWordSlide(pres, meta(), {
    kicker: `TEAM ${team} · TIME'S UP`,
    image: asset('stop'),
    big: 'TIME’S UP!',
    bigSize: 96,
    lines: { ko: '시간 종료! 정답자는 이제 돌아서세요.', en: 'Time’s up! Guessers, you can turn around now.', es: '¡Se acabó el tiempo! Adivinadores, ya pueden voltear.' },
    sub: `TEAM ${team} SCORE  ·  점수 발표`,
  });
});

// 점수판
{
  const s = frame(pres, meta());
  s.addText('SCOREBOARD · 점수판 · MARCADOR', { x: 0.6, y: 0.95, w: 8, h: 0.45, fontFace: F.latin, fontSize: 18, color: C.gold, charSpacing: 3 });
  const gap = 0.4, bw = (W - 1.2 - gap * 2) / 3;
  for (let i = 0; i < 3; i++) {
    const x = 0.6 + i * (bw + gap), y = 1.6, h = 3.7;
    s.addShape(pres.ShapeType.roundRect, { x, y, w: bw, h, rectRadius: 0.15, fill: { color: C.pineDeep }, line: { color: C.goldSoft, width: 1.5 } });
    s.addText(`TEAM ${i + 1}`, { x, y: y + 0.3, w: bw, h: 0.6, align: 'center', fontFace: F.latin, fontSize: 28, bold: true, color: C.gold, charSpacing: 2 });
    s.addShape(pres.ShapeType.line, { x: x + bw * 0.2, y: y + 2.9, w: bw * 0.6, h: 0, line: { color: C.goldSoft, width: 2 } });
    s.addText('점수 · score', { x, y: y + 3.0, w: bw, h: 0.4, align: 'center', fontFace: F.sans, fontSize: 12, color: C.mistDim });
  }
  trilingual(
    s,
    { ko: '동점이면 — 각 팀 설명자 3명 + 정답자 1명, Sudden Death 한 문제! 먼저 맞힌 팀 승.', en: 'Tie? Sudden death: 3 Actors + 1 Guesser per team, one prompt — first correct answer wins.', es: '¿Empate? Muerte súbita: 3 actores + 1 adivinador por equipo, una palabra — gana el primero.' },
    { x: 0.6, y: 5.5, w: W - 1.2, h: 1.3, size: 16, gap: 2 },
  );
}

// 시상
{
  const s = frame(pres, meta());
  s.addText('AWARDS · 시상 · PREMIOS', { x: 0.6, y: 0.95, w: 8, h: 0.45, fontFace: F.latin, fontSize: 18, color: C.gold, charSpacing: 3 });
  const cw = 8.0, x = (W - cw) / 2, y = 1.6;
  s.addShape(pres.ShapeType.roundRect, { x, y, w: cw, h: 4.0, rectRadius: 0.15, fill: { color: C.gold }, line: { color: C.gold } });
  s.addImage({ path: asset('gift'), x: x + cw / 2 - 0.6, y: y + 0.3, w: 1.2, h: 1.2 });
  s.addText('$10 Amazon Gift Card × 7', { x, y: y + 1.55, w: cw, h: 1.0, align: 'center', valign: 'middle', fontFace: F.latin, fontSize: 44, bold: true, color: C.pineDeep });
  s.addText(
    [
      { text: '우승팀 7명 전원', options: { fontFace: F.ko, color: C.pineDeep, fontSize: 28, bold: true, breakLine: true } },
      { text: 'Every member of the winning team · Todo el equipo ganador', options: { fontFace: F.latin, color: C.pineDeep, fontSize: 18 } },
    ],
    { x, y: y + 2.65, w: cw, h: 1.2, align: 'center', valign: 'top' },
  );
  trilingual(
    s,
    { ko: '세대도 직분도 다르지만 — 한 팀! 우승팀에게 큰 박수!', en: 'Different generations, different roles — one team! Applause for the winners!', es: 'Distintas generaciones y roles — ¡un solo equipo! ¡Aplausos para los ganadores!' },
    { x: 0.6, y: 5.75, w: W - 1.2, h: 1.05, size: 16, gap: 0 },
  );
}

// 마무리
{
  const s = frame(pres, meta());
  s.addText('CLOSING · 마무리 · CIERRE', { x: 0.6, y: 0.95, w: 8, h: 0.45, fontFace: F.latin, fontSize: 18, color: C.gold, charSpacing: 3 });
  headline(s, { ko: '복된 만남', en: 'Blessed Encounter', es: 'Encuentro Bendito' }, { x: 0.6, y: 1.4, w: W - 1.2, scale: 1.1 });
  s.addText('“거기서 내가 이스라엘 자손을 만나리니” — 출애굽기 29:43', { x: 0.6, y: 4.3, w: W - 1.2, h: 0.5, fontFace: F.ko, fontSize: 18, italic: true, color: C.goldSoft });
  trilingual(
    s,
    { ko: '오늘 밤 웃으며 만난 그 얼굴들 — 남은 수련회 동안 먼저 다가가 인사해 주세요.', en: 'The faces you laughed with tonight — go greet them first for the rest of this retreat.', es: 'Las caras con las que reíste esta noche — salúdalas tú primero durante el resto del retiro.' },
    { x: 0.6, y: 4.9, w: W - 1.2, h: 1.9, size: 17, gap: 4 },
  );
}

if (n !== TOTAL) throw new Error(`slide count ${n} != TOTAL ${TOTAL}`);
const file = path.join(OUT, 'icebreaker-04-generations.pptx');
await pres.writeFile({ fileName: file });
console.log('wrote', path.relative(ROOT, file), `(${n} slides)`);
