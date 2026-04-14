"""
03_crawl_competition.py
길드 대항전 점수 결정계수(R²) 분석 스크립트

Input  : data/01_dd_power.csv          (닉네임, 직업, 레벨, 전투력, ...)
         data/03_dd_competition_in.csv  (닉네임, 점수)
Output : data/03_dd_competition_out.csv (닉네임, 직업, 레벨, 전투력, 점수, 예측점수, 실압투)
"""

import csv
import os
import re

BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
POWER_CSV  = os.path.join(BASE_DIR, "data", "01_dd_power.csv")
INPUT_CSV  = os.path.join(BASE_DIR, "data", "03_dd_competition_in.csv")
OUTPUT_CSV = os.path.join(BASE_DIR, "data", "03_dd_competition_out.csv")

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
#  1) 01_dd_power.csv 읽기 (직업, 레벨, 전투력)
# ─────────────────────────────────────────
power_map = {}
with open(POWER_CSV, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        name = row['닉네임'].strip()
        power_map[name] = {
            '직업': row['직업'].strip(),
            '레벨': row['레벨'].strip(),
            '전투력': int(row['전투력'].strip()) if row['전투력'].strip().lstrip('-').isdigit() else 0,
        }

# ─────────────────────────────────────────
#  2) 03_dd_competition_in.csv 읽기
# ─────────────────────────────────────────
rows = []
with open(INPUT_CSV, encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        name  = row["닉네임"].strip()
        score = parse_score_ko(row["점수"])
        info  = power_map.get(name, {'직업': '', '레벨': '', '전투력': 0})
        rows.append({
            "name":      name,
            "job":       info['직업'],
            "level":     info['레벨'],
            "power":     info['전투력'],
            "score":     score,
            "score_str": row["점수"].strip(),
        })

# ─────────────────────────────────────────
#  3) 선형 회귀 (전투력 → 점수)
# ─────────────────────────────────────────
participants = [r for r in rows if r["score"] > 0 and r["power"] > 0]
n = len(participants)

xs = [r["power"] for r in participants]
ys = [r["score"] for r in participants]
mx = sum(xs) / n
my = sum(ys) / n
cov  = sum((xs[i] - mx) * (ys[i] - my) for i in range(n)) / n
varX = sum((x - mx) ** 2 for x in xs) / n
slope  = cov / varX
intcpt = my - slope * mx

ss_tot = sum((y - my) ** 2 for y in ys)
ss_res = sum((ys[i] - (slope * xs[i] + intcpt)) ** 2 for i in range(n))
r2 = 1 - ss_res / ss_tot

print(f"참여 인원 : {n}명 (미참여 {len(rows) - n}명)")
print(f"slope    : {slope:.6e}")
print(f"intercept: {intcpt:.6e}")
print(f"R²       : {r2:.4f}")

# ─────────────────────────────────────────
#  4) 예측점수 / 실압투 계산
# ─────────────────────────────────────────
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

# ─────────────────────────────────────────
#  5) 정렬: 점수 내림차순, 미참여 맨 아래
# ─────────────────────────────────────────
rows_sorted = sorted(rows, key=lambda r: (r["score"] == 0, -r["score"]))

# ─────────────────────────────────────────
#  6) 출력 CSV 작성
# ─────────────────────────────────────────
with open(OUTPUT_CSV, "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["닉네임", "직업", "레벨", "전투력", "점수", "예측점수", "실압투"])
    for r in rows_sorted:
        writer.writerow([
            r["name"],
            r["job"],
            r["level"],
            r["power"],
            r["score"],
            r["predicted"],
            r["silabtoo"],
        ])

print(f"\n✅  저장 완료 → {OUTPUT_CSV}")
print(f"\n{'순위':<4} {'닉네임':<14} {'직업':<20} {'레벨':>4} {'점수':>14} {'예측점수':>14} {'실압투':>8}")
print("-" * 85)
rank = 0
for r in rows_sorted:
    if r["score"] > 0:
        rank += 1
        print(f"{rank:<4} {r['name']:<14} {r['job']:<20} {r['level']:>4} {r['score']:>14,} {r['predicted']:>14,} {r['silabtoo']:>8}")
    else:
        print(f"{'—':<4} {r['name']:<14} {r['job']:<20} {r['level']:>4} {'미참여':>14}")
