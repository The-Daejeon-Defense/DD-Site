"""
json_store.py
JSON 파일 기반 데이터 저장/조회 헬퍼

data/{table}.json 구조:
{
  "dates": ["2026-04-14", "2026-04-13", ...],   # 최신순
  "records": {
    "2026-04-14": [ {필드...}, ... ],
    "2026-04-13": [ ... ],
    ...
  }
}
"""

import json
import os
from datetime import date as _date

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')


def _path(table: str) -> str:
    return os.path.join(DATA_DIR, f'{table}.json')


def _today() -> str:
    return _date.today().isoformat()


def load(table: str) -> dict:
    """JSON 파일 전체를 반환. 파일 없으면 빈 구조 반환."""
    path = _path(table)
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {"dates": [], "records": {}}


def save(table: str, rows: list[dict], recorded_date: str | None = None) -> str:
    """rows를 해당 날짜로 JSON에 upsert. 저장된 날짜 문자열 반환."""
    d = recorded_date or _today()
    data = load(table)

    # 날짜 목록 갱신 (최신순 유지)
    if d not in data["dates"]:
        data["dates"].append(d)
        data["dates"].sort(reverse=True)
    data["records"][d] = rows

    os.makedirs(DATA_DIR, exist_ok=True)
    with open(_path(table), 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    return d
