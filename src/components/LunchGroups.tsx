"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import {
  flattenPeople,
  sortByName,
  filterPeople,
  isLunchGroupsActive,
  type LunchGroup,
  type LunchPersonFlat,
} from "@/lib/lunch-groups";

// 이름표 QR(/schedule)로 들어온 성도에게 점심시간까지 임시로 보여주는 주일 점심 테이블 명단.
// 탭: 테이블별 / 이름순 + 검색. 마감 시각이 지나면 서버가 원래 일정을 내려주도록 새로고침한다.
export function LunchGroups({ groups }: { groups: LunchGroup[] }) {
  const locale = useLocale();
  const t = useTranslations("Lunch");
  const tCommon = useTranslations("Common");
  const tHome = useTranslations("Home");
  const router = useRouter();

  const [view, setView] = useState<"table" | "name">("table");
  const [query, setQuery] = useState("");

  const flat = useMemo(() => flattenPeople(groups), [groups]);
  const byName = useMemo(() => sortByName(flat, locale), [flat, locale]);
  const results = useMemo(() => filterPeople(byName, query), [byName, query]);
  const searching = query.trim().length > 0;
  const total = flat.length;

  // 화면을 켜 둔 채 마감을 넘기면 서버 렌더를 다시 받아 일정으로 복귀
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isLunchGroupsActive(new Date())) router.refresh();
    }, 60_000);
    return () => clearInterval(timer);
  }, [router]);

  const localeLabel: Record<string, string> = {
    ko: tCommon("langKo"),
    en: tCommon("langEn"),
    es: tCommon("langEs"),
  };

  const tableLabel = (n: number) => t("tableLabel", { n });

  const personName = (p: LunchPersonFlat) => (
    <span className="min-w-0 flex-1 leading-snug">
      {p.ko ? (
        <>
          <span className="font-semibold text-bark">{p.ko}</span>
          <span className="mx-1.5 text-line">/</span>
          <span className="text-bark-soft">{p.en}</span>
        </>
      ) : (
        <span className="font-semibold text-bark">{p.en}</span>
      )}
      {p.tag && <span className="ml-1.5 text-xs text-bark-soft/70">({p.tag})</span>}
    </span>
  );

  return (
    <main className="flex-1 pb-16">
      <header className="sticky top-0 z-20 border-b border-gold/25 bg-pine text-ivory shadow-sm">
        <div className="mx-auto max-w-2xl px-4 py-3 sm:px-6">
          <p className="font-display text-lg font-bold leading-tight text-gold-soft sm:text-xl">
            {tHome("theme")}
          </p>
          <p className="mt-0.5 text-[13px] leading-snug text-ivory/75">
            {tHome("dates")}
            <span className="hidden sm:inline"> · {tHome("location")}</span>
          </p>
          <nav aria-label={t("otherLanguages")} className="mt-2.5 flex flex-wrap gap-1.5">
            {routing.locales.map((loc) => {
              const current = loc === locale;
              return (
                <Link
                  key={loc}
                  href="/schedule"
                  locale={loc}
                  aria-current={current ? "page" : undefined}
                  className={`rounded-full px-3 py-1 text-[13px] font-semibold transition ${
                    current
                      ? "bg-gold text-pine-deep"
                      : "border border-ivory/30 text-ivory/85 hover:bg-white/10"
                  }`}
                >
                  {localeLabel[loc]}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <h1 className="font-display-ko text-2xl font-bold text-pine sm:text-3xl">{t("title")}</h1>
        <p className="mt-1 text-sm text-bark-soft">{t("subtitle")}</p>
        <p className="mt-3 rounded-xl bg-cream px-4 py-3 text-[15px] leading-snug text-bark ring-1 ring-gold/30">
          {t("notice")}
        </p>

        {/* 검색 — 자기 이름을 바로 찾는 가장 빠른 길 */}
        <label className="mt-5 block">
          <span className="sr-only">{t("searchPlaceholder")}</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            autoComplete="off"
            className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[17px] text-bark shadow-sm outline-none ring-moss/40 placeholder:text-bark-soft/50 focus:border-moss focus:ring-2"
          />
        </label>

        {searching ? (
          <section className="mt-4" aria-live="polite">
            <p className="text-xs font-semibold uppercase tracking-wide text-bark-soft/60">
              {t("results", { n: results.length })}
            </p>
            {results.length === 0 ? (
              <p className="mt-3 rounded-2xl bg-white/70 px-5 py-8 text-center text-bark-soft ring-1 ring-line">
                {t("noResults")}
              </p>
            ) : (
              <ul className="mt-2 divide-y divide-line rounded-2xl bg-white/80 ring-1 ring-line">
                {results.map((p, i) => (
                  <li key={`${p.table}-${p.en}-${i}`} className="flex items-center gap-3 px-4 py-3">
                    {personName(p)}
                    <span className="shrink-0 rounded-full bg-moss px-3 py-1 text-sm font-bold tabular-nums text-white">
                      {tableLabel(p.table)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ) : (
          <>
            <div
              role="tablist"
              className="mt-5 grid grid-cols-2 rounded-xl bg-pine/8 p-1 text-sm font-semibold"
            >
              {(["table", "name"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  role="tab"
                  aria-selected={view === v}
                  onClick={() => setView(v)}
                  className={`rounded-lg px-3 py-2 transition ${
                    view === v ? "bg-pine text-ivory shadow" : "text-pine hover:bg-white/60"
                  }`}
                >
                  {v === "table" ? t("tabByTable") : t("tabByName")}
                </button>
              ))}
            </div>

            {view === "table" ? (
              <div className="mt-4 space-y-4">
                {groups.map((g) => (
                  <section
                    key={g.table}
                    id={`table-${g.table}`}
                    className="rounded-2xl border border-line border-t-4 border-t-pine bg-white/80 px-4 py-3.5"
                  >
                    <header className="flex items-baseline gap-2">
                      <h2 className="font-display-ko text-xl font-bold text-pine">
                        {tableLabel(g.table)}
                      </h2>
                      {g.sub && <span className="text-sm font-semibold text-gold">{g.sub}</span>}
                      <span className="ml-auto text-xs text-bark-soft/70">
                        {t("count", { n: g.people.length })}
                      </span>
                    </header>
                    <ol className="mt-2 divide-y divide-line/70">
                      {g.people.map((p, i) => (
                        <li key={`${p.en}-${i}`} className="flex items-baseline gap-2.5 py-1.5 text-[15px]">
                          <span className="w-5 shrink-0 text-right text-xs tabular-nums text-bark-soft/60">
                            {i + 1}
                          </span>
                          {personName({ ...p, table: g.table })}
                        </li>
                      ))}
                    </ol>
                  </section>
                ))}
              </div>
            ) : (
              <ul className="mt-4 divide-y divide-line rounded-2xl bg-white/80 ring-1 ring-line">
                {byName.map((p, i) => (
                  <li key={`${p.table}-${p.en}-${i}`} className="flex items-center gap-3 px-4 py-2.5 text-[15px]">
                    {personName(p)}
                    <span className="shrink-0 rounded-full bg-pine/10 px-2.5 py-0.5 text-sm font-bold tabular-nums text-pine">
                      {tableLabel(p.table)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        <footer className="mt-10 space-y-4 border-t border-line pt-6 text-sm">
          <p className="text-xs text-bark-soft/70">{t("total", { tables: groups.length, n: total })}</p>
          <Link
            href={{ pathname: "/schedule", query: { view: "schedule" } }}
            className="inline-block font-semibold text-moss underline decoration-moss/40 underline-offset-4 hover:text-pine"
          >
            {t("viewSchedule")} →
          </Link>
        </footer>
      </div>
    </main>
  );
}
