"""
도안수목토 재벌 공인중개사사무소 - 로컬 서버 실행 스크립트
실행 방법: python main.py
"""

import os
import sys
import socket
import webbrowser
import socketserver
import http.server

# .env 환경 변수 파일 로드 (외부 패키지 없이 직접 파싱)
def load_env(env_path=".env"):
    if os.path.exists(env_path):
        try:
            with open(env_path, encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, v = line.split("=", 1)
                        k = k.strip()
                        v = v.strip().strip("'\"")
                        if k and k not in os.environ:
                            os.environ[k] = v
        except Exception:
            pass

load_env()

DEFAULT_PORT = int(os.environ.get("PORT", 8000))

def get_available_port(start_port=DEFAULT_PORT, max_attempts=20):
    """지정된 포트가 사용 중이면 사용 가능한 다음 포트를 탐색"""
    for port in range(start_port, start_port + max_attempts):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(("", port))
                return port
            except OSError:
                continue
    return start_port

class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True

def run_flask(port):
    print(f"🚀 Flask 기반 웹서버를 시작합니다 (포트: {port})...")
    from api.index import app
    webbrowser.open(f"http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=False)

def run_builtin(port):
    print("ℹ️ Flask 패키지가 없어 파이썬 내장 HTTP 서버로 실행합니다.")
    print("ℹ️ (모든 정적 웹 기능 및 로컬 스토리지 연동 정상 작동)")
    print("ℹ️ Flask 전체 백엔드 API를 사용하시려면: pip install -r requirements.txt\n")
    
    handler = http.server.SimpleHTTPRequestHandler
    with ReusableTCPServer(("", port), handler) as httpd:
        print(f"🌐 웹 서비스 주소: http://localhost:{port}")
        webbrowser.open(f"http://localhost:{port}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n서버를 종료합니다.")

if __name__ == "__main__":
    port = get_available_port(DEFAULT_PORT)
    if port != DEFAULT_PORT:
        print(f"⚠️ {DEFAULT_PORT}번 포트가 이미 사용 중이므로 {port}번 포트로 실행합니다.")

    try:
        import flask
        run_flask(port)
    except ImportError:
        run_builtin(port)

