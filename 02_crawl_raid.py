import csv
import re


def parse_score(text):
    """'108억3907만', '0' 등 한국식 점수 표기를 정수로 변환"""
    if not text or text.strip() == '0':
        return 0
    total = 0
    for value, unit in re.findall(r'([\d,]+)(조|억|만)', text):
        n = int(value.replace(',', ''))
        if unit == '조':
            total += n * 1_000_000_000_000
        elif unit == '억':
            total += n * 100_000_000
        elif unit == '만':
            total += n * 10_000
    return total


def calc_regression(data):
    """
    참여자(score > 0, power > 0) 기준으로 선형 회귀 계산.
    반환: slope, intercept, r2
    """
    participants = [(d['power'], d['score_val']) for d in data
                    if d['score_val'] > 0 and d['power'] > 0]

    if len(participants) < 2:
        return 0, 0, 0

    n  = len(participants)
    xs = [p[0] for p in participants]
    ys = [p[1] for p in participants]

    mx  = sum(xs) / n
    my  = sum(ys) / n
    cov = sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / n
    var_x = sum((x - mx) ** 2 for x in xs) / n

    slope   = cov / var_x
    intcpt  = my - slope * mx

    # 결정계수 R²
    ss_tot = sum((y - my) ** 2 for y in ys)
    ss_res = sum((y - (slope * x + intcpt)) ** 2 for x, y in zip(xs, ys))
    r2 = 1 - ss_res / ss_tot if ss_tot > 0 else 0

    return slope, intcpt, r2


def calc_silabtoo(score_val, power, slope, intcpt):
    """
    실압투(%) = (실제 점수 - 예측 점수) / 예측 점수 × 100
    미참여 또는 전투력 0이면 None 반환
    """
    if score_val == 0 or power == 0:
        return None
    predicted = slope * power + intcpt
    if predicted <= 0:
        return None
    return (score_val - predicted) / predicted * 100


def main():
    # ── 01_dd_power.csv 읽기 ─────────────────────
    power_map = {}
    with open('./data/01_dd_power.csv', newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            name = row['닉네임'].strip()
            power_map[name] = {
                '직업': row['직업'].strip(),
                '레벨': row['레벨'].strip(),
                '전투력': int(row['전투력'].strip()) if row['전투력'].strip().lstrip('-').isdigit() else 0,
            }

    # ── 02_dd_raid_in.csv 읽기 ───────────────────
    raid_in = []
    with open('./data/02_dd_raid_in.csv', newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            raid_in.append({
                '닉네임': row['닉네임'].strip(),
                '점수':   row['점수'].strip(),
            })

    # ── 데이터 병합 ───────────────────────────────
    merged = []
    for row in raid_in:
        name  = row['닉네임']
        score = row['점수']
        info  = power_map.get(name, {'직업': '', '레벨': '', '전투력': 0})
        merged.append({
            '닉네임':   name,
            '직업':     info['직업'],
            '레벨':     info['레벨'],
            '전투력':   info['전투력'],
            '점수':     score,
            'score_val': parse_score(score),
            'power':    info['전투력'],
        })

    # ── 회귀 분석 ─────────────────────────────────
    slope, intcpt, r2 = calc_regression(merged)

    print(f'[회귀 분석]')
    print(f'  slope     = {slope:.4f}')
    print(f'  intercept = {intcpt:.0f}')
    print(f'  R²        = {r2:.4f}')
    print()

    # ── 실압투 계산 및 출력 데이터 구성 ───────────
    results = []
    for d in merged:
        silabtoo = calc_silabtoo(d['score_val'], d['power'], slope, intcpt)
        silabtoo_str = f'{silabtoo:+.1f}%' if silabtoo is not None else ''
        results.append({
            '닉네임': d['닉네임'],
            '직업':   d['직업'],
            '레벨':   d['레벨'],
            '전투력': d['전투력'],
            '점수':   d['점수'],
            '실압투': silabtoo_str,
        })

        status = f"실압투:{silabtoo_str}" if silabtoo_str else '미참여'
        print(f"  {d['닉네임']:<14} 점수:{d['점수']:<12} {status}")

    # ── 02_dd_raid_out.csv 저장 ───────────────────
    fieldnames = ['닉네임', '직업', '레벨', '전투력', '점수', '실압투']
    with open('./data/02_dd_raid_out.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(results)

    print(f'\n완료! 02_dd_raid_out.csv 저장됨 ({len(results)}건, R²={r2:.4f})')


if __name__ == '__main__':
    main()
