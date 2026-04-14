// ─────────────────────────────────────────
//  데이터
// ─────────────────────────────────────────
const ROLE_ORDER = { "길마": 0, "점장": 1, "직원": 2, "알바": 3, "손님": 4 };

const ROLE_STYLE = {
  "길마": "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40",
  "점장": "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40",
  "직원": "bg-blue-500/20 text-blue-300 border border-blue-500/40",
  "알바": "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40",
  "손님": "bg-gray-500/20 text-gray-400 border border-gray-600/40",
};

// 이전 전투력 (성장 비교용)
const PREV_POWER = {
  "그린상훈":     2968900000000,
  "블랙경윤":     3661300000000,
  "실버정환":     2071800000000,
  "오렌지완":     1181000000000,
  "김안셀모":     2450900000000,
  "지난이야기":   1679000000000,
  "빠따가2":      5050400000000,
  "레드웅이":     104335990000,
  "브라운철":     39180130000,
  "전설의영포티": 397761350000,
  "하영과돌돌":   1022200000000,
  "냥꾸니":       663848130000,
  "토우르":       253832780000,
  "나로e":        1782000000000,
  "닼읔낰이트":   1272400000000,
  "도돍":         1296100000000,
  "은평구돌주먹": 1032700000000,
  "짬뽕에소주":   906669110000,
  "쭈니짜응":     768887670000,
  "가산요소":     740924490000,
  "앙끼모륑":     553511730000,
  "구준표춘":     572659720000,
  "돈키호테바이": 172895530000,
  "몽팡팡":       9857800000,
  "민우민우민우": 2241400000000,
  "즐똥1":        742004710000,
};

const POWER_DATA = [
  { name: "그린상훈",     role: "길마", level: 100, job: "신궁",                power: 3528900000000 },
  { name: "블랙경윤",     role: "점장", level: 100, job: "아크메이지(썬,콜)",   power: 4161800000000 },
  { name: "실버정환",     role: "점장", level: 100, job: "섀도어",              power: 2236700000000 },
  { name: "오렌지완",     role: "직원", level: 98,  job: "아크메이지(불,독)",   power: 1251600000000 },
  { name: "김안셀모",     role: "직원", level: 98,  job: "아크메이지(썬,콜)",   power: 3193100000000 },
  { name: "지난이야기",   role: "직원", level: 98,  job: "히어로",              power: 1679000000000 },
  { name: "빠따가2",      role: "직원", level: 99,  job: "신궁",                power: 6722100000000 },
  { name: "레드웅이",     role: "직원", level: 91,  job: "비숍",                power: 113740620000  },
  { name: "브라운철",     role: "직원", level: 88,  job: "아크메이지(썬,콜)",   power: 50504580000   },
  { name: "전설의영포티", role: "직원", level: 93,  job: "섀도어",              power: 480086540000  },
  { name: "하영과돌돌",   role: "직원", level: 96,  job: "히어로",              power: 1100400000000 },
  { name: "냥꾸니",       role: "알바", level: 94,  job: "신궁",                power: 708932830000  },
  { name: "토우르",       role: "직원", level: 93,  job: "신궁",                power: 347721440000  },
  { name: "나로e",        role: "알바", level: 99,  job: "나이트로드",          power: 2026300000000 },
  { name: "닼읔낰이트",   role: "알바", level: 96,  job: "다크나이트",          power: 1272400000000 },
  { name: "도돍",         role: "알바", level: 96,  job: "아크메이지(썬,콜)",   power: 1410100000000 },
  { name: "은평구돌주먹", role: "손님", level: 97,  job: "나이트로드",          power: 1153300000000 },
  { name: "짬뽕에소주",   role: "알바", level: 97,  job: "히어로",              power: 1012000000000 },
  { name: "쭈니짜응",     role: "손님", level: 97,  job: "섀도어",              power: 909293890000  },
  { name: "가산요소",     role: "알바", level: 98,  job: "섀도어",              power: 872087850000  },
  { name: "앙끼모륑",     role: "손님", level: 94,  job: "아크메이지(썬,콜)",   power: 568668990000  },
  { name: "구준표춘",     role: "알바", level: 96,  job: "아크메이지(썬,콜)",   power: 578003680000  },
  { name: "돈키호테바이", role: "알바", level: 92,  job: "섀도어",              power: 211626980000  },
  { name: "핫딜방문판매", role: "손님", level: 93,  job: "아크메이지(불,독)",   power: 324444870000  },
  { name: "몽팡팡",       role: "손님", level: 82,  job: "비숍",                power: 11525600000   },
  { name: "민우민우민우", role: "손님", level: 98,  job: "섀도어",              power: 2444400000000 },
  { name: "즐똥1",        role: "손님", level: 95,  job: "아크메이지(썬,콜)",   power: 848896740000  },
  { name: "표뚀",         role: "손님", level: 95,  job: "나이트로드",          power: 984974380000  },
  { name: "맞수",         role: "손님", level: 96,  job: "나이트로드",          power: 875815540000  },
];

const COMPETITION_DATA = [
  { name: "빠따가2",      job: "신궁",               level: 99,  power: 6722100000000, score: 7331740000,  predicted: 8509383436,  silabtoo: "-13.8%" },
  { name: "블랙경윤",     job: "아크메이지(썬,콜)",  level: 100, power: 4161800000000, score: 5889780000,  predicted: 5465762980,  silabtoo: "+7.8%"  },
  { name: "그린상훈",     job: "신궁",               level: 100, power: 3528900000000, score: 5583340000,  predicted: 4713387326,  silabtoo: "+18.5%" },
  { name: "김안셀모",     job: "아크메이지(썬,콜)",  level: 98,  power: 3193100000000, score: 4627670000,  predicted: 4314196705,  silabtoo: "+7.3%"  },
  { name: "실버정환",     job: "섀도어",             level: 100, power: 2236700000000, score: 4450200000,  predicted: 3177252361,  silabtoo: "+40.1%" },
  { name: "민우민우민우", job: "섀도어",             level: 98,  power: 2444400000000, score: 3267700000,  predicted: 3424160914,  silabtoo: "-4.6%"  },
  { name: "오렌지완",     job: "아크메이지(불,독)",  level: 98,  power: 1251600000000, score: 3235500000,  predicted: 2006190176,  silabtoo: "+61.3%" },
  { name: "지난이야기",   job: "히어로",             level: 98,  power: 1679000000000, score: 2698810000,  predicted: 2514272582,  silabtoo: "+7.3%"  },
  { name: "나로e",        job: "나이트로드",          level: 99,  power: 2026300000000, score: 2674110000,  predicted: 2927134115,  silabtoo: "-8.6%"  },
  { name: "도돍",         job: "아크메이지(썬,콜)",  level: 96,  power: 1410100000000, score: 2195810000,  predicted: 2194611003,  silabtoo: "+0.1%"  },
  { name: "은평구돌주먹", job: "나이트로드",          level: 97,  power: 1153300000000, score: 1971330000,  predicted: 1889333600,  silabtoo: "+4.3%"  },
  { name: "쭈니짜응",     job: "섀도어",             level: 97,  power:  909293890000, score: 1922790000,  predicted: 1599265254,  silabtoo: "+20.2%" },
  { name: "짬뽕에소주",   job: "히어로",             level: 97,  power: 1012000000000, score: 1677190000,  predicted: 1721359703,  silabtoo: "-2.6%"  },
  { name: "닼읔낰이트",   job: "다크나이트",          level: 96,  power: 1272400000000, score: 1467300000,  predicted: 2030916695,  silabtoo: "-27.8%" },
  { name: "하영과돌돌",   job: "히어로",             level: 96,  power: 1100400000000, score: 1297470000,  predicted: 1826447407,  silabtoo: "-29.0%" },
  { name: "가산요소",     job: "섀도어",             level: 98,  power:  872087850000, score: 1284250000,  predicted: 1555035646,  silabtoo: "-17.4%" },
  { name: "냥꾸니",       job: "신궁",               level: 94,  power:  708932830000, score: 1234270000,  predicted: 1361081049,  silabtoo: "-9.3%"  },
  { name: "토우르",       job: "신궁",               level: 93,  power:  347721440000, score: 1228210000,  predicted:  931682003,  silabtoo: "+31.8%" },
  { name: "구준표춘",     job: "아크메이지(썬,콜)",  level: 96,  power:  578003680000, score: 1116370000,  predicted: 1205435757,  silabtoo: "-7.4%"  },
  { name: "핫딜방문판매", job: "아크메이지(불,독)",  level: 93,  power:  324444870000, score:  822370000,  predicted:  904011401,  silabtoo: "-9.0%"  },
  { name: "전설의영포티", job: "섀도어",             level: 93,  power:  480086540000, score:  815070000,  predicted: 1089034316,  silabtoo: "-25.2%" },
  { name: "앙끼모륑",     job: "아크메이지(썬,콜)",  level: 94,  power:  568668990000, score:  741650000,  predicted: 1194338912,  silabtoo: "-37.9%" },
  { name: "레드웅이",     job: "비숍",               level: 91,  power:  113740620000, score:  679220000,  predicted:  653531470,  silabtoo: "+3.9%"  },
  { name: "돈키호테바이", job: "섀도어",             level: 92,  power:  211626980000, score:  495080000,  predicted:  769896321,  silabtoo: "-35.7%" },
  { name: "브라운철",     job: "아크메이지(썬,콜)",  level: 88,  power:   50504580000, score:  248770000,  predicted:  578358051,  silabtoo: "-57.0%" },
  { name: "몽팡팡",       job: "비숍",               level: 82,  power:   11525600000, score:  132100000,  predicted:  532020817,  silabtoo: "-75.2%" },
  { name: "즐똥1",        job: "아크메이지(썬,콜)",  level: 95,  power:  848896740000, score:          0,  predicted:          0,  silabtoo: ""       },
  { name: "표뚀",         job: "나이트로드",          level: 95,  power:  984974380000, score:          0,  predicted:          0,  silabtoo: ""       },
  { name: "맞수",         job: "나이트로드",          level: 96,  power:  875815540000, score:          0,  predicted:          0,  silabtoo: ""       },
];

const TRAINING_CENTER_DATA = [
  { name: "빠따가2",       job: "신궁",               level: 99,  power: 6722100000000,  score: 5093025, predicted: 5300877, silabtoo: "-3.9%"  },
  { name: "블랙경윤",       job: "아크메이지(썬,콜)",   level: 100, power: 4161800000000,  score: 4026165, predicted: 3592704, silabtoo: "+12.1%" },
  { name: "그린상훈",       job: "신궁",               level: 100, power: 3528900000000,  score: 3414468, predicted: 3170448, silabtoo: "+7.7%"  },
  { name: "김안셀모",       job: "아크메이지(썬,콜)",   level: 98,  power: 3193100000000,  score: 2944581, predicted: 2946410, silabtoo: "-0.1%"  },
  { name: "오렌지완",       job: "아크메이지(불,독)",   level: 98,  power: 1251600000000,  score: 2830929, predicted: 1651086, silabtoo: "+71.5%" },
  { name: "실버정환",       job: "섀도어",              level: 100, power: 2236700000000,  score: 2644353, predicted: 2308322, silabtoo: "+14.6%" },
  { name: "은평구돌주먹",   job: "나이트로드",           level: 97,  power: 1153300000000,  score: 2336577, predicted: 1585503, silabtoo: "+47.4%" },
  { name: "도돍",           job: "아크메이지(썬,콜)",   level: 96,  power: 1410100000000,  score: 2083350, predicted: 1756834, silabtoo: "+18.6%" },
  { name: "나로e",          job: "나이트로드",           level: 99,  power: 2026300000000,  score: 2073678, predicted: 2167948, silabtoo: "-4.3%"  },
  { name: "닼읔낰이트",     job: "다크나이트",           level: 96,  power: 1272400000000,  score: 1606308, predicted: 1664963, silabtoo: "-3.5%"  },
  { name: "하영과돌돌",     job: "히어로",              level: 96,  power: 1100400000000,  score: 1540953, predicted: 1550209, silabtoo: "-0.6%"  },
  { name: "쭈니짜응",       job: "섀도어",              level: 97,  power:  909293890000,  score: 1538064, predicted: 1422707, silabtoo: "+8.1%"  },
  { name: "가산요소",       job: "섀도어",              level: 98,  power:  872087850000,  score: 1501092, predicted: 1397884, silabtoo: "+7.4%"  },
  { name: "토우르",         job: "신궁",               level: 93,  power:  347721440000,  score: 1401417, predicted: 1048039, silabtoo: "+33.7%" },
  { name: "지난이야기",     job: "히어로",              level: 98,  power: 1679000000000,  score: 1352292, predicted: 1936237, silabtoo: "-30.2%" },
  { name: "냥꾸니",         job: "신궁",               level: 94,  power:  708932830000,  score: 1311351, predicted: 1289031, silabtoo: "+1.7%"  },
  { name: "구준표춘",       job: "아크메이지(썬,콜)",   level: 96,  power:  578003680000,  score: 1302021, predicted: 1201678, silabtoo: "+8.4%"  },
  { name: "즐똥1",          job: "아크메이지(썬,콜)",   level: 95,  power:  848896740000,  score: 1292703, predicted: 1382412, silabtoo: "-6.5%"  },
  { name: "민우민우민우",   job: "섀도어",              level: 98,  power: 2444400000000,  score: 1065756, predicted: 2446895, silabtoo: "-56.4%" },
  { name: "레드웅이",       job: "비숍",               level: 91,  power:  113740620000,  score: 1034106, predicted:  891933, silabtoo: "+15.9%" },
  { name: "앙끼모륑",       job: "아크메이지(썬,콜)",   level: 94,  power:  568668990000,  score:  923868, predicted: 1195450, silabtoo: "-22.7%" },
  { name: "브라운철",       job: "아크메이지(썬,콜)",   level: 88,  power:   50504580000,  score:  649644, predicted:  849743, silabtoo: "-23.5%" },
  { name: "전설의영포티",   job: "섀도어",              level: 93,  power:  480086540000,  score:  590580, predicted: 1136350, silabtoo: "-48.0%" },
  { name: "몽팡팡",         job: "비숍",               level: 82,  power:   11525600000,  score:  570171, predicted:  823737, silabtoo: "-30.8%" },
  { name: "돈키호테바이",   job: "섀도어",              level: 92,  power:  211626980000,  score:  547188, predicted:  957240, silabtoo: "-42.8%" },
  { name: "짬뽕에소주",     job: "히어로",              level: 97,  power: 1012000000000,  score:       0, predicted:       0, silabtoo: ""       },
  { name: "핫딜방문판매",   job: "아크메이지(불,독)",   level: 93,  power:  324444870000,  score:       0, predicted:       0, silabtoo: ""       },
  { name: "표뚀",           job: "나이트로드",           level: 95,  power:  984974380000,  score:       0, predicted:       0, silabtoo: ""       },
  { name: "맞수",           job: "나이트로드",           level: 96,  power:  875815540000,  score:       0, predicted:       0, silabtoo: ""       },
];


const RAID_DATA = [
  { name: "그린상훈",     job: "신궁",               level: 100, power: 3528900000000,  score: "108억3907만", predicted:  7866227530, silabtoo: "+37.8%" },
  { name: "블랙경윤",     job: "아크메이지(썬,콜)",  level: 100, power: 4161800000000,  score: "95억6731만",  predicted:  9062062116, silabtoo: "+5.6%"  },
  { name: "실버정환",     job: "섀도어",             level: 100, power: 2236700000000,  score: "69억6266만",  predicted:  5424676807, silabtoo: "+28.4%" },
  { name: "오렌지완",     job: "아크메이지(불,독)",  level: 98,  power: 1251600000000,  score: "60억4815만",  predicted:  3563376996, silabtoo: "+69.7%" },
  { name: "김안셀모",     job: "아크메이지(썬,콜)",  level: 98,  power: 3193100000000,  score: "65억1191만",  predicted:  7231749328, silabtoo: "-10.0%" },
  { name: "지난이야기",   job: "히어로",             level: 98,  power: 1679000000000,  score: "54억9337만",  predicted:  4370929061, silabtoo: "+25.7%" },
  { name: "빠따가2",      job: "신궁",               level: 99,  power: 6722100000000,  score: "119억7722만", predicted: 13899627751, silabtoo: "-13.8%" },
  { name: "레드웅이",     job: "비숍",               level: 91,  power: 113740620000,   score: "9억2291만",   predicted:  1413445568, silabtoo: "-34.7%" },
  { name: "브라운철",     job: "아크메이지(썬,콜)",  level: 88,  power: 50504580000,    score: "5억88853만",  predicted:  1293964065, silabtoo: "+7.3%"  },
  { name: "전설의영포티", job: "섀도어",             level: 93,  power: 480086540000,   score: "14억8648만",  predicted:  2105638840, silabtoo: "-29.4%" },
  { name: "하영과돌돌",   job: "히어로",             level: 96,  power: 1100400000000,  score: "31억3345만",  predicted:  3277691754, silabtoo: "-4.4%"  },
  { name: "토우르",       job: "신궁",               level: 93,  power: 347721440000,   score: "24억4540만",  predicted:  1855541250, silabtoo: "+31.8%" },
  { name: "냥꾸니",       job: "신궁",               level: 94,  power: 708932830000,   score: "22억5179만",  predicted:  2538033070, silabtoo: "-11.3%" },
  { name: "나로e",        job: "나이트로드",          level: 99,  power: 2026300000000,  score: "60억7836만",  predicted:  5027135969, silabtoo: "+20.9%" },
  { name: "닼읔낰이트",   job: "다크나이트",          level: 96,  power: 1272400000000,  score: "25억3124만",  predicted:  3602677611, silabtoo: "-29.7%" },
  { name: "도돍",         job: "아크메이지(썬,콜)",  level: 96,  power: 1410100000000,  score: "52억1889만",  predicted:  3862855242, silabtoo: "+35.1%" },
  { name: "짬뽕에소주",   job: "히어로",             level: 97,  power: 1012000000000,  score: "33억9868만",  predicted:  3110664140, silabtoo: "+9.3%"  },
  { name: "가산요소",     job: "섀도어",             level: 98,  power: 872087850000,   score: "30억1133만",  predicted:  2846306756, silabtoo: "+5.8%"  },
  { name: "구준표춘",     job: "아크메이지(썬,콜)",  level: 96,  power: 578003680000,   score: "18억5777만",  predicted:  2290648640, silabtoo: "-18.9%" },
  { name: "돈키호테바이", job: "섀도어",             level: 92,  power: 211626980000,   score: "9억4408만",   predicted:  1598397211, silabtoo: "-40.9%" },
  { name: "은평구돌주먹", job: "나이트로드",          level: 97,  power: 1153300000000,  score: "32억3899만",  predicted:  3377643800, silabtoo: "-4.1%"  },
  { name: "쭈니짜응",     job: "섀도어",             level: 97,  power: 909293890000,   score: "25억8041만",  predicted:  2916605807, silabtoo: "-11.5%" },
  { name: "앙끼모륑",     job: "아크메이지(썬,콜)",  level: 94,  power: 568668990000,   score: "14억4565만",  predicted:  2273011185, silabtoo: "-36.4%" },
  { name: "핫딜방문판매", job: "아크메이지(불,독)",  level: 93,  power: 324444870000,   score: "0",           predicted:           0, silabtoo: ""       },
  { name: "몽팡팡",       job: "비숍",               level: 82,  power: 11525600000,    score: "1억8725만",   predicted:  1220315127, silabtoo: "-84.7%" },
  { name: "민우민우민우", job: "섀도어",             level: 98,  power: 2444400000000,  score: "32억3752만",  predicted:  5817116124, silabtoo: "-44.3%" },
  { name: "즐똥1",        job: "아크메이지(썬,콜)",  level: 95,  power: 848896740000,   score: "18억9041만",  predicted:  2802488252, silabtoo: "-32.5%" },
  { name: "표뚀",         job: "나이트로드",          level: 95,  power: 984974380000,   score: "0",           predicted:           0, silabtoo: ""       },
  { name: "맞수",         job: "나이트로드",          level: 96,  power: 875815540000,   score: "0",           predicted:           0, silabtoo: ""       },
];

// ─────────────────────────────────────────
//  유틸
// ─────────────────────────────────────────
function formatPower(n) {
  const jo  = Math.floor(n / 1_000_000_000_000);
  const eok = Math.floor((n % 1_000_000_000_000) / 100_000_000);
  const man = Math.floor((n % 100_000_000) / 10_000);
  const parts = [];
  if (jo  > 0) parts.push(`${jo}조`);
  if (eok > 0) parts.push(`${eok}억`);
  if (man > 0) parts.push(`${man}만`);
  return parts.join(' ') || '0';
}

function parsePowerKo(str) {
  let total = 0;
  const jo  = str.match(/(\d+)조/);  if (jo)  total += parseInt(jo[1])  * 1_000_000_000_000;
  const eok = str.match(/(\d+)억/);  if (eok) total += parseInt(eok[1]) * 100_000_000;
  const man = str.match(/(\d+)만/);  if (man) total += parseInt(man[1]) * 10_000;
  return total;
}

// ─────────────────────────────────────────
//  탭 전환
// ─────────────────────────────────────────
function showTab(name) {
  ['home', 'power', 'competition', 'training', 'raid'].forEach(t => {
    document.getElementById(`section-${t}`).classList.toggle('hidden', t !== name);
    const btn = document.getElementById(`tab-${t}`);
    if (t === name) btn.classList.add('tab-active');
    else            btn.classList.remove('tab-active');
  });
}

function parseScoreKo(str) {
  if (!str || str === '0') return 0;
  let total = 0;
  const eok = str.match(/(\d+)억/);  if (eok) total += parseInt(eok[1]) * 100_000_000;
  const man = str.match(/(\d+)만/);  if (man) total += parseInt(man[1]) * 10_000;
  return total;
}

// ─────────────────────────────────────────
//  홈 렌더링
// ─────────────────────────────────────────
function renderHome() {
  const sorted = [...POWER_DATA].sort((a, b) => b.power - a.power);
  const total  = sorted.reduce((s, d) => s + d.power, 0);
  const avg    = total / sorted.length;
  document.getElementById('stat-members').textContent     = sorted.length + '명';
  document.getElementById('stat-total-power').textContent = formatPower(total);
  document.getElementById('stat-avg-power').textContent   = formatPower(Math.round(avg));

  const medals = ['🥇', '🥈', '🥉'];
  const styles = [
    'from-yellow-900/40 border-yellow-500/40 text-yellow-300',
    'from-gray-700/30 border-gray-600/40 text-gray-300',
    'from-orange-900/30 border-orange-600/40 text-orange-300',
  ];
  document.getElementById('top3-cards').innerHTML = sorted.slice(0, 3).map((d, i) => `
    <div class="bg-gradient-to-br ${styles[i]} border rounded-xl p-5">
      <div class="text-3xl mb-2">${medals[i]}</div>
      <div class="font-black text-white text-base">${d.name}</div>
      <div class="text-xs text-gray-400 mt-1">${d.job} · Lv.${d.level}</div>
      <div class="text-sm mt-1 opacity-80">${formatPower(d.power)}</div>
    </div>
  `).join('');

  // 성장 TOP 3 (이전 데이터 있는 멤버만)
  const growthList = POWER_DATA
    .filter(d => PREV_POWER[d.name] !== undefined)
    .map(d => ({ ...d, growth: d.power - PREV_POWER[d.name] }))
    .sort((a, b) => b.growth - a.growth)
    .slice(0, 3);

  const growthStyles = [
    'from-emerald-900/40 border-emerald-500/40',
    'from-teal-900/30 border-teal-600/40',
    'from-cyan-900/30 border-cyan-600/40',
  ];
  document.getElementById('growth3-cards').innerHTML = growthList.map((d, i) => `
    <div class="bg-gradient-to-br ${growthStyles[i]} border rounded-xl p-5">
      <div class="text-xl font-black text-emerald-400 mb-2">${i + 1}위</div>
      <div class="font-black text-white text-base">${d.name}</div>
      <div class="text-xs text-gray-400 mt-1">${d.job} · Lv.${d.level}</div>
      <div class="text-emerald-400 font-bold text-sm mt-2">+${formatPower(d.growth)}</div>
      <div class="text-xs text-gray-500 mt-0.5">${formatPower(PREV_POWER[d.name])} → ${formatPower(d.power)}</div>
    </div>
  `).join('');
}

// ─────────────────────────────────────────
//  멤버 목록 섹션
// ─────────────────────────────────────────
function renderPower() {
  // 직위 순서 → 같은 직위 내에서는 전투력 내림차순
  const sorted = [...POWER_DATA].sort((a, b) =>
    ROLE_ORDER[a.role] !== ROLE_ORDER[b.role]
      ? ROLE_ORDER[a.role] - ROLE_ORDER[b.role]
      : b.power - a.power
  );

  document.getElementById('power-count').textContent = `총 ${sorted.length}명`;

  document.getElementById('power-table-body').innerHTML = sorted.map(d => {
    const badge = `<span class="px-2 py-0.5 rounded text-xs font-semibold ${ROLE_STYLE[d.role]}">${d.role}</span>`;
    return `
      <tr class="hover:bg-gray-800/40 transition-colors">
        <td class="px-4 py-3 font-medium text-white">${d.name}</td>
        <td class="px-4 py-3 text-center">${badge}</td>
        <td class="px-4 py-3 text-center text-gray-400">Lv.${d.level}</td>
        <td class="px-4 py-3 text-gray-300">${d.job}</td>
        <td class="px-4 py-3 text-right text-gray-200 tabular-nums">${formatPower(d.power)}</td>
      </tr>`;
  }).join('');
}

// ─────────────────────────────────────────
//  대항전 섹션
// ─────────────────────────────────────────
function renderCompetition() {
  const participants = COMPETITION_DATA.filter(d => d.score > 0);
  const avgScore     = participants.reduce((s, d) => s + d.score, 0) / participants.length;
  const avgPredicted = participants.reduce((s, d) => s + d.predicted, 0) / participants.length;

  const silabtooVals = participants.map(d => parseFloat(d.silabtoo) || 0);
  const maxSilabtoo  = Math.max(...silabtooVals.map(v => Math.abs(v)));

  // R² 계산 (예측점수 활용)
  const ys    = participants.map(d => d.score);
  const n     = participants.length;
  const my    = ys.reduce((a, b) => a + b, 0) / n;
  const ssTot = ys.reduce((s, y) => s + (y - my) ** 2, 0);
  const ssRes = participants.reduce((s, d) => s + (d.score - d.predicted) ** 2, 0);
  const r2    = (1 - ssRes / ssTot).toFixed(4);

  const totalScore = participants.reduce((s, d) => s + d.score, 0);

  document.getElementById('competition-stats').innerHTML = `
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div class="text-gray-500 text-xs mb-2">참여 인원</div>
      <div class="text-2xl font-bold text-white">${participants.length}명</div>
      <div class="text-xs text-gray-600 mt-1">미참여 ${COMPETITION_DATA.length - participants.length}명</div>
    </div>
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div class="text-gray-500 text-xs mb-2">총 점수</div>
      <div class="text-lg font-bold text-white">${formatPower(totalScore)}</div>
    </div>
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div class="text-gray-500 text-xs mb-2">평균 점수</div>
      <div class="text-lg font-bold text-emerald-400">${formatPower(Math.round(avgScore))}</div>
      <div class="text-xs text-gray-600 mt-1">R² = ${r2}</div>
    </div>`;

  const sorted = [...COMPETITION_DATA].sort((a, b) => {
    if (a.score === 0 && b.score === 0) return 0;
    if (a.score === 0) return 1;
    if (b.score === 0) return -1;
    return b.score - a.score;
  });

  document.getElementById('competition-count').textContent = `총 ${sorted.length}명`;

  let rank = 0;
  document.getElementById('competition-table-body').innerHTML = sorted.map(d => {
    const isZero = d.score === 0;
    if (!isZero) rank++;

    const rankCls = rank === 1 ? 'text-yellow-400 font-black' :
                    rank === 2 ? 'text-slate-300 font-bold'   :
                    rank === 3 ? 'text-orange-400 font-bold'  : 'text-gray-500';

    let effBar = `<span class="text-gray-700 text-xs">—</span>`;
    if (!isZero && d.silabtoo) {
      const val      = parseFloat(d.silabtoo) || 0;
      const clipped  = maxSilabtoo > 0 ? Math.max(-1, Math.min(1, val / maxSilabtoo)) : 0;
      const pct      = Math.abs(clipped) * 44;
      const isAbove  = val >= 0;
      const labelCls = isAbove ? 'text-emerald-400' : 'text-rose-400';
      const fillLeft  = isAbove ? '50%' : `${50 - pct}%`;
      const fillWidth = `${pct}%`;
      const fillColor = isAbove ? '#10b981' : '#f43f5e';

      effBar = `
        <div class="flex items-center gap-2 justify-center">
          <div class="relative w-28 h-2 bg-gray-800 rounded overflow-hidden flex-shrink-0">
            <div class="absolute top-0 h-full rounded"
                 style="left:${fillLeft}; width:${fillWidth}; background:${fillColor};"></div>
            <div class="absolute top-0 h-full w-px bg-gray-500" style="left:50%"></div>
          </div>
          <span class="text-xs font-semibold tabular-nums ${labelCls} w-10 text-right">${d.silabtoo}</span>
        </div>`;
    }

    return `
      <tr class="hover:bg-gray-800/40 transition-colors ${isZero ? 'opacity-40' : ''}">
        <td class="px-4 py-3 ${rankCls}">${isZero ? '-' : rank}</td>
        <td class="px-4 py-3 font-medium text-white">${d.name}</td>
        <td class="px-4 py-3 text-center text-xs text-gray-400">${d.job}</td>
        <td class="px-4 py-3 text-center text-gray-300 tabular-nums">${d.level}</td>
        <td class="px-4 py-3 text-right text-gray-400 tabular-nums">${formatPower(d.power)}</td>
        <td class="px-4 py-3 text-right font-semibold ${isZero ? 'text-gray-600' : 'text-emerald-400'} tabular-nums">${isZero ? '미참여' : formatPower(d.score)}</td>
        <td class="px-4 py-3 text-right text-gray-500 tabular-nums">${isZero ? '-' : formatPower(d.predicted)}</td>
        <td class="px-4 py-3">${effBar}</td>
      </tr>`;
  }).join('');
}


// ─────────────────────────────────────────
//  수련장 점수 포매터
// ─────────────────────────────────────────
function formatTrainingScore(n) {
  if (!n) return '0';
  const man = Math.floor(n / 10_000);
  const rem = n % 10_000;
  if (man > 0 && rem > 0) return `${man}만${rem}`;
  if (man > 0) return `${man}만`;
  return `${n}`;
}

// ─────────────────────────────────────────
//  길드 수련장 멤버 점수 섹션
// ─────────────────────────────────────────
function renderTrainingCenter() {
  const participants = TRAINING_CENTER_DATA.filter(d => d.score > 0);
  const avgScore     = participants.reduce((s, d) => s + d.score, 0) / participants.length;
  const avgPredicted = participants.reduce((s, d) => s + d.predicted, 0) / participants.length;

  const silabtooVals = participants.map(d => parseFloat(d.silabtoo) || 0);
  const maxSilabtoo  = Math.max(...silabtooVals.map(v => Math.abs(v)));

  const ys    = participants.map(d => d.score);
  const n     = participants.length;
  const my    = ys.reduce((a, b) => a + b, 0) / n;
  const ssTot = ys.reduce((s, y) => s + (y - my) ** 2, 0);
  const ssRes = participants.reduce((s, d) => s + (d.score - d.predicted) ** 2, 0);
  const r2    = (1 - ssRes / ssTot).toFixed(4);

  const totalScore = participants.reduce((s, d) => s + d.score, 0);

  document.getElementById('training-center-stats').innerHTML = `
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div class="text-gray-500 text-xs mb-2">참여 인원</div>
      <div class="text-2xl font-bold text-white">${participants.length}명</div>
      <div class="text-xs text-gray-600 mt-1">미참여 ${TRAINING_CENTER_DATA.length - participants.length}명</div>
    </div>
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div class="text-gray-500 text-xs mb-2">총 점수</div>
      <div class="text-lg font-bold text-white">${formatTrainingScore(totalScore)}</div>
    </div>
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div class="text-gray-500 text-xs mb-2">평균 점수</div>
      <div class="text-lg font-bold text-emerald-400">${formatTrainingScore(Math.round(avgScore))}</div>
      <div class="text-xs text-gray-600 mt-1">R² = ${r2}</div>
    </div>`;

  const sorted = [...TRAINING_CENTER_DATA].sort((a, b) => {
    if (a.score === 0 && b.score === 0) return 0;
    if (a.score === 0) return 1;
    if (b.score === 0) return -1;
    return b.score - a.score;
  });

  document.getElementById('training-center-count').textContent = `총 ${sorted.length}명`;

  let rank = 0;
  document.getElementById('training-center-table-body').innerHTML = sorted.map(d => {
    const isZero = d.score === 0;
    if (!isZero) rank++;

    const rankCls = rank === 1 ? 'text-yellow-400 font-black' :
                    rank === 2 ? 'text-slate-300 font-bold'   :
                    rank === 3 ? 'text-orange-400 font-bold'  : 'text-gray-500';

    let effBar = `<span class="text-gray-700 text-xs">—</span>`;
    if (!isZero && d.silabtoo) {
      const val      = parseFloat(d.silabtoo) || 0;
      const clipped  = maxSilabtoo > 0 ? Math.max(-1, Math.min(1, val / maxSilabtoo)) : 0;
      const pct      = Math.abs(clipped) * 44;
      const isAbove  = val >= 0;
      const labelCls = isAbove ? 'text-emerald-400' : 'text-rose-400';
      const fillLeft  = isAbove ? '50%' : `${50 - pct}%`;
      const fillWidth = `${pct}%`;
      const fillColor = isAbove ? '#10b981' : '#f43f5e';

      effBar = `
        <div class="flex items-center gap-2 justify-center">
          <div class="relative w-28 h-2 bg-gray-800 rounded overflow-hidden flex-shrink-0">
            <div class="absolute top-0 h-full rounded"
                 style="left:${fillLeft}; width:${fillWidth}; background:${fillColor};"></div>
            <div class="absolute top-0 h-full w-px bg-gray-500" style="left:50%"></div>
          </div>
          <span class="text-xs font-semibold tabular-nums ${labelCls} w-10 text-right">${d.silabtoo}</span>
        </div>`;
    }

    return `
      <tr class="hover:bg-gray-800/40 transition-colors ${isZero ? 'opacity-40' : ''}">
        <td class="px-4 py-3 ${rankCls}">${isZero ? '-' : rank}</td>
        <td class="px-4 py-3 font-medium text-white">${d.name}</td>
        <td class="px-4 py-3 text-center text-xs text-gray-400">${d.job}</td>
        <td class="px-4 py-3 text-center text-gray-300 tabular-nums">${d.level}</td>
        <td class="px-4 py-3 text-right text-gray-400 tabular-nums">${formatPower(d.power)}</td>
        <td class="px-4 py-3 text-right font-semibold ${isZero ? 'text-gray-600' : 'text-emerald-400'} tabular-nums">${isZero ? '미참여' : formatTrainingScore(d.score)}</td>
        <td class="px-4 py-3 text-right text-gray-500 tabular-nums">${isZero ? '-' : formatTrainingScore(d.predicted)}</td>
        <td class="px-4 py-3">${effBar}</td>
      </tr>`;
  }).join('');
}

// ─────────────────────────────────────────
//  초기화
// ─────────────────────────────────────────
// ─────────────────────────────────────────
//  길드 토벌전 섹션
// ─────────────────────────────────────────
function renderRaid() {
  const participants = RAID_DATA.filter(d => parseScoreKo(d.score) > 0 && d.power > 0);
  const avgScore     = participants.reduce((s,d)=>s+parseScoreKo(d.score),0) / participants.length;
  const avgPredicted = participants.reduce((s,d)=>s+d.predicted,0) / participants.length;

  // 실압투 수치 파싱 ("+37.8%" → 37.8)
  const silabtooVals = participants.map(d => parseFloat(d.silabtoo) || 0);
  const maxSilabtoo  = Math.max(...silabtooVals.map(v => Math.abs(v)));

  // R² 계산 (예측점수 활용)
  const ys    = participants.map(d => parseScoreKo(d.score));
  const n     = participants.length;
  const my    = ys.reduce((a,b)=>a+b,0)/n;
  const ssTot = ys.reduce((s,y)=>s+(y-my)**2,0);
  const ssRes = participants.reduce((s,d)=>s+(parseScoreKo(d.score)-d.predicted)**2,0);
  const r2    = (1 - ssRes/ssTot).toFixed(4);

  const totalScore = participants.reduce((s,d)=>s+parseScoreKo(d.score),0);

  // 요약 카드
  document.getElementById('raid-stats').innerHTML = `
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div class="text-gray-500 text-xs mb-2">참여 인원</div>
      <div class="text-2xl font-bold text-white">${participants.length}명</div>
      <div class="text-xs text-gray-600 mt-1">미참여 ${RAID_DATA.length - participants.length}명</div>
    </div>
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div class="text-gray-500 text-xs mb-2">총 점수</div>
      <div class="text-lg font-bold text-white">${formatPower(totalScore)}</div>
    </div>
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div class="text-gray-500 text-xs mb-2">평균 점수</div>
      <div class="text-lg font-bold text-emerald-400">${formatPower(Math.round(avgScore))}</div>
      <div class="text-xs text-gray-600 mt-1">R² = ${r2}</div>
    </div>`;

  // 정렬: 점수 내림차순, 0점 맨 아래
  const sorted = [...RAID_DATA].sort((a, b) => {
    const sa = parseScoreKo(a.score), sb = parseScoreKo(b.score);
    if (sa === 0 && sb === 0) return 0;
    if (sa === 0) return 1;
    if (sb === 0) return -1;
    return sb - sa;
  });

  document.getElementById('raid-count').textContent = `총 ${sorted.length}명`;

  let rank = 0;
  document.getElementById('raid-table-body').innerHTML = sorted.map(d => {
    const score  = parseScoreKo(d.score);
    const isZero = score === 0;
    if (!isZero) rank++;

    const rankCls = rank === 1 ? 'text-yellow-400 font-black' :
                    rank === 2 ? 'text-slate-300 font-bold'   :
                    rank === 3 ? 'text-orange-400 font-bold'  : 'text-gray-500';

    // 실압투 바 (CSV 값 직접 사용)
    let effBar = `<span class="text-gray-700 text-xs">—</span>`;
    if (!isZero && d.silabtoo) {
      const val      = parseFloat(d.silabtoo) || 0;
      const clipped  = maxSilabtoo > 0 ? Math.max(-1, Math.min(1, val / maxSilabtoo)) : 0;
      const pct      = Math.abs(clipped) * 44;
      const isAbove  = val >= 0;
      const labelCls = isAbove ? 'text-emerald-400' : 'text-rose-400';

      const fillLeft  = isAbove ? '50%' : `${50 - pct}%`;
      const fillWidth = `${pct}%`;
      const fillColor = isAbove ? '#10b981' : '#f43f5e';

      effBar = `
        <div class="flex items-center gap-2 justify-center">
          <div class="relative w-28 h-2 bg-gray-800 rounded overflow-hidden flex-shrink-0">
            <div class="absolute top-0 h-full rounded"
                 style="left:${fillLeft}; width:${fillWidth}; background:${fillColor};"></div>
            <div class="absolute top-0 h-full w-px bg-gray-500" style="left:50%"></div>
          </div>
          <span class="text-xs font-semibold tabular-nums ${labelCls} w-10 text-right">${d.silabtoo}</span>
        </div>`;
    }

    return `
      <tr class="hover:bg-gray-800/40 transition-colors ${isZero ? 'opacity-40' : ''}">
        <td class="px-4 py-3 ${rankCls}">${isZero ? '-' : rank}</td>
        <td class="px-4 py-3 font-medium text-white">${d.name}</td>
        <td class="px-4 py-3 text-center text-xs text-gray-400">${d.job}</td>
        <td class="px-4 py-3 text-center text-gray-300 tabular-nums">${d.level}</td>
        <td class="px-4 py-3 text-right text-gray-400 tabular-nums">${d.power ? formatPower(d.power) : '-'}</td>
        <td class="px-4 py-3 text-right font-semibold ${isZero ? 'text-gray-600' : 'text-emerald-400'} tabular-nums">${isZero ? '미참여' : d.score}</td>
        <td class="px-4 py-3 text-right text-gray-500 tabular-nums">${isZero ? '-' : formatPower(d.predicted)}</td>
        <td class="px-4 py-3">${effBar}</td>
      </tr>`;
  }).join('');
}

renderHome();
renderPower();
renderCompetition();
renderTrainingCenter();
renderRaid();
