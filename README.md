# 도안수목토 재벌 공인중개사사무소 웹서비스

대전 도안신도시 수목토 아파트 및 상가 전문 부동산 웹서비스 (Python + Vercel 지원)

---

## 🚀 빠른 시작 (로컬 실행)

```bash
# 1. 의존성 설치 (선택)
pip install -r requirements.txt

# 2. 서버 실행 (자동으로 브라우저가 열립니다)
python main.py
```
> 브라우저 접속 주소: `http://localhost:8000`

---

## 🌐 GitHub 푸시 및 Vercel 배포 가이드

### 1단계: GitHub에 코드 올리기

1. [GitHub](https://github.com)에 로그인 후 새 리포지토리(New Repository)를 생성합니다. (예: `SuMokTo-Webpage`)
2. 터미널(PowerShell 또는 CMD)에서 다음 명령어를 실행합니다:

```bash
# 현재 폴더에서 실행
git add .
git commit -m "Initial commit: 도안수목토 재벌부동산 웹서비스"
git branch -M main

# 아래 YOUR_GITHUB_USERNAME을 본인의 깃허브 아이디로 변경하세요
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/SuMokTo-Webpage.git
git push -u origin main
```

---

### 2단계: Vercel에서 1분 만에 웹서비스 배포하기

1. [Vercel](https://vercel.com)에 접속하여 로그인 (GitHub 계정으로 로그인 권장)
2. 대시보드 우측 상단의 **[Add New...]** -> **[Project]** 클릭
3. 방금 푸시한 **`SuMokTo-Webpage`** 리포지토리를 찾아 **[Import]** 클릭
4. 설정 화면:
   - **Framework Preset**: `Other` (기본값 유지)
   - **Root Directory**: `./` (기본값 유지)
   - 별도 환경변수 설정 없이 바로 하단의 **[Deploy]** 버튼 클릭!
5. 약 30초~1분 후 배포가 완료되며, 생성된 고유 도메인(예: `https://sumokto-webpage.vercel.app`)을 통해 전 세계 어디서나 접속 가능한 웹서비스가 시작됩니다.

---

## 📁 프로젝트 구조

```
SuMokTo-Webpage/
├── api/
│   └── index.py            # Vercel Serverless Python 백엔드 (Flask)
├── css/
│   └── style.css           # 럭셔리 골드&다크 스타일
├── js/
│   └── app.js              # 프론트엔드 UI/인증/CSV 제어 로직
├── data/
│   └── properties.csv      # 초기 매물 데이터 (UTF-8-SIG)
├── index.html              # 반응형 메인 웹페이지
├── logo01.png              # 공식 심볼 로고
├── main.py                 # 파이썬 로컬 실행기 (python main.py)
├── requirements.txt        # Vercel 배포용 파이썬 패키지
├── vercel.json             # Vercel 라우팅 및 서버리스 설정
└── .gitignore              # Git 제외 파일 목록
```

---

## 🔑 주요 기능 안내

1. **상단 좌측 로고 클릭 시**:
   - '관계자 모드(ID/PW)' 인증 모달 팝업
   - 초기 관리자 계정: `admin` / `1234`
   - 관계자 로그인 시: 신규 매물 등록, 매물 수정/삭제, CSV 일괄 업로드/다운로드, 계정 추가/관리 기능 활성화
2. **매물검색 (주거/상가)**:
   - 주거용(아파트/주상복합) 및 상가용(상가/오피스/빌딩) 탭 필터링
   - 매매, 전세, 월세 조건별 필터 및 실시간 키워드 검색
   - CSV 파일 내보내기/가져오기로 대량 매물 즉시 편집
3. **고객 등록 및 카카오톡 연동**:
   - 1:1 VIP 매수/매도/임대 상담 신청 접수
   - 차후 관리자 화면에서 카카오 JavaScript 키 설정 시 담당자 카카오톡 알림 전송 연동 지원
