import csv
import re
import time
import selenium.webdriver
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


def convert_power(text):
    """'33T 405B 388M' → '33조 405억 388만'"""
    result = re.sub(r'(\d[\d,]*)T', r'\1조', text)
    result = re.sub(r'(\d[\d,]*)B', r'\1억', result)
    result = re.sub(r'(\d[\d,]*)M', r'\1만', result)
    return result


def main():
    with open("./data/03_dd_training_center.csv", newline="", encoding="utf-8") as f:
        guilds = [line.strip() for line in f if line.strip()]

    options = Options()
    options.binary_location = "/snap/firefox/current/usr/lib/firefox/firefox"
    options.add_argument("--headless")

    driver = selenium.webdriver.Firefox(options=options)
    wait = WebDriverWait(driver, 15)

    try:
        driver.get("https://www.mekifun.com/rankings")
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'input[placeholder*="guild"]')))

        search_input = driver.find_element(By.CSS_SELECTOR, 'input[placeholder*="guild"]')
        search_input.send_keys(",".join(guilds))
        driver.find_element(By.XPATH, '//button[text()="Search"]').click()

        wait.until(EC.presence_of_element_located((By.TAG_NAME, "table")))
        time.sleep(2)

        rows = driver.find_element(By.TAG_NAME, "table").find_elements(By.TAG_NAME, "tr")

        # 정확한 길드명만 필터링
        guild_set = set(guilds)
        results = []
        for row in rows[1:]:
            cells = row.find_elements(By.TAG_NAME, "td")
            if len(cells) >= 7 and cells[3].text.strip() in guild_set:
                results.append({
                    "overall":    cells[0].text.strip(),
                    "world_rank": cells[1].text.strip(),
                    "world":      cells[2].text.strip(),
                    "guild":      cells[3].text.strip(),
                    "power":      convert_power(cells[4].text.strip()),
                    "members":    cells[5].text.strip(),
                    "level":      cells[6].text.strip(),
                })
    finally:
        driver.quit()

    with open("./data/03_dd_training_center_info.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["overall", "world_rank", "world", "guild", "power", "members", "level"])
        writer.writeheader()
        writer.writerows(results)

    print(f"완료! 03_dd_training_center_info.csv 저장됨 ({len(results)}건)")
    for r in results:
        print(r)


if __name__ == "__main__":
    main()
