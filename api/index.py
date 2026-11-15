import os
import csv
import json
import io
from flask import Flask, request, jsonify, Response, send_from_directory

app = Flask(__name__, static_folder="../", static_url_path="")

# CSV 파일 경로 탐색 (로컬 및 Vercel 환경 호환)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def load_env_file(filepath=None):
    """외부 패키지 의존성 없이 .env 환경 변수를 안전하게 로드"""
    if filepath is None:
        filepath = os.path.join(BASE_DIR, ".env")
    if os.path.exists(filepath):
        try:
            with open(filepath, mode="r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if not line or line.startswith("#"):
                        continue
                    if "=" in line:
                        key, val = line.split("=", 1)
                        key = key.strip()
                        val = val.strip().strip("'\"")
                        if key and key not in os.environ:
                            os.environ[key] = val
        except Exception as e:
            print("Warning: Failed to load .env file:", e)

# 환경 변수 로드
load_env_file()

JSON_PATH = os.path.join(BASE_DIR, "data", "properties.json")
CSV_PATH = os.path.join(BASE_DIR, "data", "properties.csv")
if not os.path.exists(CSV_PATH):
    CSV_PATH = os.path.join(BASE_DIR, "properties.csv")

# 초기 메모리 매물 저장소 (Vercel Serverless Read-Only 환경 지원)
PROPERTIES_CACHE = []

def load_properties():
    global PROPERTIES_CACHE
    # 1. properties.json 우선 탐색
    if os.path.exists(JSON_PATH):
        try:
            with open(JSON_PATH, mode="r", encoding="utf-8") as f:
                PROPERTIES_CACHE = json.load(f)
                return PROPERTIES_CACHE
        except Exception as e:
            print("JSON Load Error:", e)

    # 2. properties.csv 대체 탐색
    if os.path.exists(CSV_PATH):
        try:
            with open(CSV_PATH, mode="r", encoding="utf-8-sig") as f:
                reader = csv.DictReader(f)
                PROPERTIES_CACHE = [row for row in reader]
                return PROPERTIES_CACHE
        except Exception as e:
            print("CSV Load Error:", e)
    return PROPERTIES_CACHE

# 최초 1회 로드
load_properties()

@app.route("/")
def index():
    return send_from_directory(BASE_DIR, "index.html")

@app.route("/<path:path>")
def static_proxy(path):
    if os.path.exists(os.path.join(BASE_DIR, path)):
        return send_from_directory(BASE_DIR, path)
    return send_from_directory(BASE_DIR, "index.html")

# 0. 클라이언트 공개 환경 변수 조회 API (GET /api/config)
@app.route("/api/config", methods=["GET"])
def get_config():
    """웹 클라이언트 연동용 안전한 공개 설정 (비밀키 제외)"""
    return jsonify({
        "success": True,
        "kakaoJsKey": os.environ.get("KAKAO_JAVASCRIPT_KEY", ""),
        "githubRepo": os.environ.get("GITHUB_REPO", "oransee3/SuMokTo-Webpage"),
        "hasGithubToken": bool(os.environ.get("GITHUB_TOKEN"))
    })

# 0-1. 매물 데이터 실시간 GitHub 동기화 API (POST /api/properties/sync)
@app.route("/api/properties/sync", methods=["POST"])
def sync_properties():
    global PROPERTIES_CACHE
    req_data = request.json or {}
    items = req_data.get("properties") or []
    if not items:
        return jsonify({"success": False, "message": "동기화할 매물 데이터가 없습니다."}), 400

    PROPERTIES_CACHE = items

    # 1. data/properties.json 저장
    try:
        os.makedirs(os.path.dirname(JSON_PATH), exist_ok=True)
        with open(JSON_PATH, "w", encoding="utf-8") as f:
            json.dump(items, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print("Save properties.json error:", e)

    # 2. properties.csv 동기화 저장
    save_cache_to_csv()

    # 3. 로컬 git push 시도 (로컬 서버 환경일 때)
    git_synced = False
    try:
        import subprocess
        subprocess.run(["git", "add", "data/properties.json", "properties.csv"], cwd=BASE_DIR, check=False)
        subprocess.run(["git", "commit", "-m", f"Auto sync properties via admin [{len(items)} items]"], cwd=BASE_DIR, check=False)
        res = subprocess.run(["git", "push", "origin", "main"], cwd=BASE_DIR, capture_output=True, text=True, check=False)
        if res.returncode == 0:
            git_synced = True
    except Exception as e:
        print("Local git push error (non-fatal):", e)

    return jsonify({
        "success": True,
        "message": "매물 데이터가 성공적으로 저장 및 동기화되었습니다.",
        "count": len(items),
        "gitSynced": git_synced
    })

# 1. 매물 목록 조회 API (GET /api/properties)
@app.route("/api/properties", methods=["GET"])
def get_properties():
    category = request.args.get("category")
    deal_type = request.args.get("dealType")
    keyword = request.args.get("keyword", "").strip().lower()

    items = PROPERTIES_CACHE if PROPERTIES_CACHE else load_properties()
    results = items

    if category and category != "ALL":
        results = [p for p in results if p.get("type") == category]

    if deal_type and deal_type != "ALL":
        results = [p for p in results if p.get("dealType") == deal_type]

    if keyword:
        results = [
            p for p in results
            if keyword in p.get("title", "").lower()
            or keyword in p.get("location", "").lower()
            or keyword in p.get("tags", "").lower()
            or keyword in p.get("subType", "").lower()
        ]

    return jsonify({"success": True, "count": len(results), "data": results})

# 2. 신규 매물 등록 API (POST /api/properties)
@app.route("/api/properties", methods=["POST"])
def add_property():
    data = request.json or {}
    new_id = data.get("id") or f"PROP-{len(PROPERTIES_CACHE) + 1001}"
    data["id"] = new_id

    PROPERTIES_CACHE.insert(0, data)
    save_cache_to_csv()
    return jsonify({"success": True, "message": "매물이 성공적으로 등록되었습니다.", "data": data})

# 3. 매물 수정 API (PUT /api/properties/<id>)
@app.route("/api/properties/<id>", methods=["PUT"])
def update_property(id):
    data = request.json or {}
    for idx, p in enumerate(PROPERTIES_CACHE):
        if p.get("id") == id:
            PROPERTIES_CACHE[idx] = {**p, **data}
            save_cache_to_csv()
            return jsonify({"success": True, "message": "매물 정보가 수정되었습니다."})
    return jsonify({"success": False, "message": "매물을 찾을 수 없습니다."}), 404

# 4. 매물 삭제 API (DELETE /api/properties/<id>)
@app.route("/api/properties/<id>", methods=["DELETE"])
def delete_property(id):
    global PROPERTIES_CACHE
    initial_len = len(PROPERTIES_CACHE)
    PROPERTIES_CACHE = [p for p in PROPERTIES_CACHE if p.get("id") != id]
    if len(PROPERTIES_CACHE) < initial_len:
        save_cache_to_csv()
        return jsonify({"success": True, "message": "매물이 삭제되었습니다."})
    return jsonify({"success": False, "message": "매물을 찾을 수 없습니다."}), 404

# 5. CSV 다운로드 API (GET /api/properties/csv)
@app.route("/api/properties/csv", methods=["GET"])
def export_csv():
    items = PROPERTIES_CACHE if PROPERTIES_CACHE else load_properties_from_csv()
    if not items:
        return "No data", 404

    output = io.StringIO()
    headers = list(items[0].keys())
    writer = csv.DictWriter(output, fieldnames=headers)
    writer.writeheader()
    writer.writerows(items)

    csv_data = "\ufeff" + output.getvalue()
    return Response(
        csv_data,
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment; filename=properties.csv"}
    )

# 6. CSV 일괄 업로드 API (POST /api/properties/csv)
@app.route("/api/properties/csv", methods=["POST"])
def import_csv():
    global PROPERTIES_CACHE
    if "file" not in request.files:
        return jsonify({"success": False, "message": "업로드할 CSV 파일이 없습니다."}), 400

    file = request.files["file"]
    stream = io.StringIO(file.stream.read().decode("utf-8-sig"), newline=None)
    reader = csv.DictReader(stream)
    new_items = [row for row in reader]

    if new_items:
        PROPERTIES_CACHE = new_items
        save_cache_to_csv()
        return jsonify({"success": True, "count": len(new_items), "message": f"{len(new_items)}건의 매물이 반영되었습니다."})

    return jsonify({"success": False, "message": "유효한 매물 데이터가 없습니다."}), 400

# 7. 고객 상담 접수 API (POST /api/customer/lead)
@app.route("/api/customer/lead", methods=["POST"])
def create_customer_lead():
    data = request.json or {}
    kakao_key = data.get("kakaoKey", "") or os.environ.get("KAKAO_REST_API_KEY", "")

    # 차후 카카오톡 비즈메시지 / 나에게보내기 REST API 발송 처리 예시
    kakao_status = "READY"
    if kakao_key and kakao_key != "your_kakao_rest_api_key_here":
        # kakao_send_alert(kakao_key, data)
        kakao_status = "SENT"

    return jsonify({
        "success": True,
        "message": "고객 상담 신청이 안전하게 접수되었습니다.",
        "kakaoStatus": kakao_status,
        "lead": data
    })

def save_cache_to_csv():
    try:
        if os.access(os.path.dirname(CSV_PATH), os.W_OK):
            with open(CSV_PATH, mode="w", encoding="utf-8-sig", newline="") as f:
                if PROPERTIES_CACHE:
                    writer = csv.DictWriter(f, fieldnames=list(PROPERTIES_CACHE[0].keys()))
                    writer.writeheader()
                    writer.writerows(PROPERTIES_CACHE)
    except Exception as e:
        print("CSV Save Warning (Read-only environment):", e)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
