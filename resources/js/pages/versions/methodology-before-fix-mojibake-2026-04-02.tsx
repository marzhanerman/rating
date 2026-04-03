import { Head, Link } from "@inertiajs/react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  FileSpreadsheet,
  Globe2,
  GraduationCap,
  LibraryBig,
  MonitorSmartphone,
  Microscope,
  Users,
} from "lucide-react";
import { useState } from "react";
import RankingHero, { RankingHeroPanel, RankingHeroStat } from "@/components/hero/ranking-hero";

type Questionnaire = {
  id: string;
  name: string;
  weight: number;
  maxPoints: number;
  audience: string;
  summary: string;
  details: string;
};

type Indicator = {
  id: string;
  name: string;
  points: number;
  weight: number;
  icon: typeof GraduationCap;
  description: string;
  criteria: Array<{
    code: string;
    title: string;
    points: number;
  }>;
};

const questionnaires: Questionnaire[] = [
  {
    id: "q1",
    name: "РђРЅРєРµС‚Р° в„–1",
    weight: 80,
    maxPoints: 800,
    audience: "Р—Р°РїРѕР»РЅСЏРµС‚ РІСѓР·",
    summary: "РћСЃРЅРѕРІРЅР°СЏ Р°РЅРєРµС‚Р° СЃ РїРѕРґС‚РІРµСЂР¶РґР°РµРјС‹РјРё РєРѕР»РёС‡РµСЃС‚РІРµРЅРЅС‹РјРё РїРѕРєР°Р·Р°С‚РµР»СЏРјРё РїРѕ СЂРµСЃСѓСЂСЃР°Рј, СЂРµР·СѓР»СЊС‚Р°С‚Р°Рј Рё РёРЅСЃС‚РёС‚СѓС†РёРѕРЅР°Р»СЊРЅРѕРјСѓ СЂР°Р·РІРёС‚РёСЋ.",
    details:
      "РЈРЅРёРІРµСЂСЃРёС‚РµС‚ РїСЂРµРґРѕСЃС‚Р°РІР»СЏРµС‚ РёСЃС…РѕРґРЅС‹Рµ РґР°РЅРЅС‹Рµ, РїРѕСЃР»Рµ С‡РµРіРѕ РїРѕРєР°Р·Р°С‚РµР»Рё РґРѕРїРѕР»РЅРёС‚РµР»СЊРЅРѕ СЃРІРµСЂСЏСЋС‚СЃСЏ СЌРєСЃРїРµСЂС‚Р°РјРё Рё РЅРµР·Р°РІРёСЃРёРјС‹РјРё РёСЃС‚РѕС‡РЅРёРєР°РјРё.",
  },
  {
    id: "q2",
    name: "РђРЅРєРµС‚Р° в„–2",
    weight: 5,
    maxPoints: 50,
    audience: "Р­РєСЃРїРµСЂС‚С‹",
    summary: "Р­РєСЃРїРµСЂС‚РЅР°СЏ РѕС†РµРЅРєР° РґРµСЏС‚РµР»СЊРЅРѕСЃС‚Рё СѓРЅРёРІРµСЂСЃРёС‚РµС‚Р° РєР°Рє РѕС‚РґРµР»СЊРЅС‹Р№ РєР°С‡РµСЃС‚РІРµРЅРЅС‹Р№ СЃР»РѕР№ СЂРµР№С‚РёРЅРіР°.",
    details: "РџРѕР·РІРѕР»СЏРµС‚ РґРѕРїРѕР»РЅРёС‚СЊ СЃС‚Р°С‚РёСЃС‚РёРєСѓ РїСЂРѕС„РµСЃСЃРёРѕРЅР°Р»СЊРЅРѕР№ РёРЅС‚РµСЂРїСЂРµС‚Р°С†РёРµР№ СЃРёР»СЊРЅС‹С… Рё СЃР»Р°Р±С‹С… СЃС‚РѕСЂРѕРЅ РІСѓР·Р°.",
  },
  {
    id: "q3",
    name: "РђРЅРєРµС‚Р° в„–3",
    weight: 5,
    maxPoints: 50,
    audience: "Р Р°Р±РѕС‚РѕРґР°С‚РµР»Рё",
    summary: "РћС†РµРЅРєР° СЂРµРїСѓС‚Р°С†РёРё РІСѓР·Р° Рё РєР°С‡РµСЃС‚РІР° РїРѕРґРіРѕС‚РѕРІРєРё РІС‹РїСѓСЃРєРЅРёРєРѕРІ СЃ РїРѕР·РёС†РёРё СЂС‹РЅРєР° С‚СЂСѓРґР°.",
    details: "РџРѕРєР°Р·С‹РІР°РµС‚, РЅР°СЃРєРѕР»СЊРєРѕ СѓРЅРёРІРµСЂСЃРёС‚РµС‚ РІРѕСЃРїСЂРёРЅРёРјР°РµС‚СЃСЏ РІРѕСЃС‚СЂРµР±РѕРІР°РЅРЅС‹Рј Рё РїРѕР»РµР·РЅС‹Рј РґР»СЏ РїСЂРѕС„РµСЃСЃРёРѕРЅР°Р»СЊРЅРѕР№ СЃСЂРµРґС‹.",
  },
  {
    id: "q4",
    name: "РђРЅРєРµС‚Р° в„–4",
    weight: 5,
    maxPoints: 50,
    audience: "РЎС‚СѓРґРµРЅС‚С‹",
    summary: "РћС†РµРЅРєР° РѕР±СЂР°Р·РѕРІР°С‚РµР»СЊРЅРѕРіРѕ РѕРїС‹С‚Р° Рё СѓРґРѕРІР»РµС‚РІРѕСЂРµРЅРЅРѕСЃС‚Рё РєР°С‡РµСЃС‚РІРѕРј СѓС‡РµР±РЅРѕРіРѕ РїСЂРѕС†РµСЃСЃР°.",
    details: "Р”РѕР±Р°РІР»СЏРµС‚ РїРѕР»СЊР·РѕРІР°С‚РµР»СЊСЃРєРёР№ РІР·РіР»СЏРґ РЅР° РѕСЂРіР°РЅРёР·Р°С†РёСЋ РѕР±СѓС‡РµРЅРёСЏ, РёРЅС„СЂР°СЃС‚СЂСѓРєС‚СѓСЂСѓ Рё Р°РєР°РґРµРјРёС‡РµСЃРєСѓСЋ СЃСЂРµРґСѓ.",
  },
  {
    id: "q5",
    name: "РђРЅРєРµС‚Р° в„–5",
    weight: 5,
    maxPoints: 50,
    audience: "Р’С‹РїСѓСЃРєРЅРёРєРё",
    summary: "РћС†РµРЅРєР° РєР°С‡РµСЃС‚РІР° РїРѕР»СѓС‡РµРЅРЅРѕРіРѕ РѕР±СЂР°Р·РѕРІР°РЅРёСЏ Рё СЂРµР·СѓР»СЊС‚Р°С‚РѕРІ РїРѕСЃР»Рµ Р·Р°РІРµСЂС€РµРЅРёСЏ РѕР±СѓС‡РµРЅРёСЏ.",
    details: "РџРѕР·РІРѕР»СЏРµС‚ СѓРІРёРґРµС‚СЊ РѕР±СЂР°С‚РЅСѓСЋ СЃРІСЏР·СЊ РїРѕ РєР°СЂСЊРµСЂРЅРѕР№ С‚СЂР°РµРєС‚РѕСЂРёРё Рё РїСЂР°РєС‚РёС‡РµСЃРєРѕР№ РѕС‚РґР°С‡Рµ РѕС‚ РѕР±СЂР°Р·РѕРІР°РЅРёСЏ.",
  },
];

const indicators: Indicator[] = [
  {
    id: "students",
    name: "РљРѕРЅС‚РёРЅРіРµРЅС‚ СЃС‚СѓРґРµРЅС‚РѕРІ",
    points: 80,
    weight: 10,
    icon: Users,
    description: "РџРѕРєР°Р·С‹РІР°РµС‚ РјР°СЃС€С‚Р°Р±, СЃС‚СЂСѓРєС‚СѓСЂСѓ Рё СЃРѕС†РёР°Р»СЊРЅСѓСЋ РѕР±РµСЃРїРµС‡РµРЅРЅРѕСЃС‚СЊ СЃС‚СѓРґРµРЅС‡РµСЃРєРѕРіРѕ РєРѕРЅС‚РёРЅРіРµРЅС‚Р°.",
    criteria: [
      { code: "1.1", title: "Р”РѕР»СЏ СЃС‚СѓРґРµРЅС‚РѕРІ РїРѕ РіРѕСЃСѓРґР°СЂСЃС‚РІРµРЅРЅРѕРјСѓ РѕР±СЂР°Р·РѕРІР°С‚РµР»СЊРЅРѕРјСѓ Р·Р°РєР°Р·Сѓ", points: 15 },
      { code: "1.2", title: "Р”РѕР»СЏ РјР°РіРёСЃС‚СЂР°РЅС‚РѕРІ Рё РѕР±СѓС‡Р°СЋС‰РёС…СЃСЏ PhD", points: 15 },
      { code: "1.3", title: "Р”РѕР»СЏ РёРЅРѕРіРѕСЂРѕРґРЅРёС… СЃС‚СѓРґРµРЅС‚РѕРІ", points: 15 },
      { code: "1.4", title: "РћР±РµСЃРїРµС‡РµРЅРЅРѕСЃС‚СЊ РёРЅРѕРіРѕСЂРѕРґРЅРёС… СЃС‚СѓРґРµРЅС‚РѕРІ РѕР±С‰РµР¶РёС‚РёРµРј", points: 15 },
      { code: "1.5", title: "РРЅРґРµРєСЃ РјР°СЃС€С‚Р°Р±РёСЂРѕРІР°РЅРёСЏ РІСѓР·Р°", points: 20 },
    ],
  },
  {
    id: "learning",
    name: "Р РµР·СѓР»СЊС‚Р°С‚С‹ РѕР±СѓС‡РµРЅРёСЏ Рё РѕР±СЂР°Р·РѕРІР°С‚РµР»СЊРЅС‹Рµ РїСЂРѕРіСЂР°РјРјС‹",
    points: 80,
    weight: 10,
    icon: GraduationCap,
    description: "РћС†РµРЅРёРІР°РµС‚ РїР»РѕС‚РЅРѕСЃС‚СЊ РїСЂРѕРіСЂР°РјРј, РґРѕСЃС‚РёР¶РµРЅРёСЏ СЃС‚СѓРґРµРЅС‚РѕРІ Рё РЅР°Р»РёС‡РёРµ РёРЅРЅРѕРІР°С†РёРѕРЅРЅС‹С… Рё Р°РЅРіР»РѕСЏР·С‹С‡РЅС‹С… РїСЂРѕРіСЂР°РјРј.",
    criteria: [
      { code: "2.1", title: "РЎРѕРѕС‚РЅРѕС€РµРЅРёРµ С‡РёСЃР»Р° СЃС‚СѓРґРµРЅС‚РѕРІ Рё РєРѕР»РёС‡РµСЃС‚РІР° РїСЂРѕРіСЂР°РјРј Р±Р°РєР°Р»Р°РІСЂРёР°С‚Р°, РјР°РіРёСЃС‚СЂР°С‚СѓСЂС‹ Рё PhD", points: 25 },
      { code: "2.2", title: "РџРѕР±РµРґС‹ СЃС‚СѓРґРµРЅС‚РѕРІ РЅР° РєРѕРЅРєСѓСЂСЃР°С…, РєРѕРЅС„РµСЂРµРЅС†РёСЏС…, РѕР»РёРјРїРёР°РґР°С…, СЃРїРѕСЂС‚РёРІРЅС‹С… Рё С‚РІРѕСЂС‡РµСЃРєРёС… СЃРѕР±С‹С‚РёСЏС…", points: 35 },
      { code: "2.3", title: "Р”РѕР»СЏ РЅРѕРІС‹С… Рё РёРЅРЅРѕРІР°С†РёРѕРЅРЅС‹С… РѕР±СЂР°Р·РѕРІР°С‚РµР»СЊРЅС‹С… РїСЂРѕРіСЂР°РјРј", points: 10 },
      { code: "2.4", title: "Р”РѕР»СЏ РѕР±СЂР°Р·РѕРІР°С‚РµР»СЊРЅС‹С… РїСЂРѕРіСЂР°РјРј РЅР° Р°РЅРіР»РёР№СЃРєРѕРј СЏР·С‹РєРµ", points: 10 },
    ],
  },
  {
    id: "staff",
    name: "РђРєР°РґРµРјРёС‡РµСЃРєРёРµ РєР°РґСЂС‹ Рё РЅР°СѓС‡РЅС‹Рµ СЃРѕС‚СЂСѓРґРЅРёРєРё",
    points: 110,
    weight: 13.75,
    icon: LibraryBig,
    description: "Р¤РѕРєСѓСЃРёСЂСѓРµС‚СЃСЏ РЅР° РєРІР°Р»РёС„РёРєР°С†РёРё РџРџРЎ Рё РЅР°СѓС‡РЅС‹С… СЃРѕС‚СЂСѓРґРЅРёРєРѕРІ, РёС… СЃС‚СЂСѓРєС‚СѓСЂРµ Рё РїСЂРѕС„РµСЃСЃРёРѕРЅР°Р»СЊРЅС‹С… РґРѕСЃС‚РёР¶РµРЅРёСЏС….",
    criteria: [
      { code: "3.1", title: "Р”РѕР»СЏ РґРѕРєС‚РѕСЂРѕРІ РЅР°СѓРє, РєР°РЅРґРёРґР°С‚РѕРІ РЅР°СѓРє Рё PhD РІ С€С‚Р°С‚РЅРѕРј СЃРѕСЃС‚Р°РІРµ РџРџРЎ", points: 25 },
      { code: "3.2", title: "Р”РѕР»СЏ РѕСЃС‚РµРїРµРЅРµРЅРЅС‹С… СЃРѕРІРјРµСЃС‚РёС‚РµР»РµР№ РёР· РѕС‚СЂР°СЃР»РµР№ СЌРєРѕРЅРѕРјРёРєРё", points: 15 },
      { code: "3.3", title: "Р”РѕР»СЏ РџРџРЎ СЃ РґРёРїР»РѕРјР°РјРё Рё СЃС‚РµРїРµРЅСЏРјРё РІСѓР·РѕРІ РґР°Р»СЊРЅРµРіРѕ Р·Р°СЂСѓР±РµР¶СЊСЏ", points: 10 },
      { code: "3.4", title: "РЎРѕРѕС‚РЅРѕС€РµРЅРёРµ С‡РёСЃР»Р° СЃС‚СѓРґРµРЅС‚РѕРІ РЅР° РѕРґРЅРѕРіРѕ С€С‚Р°С‚РЅРѕРіРѕ РџРџРЎ", points: 20 },
      { code: "3.5", title: "Р”РѕР»СЏ РѕСЃС‚РµРїРµРЅРµРЅРЅС‹С… С€С‚Р°С‚РЅС‹С… РЅР°СѓС‡РЅС‹С… СЃРѕС‚СЂСѓРґРЅРёРєРѕРІ", points: 10 },
      { code: "3.6", title: "Р”РѕР»СЏ РѕСЃС‚РµРїРµРЅРµРЅРЅС‹С… РЅР°СѓС‡РЅС‹С… СЃРѕС‚СЂСѓРґРЅРёРєРѕРІ-СЃРѕРІРјРµСЃС‚РёС‚РµР»РµР№", points: 5 },
      { code: "3.7", title: "Р“СЂР°РЅС‚ В«Р›СѓС‡С€РёР№ РїСЂРµРїРѕРґР°РІР°С‚РµР»СЊ РІСѓР·Р°В»", points: 15 },
      { code: "3.8", title: "Р“СЂР°РЅС‚ В«Р›СѓС‡С€РёР№ РЅР°СѓС‡РЅС‹Р№ СЂР°Р±РѕС‚РЅРёРєВ»", points: 10 },
    ],
  },
  {
    id: "research",
    name: "РќР°СѓС‡РЅРѕ-РёСЃСЃР»РµРґРѕРІР°С‚РµР»СЊСЃРєР°СЏ Рё РёРЅРЅРѕРІР°С†РёРѕРЅРЅР°СЏ СЂР°Р±РѕС‚Р°",
    points: 170,
    weight: 21.25,
    icon: Microscope,
    description: "РЎР°РјС‹Р№ РІРµСЃРѕРјС‹Р№ Р±Р»РѕРє: РїСѓР±Р»РёРєР°С†РёРё, С†РёС‚РёСЂСѓРµРјРѕСЃС‚СЊ, РїР°С‚РµРЅС‚С‹, С„РёРЅР°РЅСЃРёСЂРѕРІР°РЅРёРµ РќРР  Рё РґРёСЃСЃРµСЂС‚Р°С†РёРѕРЅРЅС‹Рµ СЃРѕРІРµС‚С‹.",
    criteria: [
      { code: "4.1", title: "РћР±СЉРµРј С„РёРЅР°РЅСЃРёСЂРѕРІР°РЅРёСЏ РќРР  РЅР° РѕРґРЅРѕРіРѕ РїСЂРµРїРѕРґР°РІР°С‚РµР»СЏ Рё РЅР°СѓС‡РЅРѕРіРѕ СЃРѕС‚СЂСѓРґРЅРёРєР°", points: 20 },
      { code: "4.2", title: "РџСѓР±Р»РёРєР°С†РёРё РІ РєР°Р·Р°С…СЃС‚Р°РЅСЃРєРёС… РёР·РґР°РЅРёСЏС…, СЂРµРєРѕРјРµРЅРґРѕРІР°РЅРЅС‹С… РљРћРљРќР’Рћ", points: 5 },
      { code: "4.3", title: "РџСѓР±Р»РёРєР°С†РёРѕРЅРЅР°СЏ Р°РєС‚РёРІРЅРѕСЃС‚СЊ Рё С†РёС‚РёСЂРѕРІР°РЅРёРµ РІ Science Index", points: 15 },
      { code: "4.4", title: "РџСѓР±Р»РёРєР°С†РёРё Рё h-index РІ Web of Science Рё Scopus", points: 80 },
      { code: "4.5", title: "РџР°С‚РµРЅС‚С‹ РЅР° РѕРґРЅРѕРіРѕ РїСЂРµРїРѕРґР°РІР°С‚РµР»СЏ Рё РЅР°СѓС‡РЅРѕРіРѕ СЃРѕС‚СЂСѓРґРЅРёРєР°", points: 30 },
      { code: "4.6", title: "РЎРІРёРґРµС‚РµР»СЊСЃС‚РІР° Рѕ РіРѕСЃСЂРµРіРёСЃС‚СЂР°С†РёРё РїСЂР°РІ РЅР° РѕР±СЉРµРєС‚С‹ Р°РІС‚РѕСЂСЃРєРѕРіРѕ РїСЂР°РІР°", points: 10 },
      { code: "4.7", title: "РљРѕР»РёС‡РµСЃС‚РІРѕ РґРёСЃСЃРµСЂС‚Р°С†РёРѕРЅРЅС‹С… СЃРѕРІРµС‚РѕРІ РїРѕ РїРѕРґРіРѕС‚РѕРІРєРµ PhD", points: 10 },
    ],
  },
  {
    id: "international",
    name: "РњРµР¶РґСѓРЅР°СЂРѕРґРЅРѕРµ СЃРѕС‚СЂСѓРґРЅРёС‡РµСЃС‚РІРѕ",
    points: 90,
    weight: 11.25,
    icon: Globe2,
    description: "РР·РјРµСЂСЏРµС‚ РјРµР¶РґСѓРЅР°СЂРѕРґРЅСѓСЋ РёРЅС‚РµРіСЂР°С†РёСЋ СѓРЅРёРІРµСЂСЃРёС‚РµС‚Р° С‡РµСЂРµР· РїСЂРѕРіСЂР°РјРјС‹, РјРѕР±РёР»СЊРЅРѕСЃС‚СЊ Рё РёРЅРѕСЃС‚СЂР°РЅРЅС‹С… СѓС‡Р°СЃС‚РЅРёРєРѕРІ.",
    criteria: [
      { code: "5.1", title: "РЎРѕРІРјРµСЃС‚РЅС‹Рµ РїСЂРѕРіСЂР°РјРјС‹ РґРІСѓРґРёРїР»РѕРјРЅРѕРіРѕ РѕР±СЂР°Р·РѕРІР°РЅРёСЏ", points: 20 },
      { code: "5.2", title: "РњРµР¶РґСѓРЅР°СЂРѕРґРЅС‹Рµ РѕР±РјРµРЅС‹, РєРѕРјР°РЅРґРёСЂРѕРІРєРё Рё СЃС‚Р°Р¶РёСЂРѕРІРєРё РџРџРЎ Рё СЃРѕС‚СЂСѓРґРЅРёРєРѕРІ", points: 20 },
      { code: "5.3", title: "РњРµР¶РґСѓРЅР°СЂРѕРґРЅР°СЏ Р°РєР°РґРµРјРёС‡РµСЃРєР°СЏ РјРѕР±РёР»СЊРЅРѕСЃС‚СЊ СЃС‚СѓРґРµРЅС‚РѕРІ", points: 20 },
      { code: "5.4", title: "Р”РѕР»СЏ РёРЅРѕСЃС‚СЂР°РЅРЅС‹С… СЃС‚СѓРґРµРЅС‚РѕРІ", points: 10 },
      { code: "5.5", title: "Р”РѕР»СЏ РёРЅРѕСЃС‚СЂР°РЅРЅС‹С… Рё РїСЂРёРіР»Р°С€РµРЅРЅС‹С… РїСЂРµРїРѕРґР°РІР°С‚РµР»РµР№", points: 20 },
    ],
  },
  {
    id: "digital",
    name: "Р¦РёС„СЂРѕРІРёР·Р°С†РёСЏ РІСѓР·Р°",
    points: 110,
    weight: 13.75,
    icon: MonitorSmartphone,
    description: "РћС†РµРЅРёРІР°РµС‚ С†РёС„СЂРѕРІСѓСЋ Р·СЂРµР»РѕСЃС‚СЊ С‡РµСЂРµР· СЃР°Р№С‚, СЃРѕС†СЃРµС‚Рё, РїР»Р°С‚С„РѕСЂРјС‹ Рё РґРёСЃС‚Р°РЅС†РёРѕРЅРЅС‹Рµ РѕР±СЂР°Р·РѕРІР°С‚РµР»СЊРЅС‹Рµ С‚РµС…РЅРѕР»РѕРіРёРё.",
    criteria: [
      { code: "6.1", title: "РћС†РµРЅРєР° РѕС„РёС†РёР°Р»СЊРЅРѕРіРѕ РІРµР±-СЃР°Р№С‚Р°: РєРѕРЅС‚РµРЅС‚, РѕР±РЅРѕРІР»СЏРµРјРѕСЃС‚СЊ, РЅР°РІРёРіР°С†РёСЏ, СЏР·С‹РєРё, СЃСЃС‹Р»РєРё Рё СЃРєРѕСЂРѕСЃС‚СЊ", points: 50 },
      { code: "6.2", title: "РљРѕР»РёС‡РµСЃС‚РІРѕ РѕС„РёС†РёР°Р»СЊРЅС‹С… Р°РєРєР°СѓРЅС‚РѕРІ РІ СЃРѕС†СЃРµС‚СЏС… СЃ СЃРёСЃС‚РµРјР°С‚РёС‡РµСЃРєРёРјРё РїСѓР±Р»РёРєР°С†РёСЏРјРё", points: 10 },
      { code: "6.3", title: "Р”РёСЃС‚Р°РЅС†РёРѕРЅРЅС‹Рµ РѕР±СЂР°Р·РѕРІР°С‚РµР»СЊРЅС‹Рµ С‚РµС…РЅРѕР»РѕРіРёРё, MOOC Рё РІРЅРµС€РЅРёРµ РѕРЅР»Р°Р№РЅ-РїР»Р°С‚С„РѕСЂРјС‹", points: 50 },
    ],
  },
  {
    id: "employment",
    name: "Р РµР·СѓР»СЊС‚Р°С‚С‹ С‚СЂСѓРґРѕСѓСЃС‚СЂРѕР№СЃС‚РІР° РІС‹РїСѓСЃРєРЅРёРєРѕРІ",
    points: 160,
    weight: 20,
    icon: BriefcaseBusiness,
    description: "РџРѕРєР°Р·С‹РІР°РµС‚ РёС‚РѕРіРѕРІСѓСЋ РѕС‚РґР°С‡Сѓ РІСѓР·Р°: С‚СЂСѓРґРѕСѓСЃС‚СЂРѕР№СЃС‚РІРѕ, РІС‹РїСѓСЃРє РїРѕ РїСЂРѕРіСЂР°РјРјР°Рј Рё РјРµР¶РґСѓРЅР°СЂРѕРґРЅС‹Рµ РіСЂР°РЅС‚С‹ РІС‹РїСѓСЃРєРЅРёРєРѕРІ.",
    criteria: [
      { code: "7.1", title: "Р”РѕР»СЏ РІС‹РїСѓСЃРєРЅРёРєРѕРІ, С‚СЂСѓРґРѕСѓСЃС‚СЂРѕРµРЅРЅС‹С… РІ РїРµСЂРІС‹Р№ РіРѕРґ РїРѕСЃР»Рµ РѕРєРѕРЅС‡Р°РЅРёСЏ РІСѓР·Р°", points: 100 },
      { code: "7.2", title: "РЎРѕРѕС‚РЅРѕС€РµРЅРёРµ РєРѕР»РёС‡РµСЃС‚РІР° РІС‹РїСѓСЃРєРЅРёРєРѕРІ Рё РєРѕР»РёС‡РµСЃС‚РІР° РїСЂРѕРіСЂР°РјРј Р±Р°РєР°Р»Р°РІСЂРёР°С‚Р°, РјР°РіРёСЃС‚СЂР°С‚СѓСЂС‹ Рё PhD", points: 30 },
      { code: "7.3", title: "Р”РѕР»СЏ РІС‹РїСѓСЃРєРЅРёРєРѕРІ, РїРѕР»СѓС‡РёРІС€РёС… РјРµР¶РґСѓРЅР°СЂРѕРґРЅС‹Рµ РіСЂР°РЅС‚С‹ Рё СЃС‚РёРїРµРЅРґРёРё", points: 30 },
    ],
  },
];

const processSteps = [
  "Р’СѓР· Р·Р°РїРѕР»РЅСЏРµС‚ РђРЅРєРµС‚Сѓ в„–1 Рё РїРѕРґС‚РІРµСЂР¶РґР°РµС‚ РєРѕР»РёС‡РµСЃС‚РІРµРЅРЅС‹Рµ РїРѕРєР°Р·Р°С‚РµР»Рё.",
  "РђРіРµРЅС‚СЃС‚РІРѕ Рё СЌРєСЃРїРµСЂС‚С‹ РїРµСЂРµРїСЂРѕРІРµСЂСЏСЋС‚ РґР°РЅРЅС‹Рµ, РІРєР»СЋС‡Р°СЏ РЅРµР·Р°РІРёСЃРёРјС‹Рµ РёСЃС‚РѕС‡РЅРёРєРё.",
  "Р­РєСЃРїРµСЂС‚С‹, СЂР°Р±РѕС‚РѕРґР°С‚РµР»Рё, СЃС‚СѓРґРµРЅС‚С‹ Рё РІС‹РїСѓСЃРєРЅРёРєРё Р·Р°РїРѕР»РЅСЏСЋС‚ РђРЅРєРµС‚С‹ в„–2вЂ“в„–5.",
  "РС‚РѕРіРѕРІС‹Р№ СЂРµР№С‚РёРЅРі СЃРєР»Р°РґС‹РІР°РµС‚СЃСЏ РёР· 1000 Р±Р°Р»Р»РѕРІ: 800 РїРѕ РђРЅРєРµС‚Рµ в„–1 Рё 200 РїРѕ РѕРїСЂРѕСЃРЅС‹Рј Р°РЅРєРµС‚Р°Рј.",
];

const notes = [
  "Р”Р»СЏ РјРµРґРёС†РёРЅСЃРєРёС… Рё РІРµС‚РµСЂРёРЅР°СЂРЅС‹С… РЅР°РїСЂР°РІР»РµРЅРёР№ СЃС‚СѓРґРµРЅС‚РѕРІ РёРЅС‚РµСЂРЅР°С‚СѓСЂС‹ РѕС‚РЅРѕСЃСЏС‚ Рє Р±Р°РєР°Р»Р°РІСЂРёР°С‚Сѓ, Р° СЂРµР·РёРґРµРЅС‚СѓСЂС‹ вЂ” Рє РјР°РіРёСЃС‚СЂР°С‚СѓСЂРµ.",
  "РџРѕР±РµРґС‹ СЃС‚СѓРґРµРЅС‚РѕРІ РЅР° РєРѕРЅС„РµСЂРµРЅС†РёСЏС… Рё РѕР»РёРјРїРёР°РґР°С… СЃРѕР±СЃС‚РІРµРЅРЅРѕРіРѕ РІСѓР·Р° РЅРµ РІРєР»СЋС‡Р°СЋС‚СЃСЏ РІ С‡РёСЃР»Рѕ РґРѕСЃС‚РёР¶РµРЅРёР№ РґР»СЏ СЂР°СЃС‡РµС‚Р°.",
  "Р’СѓР·С‹ РёСЃРєСѓСЃСЃС‚РІР° РІРјРµСЃС‚Рѕ РќРР  РјРѕРіСѓС‚ РїСЂРµРґСЃС‚Р°РІР»СЏС‚СЊ СЂРµР·СѓР»СЊС‚Р°С‚С‹ РєРѕРЅС†РµСЂС‚РЅРѕР№ РґРµСЏС‚РµР»СЊРЅРѕСЃС‚Рё, РІ С‚РѕРј С‡РёСЃР»Рµ Р·Р°СЂСѓР±РµР¶РЅРѕР№.",
];

export default function MethodologyPage() {
  const [activeQuestionnaire, setActiveQuestionnaire] = useState(questionnaires[0].id);
  const [activeIndicator, setActiveIndicator] = useState(indicators[0].id);

  const questionnaire = questionnaires.find((item) => item.id === activeQuestionnaire) ?? questionnaires[0];
  const indicator = indicators.find((item) => item.id === activeIndicator) ?? indicators[0];
  const IndicatorIcon = indicator.icon;

  return (
    <>
      <Head title="РњРµС‚РѕРґРѕР»РѕРіРёСЏ СЂРµР№С‚РёРЅРіР°" />

      <div className="min-h-screen bg-[#f7f7f2] text-slate-950">
        <RankingHero
          currentPath="/methodology"
          badge={
            <>
              <FileSpreadsheet className="h-4 w-4 text-blue-300" />
              Методология институционального рейтинга вузов Казахстана
            </>
          }
          title="Как рассчитывается рейтинг IQAA"
          description="Страница показывает структуру анкет, распределение баллов и ключевые индикаторы, из которых складывается институциональный рейтинг вузов."
          actions={
            <>
              <a
                href="#questionnaires"
                className="btn-orange inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white"
              >
                Изучить анкеты
                <ChevronRight className="h-4 w-4" />
              </a>
              <a
                href="#indicators"
                className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white/80 transition-all duration-300 hover:bg-white/10 hover:text-white"
              >
                Перейти к индикаторам
              </a>
            </>
          }
          aside={
            <div className="space-y-4 lg:ml-auto lg:max-w-md">
              <div className="grid grid-cols-2 gap-3">
                <RankingHeroStat label="Всего анкет" value={5} valueClassName="text-3xl" />
                <RankingHeroStat label="Индикаторов в Анкете №1" value={7} valueClassName="text-3xl" />
              </div>

              <RankingHeroPanel className="rounded-[1.75rem] p-5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-300/70">Максимум баллов</div>
                <div className="mt-3 text-4xl font-semibold text-white">1000</div>
                <p className="mt-3 text-sm leading-6 text-blue-100/65">
                  800 баллов приходятся на Анкету №1, а ещё 200 баллов распределяются между анкетами 2–5.
                </p>
              </RankingHeroPanel>
            </div>
          }
        />

        <main className="mx-auto max-w-7xl px-6 py-12">
          <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">Р›РѕРіРёРєР° РѕС†РµРЅРєРё</div>
              <h2 className="mt-2 text-3xl font-semibold text-slate-950">РљР°Рє СѓСЃС‚СЂРѕРµРЅ СЂР°СЃС‡РµС‚</h2>

              <div className="mt-8 grid gap-4">
                {processSteps.map((step, index) => (
                  <div key={step} className="flex gap-4 rounded-[1.5rem] bg-slate-50 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-700 text-sm font-semibold text-white">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-6 text-slate-700">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] bg-[#fff7ed] p-6 shadow-sm ring-1 ring-orange-200">
              <div className="text-sm font-medium uppercase tracking-[0.24em] text-orange-700">РћСЃРѕР±С‹Рµ РїСЂР°РІРёР»Р°</div>
              <h2 className="mt-2 text-3xl font-semibold text-slate-950">РњРµС‚РѕРґРёС‡РµСЃРєРёРµ РѕРіРѕРІРѕСЂРєРё</h2>

              <div className="mt-8 space-y-4">
                {notes.map((note) => (
                  <div key={note} className="flex gap-3 rounded-[1.5rem] bg-white/90 p-4 ring-1 ring-orange-100">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
                    <p className="text-sm leading-6 text-slate-700">{note}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-10 rounded-[2rem] bg-[#0f172a] p-6 text-white shadow-sm ring-1 ring-slate-800">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-blue-100">
                  <Globe2 className="h-4 w-4" />
                  IREG
                </div>
                <h2 className="mt-5 text-3xl font-semibold md:text-4xl">РњРµР¶РґСѓРЅР°СЂРѕРґРЅС‹Рµ РїСЂРёРЅС†РёРїС‹ РІС‹РЅРµСЃРµРЅС‹ РІ РѕС‚РґРµР»СЊРЅСѓСЋ СЃС‚СЂР°РЅРёС†Сѓ</h2>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
                  Р§С‚РѕР±С‹ РјРµС‚РѕРґРѕР»РѕРіРёСЏ РѕСЃС‚Р°РІР°Р»Р°СЃСЊ СЃС„РѕРєСѓСЃРёСЂРѕРІР°РЅРЅРѕР№ РЅР° СЂР°СЃС‡РµС‚Рµ СЂРµР№С‚РёРЅРіР°, РїРѕРґСЂРѕР±РЅС‹Р№ РјР°С‚РµСЂРёР°Р» РѕР± IREG Рё Р‘РµСЂР»РёРЅСЃРєРёС… РїСЂРёРЅС†РёРїР°С…
                  РІС‹РЅРµСЃРµРЅ РѕС‚РґРµР»СЊРЅРѕ. РўР°Рє С„РѕСЂРјСѓР»Р° РѕС†РµРЅРєРё РЅРµ СЃРјРµС€РёРІР°РµС‚СЃСЏ СЃ РјРµР¶РґСѓРЅР°СЂРѕРґРЅС‹Рј РёСЃС‚РѕСЂРёС‡РµСЃРєРёРј РєРѕРЅС‚РµРєСЃС‚РѕРј.
                </p>
              </div>

              <div className="rounded-[1.7rem] bg-white p-5 text-slate-950">
                <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">РћС‚РґРµР»СЊРЅР°СЏ СЃС‚СЂР°РЅРёС†Р°</div>
                <h3 className="mt-2 text-2xl font-semibold">IREG Рё Р‘РµСЂР»РёРЅСЃРєРёРµ РїСЂРёРЅС†РёРїС‹</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  РўР°Рј СЃРѕР±СЂР°РЅС‹ РїСЂРѕРёСЃС…РѕР¶РґРµРЅРёРµ РїСЂРёРЅС†РёРїРѕРІ, РёС… СЃРјС‹СЃР» Рё РёРЅС‚РµСЂР°РєС‚РёРІРЅР°СЏ СЃРІСЏР·СЊ СЃ Р»РѕРіРёРєРѕР№ СЂРµР№С‚РёРЅРіР° IQAA.
                </p>
                <Link
                  href="/ireg"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#f97316] px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                  РћС‚РєСЂС‹С‚СЊ СЃС‚СЂР°РЅРёС†Сѓ IREG
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>

          <section id="questionnaires" className="mt-10 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">РђРЅРєРµС‚С‹</div>
                <h2 className="mt-2 text-3xl font-semibold text-slate-950">РРЅС‚РµСЂР°РєС‚РёРІРЅР°СЏ РєР°СЂС‚Р° Р°РЅРєРµС‚</h2>
              </div>

              <p className="max-w-xl text-sm leading-6 text-slate-500">
                РќР°Р¶РјРё РЅР° Р°РЅРєРµС‚Сѓ, С‡С‚РѕР±С‹ СѓРІРёРґРµС‚СЊ РµРµ РІРµСЃ РІ РјРѕРґРµР»Рё, РјР°РєСЃРёРјР°Р»СЊРЅС‹Р№ Р±Р°Р»Р» Рё СЂРѕР»СЊ РІ РёС‚РѕРіРѕРІРѕРј СЂРµР№С‚РёРЅРіРµ.
              </p>
            </div>

            <div className="mt-8 grid gap-4 xl:grid-cols-5">
              {questionnaires.map((item) => {
                const isActive = item.id === activeQuestionnaire;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveQuestionnaire(item.id)}
                    className={`rounded-[1.6rem] border p-5 text-left transition ${
                      isActive ? "border-blue-200 bg-blue-50 shadow-sm" : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"
                    }`}
                  >
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-500">{item.audience}</div>
                    <div className="mt-3 text-xl font-semibold text-slate-950">{item.name}</div>
                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <div className="text-sm text-slate-500">Р’РµСЃ</div>
                        <div className="text-3xl font-semibold text-slate-950">{item.weight}%</div>
                      </div>
                      <ArrowRight className={`h-5 w-5 ${isActive ? "text-blue-700" : "text-slate-400"}`} />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_240px]">
              <div className="rounded-[1.75rem] bg-slate-50 p-6 ring-1 ring-slate-200">
                <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">{questionnaire.audience}</div>
                <h3 className="mt-2 text-3xl font-semibold text-slate-950">{questionnaire.name}</h3>
                <p className="mt-4 text-base leading-7 text-slate-700">{questionnaire.summary}</p>
                <p className="mt-4 text-sm leading-6 text-slate-500">{questionnaire.details}</p>
              </div>

              <div className="rounded-[1.75rem] bg-[#0f2d63] p-6 text-white">
                <div className="text-xs uppercase tracking-[0.24em] text-blue-200">РњР°РєСЃРёРјР°Р»СЊРЅС‹Р№ Р±Р°Р»Р»</div>
                <div className="mt-3 text-5xl font-semibold">{questionnaire.maxPoints}</div>
                <div className="mt-6 text-xs uppercase tracking-[0.24em] text-blue-200">Р”РѕР»СЏ РІ РѕР±С‰РµРј СЂРµР№С‚РёРЅРіРµ</div>
                <div className="mt-3 text-5xl font-semibold">{questionnaire.weight}%</div>
              </div>
            </div>
          </section>

          <section id="indicators" className="mt-10 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">РђРЅРєРµС‚Р° в„–1</div>
                <h2 className="mt-2 text-3xl font-semibold text-slate-950">Р Р°СЃРїСЂРµРґРµР»РµРЅРёРµ Р±Р°Р»Р»РѕРІ РїРѕ РёРЅРґРёРєР°С‚РѕСЂР°Рј</h2>
              </div>

              <p className="max-w-xl text-sm leading-6 text-slate-500">
                РСЃСЃР»РµРґСѓР№ 7 РѕСЃРЅРѕРІРЅС‹С… РёРЅРґРёРєР°С‚РѕСЂРѕРІ: РІ РєР°Р¶РґРѕРј Р±Р»РѕРєРµ РїРѕРєР°Р·Р°РЅС‹ РІРµСЃ, РЅР°Р·РЅР°С‡РµРЅРёРµ Рё РєР»СЋС‡РµРІС‹Рµ РєСЂРёС‚РµСЂРёРё РѕС†РµРЅРєРё.
              </p>
            </div>

            <div className="mt-8 grid gap-4 xl:grid-cols-4">
              {indicators.map((item) => {
                const isActive = item.id === activeIndicator;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveIndicator(item.id)}
                    className={`rounded-[1.6rem] border p-5 text-left transition ${
                      isActive ? "border-orange-200 bg-orange-50 shadow-sm" : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className={`rounded-2xl p-3 ${isActive ? "bg-orange-100 text-orange-700" : "bg-white text-slate-600 ring-1 ring-slate-200"}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-500">{item.weight}%</div>
                        <div className="text-lg font-semibold text-slate-950">{item.points} Р±.</div>
                      </div>
                    </div>
                    <div className="mt-4 text-lg font-semibold leading-snug text-slate-950">{item.name}</div>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_290px]">
              <div className="rounded-[1.75rem] bg-slate-50 p-6 ring-1 ring-slate-200">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
                    <IndicatorIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">{indicator.weight}% РІРµСЃР° РђРЅРєРµС‚С‹ в„–1</div>
                    <h3 className="mt-2 text-3xl font-semibold text-slate-950">{indicator.name}</h3>
                    <p className="mt-4 text-sm leading-6 text-slate-600">{indicator.description}</p>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  {indicator.criteria.map((criterion) => (
                    <div key={criterion.code} className="rounded-[1.4rem] bg-white p-4 ring-1 ring-slate-200">
                      <div className="flex items-center justify-between gap-4">
                        <div className="text-sm font-medium uppercase tracking-[0.2em] text-blue-700">{criterion.code}</div>
                        <div className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">{criterion.points} Р±Р°Р»Р»РѕРІ</div>
                      </div>
                      <div className="mt-3 text-base leading-7 text-slate-900">{criterion.title}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.75rem] bg-[#fff7ed] p-6 ring-1 ring-orange-200">
                <div className="text-sm font-medium uppercase tracking-[0.24em] text-orange-700">Р‘С‹СЃС‚СЂС‹Р№ РѕСЂРёРµРЅС‚РёСЂ</div>
                <h3 className="mt-2 text-2xl font-semibold text-slate-950">Р“РґРµ СЃРѕСЃСЂРµРґРѕС‚РѕС‡РµРЅ РѕСЃРЅРѕРІРЅРѕР№ РІРµСЃ</h3>

                <div className="mt-6 space-y-4">
                  {indicators
                    .slice()
                    .sort((a, b) => b.points - a.points)
                    .map((item) => (
                      <div key={item.id}>
                        <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                          <span className="text-slate-700">{item.name}</span>
                          <span className="font-semibold text-slate-950">{item.points} Р±.</span>
                        </div>
                        <div className="h-2 rounded-full bg-orange-100">
                          <div className="h-2 rounded-full bg-orange-500" style={{ width: `${(item.points / 170) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                </div>

                <div className="mt-8 rounded-[1.4rem] bg-white p-4 ring-1 ring-orange-100">
                  <div className="text-sm text-slate-500">РЎР°РјС‹Р№ РІРµСЃРѕРјС‹Р№ Р±Р»РѕРє</div>
                  <div className="mt-1 text-lg font-semibold text-slate-950">РќР°СѓС‡РЅРѕ-РёСЃСЃР»РµРґРѕРІР°С‚РµР»СЊСЃРєР°СЏ Рё РёРЅРЅРѕРІР°С†РёРѕРЅРЅР°СЏ СЂР°Р±РѕС‚Р°</div>
                  <div className="mt-2 text-sm leading-6 text-slate-600">Р­С‚РѕС‚ Р±Р»РѕРє РґР°РµС‚ 170 Р±Р°Р»Р»РѕРІ, С‚Рѕ РµСЃС‚СЊ 21,25% РІСЃРµР№ РђРЅРєРµС‚С‹ в„–1.</div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-10 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700">РС‚РѕРі</div>
                <h2 className="mt-2 text-3xl font-semibold text-slate-950">Р§С‚Рѕ РІР°Р¶РЅРѕ РїРѕРЅРёРјР°С‚СЊ Рѕ РјРµС‚РѕРґРѕР»РѕРіРёРё</h2>
              </div>

              <Link href="/ranking" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800">
                РћС‚РєСЂС‹С‚СЊ СЂРµР№С‚РёРЅРі
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.5rem] bg-slate-50 p-5">
                <div className="text-lg font-semibold text-slate-950">РљРѕР»РёС‡РµСЃС‚РІРµРЅРЅР°СЏ Р±Р°Р·Р°</div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  РћСЃРЅРѕРІР° СЂРµР№С‚РёРЅРіР° вЂ” РїСЂРѕРІРµСЂСЏРµРјР°СЏ Р°РЅРєРµС‚Р° СЃ РїРѕРєР°Р·Р°С‚РµР»СЏРјРё СЃС‚СѓРґРµРЅС‚РѕРІ, РєР°РґСЂРѕРІ, РЅР°СѓРєРё, РјРµР¶РґСѓРЅР°СЂРѕРґРЅРѕР№ Р°РєС‚РёРІРЅРѕСЃС‚Рё, С†РёС„СЂРѕРІРёР·Р°С†РёРё Рё
                  С‚СЂСѓРґРѕСѓСЃС‚СЂРѕР№СЃС‚РІР°.
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-slate-50 p-5">
                <div className="text-lg font-semibold text-slate-950">Р РµРїСѓС‚Р°С†РёРѕРЅРЅС‹Р№ СЃР»РѕР№</div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  РђРЅРєРµС‚С‹ СЌРєСЃРїРµСЂС‚РѕРІ, СЂР°Р±РѕС‚РѕРґР°С‚РµР»РµР№, СЃС‚СѓРґРµРЅС‚РѕРІ Рё РІС‹РїСѓСЃРєРЅРёРєРѕРІ РґРѕР±Р°РІР»СЏСЋС‚ РѕР±СЂР°С‚РЅСѓСЋ СЃРІСЏР·СЊ Рѕ РєР°С‡РµСЃС‚РІРµ РІСѓР·Р° Рё РµРіРѕ СЂРµР·СѓР»СЊС‚Р°С‚Р°С….
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-slate-50 p-5">
                <div className="text-lg font-semibold text-slate-950">Р‘Р°Р»Р°РЅСЃ СЂРµР·СѓР»СЊС‚Р°С‚Р° Рё РїРѕС‚РµРЅС†РёР°Р»Р°</div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  РњРµС‚РѕРґРѕР»РѕРіРёСЏ РѕРґРЅРѕРІСЂРµРјРµРЅРЅРѕ СЃРјРѕС‚СЂРёС‚ РЅР° СЂРµСЃСѓСЂСЃС‹, РїСЂРѕС†РµСЃСЃС‹, РёСЃСЃР»РµРґРѕРІР°С‚РµР»СЊСЃРєСѓСЋ РїСЂРѕРґСѓРєС‚РёРІРЅРѕСЃС‚СЊ Рё РєРѕРЅРµС‡РЅС‹Р№ РІС‹С…РѕРґ вЂ” РєР°С‡РµСЃС‚РІРѕ
                  РІС‹РїСѓСЃРєРЅРёРєРѕРІ Рё РёС… С‚СЂСѓРґРѕСѓСЃС‚СЂРѕР№СЃС‚РІРѕ.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
