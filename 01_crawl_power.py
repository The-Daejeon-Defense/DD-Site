import argparse
import csv
import json_store
import time
import selenium.webdriver
from selenium.webdriver.edge.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


def parse_power(text):
    """'2조 5765억', '1028억 8429만' 등을 정수로 변환"""
    import re
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


def get_driver():
    options = Options()
    options.add_argument("--headless")
    return selenium.webdriver.Edge(options=options)


def search_character(driver, wait, name):
    """캐릭터 검색 후 (직업, 레벨, 전투력) 반환. 실패 시 None."""
    driver.get("https://www.mekipick.com/ranking/character")
    search_input = wait.until(
        EC.presence_of_element_located((By.CSS_SELECTOR, 'input[placeholder*="닉네임"]'))
    )
    search_input.clear()
    search_input.send_keys(name)
    search_input.send_keys(Keys.RETURN)

    try:
        wait.until(
            EC.presence_of_element_located((By.XPATH, '//*[@class="font-bold text-sm"]'))
        )
        rows = driver.find_elements(By.CSS_SELECTOR, "button.w-full.flex.items-center.gap-3")

        target_row = None
        for row in rows:
            name_el = row.find_element(By.CSS_SELECTOR, "div.font-medium")
            if name_el.text.strip() == name:
                target_row = row
                break
        if target_row is None and rows:
            target_row = rows[0]

        if target_row:
            subtitle = target_row.find_element(By.CSS_SELECTOR, "div.text-sm.text-muted-foreground").text.strip()
            power_text = target_row.find_element(By.CSS_SELECTOR, "div.font-bold.text-sm").text.strip()

            # "신궁 · Lv.99 · CH.19" 파싱
            parts = [p.strip() for p in subtitle.split("·")]
            job   = parts[0] if len(parts) > 0 else ""
            level = ""
            for p in parts:
                if p.startswith("Lv."):
                    level = p[3:]
                    break

            return job, level, power_text
    except Exception:
        pass
    return None


def main(recorded_date=None):
    with open("./data/01_daejeon_defense.csv", newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        members = [(row["닉네임"].strip(), row["직위"].strip()) for row in reader if row["닉네임"].strip()]

    driver = get_driver()
    wait = WebDriverWait(driver, 10)

    results = []
    for i, (name, role) in enumerate(members):
        print(f"[{i+1}/{len(members)}] {name} 검색 중...")
        info = search_character(driver, wait, name)
        if info:
            job, level, power_text = info
            power = parse_power(power_text)
            print(f"  -> 직업:{job} Lv.{level} 전투력:{power_text}")
            results.append((name, role, job, level, power))
        else:
            print(f"  -> 검색 실패")
            results.append((name, role, "", "", "검색 실패"))
        time.sleep(0.5)

    driver.quit()

    db_rows = [
        {'name': r[0], 'role': r[1], 'job': r[2],
         'level': int(r[3]) if str(r[3]).isdigit() else 0,
         'power': r[4] if isinstance(r[4], int) else 0}
        for r in results
    ]
    saved_date = json_store.save('power', db_rows, recorded_date)
    print(f"\n완료! ({len(results)}건)")
    print(f"✅ JSON 저장 완료 ({saved_date})")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--date', default=None, help='기록 날짜 (YYYY-MM-DD, 기본: 오늘)')
    args = parser.parse_args()
    main(args.date)
