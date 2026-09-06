// 주일 점심 식사 테이블 — 이름표 QR 일정 페이지(/schedule)에 점심시간까지 임시 노출.
// 순수 로직만. 명단 데이터는 lunch-groups-data.ts (식사 후 삭제 예정).

export interface LunchPerson {
  ko: string | null; // 한글 이름(직분 포함 가능). 없으면 null
  en: string; // 영문 표기 (항상 있음)
  tag?: string; // 부가 표시 (예: babysitter)
}

export interface LunchGroup {
  table: number;
  sub?: string; // 부제 (Moms & Children, Gideon-20 …)
  people: LunchPerson[];
}

export interface LunchPersonFlat extends LunchPerson {
  table: number;
  sub?: string;
}

// 점심 테이블 노출 마감 — 뉴욕 시각 2026-09-06 13:00 (성경공부 2 시작). 이 시각 이후 /schedule 은
// 원래 일정으로 자동 복귀. 즉시 해제하려면 과거 시각으로 바꿔 배포.
export const LUNCH_GROUPS_UNTIL = new Date("2026-09-06T13:00:00-04:00");

export function isLunchGroupsActive(now: Date): boolean {
  return now.getTime() < LUNCH_GROUPS_UNTIL.getTime();
}

export function flattenPeople(groups: LunchGroup[]): LunchPersonFlat[] {
  return groups.flatMap((g) =>
    g.people.map((p) => ({ ...p, table: g.table, ...(g.sub ? { sub: g.sub } : {}) })),
  );
}

const koCollator = new Intl.Collator("ko");
const enCollator = new Intl.Collator("en", { sensitivity: "base" });

// ko: 한글 이름 가나다순, 한글 없는 사람은 뒤에 영문 A→Z. 그 외 로케일: 영문 표기 A→Z.
export function sortByName(people: LunchPersonFlat[], locale: string): LunchPersonFlat[] {
  const sorted = [...people];
  if (locale === "ko") {
    sorted.sort((a, b) => {
      if (a.ko && b.ko) return koCollator.compare(a.ko, b.ko);
      if (a.ko) return -1;
      if (b.ko) return 1;
      return enCollator.compare(a.en, b.en);
    });
  } else {
    sorted.sort((a, b) => enCollator.compare(a.en, b.en));
  }
  return sorted;
}

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, "");

export function filterPeople(people: LunchPersonFlat[], query: string): LunchPersonFlat[] {
  const q = norm(query);
  if (!q) return people;
  return people.filter((p) => norm(p.en).includes(q) || (p.ko ? norm(p.ko).includes(q) : false));
}
