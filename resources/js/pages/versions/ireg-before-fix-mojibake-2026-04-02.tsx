import { Head, Link } from "@inertiajs/react";
import { CheckCircle2, ChevronRight, FileSpreadsheet, Globe2, Scale, ShieldCheck, Users } from "lucide-react";
import { useState } from "react";
import RankingHero from "@/components/hero/ranking-hero";

type Principle = {
  id: string;
  name: string;
  icon: typeof Globe2;
  summary: string;
  principle: string;
  iqaa: string;
  bullets: string[];
};

type ConferenceHighlight = {
  id: string;
  year: string;
  city: string;
  country: string;
  dates: string;
  title: string;
  theme: string;
  officialUrl: string;
  summary: string;
  photos: Array<{
    src: string;
    alt: string;
  }>;
};

const timeline = [
  {
    year: "2004",
    title: "Р¤РѕСЂРјРёСЂРѕРІР°РЅРёРµ IREG",
    text: "РњРµР¶РґСѓРЅР°СЂРѕРґРЅР°СЏ СЌРєСЃРїРµСЂС‚РЅР°СЏ РіСЂСѓРїРїР° РїРѕСЏРІРёР»Р°СЃСЊ РєР°Рє РїР»РѕС‰Р°РґРєР° РґР»СЏ РѕР±СЃСѓР¶РґРµРЅРёСЏ РєР°С‡РµСЃС‚РІР° Р°РєР°РґРµРјРёС‡РµСЃРєРёС… СЂРµР№С‚РёРЅРіРѕРІ Рё РЅР°РґРµР¶РЅРѕСЃС‚Рё РёС… РјРµС‚РѕРґРѕР»РѕРіРёРё.",
  },
  {
    year: "2006",
    title: "Р‘РµСЂР»РёРЅСЃРєРёРµ РїСЂРёРЅС†РёРїС‹",
    text: "Р’ Р‘РµСЂР»РёРЅРµ Р±С‹Р»Рё Р·Р°С„РёРєСЃРёСЂРѕРІР°РЅС‹ РїСЂРёРЅС†РёРїС‹ РґРѕР±СЂРѕСЃРѕРІРµСЃС‚РЅРѕРіРѕ СЂР°РЅР¶РёСЂРѕРІР°РЅРёСЏ: С†РµР»СЊ, РїСЂРѕР·СЂР°С‡РЅРѕСЃС‚СЊ, РєРѕСЂСЂРµРєС‚РЅС‹Р№ СЃР±РѕСЂ РґР°РЅРЅС‹С… Рё РїРѕРЅСЏС‚РЅР°СЏ РїСѓР±Р»РёРєР°С†РёСЏ СЂРµР·СѓР»СЊС‚Р°С‚РѕРІ.",
  },
  {
    year: "РЎРµРіРѕРґРЅСЏ",
    title: "РџСЂР°РєС‚РёРєР° РґР»СЏ IQAA",
    text: "РќР° СЌС‚РѕР№ СЃС‚СЂР°РЅРёС†Рµ Р°РєС†РµРЅС‚ СЃРґРµР»Р°РЅ РЅРµ РЅР° СЃС‚Р°СЂС‹С… Р±РёРѕРіСЂР°С„РёСЏС… Рё СЃРѕСЃС‚Р°РІР°С… РєРѕРјРёС‚РµС‚РѕРІ, Р° РЅР° С‚РµС… РёРґРµСЏС… IREG, РєРѕС‚РѕСЂС‹Рµ СЂРµР°Р»СЊРЅРѕ РѕР±СЉСЏСЃРЅСЏСЋС‚ Р»РѕРіРёРєСѓ СЂРµР№С‚РёРЅРіР° IQAA.",
  },
];

const conferenceHighlights: ConferenceHighlight[] = [
  {
    id: "2019",
    year: "2019",
    city: "Bologna",
    country: "Italy",
    dates: "8-10 May 2019",
    title: "IREG 2019 Conference",
    theme: "Rankings: A Challenge to Higher Education?",
    officialUrl: "https://www.ireg-observatory.org/en/ireg-2019",
    summary:
      "РќР° РѕС„РёС†РёР°Р»СЊРЅРѕРј СЃР°Р№С‚Рµ IREG СЌС‚Р° РєРѕРЅС„РµСЂРµРЅС†РёСЏ СѓРєР°Р·Р°РЅР° РєР°Рє РѕС‡РЅРѕРµ СЃРѕР±С‹С‚РёРµ РІ Р‘РѕР»РѕРЅСЊРµ. Р”Р»СЏ СЃС‚СЂР°РЅРёС†С‹ РёСЃРїРѕР»СЊР·РѕРІР°РЅС‹ РЅР°Р№РґРµРЅРЅС‹Рµ С„РѕС‚РѕРіСЂР°С„РёРё СЃ СѓС‡Р°СЃС‚РёРµРј СЂСѓРєРѕРІРѕРґСЃС‚РІР° IQAA РёРјРµРЅРЅРѕ Р·Р° СЌС‚РѕС‚ РіРѕРґ.",
    photos: [
      {
        src: "/storage/images/ireg-conferences/ireg-2019-bologna-46.jpg",
        alt: "РЈС‡Р°СЃС‚РёРµ СЂСѓРєРѕРІРѕРґСЃС‚РІР° IQAA РІ IREG 2019 Conference in Bologna, Italy",
      },
      {
        src: "/storage/images/ireg-conferences/ireg-2019-bologna-3.jpg",
        alt: "Р¤РѕС‚РѕРіСЂР°С„РёСЏ СЂСѓРєРѕРІРѕРґСЃС‚РІР° IQAA РЅР° IREG 2019 РІ Р‘РѕР»РѕРЅСЊРµ",
      },
      {
        src: "/storage/images/ireg-conferences/ireg-2019-bologna-16.jpg",
        alt: "Р“СЂСѓРїРїРѕРІР°СЏ С„РѕС‚РѕРіСЂР°С„РёСЏ СѓС‡Р°СЃС‚РЅРёРєРѕРІ IREG 2019 РІ Р‘РѕР»РѕРЅСЊРµ",
      },
    ],
  },
  {
    id: "2023",
    year: "2023",
    city: "Tashkent / Samarkand",
    country: "Uzbekistan",
    dates: "26-28 April 2023",
    title: "IREG 2023 Conference",
    theme: "Rankings and University International Exposure",
    officialUrl: "https://www.ireg-observatory.org/en/ireg-2023",
    summary:
      "РќР° РѕС„РёС†РёР°Р»СЊРЅРѕРј СЃР°Р№С‚Рµ IREG СЌС‚Р° РєРѕРЅС„РµСЂРµРЅС†РёСЏ РѕР±РѕР·РЅР°С‡РµРЅР° РєР°Рє СЃРѕР±С‹С‚РёРµ РІ РўР°С€РєРµРЅС‚Рµ Рё РЎР°РјР°СЂРєР°РЅРґРµ. Р”Р»СЏ СЃС‚СЂР°РЅРёС†С‹ РёСЃРїРѕР»СЊР·РѕРІР°РЅРѕ РЅР°Р№РґРµРЅРЅРѕРµ РїРѕРґС‚РІРµСЂР¶РґРµРЅРЅРѕРµ С„РѕС‚Рѕ СѓС‡Р°СЃС‚РёСЏ СЂСѓРєРѕРІРѕРґСЃС‚РІР° IQAA.",
    photos: [
      {
        src: "/storage/images/ireg-conferences/ireg-2023-tashkent.jpg",
        alt: "РЈС‡Р°СЃС‚РёРµ СЂСѓРєРѕРІРѕРґСЃС‚РІР° IQAA РІ IREG 2023 Conference in Tashkent and Samarkand",
      },
    ],
  },
];

const historical2010 = [
  {
    id: "warsaw-2010",
    year: "2010",
    location: "Warsaw, Poland",
    dates: "March 2010",
    title: "Inaugural IREG Observatory General Assembly",
    sourceLabel: "РђСЂС…РёРІРЅС‹Р№ РјР°С‚РµСЂРёР°Р» IREG",
    sourceUrl: "https://ireg-observatory.org/wp-content/uploads/2019/12/IREG_Berlin.pdf",
    description:
      "РСЃС‚РѕСЂРёС‡РµСЃРєРёР№ РєР°РґСЂ РёР· СЂР°РЅРЅРµРіРѕ СЌС‚Р°РїР° СЃС‚Р°РЅРѕРІР»РµРЅРёСЏ IREG Observatory. Р”Р°С‚РёСЂРѕРІРєР° Рё РєРѕРЅС‚РµРєСЃС‚ РѕРїРёСЂР°СЋС‚СЃСЏ РЅР° Р°СЂС…РёРІРЅС‹Р№ РїСЂРѕРіСЂР°РјРјРЅС‹Р№ РјР°С‚РµСЂРёР°Р» IREG, РіРґРµ СѓРїРѕРјРёРЅР°РµС‚СЃСЏ Inaugural IREG Observatory General Assembly, Warsaw, March 2010.",
    photo: {
      src: "/storage/images/ireg-conferences/ireg-2010-warsaw.jpg",
      alt: "РђСЂС…РёРІРЅРѕРµ С„РѕС‚Рѕ General Assembly Round Table IREG, Warsaw, 2010",
    },
  },
  {
    id: "berlin-2010",
    year: "2010",
    location: "Berlin, Germany",
    dates: "6-8 October 2010",
    title: "IREG-5 Conference",
    sourceLabel: "РћС„РёС†РёР°Р»СЊРЅР°СЏ СЃС‚СЂР°РЅРёС†Р° IREG 2010",
    sourceUrl: "https://www.ireg-observatory.org/en/ireg-2010",
    description:
      "РћС„РёС†РёР°Р»СЊРЅС‹Р№ СЃР°Р№С‚ IREG С„РёРєСЃРёСЂСѓРµС‚ РєРѕРЅС„РµСЂРµРЅС†РёСЋ IREG-5 РІ Р‘РµСЂР»РёРЅРµ РєР°Рє СЃРѕР±С‹С‚РёРµ 6-8 РѕРєС‚СЏР±СЂСЏ 2010 РіРѕРґР° РїРѕРґ С‚РµРјРѕР№ 'The Academic Rankings from Popularity to Reliability'.",
    photo: {
      src: "/storage/images/ireg-conferences/ireg-2010-berlin.jpg",
      alt: "РђСЂС…РёРІРЅРѕРµ С„РѕС‚Рѕ IREG-5 Conference, Berlin, 2010",
    },
  },
];

const principles: Principle[] = [
  {
    id: "purpose",
    name: "Р¦РµР»СЊ Рё Р°СѓРґРёС‚РѕСЂРёСЏ",
    icon: FileSpreadsheet,
    summary: "Р Р°РЅР¶РёСЂРѕРІР°РЅРёРµ РґРѕР»Р¶РЅРѕ Р±С‹С‚СЊ РёРЅСЃС‚СЂСѓРјРµРЅС‚РѕРј Р°РЅР°Р»РёР·Р° Рё СЃСЂР°РІРЅРµРЅРёСЏ, Р° РЅРµ РµРґРёРЅСЃС‚РІРµРЅРЅС‹Рј СЃРїРѕСЃРѕР±РѕРј РѕС†РµРЅРєРё РєР°С‡РµСЃС‚РІР°.",
    principle: "РџРѕР»СЊР·РѕРІР°С‚РµР»СЊ РґРѕР»Р¶РµРЅ РїРѕРЅРёРјР°С‚СЊ, РґР»СЏ РєРѕРіРѕ СЃРѕР·РґР°РµС‚СЃСЏ СЂРµР№С‚РёРЅРі, РєР°РєРёРµ Р·Р°РґР°С‡Рё РѕРЅ СЂРµС€Р°РµС‚ Рё РєР°Рє РєРѕСЂСЂРµРєС‚РЅРѕ С‡РёС‚Р°С‚СЊ СЂРµР·СѓР»СЊС‚Р°С‚С‹.",
    iqaa: "Р’ IQAA СЂРµР№С‚РёРЅРі СЂР°Р±РѕС‚Р°РµС‚ РєР°Рє Р°РЅР°Р»РёС‚РёС‡РµСЃРєРёР№ РёРЅСЃС‚СЂСѓРјРµРЅС‚, РєРѕС‚РѕСЂС‹Р№ РґРѕРїРѕР»РЅСЏРµС‚ Р°РєРєСЂРµРґРёС‚Р°С†РёСЋ Рё СЌРєСЃРїРµСЂС‚РЅСѓСЋ РѕС†РµРЅРєСѓ, РЅРѕ РЅРµ РїРѕРґРјРµРЅСЏРµС‚ РёС….",
    bullets: [
      "СЂРµР№С‚РёРЅРі С‡РёС‚Р°РµС‚СЃСЏ РєР°Рє Р°РЅР°Р»РёС‚РёС‡РµСЃРєРёР№ РёРЅСЃС‚СЂСѓРјРµРЅС‚, Р° РЅРµ РєР°Рє РµРґРёРЅСЃС‚РІРµРЅРЅС‹Р№ РІРµСЂРґРёРєС‚",
      "РјРµС‚СЂРёРєРё РїРѕРґР±РёСЂР°СЋС‚СЃСЏ РїРѕРґ РёРЅСЃС‚РёС‚СѓС†РёРѕРЅР°Р»СЊРЅСѓСЋ РѕС†РµРЅРєСѓ, Р° РЅРµ РїРѕРґ СЃР»СѓС‡Р°Р№РЅС‹Р№ РЅР°Р±РѕСЂ РїРѕРєР°Р·Р°С‚РµР»РµР№",
      "РїРѕР»СЊР·РѕРІР°С‚РµР»СЊ Р»СѓС‡С€Рµ РїРѕРЅРёРјР°РµС‚ РіСЂР°РЅРёС†С‹ Рё СЃРјС‹СЃР» СЂРµР·СѓР»СЊС‚Р°С‚РѕРІ",
    ],
  },
  {
    id: "diversity",
    name: "Р Р°Р·РЅРѕРѕР±СЂР°Р·РёРµ РІСѓР·РѕРІ",
    icon: Users,
    summary: "РџСЂРёРЅС†РёРїС‹ IREG С‚СЂРµР±СѓСЋС‚ СѓС‡РёС‚С‹РІР°С‚СЊ СЂР°Р·Р»РёС‡РёРµ РјРёСЃСЃРёР№, РїСЂРѕС„РёР»РµР№ Рё РєРѕРЅС‚РµРєСЃС‚Р° СѓРЅРёРІРµСЂСЃРёС‚РµС‚РѕРІ.",
    principle: "РСЃСЃР»РµРґРѕРІР°С‚РµР»СЊСЃРєРёР№, СЂРµРіРёРѕРЅР°Р»СЊРЅС‹Р№, РѕС‚СЂР°СЃР»РµРІРѕР№ Рё РјРЅРѕРіРѕРїСЂРѕС„РёР»СЊРЅС‹Р№ РІСѓР· РЅРµР»СЊР·СЏ РѕС†РµРЅРёРІР°С‚СЊ РєР°Рє РїРѕР»РЅРѕСЃС‚СЊСЋ РѕРґРёРЅР°РєРѕРІС‹Рµ РјРѕРґРµР»Рё.",
    iqaa: "Р­С‚Рѕ РІРёРґРЅРѕ С‡РµСЂРµР· Р±Р°Р»Р°РЅСЃ РёРЅРґРёРєР°С‚РѕСЂРѕРІ: РєСЂРѕРјРµ РЅР°СѓРєРё СѓС‡РёС‚С‹РІР°СЋС‚СЃСЏ РѕР±СѓС‡РµРЅРёРµ, С†РёС„СЂРѕРІРёР·Р°С†РёСЏ, РјРµР¶РґСѓРЅР°СЂРѕРґРЅРѕРµ СЃРѕС‚СЂСѓРґРЅРёС‡РµСЃС‚РІРѕ Рё С‚СЂСѓРґРѕСѓСЃС‚СЂРѕР№СЃС‚РІРѕ.",
    bullets: [
      "РєР°С‡РµСЃС‚РІРѕ РЅРµ СЃРІРѕРґРёС‚СЃСЏ С‚РѕР»СЊРєРѕ Рє РЅР°СѓРєРµ РёР»Рё СЂРµРїСѓС‚Р°С†РёРё",
      "РѕС†РµРЅРєР° Р±Р»РёР¶Рµ Рє СЂРµР°Р»СЊРЅРѕРјСѓ РїСЂРѕС„РёР»СЋ СѓРЅРёРІРµСЂСЃРёС‚РµС‚Р°",
      "СЃСЂР°РІРЅРµРЅРёРµ СЃС‚Р°РЅРѕРІРёС‚СЃСЏ Р°РєРєСѓСЂР°С‚РЅРµРµ Рё СЃРїСЂР°РІРµРґР»РёРІРµРµ",
    ],
  },
  {
    id: "transparency",
    name: "РџСЂРѕР·СЂР°С‡РЅРѕСЃС‚СЊ РјРµС‚РѕРґРёРєРё",
    icon: Scale,
    summary: "РћС‚РєСЂС‹С‚РѕСЃС‚СЊ РёСЃС‚РѕС‡РЅРёРєРѕРІ, РёРЅРґРёРєР°С‚РѕСЂРѕРІ Рё РІРµСЃРѕРІ вЂ” РѕРґРёРЅ РёР· РєР»СЋС‡РµРІС‹С… РїСЂРёРЅС†РёРїРѕРІ РґРѕР±СЂРѕСЃРѕРІРµСЃС‚РЅРѕРіРѕ СЂР°РЅР¶РёСЂРѕРІР°РЅРёСЏ.",
    principle: "РџРѕР»СЊР·РѕРІР°С‚РµР»СЊ РґРѕР»Р¶РµРЅ РІРёРґРµС‚СЊ, РёР· С‡РµРіРѕ СЃРєР»Р°РґС‹РІР°РµС‚СЃСЏ РёС‚РѕРіРѕРІС‹Р№ Р±Р°Р»Р» Рё РїРѕС‡РµРјСѓ РёРјРµРЅРЅРѕ СЌС‚Рё РїРѕРєР°Р·Р°С‚РµР»Рё РІРєР»СЋС‡РµРЅС‹ РІ РјРѕРґРµР»СЊ.",
    iqaa: "Р’ РјРµС‚РѕРґРѕР»РѕРіРёРё IQAA СЌС‚Рѕ РІС‹СЂР°Р¶РµРЅРѕ С‡РµСЂРµР· 5 Р°РЅРєРµС‚, РІРµСЃР° 80/5/5/5/5 Рё РїРѕРґСЂРѕР±РЅСѓСЋ СЂР°СЃРєР»Р°РґРєСѓ РђРЅРєРµС‚С‹ в„–1 РїРѕ 7 РёРЅРґРёРєР°С‚РѕСЂР°Рј.",
    bullets: [
      "РєР°Р¶РґС‹Р№ Р±Р»РѕРє РѕС†РµРЅРєРё РёРјРµРµС‚ РїРѕРЅСЏС‚РЅС‹Р№ РјР°РєСЃРёРјР°Р»СЊРЅС‹Р№ Р±Р°Р»Р»",
      "СЃС‚СЂСѓРєС‚СѓСЂР° СЂРµР№С‚РёРЅРіР° РїСЂРѕСЃР»РµР¶РёРІР°РµС‚СЃСЏ РѕС‚ РѕР±С‰РµРіРѕ СЂРµР·СѓР»СЊС‚Р°С‚Р° РґРѕ РєРѕРЅРєСЂРµС‚РЅРѕРіРѕ РєСЂРёС‚РµСЂРёСЏ",
      "РјРµС‚РѕРґРѕР»РѕРіРёСЏ СЃС‚Р°РЅРѕРІРёС‚СЃСЏ РѕР±СЉСЏСЃРЅРёРјРѕР№, Р° РЅРµ СЃРєСЂС‹С‚РѕР№",
    ],
  },
  {
    id: "verification",
    name: "РџСЂРѕРІРµСЂСЏРµРјРѕСЃС‚СЊ РґР°РЅРЅС‹С…",
    icon: ShieldCheck,
    summary: "Р‘РµСЂР»РёРЅСЃРєРёРµ РїСЂРёРЅС†РёРїС‹ СЂРµРєРѕРјРµРЅРґСѓСЋС‚ РѕРїРёСЂР°С‚СЊСЃСЏ РЅР° РІРµСЂРёС„РёС†РёСЂСѓРµРјС‹Рµ РґР°РЅРЅС‹Рµ Рё РєРѕРјР±РёРЅРёСЂРѕРІР°С‚СЊ РЅРµСЃРєРѕР»СЊРєРѕ РёСЃС‚РѕС‡РЅРёРєРѕРІ.",
    principle: "Р”РѕРІРµСЂРёРµ Рє СЂРµР№С‚РёРЅРіСѓ РІРѕР·РЅРёРєР°РµС‚ С‚РѕРіРґР°, РєРѕРіРґР° РґР°РЅРЅС‹Рµ РјРѕР¶РЅРѕ РїРµСЂРµРїСЂРѕРІРµСЂРёС‚СЊ, Р° РѕС€РёР±РєРё вЂ” РѕР±РЅР°СЂСѓР¶РёС‚СЊ Рё СЃРєРѕСЂСЂРµРєС‚РёСЂРѕРІР°С‚СЊ.",
    iqaa: "Р’ IQAA РІСѓР· РїСЂРµРґРѕСЃС‚Р°РІР»СЏРµС‚ РѕСЃРЅРѕРІРЅСѓСЋ Р°РЅРєРµС‚Сѓ, Р·Р°С‚РµРј РґР°РЅРЅС‹Рµ РїРµСЂРµРїСЂРѕРІРµСЂСЏСЋС‚СЃСЏ СЌРєСЃРїРµСЂС‚Р°РјРё Рё СЃРѕРїРѕСЃС‚Р°РІР»СЏСЋС‚СЃСЏ СЃ РЅРµР·Р°РІРёСЃРёРјС‹РјРё РёСЃС‚РѕС‡РЅРёРєР°РјРё Рё СЂРµР·СѓР»СЊС‚Р°С‚Р°РјРё РѕРїСЂРѕСЃРѕРІ.",
    bullets: [
      "СЃРѕРµРґРёРЅСЏСЋС‚СЃСЏ РєРѕР»РёС‡РµСЃС‚РІРµРЅРЅС‹Рµ РґР°РЅРЅС‹Рµ Рё РІРЅРµС€РЅСЏСЏ РѕР±СЂР°С‚РЅР°СЏ СЃРІСЏР·СЊ",
      "СЃРЅРёР¶Р°РµС‚СЃСЏ Р·Р°РІРёСЃРёРјРѕСЃС‚СЊ С‚РѕР»СЊРєРѕ РѕС‚ СЃР°РјРѕРѕС‚С‡РµС‚Р° РІСѓР·Р°",
      "РёС‚РѕРіРѕРІР°СЏ РїРѕР·РёС†РёСЏ СЃС‚Р°РЅРѕРІРёС‚СЃСЏ СѓСЃС‚РѕР№С‡РёРІРµРµ Рё РїРѕРЅСЏС‚РЅРµРµ",
    ],
  },
];

const archivePhotos = [
  {
    src: "/storage/images/ireg-archive/image5.jpeg",
    alt: "РђСЂС…РёРІРЅРѕРµ С„РѕС‚Рѕ РёСЃРїРѕР»РЅРёС‚РµР»СЊРЅРѕРіРѕ РєРѕРјРёС‚РµС‚Р° IREG, 2009 РіРѕРґ",
  },
  {
    src: "/storage/images/ireg-archive/image6.jpeg",
    alt: "РђСЂС…РёРІРЅРѕРµ С„РѕС‚Рѕ РёР· РјР°С‚РµСЂРёР°Р»РѕРІ IREG, 2009 РіРѕРґ",
  },
  {
    src: "/storage/images/ireg-archive/image7.jpeg",
    alt: "РђСЂС…РёРІРЅРѕРµ С„РѕС‚Рѕ РёР· СЃС‚Р°СЂРѕР№ РІРµСЂСЃРёРё СЃР°Р№С‚Р° IREG, 2009 РіРѕРґ",
  },
];

export default function IregPage() {
  const [activePrinciple, setActivePrinciple] = useState(principles[0].id);
  const principle = principles.find((item) => item.id === activePrinciple) ?? principles[0];
  const PrincipleIcon = principle.icon;

  return (
    <>
      <Head title="IREG Рё Р‘РµСЂР»РёРЅСЃРєРёРµ РїСЂРёРЅС†РёРїС‹" />

      <div className="min-h-screen bg-[#f7f7f2] text-slate-950">
        <RankingHero
          currentPath="/ireg"
          badge={
            <>
              <Globe2 className="h-4 w-4 text-blue-300" />
              IREG и Берлинские принципы
            </>
          }
          title="Международная рамка доверия к рейтингу"
          description="Эта страница объясняет, почему IREG и Берлинские принципы важны для понимания методологии рейтинга IQAA, и отдельно показывает подтверждённое участие руководства IQAA в конференциях IREG."
          actions={
            <>
              <a
                href="#conferences"
                className="btn-orange inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white"
              >
                Смотреть конференции IQAA
                <ChevronRight className="h-4 w-4" />
              </a>
              <a
                href="#archive"
                className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white/80 transition-all duration-300 hover:bg-white/10 hover:text-white"
              >
                Открыть архивный блок
              </a>
            </>
          }
          aside={
            <div className="space-y-4 lg:ml-auto lg:max-w-lg">
              <div className="rounded-[1.8rem] bg-white p-5 text-slate-950 shadow-2xl shadow-slate-950/20">
                <div className="text-xs uppercase tracking-[0.24em] text-blue-700">Логотип IREG</div>
                <div className="mt-4 flex min-h-[96px] items-center justify-center rounded-[1.3rem] bg-slate-50 p-6 ring-1 ring-slate-200">
                  <img src="/images/ireg-logo.png" alt="Логотип IREG" className="h-auto w-full max-w-[200px] object-contain" />
                </div>
              </div>

              <div className="overflow-hidden rounded-[1.8rem] bg-white shadow-2xl shadow-slate-950/20">
                <img
                  src="/storage/images/ireg-certificate.png"
                  alt="Архивный документ IREG и Берлинских принципов"
                  className="h-[260px] w-full object-cover object-center"
                />
                <div className="p-5 text-slate-950">
                  <div className="text-xs uppercase tracking-[0.24em] text-orange-700">Документ / скан</div>
                  <div className="mt-2 text-xl font-semibold">Визуальный документ из архива IREG</div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Нейтральный визуал, который поддерживает разговор о международных принципах качества и историческом контексте ранжирования.
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-[1.8rem] ring-1 ring-white/10">
                <img
                  src="/storage/images/ireg-conferences/ireg-2023-tashkent.jpg"
                  alt="Участники IREG 2023 в Ташкенте и Самарканде"
                  className="h-[180px] w-full object-cover object-center"
                />
              </div>
            </div>
          }
        />

        <main className="mx-auto max-w-7xl px-6 py-12">
          <section className="border-b border-slate-200 pb-10">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">РўР°Р№РјР»Р°Р№РЅ</div>
                <h2 className="mt-2 text-3xl font-semibold text-slate-950">РљРѕСЂРѕС‚РєР°СЏ С…СЂРѕРЅРѕР»РѕРіРёСЏ IREG</h2>
              </div>

              <p className="max-w-xl text-sm leading-6 text-slate-500">
                РСЃС‚РѕСЂРёСЏ Р·РґРµСЃСЊ РїРѕРєР°Р·Р°РЅР° С‚РѕР»СЊРєРѕ РІ С‚РѕРј РѕР±СЉРµРјРµ, РєРѕС‚РѕСЂС‹Р№ РїРѕРјРѕРіР°РµС‚ РїРѕРЅСЏС‚СЊ РїСЂРѕРёСЃС…РѕР¶РґРµРЅРёРµ РїСЂРёРЅС†РёРїРѕРІ Рё РёС… СЃРІСЏР·СЊ СЃ РјРµС‚РѕРґРѕР»РѕРіРёРµР№ IQAA.
              </p>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {timeline.map((item) => (
                <article key={item.year} className="relative pl-6">
                  <div className="absolute bottom-0 left-2 top-0 w-px bg-slate-200" />
                  <div className="absolute left-0 top-7 h-4 w-4 rounded-full border-4 border-[#f7f7f2] bg-orange-500 shadow-sm shadow-orange-500/30" />

                  <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5 transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
                    <div className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">
                      {item.year}
                    </div>
                    <h3 className="mt-4 text-2xl font-semibold text-slate-950">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="conferences" className="mt-10 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">IQAA РЅР° РєРѕРЅС„РµСЂРµРЅС†РёСЏС… IREG</div>
                <h2 className="mt-2 text-3xl font-semibold text-slate-950">РџРѕРґС‚РІРµСЂР¶РґРµРЅРЅС‹Рµ РєРѕРЅС„РµСЂРµРЅС†РёРё СЃ СѓС‡Р°СЃС‚РёРµРј СЂСѓРєРѕРІРѕРґСЃС‚РІР° IQAA</h2>
              </div>

              <p className="max-w-xl text-sm leading-6 text-slate-500">
                Р—РґРµСЃСЊ РїРѕРєР°Р·Р°РЅС‹ С‚РѕР»СЊРєРѕ С‚Рµ РєРѕРЅС„РµСЂРµРЅС†РёРё, РґР»СЏ РєРѕС‚РѕСЂС‹С… РµСЃС‚СЊ Рё РѕС„РёС†РёР°Р»СЊРЅС‹Р№ СЃР»РµРґ РЅР° СЃР°Р№С‚Рµ IREG, Рё РЅР°Р№РґРµРЅРЅС‹Рµ С„РѕС‚РѕРіСЂР°С„РёРё СѓС‡Р°СЃС‚РёСЏ
                СЂСѓРєРѕРІРѕРґСЃС‚РІР° IQAA.
              </p>
            </div>

            <div className="mt-8 space-y-10">
              {conferenceHighlights.map((conference) => (
                <section key={conference.id} className="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
                  <div className="rounded-[1.7rem] bg-slate-50 p-6 ring-1 ring-slate-200">
                    <div className="text-xs uppercase tracking-[0.24em] text-blue-700">
                      {conference.year} вЂў {conference.city}, {conference.country}
                    </div>
                    <h3 className="mt-3 text-3xl font-semibold text-slate-950">{conference.title}</h3>
                    <div className="mt-3 text-sm font-medium uppercase tracking-[0.18em] text-orange-700">{conference.dates}</div>
                    <p className="mt-4 text-lg leading-7 text-slate-800">{conference.theme}</p>
                    <p className="mt-4 text-sm leading-6 text-slate-600">{conference.summary}</p>

                    <div className="mt-6 rounded-[1.4rem] bg-white p-4 ring-1 ring-slate-200">
                      <div className="text-xs uppercase tracking-[0.24em] text-slate-500">РћС„РёС†РёР°Р»СЊРЅС‹Р№ РёСЃС‚РѕС‡РЅРёРє IREG</div>
                      <a
                        href={conference.officialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800"
                      >
                        РћС‚РєСЂС‹С‚СЊ СЃС‚СЂР°РЅРёС†Сѓ РєРѕРЅС„РµСЂРµРЅС†РёРё
                        <ChevronRight className="h-4 w-4" />
                      </a>
                    </div>
                  </div>

                  <div className={`grid gap-4 ${conference.photos.length > 1 ? "md:grid-cols-2" : ""}`}>
                    {conference.photos.map((photo, index) => (
                      <div
                        key={photo.src}
                        className={`overflow-hidden rounded-[1.7rem] bg-white shadow-sm ring-1 ring-slate-200 ${
                          conference.photos.length === 3 && index === 2 ? "md:col-span-2" : ""
                        }`}
                      >
                        <img src={photo.src} alt={photo.alt} className="h-[260px] w-full object-cover object-center" />
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </section>

          <section className="mt-10 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">РСЃС‚РѕСЂРёС‡РµСЃРєРёР№ РєРѕРЅС‚РµРєСЃС‚ 2010</div>
                <h2 className="mt-2 text-3xl font-semibold text-slate-950">Р‘РµСЂР»РёРЅ Рё Р’Р°СЂС€Р°РІР° РІ Р°СЂС…РёРІРµ IREG</h2>
              </div>

              <p className="max-w-xl text-sm leading-6 text-slate-500">
                Р­С‚Рё С„РѕС‚РѕРіСЂР°С„РёРё РѕСЃС‚Р°РІР»РµРЅС‹ РєР°Рє РѕС‚РґРµР»СЊРЅС‹Р№ РёСЃС‚РѕСЂРёС‡РµСЃРєРёР№ СЃР»РѕР№: РѕРЅРё РїРѕРєР°Р·С‹РІР°СЋС‚ СЂР°РЅРЅРёРµ СЃРѕР±С‹С‚РёСЏ IREG РІ 2010 РіРѕРґСѓ Рё РЅРµ СЃРјРµС€РёРІР°СЋС‚СЃСЏ
                СЃ РїРѕРґС‚РІРµСЂР¶РґРµРЅРЅС‹Рј Р±Р»РѕРєРѕРј СѓС‡Р°СЃС‚РёСЏ IQAA РІ 2019 Рё 2023 РіРѕРґР°С….
              </p>
            </div>

            <div className="mt-8 space-y-10">
              {historical2010.map((item) => (
                <section key={item.id} className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center">
                  <div className="overflow-hidden rounded-[1.8rem] bg-slate-50 ring-1 ring-slate-200">
                    <img src={item.photo.src} alt={item.photo.alt} className="h-[320px] w-full object-cover object-center" />
                  </div>

                  <div className="rounded-[1.8rem] bg-slate-50 p-6 ring-1 ring-slate-200">
                    <div className="text-xs uppercase tracking-[0.24em] text-blue-700">
                      {item.year} вЂў {item.location}
                    </div>
                    <h3 className="mt-3 text-3xl font-semibold text-slate-950">{item.title}</h3>
                    <div className="mt-3 text-sm font-medium uppercase tracking-[0.18em] text-orange-700">{item.dates}</div>
                    <p className="mt-4 text-sm leading-7 text-slate-600">{item.description}</p>

                    <div className="mt-6 rounded-[1.3rem] bg-white p-4 ring-1 ring-slate-200">
                      <div className="text-xs uppercase tracking-[0.24em] text-slate-500">{item.sourceLabel}</div>
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800"
                      >
                        РћС‚РєСЂС‹С‚СЊ РёСЃС‚РѕС‡РЅРёРє
                        <ChevronRight className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </section>
              ))}
            </div>
          </section>

          <section id="principles" className="mt-10 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">РРЅС‚РµСЂР°РєС‚РёРІРЅС‹Р№ РѕР±Р·РѕСЂ</div>
                <h2 className="mt-2 text-3xl font-semibold text-slate-950">РљР°Рє РїСЂРёРЅС†РёРїС‹ IREG С‡РёС‚Р°СЋС‚СЃСЏ РІ РјРµС‚РѕРґРѕР»РѕРіРёРё IQAA</h2>
              </div>

              <p className="max-w-xl text-sm leading-6 text-slate-500">
                Р’С‹Р±РµСЂРё РїСЂРёРЅС†РёРї, С‡С‚РѕР±С‹ СѓРІРёРґРµС‚СЊ РµРіРѕ РёСЃС…РѕРґРЅСѓСЋ РёРґРµСЋ, РѕС‚СЂР°Р¶РµРЅРёРµ РІ РјРµС‚РѕРґРѕР»РѕРіРёРё IQAA Рё РїСЂР°РєС‚РёС‡РµСЃРєРёР№ СЃРјС‹СЃР» РґР»СЏ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ.
              </p>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
              <div className="space-y-3">
                {principles.map((item) => {
                  const isActive = item.id === activePrinciple;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActivePrinciple(item.id)}
                      className={`w-full rounded-[1.4rem] border p-4 text-left transition ${
                        isActive ? "border-blue-200 bg-blue-50 shadow-sm" : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`rounded-2xl p-3 ${isActive ? "bg-blue-100 text-blue-700" : "bg-white text-slate-500 ring-1 ring-slate-200"}`}>
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div className="text-sm font-semibold text-slate-950">{item.name}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="rounded-[1.6rem] bg-slate-50 p-6 ring-1 ring-slate-200">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
                    <PrincipleIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">{principle.name}</div>
                    <p className="mt-3 text-base leading-7 text-slate-700">{principle.summary}</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-[1.3rem] bg-white p-4 ring-1 ring-slate-200">
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-500">РџСЂРёРЅС†РёРї IREG</div>
                    <p className="mt-3 text-sm leading-6 text-slate-700">{principle.principle}</p>
                  </div>

                  <div className="rounded-[1.3rem] bg-[#fff7ed] p-4 ring-1 ring-orange-200">
                    <div className="text-xs uppercase tracking-[0.24em] text-orange-700">РљР°Рє СЌС‚Рѕ РІРёРґРЅРѕ РІ IQAA</div>
                    <p className="mt-3 text-sm leading-6 text-slate-700">{principle.iqaa}</p>
                  </div>
                </div>

                <div className="mt-6 rounded-[1.3rem] bg-white p-4 ring-1 ring-slate-200">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Р§С‚Рѕ СЌС‚Рѕ Р·РЅР°С‡РёС‚ РґР»СЏ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ СЂРµР№С‚РёРЅРіР°</div>
                  <div className="mt-4 space-y-3">
                    {principle.bullets.map((bullet) => (
                      <div key={bullet} className="flex gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
                        <p className="text-sm leading-6 text-slate-700">{bullet}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-200">
              <img
                src="/storage/images/ireg-conferences/ireg-2019-bologna-16.jpg"
                alt="Р“СЂСѓРїРїРѕРІРѕР№ РєР°РґСЂ IREG 2019 РІ Р‘РѕР»РѕРЅСЊРµ"
                className="h-[340px] w-full object-cover object-center"
              />
            </div>

            <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">РќРµР№С‚СЂР°Р»СЊРЅС‹Рµ РІРёР·СѓР°Р»С‹</div>
              <h2 className="mt-2 text-3xl font-semibold text-slate-950">Р’РёР·СѓР°Р»СЊРЅС‹Р№ РјР°С‚РµСЂРёР°Р» Р±РµР· РїРµСЂРµРіСЂСѓР·Р° РїРµСЂСЃРѕРЅР°Р»РёСЏРјРё</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Р”Р»СЏ СЃС‚СЂР°РЅРёС†С‹ РёСЃРїРѕР»СЊР·РѕРІР°РЅС‹ Р»РѕРіРѕС‚РёРї IREG, Р°СЂС…РёРІРЅС‹Р№ РґРѕРєСѓРјРµРЅС‚, С‚Р°Р№РјР»Р°Р№РЅ, РёРєРѕРЅРєРё Рё РїРѕРґС‚РІРµСЂР¶РґРµРЅРЅС‹Рµ РєРѕРЅС„РµСЂРµРЅС†РёРѕРЅРЅС‹Рµ С„РѕС‚РѕРіСЂР°С„РёРё.
                РСЃС‚РѕСЂРёС‡РµСЃРєРёР№ Рё СЃРѕРІСЂРµРјРµРЅРЅС‹Р№ РєРѕРЅС‚РµРЅС‚ СЂР°Р·РґРµР»РµРЅ, С‡С‚РѕР±С‹ Р°СЂС…РёРІ РЅРµ РІРѕСЃРїСЂРёРЅРёРјР°Р»СЃСЏ РєР°Рє Р°РєС‚СѓР°Р»СЊРЅС‹Р№ СЃРѕСЃС‚Р°РІ РѕСЂРіР°РЅРѕРІ IREG.
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex gap-3 rounded-[1.4rem] bg-slate-50 p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
                  <p className="text-sm leading-6 text-slate-700">Р›РѕРіРѕС‚РёРї IREG СЂР°Р±РѕС‚Р°РµС‚ РєР°Рє РЅРµР№С‚СЂР°Р»СЊРЅС‹Р№ РІРёР·СѓР°Р»СЊРЅС‹Р№ СЏРєРѕСЂСЊ РјРµР¶РґСѓРЅР°СЂРѕРґРЅРѕР№ СЂР°РјРєРё.</p>
                </div>
                <div className="flex gap-3 rounded-[1.4rem] bg-slate-50 p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
                  <p className="text-sm leading-6 text-slate-700">РђСЂС…РёРІРЅС‹Р№ РґРѕРєСѓРјРµРЅС‚ СѓСЃРёР»РёРІР°РµС‚ СЂР°Р·РіРѕРІРѕСЂ Рѕ Р‘РµСЂР»РёРЅСЃРєРёС… РїСЂРёРЅС†РёРїР°С… Рё РєСѓР»СЊС‚СѓСЂРµ РїСЂРѕР·СЂР°С‡РЅРѕРіРѕ СЂР°РЅР¶РёСЂРѕРІР°РЅРёСЏ.</p>
                </div>
                <div className="flex gap-3 rounded-[1.4rem] bg-slate-50 p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
                  <p className="text-sm leading-6 text-slate-700">Р¤РѕС‚РѕРіСЂР°С„РёРё РІС‹РЅРµСЃРµРЅС‹ РІ РѕС‚РґРµР»СЊРЅС‹Р№ РєРѕРЅС„РµСЂРµРЅС†РёРѕРЅРЅС‹Р№ Рё Р°СЂС…РёРІРЅС‹Р№ РєРѕРЅС‚СѓСЂ, Р° РЅРµ СЃРјРµС€Р°РЅС‹ РІ РѕРґРёРЅ РѕР±С‰РёР№ РёСЃС‚РѕСЂРёС‡РµСЃРєРёР№ РїРѕС‚РѕРє.</p>
                </div>
              </div>
            </div>
          </section>

          <section id="archive" className="mt-10 rounded-[2rem] bg-[#111827] p-6 text-white shadow-sm ring-1 ring-slate-800">
            <div className="flex flex-col gap-3 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-200">РСЃС‚РѕСЂРёС‡РµСЃРєР°СЏ СЃРїСЂР°РІРєР°</div>
                <h2 className="mt-2 text-3xl font-semibold">Р¤РѕС‚Рѕ РёСЃРїРѕР»РЅРёС‚РµР»СЊРЅРѕРіРѕ РєРѕРјРёС‚РµС‚Р° IREG, 2009 РіРѕРґ</h2>
              </div>

              <p className="max-w-xl text-sm leading-6 text-slate-300">
                РђСЂС…РёРІРЅС‹Р№ С„РѕС‚РѕР±Р»РѕРє СЃРѕС…СЂР°РЅРµРЅ РєР°Рє РёСЃС‚РѕСЂРёС‡РµСЃРєРёР№ РєРѕРЅС‚РµРєСЃС‚. Р­С‚Рё РёР·РѕР±СЂР°Р¶РµРЅРёСЏ РЅРµ СЃР»РµРґСѓРµС‚ РІРѕСЃРїСЂРёРЅРёРјР°С‚СЊ РєР°Рє Р°РєС‚СѓР°Р»СЊРЅС‹Р№ СЃРѕСЃС‚Р°РІ РёР»Рё
                РґРµР№СЃС‚РІСѓСЋС‰СѓСЋ СЃС‚СЂСѓРєС‚СѓСЂСѓ IREG СЃРµРіРѕРґРЅСЏ.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {archivePhotos.map((photo) => (
                <div key={photo.src} className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/5">
                  <img src={photo.src} alt={photo.alt} className="h-[230px] w-full object-cover object-center" />
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-blue-200">РђСЂС…РёРІРЅС‹Р№ РґРёСЃРєР»РµР№РјРµСЂ</div>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Р‘Р»РѕРє РѕСЃС‚Р°РІР»РµРЅ РєР°Рє Р°СЂС…РёРІРЅР°СЏ СЃРїСЂР°РІРєР°: РѕРЅ РїРѕРєР°Р·С‹РІР°РµС‚ РёСЃС‚РѕСЂРёС‡РµСЃРєРёР№ РІРёР·СѓР°Р»СЊРЅС‹Р№ РјР°С‚РµСЂРёР°Р» РёР· СЃС‚Р°СЂРѕР№ РІРµСЂСЃРёРё СЃР°Р№С‚Р° Рё РґРѕРїРѕР»РЅСЏРµС‚
                СЃС‚СЂР°РЅРёС†Сѓ, РЅРѕ РЅРµ Р·Р°РјРµРЅСЏРµС‚ Р°РєС‚СѓР°Р»СЊРЅСѓСЋ РёРЅСЃС‚РёС‚СѓС†РёРѕРЅР°Р»СЊРЅСѓСЋ РёРЅС„РѕСЂРјР°С†РёСЋ РѕР± IREG.
              </p>
            </div>
          </section>

          <section className="mt-10 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">РЎРІСЏР·СЊ СЃРѕ СЃС‚СЂР°РЅРёС†РµР№ РјРµС‚РѕРґРѕР»РѕРіРёРё</div>
                <h2 className="mt-2 text-3xl font-semibold text-slate-950">Р“РґРµ СЌС‚Рѕ РІСЃС‚СЂРµС‡Р°РµС‚СЃСЏ РІ СЂРµР№С‚РёРЅРіРµ IQAA</h2>
              </div>

              <Link href="/methodology" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800">
                Р’РµСЂРЅСѓС‚СЊСЃСЏ Рє РјРµС‚РѕРґРѕР»РѕРіРёРё
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.5rem] bg-slate-50 p-5">
                <div className="text-lg font-semibold text-slate-950">РџСЂРѕР·СЂР°С‡РЅР°СЏ СЃС‚СЂСѓРєС‚СѓСЂР°</div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  5 Р°РЅРєРµС‚, РѕС‚РєСЂС‹С‚С‹Рµ РІРµСЃР° Рё РґРµС‚Р°Р»СЊРЅР°СЏ СЂР°СЃРєР»Р°РґРєР° РђРЅРєРµС‚С‹ в„–1 РґРµР»Р°СЋС‚ РјРѕРґРµР»СЊ РїРѕРЅСЏС‚РЅРѕР№ Рё РїСЂРѕРІРµСЂСЏРµРјРѕР№.
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-slate-50 p-5">
                <div className="text-lg font-semibold text-slate-950">РњРЅРѕРіРѕРёСЃС‚РѕС‡РЅРёРєРѕРІР°СЏ РѕС†РµРЅРєР°</div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Р’ СЂРµР№С‚РёРЅРіРµ СЃРѕРµРґРёРЅСЏСЋС‚СЃСЏ РґР°РЅРЅС‹Рµ РІСѓР·Р°, СЌРєСЃРїРµСЂС‚РЅР°СЏ РѕС†РµРЅРєР° Рё РѕР±СЂР°С‚РЅР°СЏ СЃРІСЏР·СЊ РѕС‚ СЂР°Р±РѕС‚РѕРґР°С‚РµР»РµР№, СЃС‚СѓРґРµРЅС‚РѕРІ Рё РІС‹РїСѓСЃРєРЅРёРєРѕРІ.
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-slate-50 p-5">
                <div className="text-lg font-semibold text-slate-950">РђРєРєСѓСЂР°С‚РЅР°СЏ РёРЅС‚РµСЂРїСЂРµС‚Р°С†РёСЏ</div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  РџСЂРёРЅС†РёРїС‹ IREG РїРѕРјРѕРіР°СЋС‚ РѕР±СЉСЏСЃРЅСЏС‚СЊ СЂРµР·СѓР»СЊС‚Р°С‚С‹ РєР°Рє Р°РЅР°Р»РёС‚РёС‡РµСЃРєРёР№ РёРЅСЃС‚СЂСѓРјРµРЅС‚, Р° РЅРµ РєР°Рє РµРґРёРЅСЃС‚РІРµРЅРЅС‹Р№ РєСЂРёС‚РµСЂРёР№ РєР°С‡РµСЃС‚РІР°.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
