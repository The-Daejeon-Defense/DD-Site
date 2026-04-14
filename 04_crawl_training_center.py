"""
04_crawl_training_center.py
길드 수련장 점수 결정계수(R²) 분석 스크립트

Input  : data/power.json                     (최신 전투력 데이터)
         data/04_dd_training_center_in.csv   (닉네임, 점수)
Output : data/training_center.json
"""

import argparse
import csv
import os
import re

import json_store

BASE_DIR  = os.path.dirname(os.path.abspath(__file__))
INPUT_CSV = os.path.join(BASE_DIR, "data", "04_dd_training_center_in.csv")


def parse_score_ko(s: str) -> int:
    """'341만4468' → 3414468,  '55억8334만' → 5583340000,  '0' 또는 '' → 0"""
    s = s.strip()
    if not s or s == "0":
        return 0
    total = 0
    m = re.search(r"(\d+)억", s)
    if m:
        total += int(m.group(1)) * 100_000_000
    m = re.search(r"(\d+)만(\d*)", s)
    if m:
        total += int(m.group(1)) * 10_000
        if m.group(2):
            total += int(m.group(2))
    return total


def main(recorded_date=None):
    # ─────────────────────────────────────────
    #  1) power.json 읽기
    # ─────────────────────────────────────────
    power_json = json_store.load('power')
    latest = power_json['dates'][0] if power_json['dates'] else None
    power_map = {}
    if latest:
        for r in power_json['records'][latest]:
            power_map[r['name']] = {
                '직업': r['job'],
                '레벨': r['level'],
                '전투력': r['power'],
            }

    # ─────────────────────────────────────────
    #  2) 04_dd_training_center_in.csv 읽기
    # ─────────────────────────────────────────
    rows = []
    with open(INPUT_CSV, encoding="utf-8") as f:
        for row in csv.DictReader(f):
            name  = row["닉네임"].strip()
            score = parse_score_ko(row["점수"])
            info  = power_map.get(name, {'직업': '', '레벨': '', '전투력': 0})
            rows.append({
                "name":  name,
                "job":   info['직업'],
                "level": info['레벨'],
                "power": info['전투력'],
                "score": score,
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
            r["silabtoo"] = f"{'+' if pct >= 0 else ''}{pct:.1f}%"
        else:
            r["predicted"] = 0
            r["silabtoo"]  = ""

    # ─────────────────────────────────────────
    #  5) 정렬: 점수 내림차순, 미참여 맨 아래
    # ─────────────────────────────────────────
    rows_sorted = sorted(rows, key=lambda r: (r["score"] == 0, -r["score"]))

    print(f"\n{'순위':<4} {'닉네임':<14} {'직업':<20} {'레벨':>4} {'점수':>12} {'예측점수':>12} {'실압투':>8}")
    print("-" * 80)
    rank = 0
    for r in rows_sorted:
        if r["score"] > 0:
            rank += 1
            print(f"{rank:<4} {r['name']:<14} {r['job']:<20} {r['level']:>4} {r['score']:>12,} {r['predicted']:>12,} {r['silabtoo']:>8}")
        else:
            print(f"{'—':<4} {r['name']:<14} {r['job']:<20} {r['level']:>4} {'미참여':>12}")

    # ─────────────────────────────────────────
    #  7) JSON 저장
    # ─────────────────────────────────────────
    saved_date = json_store.save('training_center', rows_sorted, recorded_date)
    print(f"\n✅  JSON 저장 완료 ({saved_date})")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--date', default=None, help='기록 날짜 (YYYY-MM-DD, 기본: 오늘)')
    args = parser.parse_args()
    main(args.date)
