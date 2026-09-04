// 아이스브레이커 슬라이드 공통 테마 — 사이트 다크 테마(벽보 dark 버전)와 동일한 토큰.
// pptx 는 폰트를 못 심는다. 아래 폰트는 전부 Google Fonts 에 있는 이름이라 Google Slides 로
// 올리면 그대로 매핑되고, PowerPoint 에서는 설치돼 있으면 쓰고 없으면 폴백된다.
import pptxgen from 'pptxgenjs';

export const C = {
  pine: '14342B',
  pineDeep: '0E241D',
  ivory: 'F6F1E7',
  cream: 'FBF8F1',
  gold: 'C89B3C',
  goldSoft: 'DCC07F',
  mist: 'E7EAE3',
  mistDim: 'A8BDB2',
  bark: '2B2A26',
};

export const F = {
  ko: 'Nanum Myeongjo', // 한국어 제목
  latin: 'Fraunces', // 영어·스페인어 제목, 숫자
  sans: 'Noto Sans KR', // 본문·라벨 (한/영/서 모두 커버)
};

// 슬라이드 13.333 × 7.5 in
export const W = 13.333;
export const H = 7.5;
const M = 0.6; // 좌우 여백

// 세 언어 공통 스타일 — 모든 슬라이드에서 같은 순서·같은 색 (청중이 자기 언어를 같은 자리에서 찾도록)
export const LANG = {
  ko: { fontFace: F.ko, color: C.ivory },
  en: { fontFace: F.latin, color: C.goldSoft },
  es: { fontFace: F.latin, color: C.mist },
};

export function newDeck() {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  pres.author = 'Evergreen Church';
  pres.title = 'Ice Breaker — 2026 Evergreen Summer Retreat';
  return pres;
}

/** 어두운 바탕 + 상단 라벨 + 하단 괘선/푸터. 매 슬라이드 공통. */
export function frame(pres, { eyebrow, pageNo, total }) {
  const s = pres.addSlide();
  s.background = { color: C.pine };

  s.addText(eyebrow, {
    x: M, y: 0.38, w: 7, h: 0.4,
    fontFace: F.sans, fontSize: 12, bold: true, color: C.gold, charSpacing: 4,
  });
  s.addText('Blessed Encounter · 복된 만남 · Encuentro Bendito', {
    x: W - M - 7, y: 0.38, w: 7, h: 0.4, align: 'right',
    fontFace: F.latin, fontSize: 13, italic: true, color: C.mistDim,
  });

  s.addShape(pres.ShapeType.line, {
    x: M, y: 6.85, w: W - 2 * M, h: 0,
    line: { color: C.goldSoft, width: 0.75, transparency: 60 },
  });
  s.addText('2026 Evergreen Church Summer Retreat · Ice Breaker', {
    x: M, y: 6.92, w: 8, h: 0.35,
    fontFace: F.sans, fontSize: 10, color: C.mistDim,
  });
  if (pageNo) {
    s.addText(`${pageNo} / ${total}`, {
      x: W - M - 2, y: 6.92, w: 2, h: 0.35, align: 'right',
      fontFace: F.latin, fontSize: 10, color: C.mistDim,
    });
  }
  return s;
}

/** 세 언어 헤드라인 세트 — 한국어 크게, 영어·스페인어 순서로. */
export function headline(s, { ko, en, es }, { x, y, w, scale = 1, sizes = {} }) {
  const koSize = sizes.ko ?? 44 * scale;
  const enSize = sizes.en ?? 32 * scale;
  const esSize = sizes.es ?? 28 * scale;
  s.addText(ko, {
    x, y, w, h: 1.05 * scale,
    ...LANG.ko, fontSize: koSize, bold: true, valign: 'bottom',
  });
  s.addText(en, {
    x, y: y + 1.1 * scale, w, h: 0.7 * scale,
    ...LANG.en, fontSize: enSize, valign: 'top',
  });
  s.addText(es, {
    x, y: y + 1.8 * scale, w, h: 0.65 * scale,
    ...LANG.es, fontSize: esSize, valign: 'top',
  });
}

/** 세 언어 본문 한 묶음 — 문단 3개, 같은 순서. */
export function trilingual(s, { ko, en, es }, { x, y, w, h, size = 20, gap = 10 }) {
  s.addText(
    [
      { text: ko, options: { fontFace: F.sans, color: C.ivory, fontSize: size, breakLine: true, paraSpaceAfter: gap } },
      { text: en, options: { fontFace: F.sans, color: C.goldSoft, fontSize: size - 2, breakLine: true, paraSpaceAfter: gap } },
      { text: es, options: { fontFace: F.sans, color: C.mist, fontSize: size - 2 } },
    ],
    { x, y, w, h, valign: 'top', lineSpacingMultiple: 1.15 },
  );
}

/**
 * 진행 단계 슬라이드: 왼쪽에 라운드 표지(작은 라벨 + 큰 숫자), 오른쪽에 세 언어 제목 + 안내문.
 * big 이 없으면 라벨만 둔다.
 */
export function stepSlide(pres, meta, { kicker, big, title, body, cueLine }) {
  const s = frame(pres, meta);
  const colX = 3.95;

  s.addText(kicker, {
    x: M, y: 1.55, w: 2.9, h: 0.4,
    fontFace: F.latin, fontSize: 18, color: C.gold, charSpacing: 3,
  });
  if (big) {
    s.addText(big, {
      x: M, y: 1.9, w: 2.9, h: 2.3,
      fontFace: F.latin, fontSize: big.length > 2 ? 96 : 150, bold: true, color: C.ivory, valign: 'top',
    });
  }
  s.addShape(pres.ShapeType.line, {
    x: colX - 0.4, y: 1.6, w: 0, h: 4.7,
    line: { color: C.goldSoft, width: 0.75, transparency: 60 },
  });

  headline(s, title, { x: colX, y: 1.35, w: W - M - colX });
  if (body) trilingual(s, body, { x: colX, y: 4.05, w: W - M - colX, h: cueLine ? 1.75 : 2.6 });
  if (cueLine) {
    s.addText(cueLine, {
      x: colX, y: 5.85, w: W - M - colX, h: 0.7, valign: 'middle',
      fontFace: F.latin, fontSize: 26, bold: true, color: C.gold, charSpacing: 1,
    });
  }
  return s;
}

/** 규칙 2개짜리 슬라이드 — 금색 번호 원 + 세 언어. */
export function rulesSlide(pres, meta, { kicker, rules }) {
  const s = frame(pres, meta);
  s.addText(kicker, {
    x: M, y: 0.95, w: 8, h: 0.45,
    fontFace: F.latin, fontSize: 18, color: C.gold, charSpacing: 3,
  });
  // 2개면 넉넉히, 3개면 촘촘히
  const rowY = rules.length >= 3 ? [1.4, 3.15, 4.9] : [1.55, 4.15];
  const rowH = rules.length >= 3 ? 1.75 : 2.45;
  rules.forEach((r, i) => {
    const y = rowY[i];
    s.addShape(pres.ShapeType.ellipse, {
      x: M, y: y + 0.05, w: 0.85, h: 0.85, fill: { color: C.gold }, line: { color: C.gold },
    });
    s.addText(String(r.n), {
      x: M, y: y + 0.05, w: 0.85, h: 0.85, align: 'center', valign: 'middle',
      fontFace: F.latin, fontSize: 30, bold: true, color: C.pineDeep,
    });
    s.addText(
      [
        { text: r.ko, options: { ...LANG.ko, fontSize: 28, bold: true, breakLine: true, paraSpaceAfter: 8 } },
        { text: r.en, options: { fontFace: F.sans, color: C.goldSoft, fontSize: 19, breakLine: true, paraSpaceAfter: 6 } },
        { text: r.es, options: { fontFace: F.sans, color: C.mist, fontSize: 19 } },
      ],
      { x: M + 1.15, y: y - 0.05, w: W - 2 * M - 1.15, h: rowH, valign: 'top', lineSpacingMultiple: 1.1 },
    );
  });
  return s;
}

/** 구호 슬라이드 — ROCK / PAPER / SCISSORS / SHOOT! 네 칸. */
export function cueSlide(pres, meta, { kicker, items, footer, big = false }) {
  const s = frame(pres, meta);
  s.addText(kicker, {
    x: M, y: 0.95, w: 10, h: 0.45,
    fontFace: F.latin, fontSize: 18, color: C.gold, charSpacing: 3,
  });
  const n = items.length;
  const gap = 0.25;
  const cw = (W - 2 * M - gap * (n - 1)) / n;
  const top = 1.6;
  const icon = big ? 1.7 : 1.4; // 이모지 PNG 한 변(in)
  const boxH = big ? 3.75 : 3.55;
  items.forEach((it, i) => {
    const x = M + i * (cw + gap);
    const isShoot = i === n - 1;
    if (isShoot) {
      s.addShape(pres.ShapeType.roundRect, {
        x, y: top - 0.15, w: cw, h: boxH, rectRadius: 0.15,
        fill: { color: C.gold }, line: { color: C.gold },
      });
    }
    s.addImage({ path: it.image, x: x + (cw - icon) / 2, y: top + 0.05, w: icon, h: icon });
    s.addText(it.word, {
      x, y: top + icon + 0.15, w: cw, h: 0.85, align: 'center', valign: 'middle',
      fontFace: F.latin, fontSize: big ? 36 : 34, bold: true,
      color: isShoot ? C.pineDeep : C.goldSoft,
    });
    if (it.sub) {
      s.addText(it.sub, {
        x, y: top + icon + 1.0, w: cw, h: 0.8, align: 'center', valign: 'top',
        fontFace: F.sans, fontSize: 16, color: isShoot ? C.pineDeep : C.mist, lineSpacingMultiple: 1.2,
      });
    }
  });
  if (footer) trilingual(s, footer, { x: M, y: 5.4, w: W - 2 * M, h: 1.35, size: 20, gap: 4 });
  return s;
}

/**
 * Group Up! 라운드 슬라이드: 왼쪽에 그룹 인원(큰 숫자)과 티켓 수, 오른쪽에 세 언어 제목 + 조건 목록.
 * conditions: [{ ko, en, es }] — 각 조건이 한 줄(세 언어), 금색 번호 원.
 */
export function roundSlide(pres, meta, { kicker, size, tickets, ticketIcon, title, conditions, note, music, musicIcon }) {
  const s = frame(pres, meta);
  const colX = 3.95;

  s.addText(kicker, {
    x: M, y: 1.5, w: 2.9, h: 0.4,
    fontFace: F.latin, fontSize: 18, color: C.gold, charSpacing: 3,
  });
  s.addText(String(size), {
    x: M, y: 1.75, w: 2.9, h: 1.9,
    fontFace: F.latin, fontSize: 132, bold: true, color: C.ivory, valign: 'top',
  });
  s.addText(
    [
      { text: '명씩', options: { fontFace: F.ko, color: C.ivory, fontSize: 22, bold: true, breakLine: true } },
      { text: 'per group · por grupo', options: { fontFace: F.sans, color: C.mistDim, fontSize: 13 } },
    ],
    { x: M, y: 3.65, w: 2.9, h: 0.8, valign: 'top', lineSpacingMultiple: 1.1 },
  );
  if (tickets !== undefined) {
    // tickets: 숫자면 크게 표시, null 이면 "MC 발표" (라운드 순서를 현장에서 고르는 경우)
    const ty = 4.75;
    s.addShape(pres.ShapeType.roundRect, {
      x: M, y: ty, w: 2.9, h: 1.55, rectRadius: 0.12, fill: { color: C.gold }, line: { color: C.gold },
    });
    if (ticketIcon) s.addImage({ path: ticketIcon, x: M + 0.2, y: ty + 0.35, w: 0.85, h: 0.85 });
    s.addText(tickets == null ? 'MC' : String(tickets), {
      x: M + 1.1, y: ty + 0.05, w: 1.7, h: 1.0, align: 'center', valign: 'middle',
      fontFace: F.latin, fontSize: tickets == null ? 40 : 54, bold: true, color: C.pineDeep,
    });
    s.addText(tickets == null ? '티켓 수는 MC 발표 · tickets: MC' : '티켓 · tickets · boletos', {
      x: M, y: ty + 1.05, w: 2.9, h: 0.4, align: 'center',
      fontFace: F.sans, fontSize: 12, color: C.pineDeep,
    });
  }
  s.addShape(pres.ShapeType.line, {
    x: colX - 0.4, y: 1.6, w: 0, h: 4.7,
    line: { color: C.goldSoft, width: 0.75, transparency: 60 },
  });

  headline(s, title, { x: colX, y: 1.3, w: W - M - colX, scale: 0.85 });

  const n = conditions.length;
  const top = 3.55;
  const rowH = n >= 3 ? 0.8 : 1.0;
  conditions.forEach((c, i) => {
    const y = top + i * rowH;
    s.addShape(pres.ShapeType.ellipse, {
      x: colX, y: y + 0.08, w: 0.5, h: 0.5, fill: { color: C.gold }, line: { color: C.gold },
    });
    s.addText(String(i + 1), {
      x: colX, y: y + 0.08, w: 0.5, h: 0.5, align: 'center', valign: 'middle',
      fontFace: F.latin, fontSize: 18, bold: true, color: C.pineDeep,
    });
    s.addText(
      [
        { text: c.ko, options: { fontFace: F.sans, color: C.ivory, fontSize: n >= 3 ? 19 : 23, bold: true, breakLine: true } },
        { text: `${c.en}   ·   ${c.es}`, options: { fontFace: F.sans, color: C.goldSoft, fontSize: n >= 3 ? 13 : 15 } },
      ],
      { x: colX + 0.7, y, w: W - M - colX - 0.7, h: rowH, valign: 'top', lineSpacingMultiple: 1.05 },
    );
  });
  if (note) {
    s.addText(note, {
      x: colX, y: 5.6, w: W - M - colX, h: 0.4,
      fontFace: F.sans, fontSize: 12, italic: true, color: C.mistDim,
    });
  }
  if (music) {
    // 음악이 나오는 동안 할 미션 — 조건과 구분되게 어두운 띠 + 음표 아이콘
    const my = 6.05;
    s.addShape(pres.ShapeType.roundRect, {
      x: colX, y: my, w: W - M - colX, h: 0.7, rectRadius: 0.1,
      fill: { color: C.pineDeep }, line: { color: C.goldSoft, width: 0.75, transparency: 40 },
    });
    if (musicIcon) s.addImage({ path: musicIcon, x: colX + 0.15, y: my + 0.17, w: 0.36, h: 0.36 });
    s.addText(
      [
        { text: music.ko, options: { fontFace: F.sans, color: C.ivory, fontSize: 14, bold: true } },
        { text: `   ${music.en} · ${music.es}`, options: { fontFace: F.sans, color: C.goldSoft, fontSize: 12 } },
      ],
      { x: colX + 0.6, y: my, w: W - M - colX - 0.7, h: 0.7, valign: 'middle', lineSpacingMultiple: 1.05 },
    );
  }
  return s;
}

// ───────────────────────────── Game 03 · Who Is It? ─────────────────────────────

/** 왼쪽 세로 기둥: 라벨 + 큰 "?" + 진행 표시. 힌트 슬라이드들이 공유. */
function personColumn(pres, s, { kicker, mark = '?', progress }) {
  s.addText(kicker, {
    x: M, y: 1.5, w: 2.9, h: 0.4,
    fontFace: F.latin, fontSize: 18, color: C.gold, charSpacing: 3,
  });
  s.addText(mark, {
    x: M, y: 1.8, w: 2.9, h: 2.6, align: 'center',
    fontFace: F.latin, fontSize: 190, bold: true, color: C.ivory, valign: 'top',
  });
  if (progress) {
    // 힌트 진행 점: 지난 것·현재는 금색, 남은 것은 윤곽선
    const { current, total } = progress;
    const d = 0.28, gap = 0.14;
    const x0 = M + (2.9 - (total * d + (total - 1) * gap)) / 2;
    for (let i = 0; i < total; i++) {
      const on = i < current;
      s.addShape(pres.ShapeType.ellipse, {
        x: x0 + i * (d + gap), y: 4.75, w: d, h: d,
        fill: on ? { color: C.gold } : { color: C.pine },
        line: { color: C.gold, width: 1 },
      });
    }
    s.addText(`HINT ${current} / ${total}`, {
      x: M, y: 5.1, w: 2.9, h: 0.4, align: 'center',
      fontFace: F.latin, fontSize: 14, color: C.mistDim, charSpacing: 2,
    });
  }
  s.addShape(pres.ShapeType.line, {
    x: 3.95 - 0.4, y: 1.6, w: 0, h: 4.7,
    line: { color: C.goldSoft, width: 0.75, transparency: 60 },
  });
}

/**
 * 힌트 슬라이드: 이전 힌트는 위에 작게(흐리게) 쌓이고, 현재 힌트는 아래에 세 언어로 크게.
 * hints: [{ ko, en, es }] 전체, current: 1부터.
 */
export function hintSlide(pres, meta, { kicker, hints, current }) {
  const s = frame(pres, meta);
  personColumn(pres, s, { kicker, progress: { current, total: hints.length } });
  const colX = 3.95, cw = W - M - colX;

  s.addText('HINT · 힌트 · PISTA', {
    x: colX, y: 0.95, w: 8, h: 0.45,
    fontFace: F.latin, fontSize: 18, color: C.gold, charSpacing: 3,
  });

  // 이전 힌트(흐리게 누적): 개수가 많아질수록 한 행을 낮게 — 7개 힌트까지 수용
  const prev = current - 1;
  const prevH = prev >= 6 ? 0.45 : prev >= 5 ? 0.5 : prev >= 3 ? 0.6 : 0.72;
  const prevKo = prev >= 5 ? 12 : prev >= 3 ? 13 : 15;
  let y = prev >= 6 ? 1.38 : 1.45;
  for (let i = 0; i < prev; i++) {
    const h = hints[i];
    // 영어+스페인어가 한 줄에 안 들어갈 만큼 길면 두 줄로 나누고 행을 조금 높인다
    const split = (h.en.length + h.es.length) > 105;
    const rowH = prevH + (split ? prevH * 0.36 : 0);
    s.addShape(pres.ShapeType.ellipse, {
      x: colX, y: y + 0.06, w: 0.36, h: 0.36, fill: { color: C.pine }, line: { color: C.goldSoft, width: 1 },
    });
    s.addText(String(i + 1), {
      x: colX, y: y + 0.06, w: 0.36, h: 0.36, align: 'center', valign: 'middle',
      fontFace: F.latin, fontSize: 12, bold: true, color: C.goldSoft,
    });
    const sub = { fontFace: F.sans, color: C.mistDim, fontSize: prevKo - 3 };
    s.addText(
      [
        { text: h.ko, options: { fontFace: F.sans, color: C.mist, fontSize: prevKo, breakLine: true } },
        ...(split
          ? [{ text: h.en, options: { ...sub, breakLine: true } }, { text: h.es, options: sub }]
          : [{ text: `${h.en}   ·   ${h.es}`, options: sub }]),
      ],
      { x: colX + 0.55, y, w: cw - 0.55, h: rowH, valign: 'top', lineSpacingMultiple: 1.0 },
    );
    y += rowH;
  }

  // 현재 힌트 — 남은 높이를 전부 쓴다
  const h = hints[current - 1];
  const top = y + (current > 1 ? (prev >= 6 ? 0.1 : 0.2) : 0);
  const avail = 6.65 - top;
  // 위에 쌓인 것이 많을수록 작게 (3단계)
  const sz = prev <= 1 ? [34, 22, 20] : prev <= 4 ? [28, 19, 17] : prev <= 5 ? [24, 17, 15] : [22, 16, 14];
  s.addShape(pres.ShapeType.ellipse, {
    x: colX, y: top + 0.12, w: 0.7, h: 0.7, fill: { color: C.gold }, line: { color: C.gold },
  });
  s.addText(String(current), {
    x: colX, y: top + 0.12, w: 0.7, h: 0.7, align: 'center', valign: 'middle',
    fontFace: F.latin, fontSize: 26, bold: true, color: C.pineDeep,
  });
  s.addText(
    [
      { text: h.ko, options: { ...LANG.ko, fontSize: sz[0], bold: true, breakLine: true, paraSpaceAfter: prev >= 5 ? 8 : 14 } },
      { text: h.en, options: { fontFace: F.sans, color: C.goldSoft, fontSize: sz[1], breakLine: true, paraSpaceAfter: prev >= 5 ? 4 : 8 } },
      { text: h.es, options: { fontFace: F.sans, color: C.mist, fontSize: sz[2] } },
    ],
    { x: colX + 0.95, y: top, w: cw - 0.95, h: avail, valign: 'top', lineSpacingMultiple: 1.15 },
  );
  return s;
}

/** 사진 힌트 슬라이드: 어릴 적 사진 한 장을 가능한 한 크게(전체 폭). photo: { path, ratio(w/h) } */
export function photoSlide(pres, meta, { kicker, current, total, title, photo }) {
  const s = frame(pres, meta);
  s.addText(kicker, {
    x: M, y: 0.95, w: 4, h: 0.45,
    fontFace: F.latin, fontSize: 18, color: C.gold, charSpacing: 3,
  });
  s.addText(
    [
      { text: `HINT ${current} / ${total}   `, options: { fontFace: F.latin, color: C.gold, fontSize: 16, charSpacing: 2 } },
      { text: title.ko, options: { ...LANG.ko, fontSize: 22, bold: true } },
      { text: `   ${title.en} · ${title.es}`, options: { fontFace: F.sans, color: C.goldSoft, fontSize: 14 } },
    ],
    { x: 4.6, y: 0.95, w: W - M - 4.6, h: 0.45, align: 'right', valign: 'middle' },
  );
  const top = 1.5, maxH = 6.7 - top, maxW = W - 2 * M;
  let h = maxH, w = h * photo.ratio;
  if (w > maxW) { w = maxW; h = w / photo.ratio; }
  const x = M + (maxW - w) / 2, y = top + (maxH - h) / 2;
  s.addShape(pres.ShapeType.rect, {
    x: x - 0.08, y: y - 0.08, w: w + 0.16, h: h + 0.16, fill: { color: C.ivory }, line: { color: C.ivory },
  });
  s.addImage({ path: photo.path, x, y, w, h });
  return s;
}

/** 정답 공개: 왼쪽 큰 사진(아이보리 테두리) + 오른쪽 이름 세 언어 + 박수 유도. */
export function revealSlide(pres, meta, { kicker, photo, name, cheer }) {
  const s = frame(pres, meta);
  s.addText(kicker, {
    x: M, y: 0.95, w: 10, h: 0.45,
    fontFace: F.latin, fontSize: 18, color: C.gold, charSpacing: 3,
  });
  const top = 1.55, maxH = 6.65 - top, maxW = 6.0;
  let h = maxH, w = h * photo.ratio;
  if (w > maxW) { w = maxW; h = w / photo.ratio; }
  const y = top + (maxH - h) / 2;
  s.addShape(pres.ShapeType.rect, {
    x: M - 0.08, y: y - 0.08, w: w + 0.16, h: h + 0.16, fill: { color: C.ivory }, line: { color: C.ivory },
  });
  s.addImage({ path: photo.path, x: M, y, w, h });

  const tx = M + w + 0.6, tw = W - M - tx;
  s.addText('IT’S…', {
    x: tx, y: 1.7, w: tw, h: 0.6,
    fontFace: F.latin, fontSize: 30, italic: true, color: C.goldSoft,
  });
  s.addText(name.ko, {
    x: tx, y: 2.3, w: tw, h: 1.5,
    fontFace: F.ko, fontSize: name.ko.length > 7 ? 38 : 46, bold: true, color: C.ivory, valign: 'top',
  });
  s.addText(
    [
      { text: name.en, options: { fontFace: F.latin, color: C.goldSoft, fontSize: 26, breakLine: true, paraSpaceAfter: 6 } },
      { text: name.es, options: { fontFace: F.latin, color: C.mist, fontSize: 22 } },
    ],
    { x: tx, y: 3.85, w: tw, h: 1.4, valign: 'top', lineSpacingMultiple: 1.1 },
  );
  if (cheer) {
    s.addShape(pres.ShapeType.roundRect, {
      x: tx, y: 5.55, w: tw, h: 1.0, rectRadius: 0.12, fill: { color: C.gold }, line: { color: C.gold },
    });
    s.addText(
      [
        { text: cheer.ko, options: { fontFace: F.ko, color: C.pineDeep, fontSize: 22, bold: true, breakLine: true } },
        { text: `${cheer.en} · ${cheer.es}`, options: { fontFace: F.latin, color: C.pineDeep, fontSize: 14 } },
      ],
      { x: tx, y: 5.55, w: tw, h: 1.0, align: 'center', valign: 'middle', lineSpacingMultiple: 1.05 },
    );
  }
  return s;
}

// ───────────────────────────── Game 04 · Generations Challenge ─────────────────────────────

/** 문제 슬라이드(설명자용): 상단 팀/번호 + 카테고리, 가운데 세 언어 정답 단어 아주 크게. */
export function promptSlide(pres, meta, { team, n, total, heading, category, prompt }) {
  const s = frame(pres, meta);
  s.addText(heading ?? `TEAM ${team}  ·  ${n} / ${total}`, {
    x: M, y: 0.95, w: 6, h: 0.5,
    fontFace: F.latin, fontSize: 20, color: C.gold, charSpacing: 3,
  });
  s.addText(
    [
      { text: category.ko, options: { fontFace: F.sans, color: C.goldSoft, fontSize: 18, bold: true } },
      { text: `  ·  ${category.en}  ·  ${category.es}`, options: { fontFace: F.sans, color: C.mistDim, fontSize: 14 } },
    ],
    { x: 5.5, y: 0.95, w: W - M - 5.5, h: 0.5, align: 'right', valign: 'middle' },
  );
  const koSize = prompt.ko.length > 10 ? 60 : prompt.ko.length > 6 ? 76 : 96;
  s.addText(prompt.ko, {
    x: M, y: 1.7, w: W - 2 * M, h: 2.6, align: 'center', valign: 'middle',
    fontFace: F.ko, fontSize: koSize, bold: true, color: C.ivory,
  });
  s.addText(prompt.en, {
    x: M, y: 4.35, w: W - 2 * M, h: 0.95, align: 'center', valign: 'middle',
    fontFace: F.latin, fontSize: prompt.en.length > 24 ? 36 : 44, color: C.goldSoft,
  });
  s.addText(prompt.es, {
    x: M, y: 5.3, w: W - 2 * M, h: 0.8, align: 'center', valign: 'middle',
    fontFace: F.latin, fontSize: prompt.es.length > 28 ? 26 : 32, color: C.mist,
  });
  s.addText('정답자는 화면을 보지 않습니다 · Guessers face away · Los adivinadores no miran', {
    x: M, y: 6.3, w: W - 2 * M, h: 0.4, align: 'center',
    fontFace: F.sans, fontSize: 12, italic: true, color: C.mistDim,
  });
  return s;
}

/** 큰 단어 한 장(팀 시작·시간 종료 등): 왼쪽 이미지, 가운데 큰 글자 + 세 언어 한 줄씩. */
export function bigWordSlide(pres, meta, { kicker, image, big, bigSize = 110, lines, sub }) {
  const s = frame(pres, meta);
  s.addText(kicker, {
    x: M, y: 0.95, w: 10, h: 0.45,
    fontFace: F.latin, fontSize: 18, color: C.gold, charSpacing: 3,
  });
  if (image) s.addImage({ path: image, x: M + 0.2, y: 2.0, w: 2.4, h: 2.4 });
  const tx = image ? 3.6 : M, tw = W - M - tx;
  s.addText(big, {
    x: tx, y: 1.45, w: tw, h: 2.2, valign: 'middle',
    fontFace: F.latin, fontSize: bigSize, bold: true, color: C.ivory,
  });
  if (lines) trilingual(s, lines, { x: tx, y: 3.8, w: tw, h: 1.9, size: 22, gap: 4 });
  if (sub) {
    s.addText(sub, {
      x: tx, y: 5.8, w: tw, h: 0.7, valign: 'middle',
      fontFace: F.latin, fontSize: 28, bold: true, color: C.gold, charSpacing: 1,
    });
  }
  return s;
}
