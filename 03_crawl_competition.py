"""
03_crawl_competition.py
길드 대항전 점수 결정계수(R²) 분석 스크립트

Input  : data/03_dd_competition_in.csv  (닉네임, 점수)
Output : data/03_dd_competition_out.csv (닉네임, 전투력, 점수, 예측점수, 실압투)
"""

import csv
import os
import re

# ─────────────────────────────────────────
#  전투력 데이터 (index.html POWER_DATA 기준)
# ─────────────────────────────────────────
POWER_DATA = {
    "그린상훈":     3528900000000,
    "블랙경윤":     4161800000000,
    "실버정환":     2236700000000,
    "오렌지완":     1251600000000,
    "김안셀모":     3193100000000,
    "지난이야기":   1679000000000,
    "빠따가2":      6722100000000,
    "레드웅이":     113740620000,
    "브라운철":     50504580000,
    "전설의영포티": 480086540000,
    "하영과돌돌":   1100400000000,
    "냥꾸니":       708932830000,
    "토우르":       347721440000,
    "나로e":        2026300000000,
    "닼읔낰이트":   1272400000000,
    "도돍":         1410100000000,
    "은평구돌주먹": 1153300000000,
    "짬뽕에소주":   1012000000000,
    "쭈니짜응":     909293890000,
    "가산요소":     872087850000,
    "앙끼모륑":     568668990000,
    "구준표춘":     578003680000,
    "돈키호테바이": 211626980000,
    "핫딜방문판매": 324444870000,
    "몽팡팡":       11525600000,
    "민우민우민우": 2444400000000,
    "즐똥1":        848896740000,
    "표뚀":         984974380000,
    "맞수":         875815540000,
}

# ─────────────────────────────────────────
#  유틸: 한국어 점수 문자열 → 정수
# ─────────────────────────────────────────
def parse_score_ko(s: str) -> int:
    """'55억8334만' → 5583340000,  '0' 또는 '' → 0"""
    s = s.strip()
    if not s or s == "0":
        return 0
    total = 0
    m = re.search(r"(\d+)억", s)
    if m:
        total += int(m.group(1)) * 100_000_000
    m = re.search(r"(\d+)만", s)
    if m:
        total += int(m.group(1)) * 10_000
    return total

# ─────────────────────────────────────────
#  메인
# ─────────────────────────────────────────
BASE_DIR  = os.path.dirname(os.path.abspath(__file__))
INPUT_CSV = os.path.join(BASE_DIR, "data", "03_dd_competition_in.csv")
OUTPUT_CSV= os.path.join(BASE_DIR, "data", "03_dd_competition_out.csv")

# 1) 입력 읽기
rows = []
with open(INPUT_CSV, encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        name  = row["닉네임"].strip()
        score = parse_score_ko(row["점수"])
        power = POWER_DATA.get(name, 0)
        rows.append({"name": name, "power": power, "score": score, "score_str": row["점수"].strip()})

# 2) 참여자 필터 (점수 > 0 and 전투력 > 0)
participants = [r for r in rows if r["score"] > 0 and r["power"] > 0]
n = len(participants)

# 3) 선형 회귀 (전투력 → 점수)
xs = [r["power"] for r in participants]
ys = [r["score"] for r in participants]
mx = sum(xs) / n
my = sum(ys) / n
cov  = sum((xs[i] - mx) * (ys[i] - my) for i in range(n)) / n
varX = sum((x - mx) ** 2 for x in xs) / n
slope  = cov / varX
intcpt = my - slope * mx

# 4) R²
ss_tot = sum((y - my) ** 2 for y in ys)
ss_res = sum((ys[i] - (slope * xs[i] + intcpt)) ** 2 for i in range(n))
r2 = 1 - ss_res / ss_tot

print(f"참여 인원 : {n}명 (미참여 {len(rows) - n}명)")
print(f"slope    : {slope:.6e}")
print(f"intercept: {intcpt:.6e}")
print(f"R²       : {r2:.4f}")

# 5) 실압투 계산
for r in rows:
    if r["score"] > 0 and r["power"] > 0:
        predicted = slope * r["power"] + intcpt
        r["predicted"] = round(predicted)
        pct = (r["score"] - predicted) / predicted * 100
        sign = "+" if pct >= 0 else ""
        r["silabtoo"] = f"{sign}{pct:.1f}%"
    else:
        r["predicted"] = 0
        r["silabtoo"]  = ""

# 6) 정렬: 점수 내림차순, 미참여 맨 아래
rows_sorted = sorted(rows, key=lambda r: (r["score"] == 0, -r["score"]))

# 7) 출력 CSV 작성
with open(OUTPUT_CSV, "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["닉네임", "전투력", "점수", "예측점수", "실압투"])
    for r in rows_sorted:
        writer.writerow([
            r["name"],
            r["power"],
            r["score"],
            r["predicted"],
            r["silabtoo"],
        ])

print(f"\n✅  저장 완료 → {OUTPUT_CSV}")
print(f"\n{'순위':<4} {'닉네임':<14} {'점수':>14} {'예측점수':>14} {'실압투':>8}")
print("-" * 60)
rank = 0
for r in rows_sorted:
    if r["score"] > 0:
        rank += 1
        print(f"{rank:<4} {r['name']:<14} {r['score']:>14,} {r['predicted']:>14,} {r['silabtoo']:>8}")
    else:
        print(f"{'—':<4} {r['name']:<14} {'미참여':>14}")
