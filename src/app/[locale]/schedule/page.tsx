import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { PublicSchedule } from "@/components/PublicSchedule";
import { LunchGroups } from "@/components/LunchGroups";
import { isLunchGroupsActive } from "@/lib/lunch-groups";
import { LUNCH_GROUPS } from "@/lib/lunch-groups-data";
import type { ScheduleItem } from "@/lib/types";

// 이름표 QR 전용 언어별 일정 페이지.
//   ko → /schedule · en → /en/schedule · es → /es/schedule
// (site) 라우트 그룹 밖이라 사이트 헤더/푸터 없이 렌더된다. 홈의 #schedule 섹션은 그대로.
//
// ⏱ 임시(2026-09-06 주일 13:00 뉴욕 시각까지): 같은 URL에서 주일 점심 식사 테이블 명단을 대신 보여준다.
//   ?view=schedule 이면 기간 중에도 일정. 식사 후 LunchGroups/lunch-groups-data 와 함께 제거.

type SearchParams = Promise<{ view?: string | string[] }>;

async function showLunch(searchParams: SearchParams): Promise<boolean> {
  if (!isLunchGroupsActive(new Date())) return false;
  const { view } = await searchParams;
  return view !== "schedule";
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { locale } = await params;
  if (await showLunch(searchParams)) {
    const tl = await getTranslations({ locale, namespace: "Lunch" });
    return { title: tl("metaTitle"), description: tl("title") };
  }
  const t = await getTranslations({ locale, namespace: "Schedule" });
  return {
    title: t("qrMetaTitle"),
    description: t("pageTitle"),
  };
}

export default async function SchedulePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: SearchParams;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  if (await showLunch(searchParams)) {
    return <LunchGroups groups={LUNCH_GROUPS} />;
  }

  const supabase = await createClient();
  // 공개엔 owner/admin_note(관리자 전용) 미노출 — 명시적 컬럼만 선택 (홈 쿼리와 동일)
  const { data } = await supabase
    .from("schedule_items")
    .select(
      "id, day, start_time, title, title_en, title_es, description, description_en, description_es, location, location_en, location_es, sort_order, by_language, created_at",
    )
    .order("day")
    .order("start_time")
    .order("sort_order");

  return <PublicSchedule items={(data as ScheduleItem[] | null) ?? []} />;
}
