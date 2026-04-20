// ─────────────────────────────────────────
//  상수
// ─────────────────────────────────────────
const ROLE_ORDER = { "길마": 0, "점장": 1, "직원": 2, "알바": 3, "손님": 4 };

const ROLE_STYLE = {
  "길마": "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40",
  "점장": "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40",
  "직원": "bg-blue-500/20 text-blue-300 border border-blue-500/40",
  "알바": "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40",
  "손님": "bg-gray-500/20 text-gray-400 border border-gray-600/40",
};

// ─────────────────────────────────────────
//  전체 JSON 캐시 (전 날짜 포함)
// ─────────────────────────────────────────
let POWER_JSON       = { dates: [], records: {} };
let COMPETITION_JSON = { dates: [], records: {} };
let TRAINING_JSON    = { dates: [], records: {} };
let RAID_JSON        = { dates: [], records: {} };

// ─────────────────────────────────────────
//  현재 화면에 표시 중인 데이터
// ─────────────────────────────────────────
let POWER_DATA           = [];
let PREV_POWER           = {};   // { name: power }
let COMPETITION_DATA     = [];
let TRAINING_CENTER_DATA = [];
let RAID_DATA            = [];

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

function formatTrainingScore(n) {
  if (!n) return '0';
  const man = Math.floor(n / 10_000);
  const rem = n % 10_000;
  if (man > 0 && rem > 0) return `${man}만${rem}`;
  if (man > 0) return `${man}만`;
  return `${n}`;
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

// ─────────────────────────────────────────
//  날짜 선택기 업데이트
// ─────────────────────────────────────────
function updateDateSelect(selectId, currentDate, availableDates) {
  const el = document.getElementById(selectId);
  if (!el) return;
  el.innerHTML = availableDates.length
    ? availableDates.map(d =>
        `<option value="${d}" ${d === currentDate ? 'selected' : ''}>${d}</option>`
      ).join('')
    : `<option value="">데이터 없음</option>`;
}

// ─────────────────────────────────────────
//  실압투 바 생성 헬퍼
// ─────────────────────────────────────────
function makeEffBar(silabtoo, maxSilabtoo) {
  if (!silabtoo) return `<span class="text-gray-700 text-xs">—</span>`;
  const val      = parseFloat(silabtoo) || 0;
  const clipped  = maxSilabtoo > 0 ? Math.max(-1, Math.min(1, val / maxSilabtoo)) : 0;
  const pct      = Math.abs(clipped) * 44;
  const isAbove  = val >= 0;
  const labelCls = isAbove ? 'text-emerald-400' : 'text-rose-400';
  const fillLeft  = isAbove ? '50%' : `${50 - pct}%`;
  const fillColor = isAbove ? '#10b981' : '#f43f5e';
  return `
    <div class="flex items-center gap-2 justify-center">
      <div class="relative w-28 h-2 bg-gray-800 rounded overflow-hidden flex-shrink-0">
        <div class="absolute top-0 h-full rounded"
             style="left:${fillLeft}; width:${pct}%; background:${fillColor};"></div>
        <div class="absolute top-0 h-full w-px bg-gray-500" style="left:50%"></div>
      </div>
      <span class="text-xs font-semibold tabular-nums ${labelCls} w-10 text-right">${silabtoo}</span>
    </div>`;
}

function calcStats(participants, scoreGetter) {
  const ys    = participants.map(scoreGetter);
  const n     = ys.length;
  const my    = ys.reduce((a, b) => a + b, 0) / n;
  const ssTot = ys.reduce((s, y) => s + (y - my) ** 2, 0);
  const ssRes = participants.reduce((s, d) => s + (scoreGetter(d) - d.predicted) ** 2, 0);
  const r2    = ssTot > 0 ? (1 - ssRes / ssTot).toFixed(4) : '0.0000';
  const total = ys.reduce((a, b) => a + b, 0);
  const avg   = total / n;
  return { r2, total, avg };
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

  // 성장 TOP 3
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
  document.getElementById('growth3-cards').innerHTML = growthList.length
    ? growthList.map((d, i) => `
        <div class="bg-gradient-to-br ${growthStyles[i]} border rounded-xl p-5">
          <div class="text-xl font-black text-emerald-400 mb-2">${i + 1}위</div>
          <div class="font-black text-white text-base">${d.name}</div>
          <div class="text-xs text-gray-400 mt-1">${d.job} · Lv.${d.level}</div>
          <div class="text-emerald-400 font-bold text-sm mt-2">+${formatPower(d.growth)}</div>
          <div class="text-xs text-gray-500 mt-0.5">${formatPower(PREV_POWER[d.name])} → ${formatPower(d.power)}</div>
        </div>
      `).join('')
    : `<div class="col-span-3 text-center text-gray-600 text-sm py-4">이전 기록이 없어 성장 데이터를 표시할 수 없습니다.</div>`;
}

// ─────────────────────────────────────────
//  멤버 전투력 섹션
// ─────────────────────────────────────────
function renderPower() {
  const sorted = [...POWER_DATA].sort((a, b) =>
    ROLE_ORDER[a.role] !== ROLE_ORDER[b.role]
      ? ROLE_ORDER[a.role] - ROLE_ORDER[b.role]
      : b.power - a.power
  );
  document.getElementById('power-count').textContent = `총 ${sorted.length}명`;
  document.getElementById('power-table-body').innerHTML = sorted.map(d => {
    const badge = `<span class="px-2 py-0.5 rounded text-xs font-semibold ${ROLE_STYLE[d.role] ?? ''}">${d.role}</span>`;
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
  if (!participants.length) return;

  const maxSilabtoo = Math.max(...participants.map(d => Math.abs(parseFloat(d.silabtoo) || 0)));
  const { r2, total, avg } = calcStats(participants, d => d.score);

  document.getElementById('competition-stats').innerHTML = `
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div class="text-gray-500 text-xs mb-2">참여 인원</div>
      <div class="text-2xl font-bold text-white">${participants.length}명</div>
      <div class="text-xs text-gray-600 mt-1">미참여 ${COMPETITION_DATA.length - participants.length}명</div>
    </div>
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div class="text-gray-500 text-xs mb-2">총 점수</div>
      <div class="text-lg font-bold text-white">${formatPower(total)}</div>
    </div>
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div class="text-gray-500 text-xs mb-2">평균 점수</div>
      <div class="text-lg font-bold text-emerald-400">${formatPower(Math.round(avg))}</div>
      <div class="text-xs text-gray-600 mt-1">R² = ${r2}</div>
    </div>`;

  const sorted = [...COMPETITION_DATA].sort((a, b) =>
    a.score === 0 && b.score === 0 ? 0 : a.score === 0 ? 1 : b.score === 0 ? -1 : b.score - a.score
  );
  document.getElementById('competition-count').textContent = `총 ${sorted.length}명`;

  let rank = 0;
  document.getElementById('competition-table-body').innerHTML = sorted.map(d => {
    const isZero = d.score === 0;
    if (!isZero) rank++;
    const rankCls = rank === 1 ? 'text-yellow-400 font-black' :
                    rank === 2 ? 'text-slate-300 font-bold'   :
                    rank === 3 ? 'text-orange-400 font-bold'  : 'text-gray-500';
    return `
      <tr class="hover:bg-gray-800/40 transition-colors ${isZero ? 'opacity-40' : ''}">
        <td class="px-4 py-3 ${rankCls}">${isZero ? '-' : rank}</td>
        <td class="px-4 py-3 font-medium text-white">${d.name}</td>
        <td class="px-4 py-3 text-center text-xs text-gray-400">${d.job}</td>
        <td class="px-4 py-3 text-center text-gray-300 tabular-nums">${d.level}</td>
        <td class="px-4 py-3 text-right text-gray-400 tabular-nums">${formatPower(d.power)}</td>
        <td class="px-4 py-3 text-right font-semibold ${isZero ? 'text-gray-600' : 'text-emerald-400'} tabular-nums">
          ${isZero ? '미참여' : formatPower(d.score)}</td>
        <td class="px-4 py-3 text-right text-gray-500 tabular-nums">${isZero ? '-' : formatPower(d.predicted)}</td>
        <td class="px-4 py-3">${isZero ? '<span class="text-gray-700 text-xs">—</span>' : makeEffBar(d.silabtoo, maxSilabtoo)}</td>
      </tr>`;
  }).join('');
}

// ─────────────────────────────────────────
//  수련장 섹션
// ─────────────────────────────────────────
function renderTrainingCenter() {
  const participants = TRAINING_CENTER_DATA.filter(d => d.score > 0);
  if (!participants.length) return;

  const maxSilabtoo = Math.max(...participants.map(d => Math.abs(parseFloat(d.silabtoo) || 0)));
  const { r2, total, avg } = calcStats(participants, d => d.score);

  document.getElementById('training-center-stats').innerHTML = `
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div class="text-gray-500 text-xs mb-2">참여 인원</div>
      <div class="text-2xl font-bold text-white">${participants.length}명</div>
      <div class="text-xs text-gray-600 mt-1">미참여 ${TRAINING_CENTER_DATA.length - participants.length}명</div>
    </div>
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div class="text-gray-500 text-xs mb-2">총 점수</div>
      <div class="text-lg font-bold text-white">${formatTrainingScore(total)}</div>
    </div>
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div class="text-gray-500 text-xs mb-2">평균 점수</div>
      <div class="text-lg font-bold text-emerald-400">${formatTrainingScore(Math.round(avg))}</div>
      <div class="text-xs text-gray-600 mt-1">R² = ${r2}</div>
    </div>`;

  const sorted = [...TRAINING_CENTER_DATA].sort((a, b) =>
    a.score === 0 && b.score === 0 ? 0 : a.score === 0 ? 1 : b.score === 0 ? -1 : b.score - a.score
  );
  document.getElementById('training-center-count').textContent = `총 ${sorted.length}명`;

  let rank = 0;
  document.getElementById('training-center-table-body').innerHTML = sorted.map(d => {
    const isZero = d.score === 0;
    if (!isZero) rank++;
    const rankCls = rank === 1 ? 'text-yellow-400 font-black' :
                    rank === 2 ? 'text-slate-300 font-bold'   :
                    rank === 3 ? 'text-orange-400 font-bold'  : 'text-gray-500';
    return `
      <tr class="hover:bg-gray-800/40 transition-colors ${isZero ? 'opacity-40' : ''}">
        <td class="px-4 py-3 ${rankCls}">${isZero ? '-' : rank}</td>
        <td class="px-4 py-3 font-medium text-white">${d.name}</td>
        <td class="px-4 py-3 text-center text-xs text-gray-400">${d.job}</td>
        <td class="px-4 py-3 text-center text-gray-300 tabular-nums">${d.level}</td>
        <td class="px-4 py-3 text-right text-gray-400 tabular-nums">${formatPower(d.power)}</td>
        <td class="px-4 py-3 text-right font-semibold ${isZero ? 'text-gray-600' : 'text-emerald-400'} tabular-nums">
          ${isZero ? '미참여' : formatTrainingScore(d.score)}</td>
        <td class="px-4 py-3 text-right text-gray-500 tabular-nums">${isZero ? '-' : formatTrainingScore(d.predicted)}</td>
        <td class="px-4 py-3">${isZero ? '<span class="text-gray-700 text-xs">—</span>' : makeEffBar(d.silabtoo, maxSilabtoo)}</td>
      </tr>`;
  }).join('');
}

// ─────────────────────────────────────────
//  토벌전 섹션
// ─────────────────────────────────────────
function renderRaid() {
  const participants = RAID_DATA.filter(d => d.score_int > 0 && d.power > 0);
  if (!participants.length) return;

  const maxSilabtoo = Math.max(...participants.map(d => Math.abs(parseFloat(d.silabtoo) || 0)));
  const { r2, total, avg } = calcStats(participants, d => d.score_int);

  document.getElementById('raid-stats').innerHTML = `
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div class="text-gray-500 text-xs mb-2">참여 인원</div>
      <div class="text-2xl font-bold text-white">${participants.length}명</div>
      <div class="text-xs text-gray-600 mt-1">미참여 ${RAID_DATA.length - participants.length}명</div>
    </div>
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div class="text-gray-500 text-xs mb-2">총 점수</div>
      <div class="text-lg font-bold text-white">${formatPower(total)}</div>
    </div>
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div class="text-gray-500 text-xs mb-2">평균 점수</div>
      <div class="text-lg font-bold text-emerald-400">${formatPower(Math.round(avg))}</div>
      <div class="text-xs text-gray-600 mt-1">R² = ${r2}</div>
    </div>`;

  const sorted = [...RAID_DATA].sort((a, b) =>
    a.score_int === 0 && b.score_int === 0 ? 0
      : a.score_int === 0 ? 1 : b.score_int === 0 ? -1 : b.score_int - a.score_int
  );
  document.getElementById('raid-count').textContent = `총 ${sorted.length}명`;

  let rank = 0;
  document.getElementById('raid-table-body').innerHTML = sorted.map(d => {
    const isZero = d.score_int === 0;
    if (!isZero) rank++;
    const rankCls = rank === 1 ? 'text-yellow-400 font-black' :
                    rank === 2 ? 'text-slate-300 font-bold'   :
                    rank === 3 ? 'text-orange-400 font-bold'  : 'text-gray-500';
    return `
      <tr class="hover:bg-gray-800/40 transition-colors ${isZero ? 'opacity-40' : ''}">
        <td class="px-4 py-3 ${rankCls}">${isZero ? '-' : rank}</td>
        <td class="px-4 py-3 font-medium text-white">${d.name}</td>
        <td class="px-4 py-3 text-center text-xs text-gray-400">${d.job}</td>
        <td class="px-4 py-3 text-center text-gray-300 tabular-nums">${d.level}</td>
        <td class="px-4 py-3 text-right text-gray-400 tabular-nums">${d.power ? formatPower(d.power) : '-'}</td>
        <td class="px-4 py-3 text-right font-semibold ${isZero ? 'text-gray-600' : 'text-emerald-400'} tabular-nums">
          ${isZero ? '미참여' : d.score_str}</td>
        <td class="px-4 py-3 text-right text-gray-500 tabular-nums">${isZero ? '-' : formatPower(d.predicted)}</td>
        <td class="px-4 py-3">${isZero ? '<span class="text-gray-700 text-xs">—</span>' : makeEffBar(d.silabtoo, maxSilabtoo)}</td>
      </tr>`;
  }).join('');
}

// ─────────────────────────────────────────
//  날짜별 섹션 전환 (재fetch 없이 메모리에서)
// ─────────────────────────────────────────
function loadPower(date) {
  POWER_DATA = POWER_JSON.records[date] ?? [];
  const prevDate = POWER_JSON.dates[POWER_JSON.dates.indexOf(date) + 1];
  PREV_POWER = prevDate
    ? Object.fromEntries((POWER_JSON.records[prevDate] ?? []).map(r => [r.name, r.power]))
    : {};
  updateDateSelect('power-date-select', date, POWER_JSON.dates);
  renderHome();
  renderPower();
}

function loadCompetition(date) {
  COMPETITION_DATA = COMPETITION_JSON.records[date] ?? [];
  updateDateSelect('competition-date-select', date, COMPETITION_JSON.dates);
  renderCompetition();
}

function loadTraining(date) {
  TRAINING_CENTER_DATA = TRAINING_JSON.records[date] ?? [];
  updateDateSelect('training-date-select', date, TRAINING_JSON.dates);
  renderTrainingCenter();
}

function loadRaid(date) {
  RAID_DATA = RAID_JSON.records[date] ?? [];
  updateDateSelect('raid-date-select', date, RAID_JSON.dates);
  renderRaid();
}

// ─────────────────────────────────────────
//  초기 전체 로드
// ─────────────────────────────────────────
async function loadAll() {
  try {
    const [power, competition, training, raid] = await Promise.all([
      fetch('./data/power.json').then(r => r.json()),
      fetch('./data/competition.json').then(r => r.json()),
      fetch('./data/training_center.json').then(r => r.json()),
      fetch('./data/raid.json').then(r => r.json()),
    ]);

    // 전체 캐시 저장
    POWER_JSON       = power;
    COMPETITION_JSON = competition;
    TRAINING_JSON    = training;
    RAID_JSON        = raid;

    // 최신 날짜 데이터 설정
    const latestPower = power.dates[0];
    POWER_DATA = power.records[latestPower] ?? [];

    // 전투력 성장: 두 번째 날짜(이전 기록)와 비교
    const prevDate = power.dates[1];
    if (prevDate) {
      const prevRows = power.records[prevDate] ?? [];
      PREV_POWER = Object.fromEntries(prevRows.map(r => [r.name, r.power]));
    }

    const latestComp     = competition.dates[0];
    const latestTraining = training.dates[0];
    const latestRaid     = raid.dates[0];

    COMPETITION_DATA     = competition.records[latestComp]     ?? [];
    TRAINING_CENTER_DATA = training.records[latestTraining]    ?? [];
    RAID_DATA            = raid.records[latestRaid]            ?? [];

    updateDateSelect('power-date-select',        latestPower,    power.dates);
    updateDateSelect('competition-date-select', latestComp,     competition.dates);
    updateDateSelect('training-date-select',    latestTraining, training.dates);
    updateDateSelect('raid-date-select',        latestRaid,     raid.dates);

    const footerDate = document.getElementById('footer-date');
    if (footerDate) footerDate.textContent = latestPower;

    renderHome();
    renderPower();
    renderCompetition();
    renderTrainingCenter();
    renderRaid();

  } catch (e) {
    console.error('데이터 로드 실패:', e);
  }
}

loadAll();
