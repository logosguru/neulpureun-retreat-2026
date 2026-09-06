import { test } from "node:test";
import assert from "node:assert/strict";
import {
  flattenPeople,
  sortByName,
  filterPeople,
  isLunchGroupsActive,
  type LunchGroup,
} from "./lunch-groups.ts";

const groups: LunchGroup[] = [
  {
    table: 1,
    people: [
      { ko: "정의정", en: "Euijung Jung" },
      { ko: null, en: "Kevin Kim" },
      { ko: "구본윤", en: "Bonyoon Koo" },
    ],
  },
  {
    table: 2,
    sub: "Gideon-20",
    people: [
      { ko: "박영민", en: "Youngmin Park" },
      { ko: null, en: "Anna Bell", tag: "babysitter" },
    ],
  },
];

test("flattenPeople: 테이블 번호·부제를 사람마다 붙인다", () => {
  const flat = flattenPeople(groups);
  assert.equal(flat.length, 5);
  assert.deepEqual(flat[3], {
    ko: "박영민",
    en: "Youngmin Park",
    table: 2,
    sub: "Gideon-20",
  });
  assert.equal(flat[4].tag, "babysitter");
});

test("sortByName ko: 한글 가나다순, 영문만 있는 사람은 뒤에 A→Z", () => {
  const names = sortByName(flattenPeople(groups), "ko").map((p) => p.en);
  assert.deepEqual(names, [
    "Bonyoon Koo", // 구본윤
    "Youngmin Park", // 박영민
    "Euijung Jung", // 정의정
    "Anna Bell",
    "Kevin Kim",
  ]);
});

test("sortByName en: 영문 표기 그대로 A→Z (대소문자 무시)", () => {
  const names = sortByName(flattenPeople(groups), "en").map((p) => p.en);
  assert.deepEqual(names, [
    "Anna Bell",
    "Bonyoon Koo",
    "Euijung Jung",
    "Kevin Kim",
    "Youngmin Park",
  ]);
});

test("filterPeople: 한글/영문 어느 쪽이든 부분 일치, 공백·대소문자 무시", () => {
  const flat = flattenPeople(groups);
  assert.deepEqual(filterPeople(flat, "kim").map((p) => p.en), ["Kevin Kim"]);
  assert.deepEqual(filterPeople(flat, "영민").map((p) => p.en), ["Youngmin Park"]);
  assert.deepEqual(filterPeople(flat, " young MIN ").map((p) => p.en), ["Youngmin Park"]);
  assert.equal(filterPeople(flat, "").length, 5);
});

test("isLunchGroupsActive: 마감(뉴욕 13:00) 전에는 true, 이후엔 false", () => {
  // 2026-09-06 12:59 EDT = 16:59Z, 13:00 EDT = 17:00Z
  assert.equal(isLunchGroupsActive(new Date("2026-09-06T16:59:00Z")), true);
  assert.equal(isLunchGroupsActive(new Date("2026-09-06T17:00:00Z")), false);
  assert.equal(isLunchGroupsActive(new Date("2026-09-05T12:00:00Z")), true);
  assert.equal(isLunchGroupsActive(new Date("2026-09-07T12:00:00Z")), false);
});
