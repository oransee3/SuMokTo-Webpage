/**
 * 도안수목토 재벌 공인중개사사무소 웹 어플리케이션
 * Features:
 * - 매물 관리 (주거/상가, 추천매물, 검색, 필터링)
 * - CSV 데이터 가져오기 / 내보내기 (UTF-8 BOM 지원)
 * - 관계자 모드 (ID/PW 인증, 계정 추가/수정/삭제)
 * - 고객 등록 (상담 접수, 로컬 저장 및 카카오 API 연동 준비)
 */

// ==========================================
// 1. 초기 기본 매물 데이터
// ==========================================
const DEFAULT_PROPERTIES = [
  {
    id: 'PROP-1001',
    type: '주거',
    subType: '아파트',
    dealType: '매매',
    title: '도안 수목토 아파트 로얄동',
    location: '대전광역시 서구 도안동',
    price: '6억 8,000만',
    priceNumber: 68000,
    area: '112㎡ (34평형)',
    floor: '18층 / 25층',
    tags: '#남향 #초품아 #탁트인조망 #올수리',
    description: '도안신도시 중심 입지! 일조권과 조망이 매우 우수하며 내부 인테리어 올수리 완료되어 즉시 입주 가능합니다.',
    featured: 'Y',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80'
    ],
    contact: '042-546-4900',
    mapImageUrl: 'images/A-Type-Plan03.png'
  },
  {
    id: 'PROP-1002',
    type: '주거',
    subType: '아파트',
    dealType: '전세',
    title: '도안 힐스테이트 고층 로얄뷰',
    location: '대전광역시 서구 도안동',
    price: '4억 5,000만',
    priceNumber: 45000,
    area: '84㎡ (25평형)',
    floor: '22층 / 30층',
    tags: '#신축급 #역세권 #시스템에어컨 #융자없음',
    description: '도안 핵심 생활권, 학군 및 편의시설 인접. 융자 없는 안심 전세 매물로 신혼부부 및 소가족 강력 추천합니다.',
    featured: 'Y',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'
    ],
    contact: '042-546-4900',
    mapImageUrl: ''
  },
  {
    id: 'PROP-1003',
    type: '주거',
    subType: '주상복합',
    dealType: '매매',
    title: '대전 하늘채 루시에르 하이엔드',
    location: '대전광역시 중구 선화동',
    price: '12억 5,000만',
    priceNumber: 125000,
    area: '140㎡ (42평형)',
    floor: '38층 / 49층',
    tags: '#초고층 #파노라마뷰 #하이엔드 #풀옵션',
    description: '대전을 대표하는 럭셔리 주상복합 펜트하우스급 파노라마 조망. 최고급 이태리 수입 자재 시공 및 호텔식 컨시어지 서비스 제공.',
    featured: 'Y',
    imageUrl: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80',
    contact: '042-546-4900'
  },
  {
    id: 'PROP-1004',
    type: '주거',
    subType: '아파트',
    dealType: '월세',
    title: '도안 아이파크 쾌적한 남향',
    location: '대전광역시 서구 도안동',
    price: '보증금 5,000만 / 월 180만',
    priceNumber: 5000,
    area: '115㎡ (35평형)',
    floor: '10층 / 20층',
    tags: '#남서향 #단지내조경 #확장형 #쾌적',
    description: '넓은 동간 거리와 풍부한 녹지 조경. 채광이 하루종일 우수하며 깨끗하게 관리되어 깔끔한 상태를 유지하고 있습니다.',
    featured: 'N',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    contact: '042-546-4900'
  },
  {
    id: 'PROP-2001',
    type: '상가',
    subType: '근린상가',
    dealType: '월세',
    title: '도안 수목토 메인대로변 1층 코너 상가',
    location: '대전광역시 서구 도안동',
    price: '보증금 5,000만 / 월 320만',
    priceNumber: 5000,
    area: '66㎡ (20평)',
    floor: '1층 / 5층',
    tags: '#대로변코너 #가시성최상 #무권리금 #카페추천',
    description: '유동인구 및 대단지 아파트 배후수요가 집중되는 메인 통로 상가. 카페, 베이커리, 약국, 프랜차이즈 강력 추천.',
    featured: 'Y',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    contact: '042-546-4900'
  },
  {
    id: 'PROP-2002',
    type: '상가',
    subType: '상가건물',
    dealType: '매매',
    title: '유성 도안 신축 상가빌딩 통매매',
    location: '대전광역시 유성구 상대동',
    price: '35억',
    priceNumber: 350000,
    area: '대지 330㎡ / 연면적 680㎡',
    floor: '지하1층 ~ 지상4층',
    tags: '#수익률5% #우량임차완료 #안정적수익',
    description: '현재 전층 우량 임차인 입주 완료(병의원, 학원, 유명 프랜차이즈), 공실 걱정 없는 연 5% 이상 고수익 빌딩 매물.',
    featured: 'Y',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    contact: '042-546-4900'
  },
  {
    id: 'PROP-2003',
    type: '상가',
    subType: '사무실',
    dealType: '월세',
    title: '도안 테크노밸리 스마트 오피스',
    location: '대전광역시 유성구 용산동',
    price: '보증금 3,000만 / 월 180만',
    priceNumber: 3000,
    area: '132㎡ (40평)',
    floor: '6층 / 10층',
    tags: '#인테리어완비 #주차편리 #즉시입주 #룸3개',
    description: '대표실, 대회의실, 탕비공간 인테리어 완비. 시스템 냉난방기 설치되어 가구 집기만 가지고 바로 근무 가능합니다.',
    featured: 'N',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    contact: '042-546-4900'
  },
  {
    id: 'PROP-2004',
    type: '상가',
    subType: '근린상가',
    dealType: '매매',
    title: '도안 2단계 신상권 2층 병의원 개원자리',
    location: '대전광역시 유성구 복용동',
    price: '7억 8,000만',
    priceNumber: 78000,
    area: '148㎡ (45평)',
    floor: '2층 / 7층',
    tags: '#신축상가 #소아과치과추천 #엘리베이터앞',
    description: '배후 1만 세대 항아리 상권 초입 메인 코너 위치. 소아과, 치과, 한의원, 대형 전문학원 개원에 최적화된 자리입니다.',
    featured: 'N',
    imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    contact: '042-546-4900'
  }
];

// 초기 관리자 계정 목록
const DEFAULT_USERS = [
  { id: 'admin', pw: '1234', name: '대표 중개사', role: '최고관리자' },
  { id: 'agent1', pw: '1234', name: '소속 공인중개사', role: '매물관리자' }
];

// ==========================================
// 2. 인증 관리자 (AuthManager)
// ==========================================
const AuthManager = {
  KEY_USERS: 'chebol_auth_users',
  KEY_CURRENT_USER: 'chebol_current_user',

  init() {
    // 웹페이지를 닫으면 자동으로 일반 모드가 되도록 localStorage의 잔여 로그인 세션 정리
    localStorage.removeItem(this.KEY_CURRENT_USER);
    if (!localStorage.getItem(this.KEY_USERS)) {
      localStorage.setItem(this.KEY_USERS, JSON.stringify(DEFAULT_USERS));
    }
  },

  getUsers() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(this.KEY_USERS)) || DEFAULT_USERS;
    } catch (e) {
      return DEFAULT_USERS;
    }
  },

  saveUsers(users) {
    localStorage.setItem(this.KEY_USERS, JSON.stringify(users));
  },

  getCurrentUser() {
    try {
      // 브라우저 종료 시 자동 소멸되는 sessionStorage만 사용하여 일반 모드로 복귀 보장
      const userStr = sessionStorage.getItem(this.KEY_CURRENT_USER);
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      return null;
    }
  },

  isLoggedIn() {
    return this.getCurrentUser() !== null;
  },

  login(id, pw) {
    const users = this.getUsers();
    const found = users.find(u => u.id === id.trim() && u.pw === pw.trim());
    if (found) {
      const sessionUser = { id: found.id, name: found.name, role: found.role };
      // 탭/창 종료 시 자동 로그아웃을 위해 sessionStorage에만 저장
      sessionStorage.setItem(this.KEY_CURRENT_USER, JSON.stringify(sessionUser));
      return { success: true, user: sessionUser };
    }
    return { success: false, message: '아이디 또는 비밀번호가 일치하지 않습니다.' };
  },

  logout() {
    sessionStorage.removeItem(this.KEY_CURRENT_USER);
    localStorage.removeItem(this.KEY_CURRENT_USER);
  },

  addUser(id, pw, name, role = '담당자') {
    const users = this.getUsers();
    if (users.some(u => u.id === id.trim())) {
      return { success: false, message: '이미 존재하는 아이디입니다.' };
    }
    users.push({ id: id.trim(), pw: pw.trim(), name: name.trim(), role });
    this.saveUsers(users);
    return { success: true, message: '새 계정이 등록되었습니다.' };
  },

  updateUser(id, newPw, newName) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return { success: false, message: '계정을 찾을 수 없습니다.' };
    if (newPw) users[idx].pw = newPw.trim();
    if (newName) users[idx].name = newName.trim();
    this.saveUsers(users);
    return { success: true, message: '계정 정보가 수정되었습니다.' };
  },

  deleteUser(id) {
    let users = this.getUsers();
    if (users.length <= 1) {
      return { success: false, message: '최소 1개의 관리자 계정이 유지되어야 합니다.' };
    }
    const current = this.getCurrentUser();
    if (current && current.id === id) {
      return { success: false, message: '현재 로그인 중인 본인 계정은 삭제할 수 없습니다.' };
    }
    users = users.filter(u => u.id !== id);
    this.saveUsers(users);
    return { success: true, message: '계정이 삭제되었습니다.' };
  }
};

// ==========================================
// 3. CSV 처리기 (CSVParser)
// ==========================================
const CSVParser = {
  // 매물 배열을 CSV 문자열로 변환 (UTF-8)
  toCSV(properties) {
    const headers = ['id', 'type', 'subType', 'dealType', 'title', 'location', 'price', 'priceNumber', 'floorType', 'area', 'floor', 'tags', 'description', 'featured', 'imageUrl', 'contact', 'mapImageUrl', 'images'];
    const rows = [headers.join(',')];

    properties.forEach(p => {
      const row = headers.map(header => {
        let val = '';
        if (header === 'images' && Array.isArray(p.images)) {
          val = p.images.join(';');
        } else if (p[header] !== undefined && p[header] !== null) {
          val = String(p[header]);
        }
        // 쉼표나 따옴표나 줄바꿈이 있는 경우 쌍따옴표로 감싸고 쌍따옴표는 두 번 표기
        if (val.includes(',') || val.includes('"') || val.includes('\n')) {
          val = '"' + val.replace(/"/g, '""') + '"';
        }
        return val;
      });
      rows.push(row.join(','));
    });

    return '\uFEFF' + rows.join('\r\n'); // UTF-8 BOM 추가
  },

  // CSV 문자열을 매물 배열로 파싱
  parseCSV(text) {
    // BOM 제거
    let cleanText = text.replace(/^\uFEFF/, '');
    const lines = this.parseCSVLines(cleanText);
    if (lines.length < 2) return [];

    const headers = lines[0].map(h => h.trim());
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (line.length === 0 || (line.length === 1 && line[0].trim() === '')) continue;
      
      const obj = {};
      headers.forEach((h, idx) => {
        obj[h] = line[idx] !== undefined ? line[idx].trim() : '';
      });

      if (obj.id && obj.title) {
        // 필수 값 보정
        obj.type = obj.type || '주거';
        obj.subType = obj.subType || '기타';
        obj.dealType = obj.dealType || '매매';
        obj.price = obj.price || '가격협의';
        obj.priceNumber = Number(obj.priceNumber) || 0;
        obj.floorType = obj.floorType || '';
        obj.area = obj.area || '-';
        obj.floor = obj.floor || '-';
        obj.tags = obj.tags || '';
        obj.description = obj.description || '';
        obj.featured = (obj.featured && obj.featured.toUpperCase() === 'Y') ? 'Y' : 'N';
        obj.imageUrl = obj.imageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
        obj.contact = obj.contact || '042-546-4900';
        obj.mapImageUrl = obj.mapImageUrl || '';
        if (obj.images && typeof obj.images === 'string') {
          obj.images = obj.images.split(';').map(s => s.trim()).filter(Boolean);
        } else {
          obj.images = obj.imageUrl ? [obj.imageUrl] : [];
        }
        if (obj.images.length > 0) {
          obj.imageUrl = obj.images[0];
        }
        result.push(obj);
      }
    }
    return result;
  },

  // RFC 4180 준수 CSV 토크나이저
  parseCSVLines(text) {
    const lines = [];
    let row = [];
    let cur = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      const next = text[i + 1];

      if (c === '"') {
        if (inQuotes && next === '"') {
          cur += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === ',' && !inQuotes) {
        row.push(cur);
        cur = '';
      } else if ((c === '\r' || c === '\n') && !inQuotes) {
        if (c === '\r' && next === '\n') i++;
        row.push(cur);
        cur = '';
        lines.push(row);
        row = [];
      } else {
        cur += c;
      }
    }
    if (cur.length > 0 || row.length > 0) {
      row.push(cur);
      lines.push(row);
    }
    return lines;
  },

  // 파일 다운로드 트리거
  download(filename, content) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

// ==========================================
// 4-1. GitHub 실시간 동기화 관리자 (GitHubSyncManager)
// ==========================================
const GitHubSyncManager = {
  KEY_GITHUB_TOKEN: 'chebol_github_token',
  REPO: 'oransee3/SuMokTo-Webpage',
  cachedServerToken: '',

  getToken() {
    return localStorage.getItem(this.KEY_GITHUB_TOKEN) || this.cachedServerToken || '';
  },

  setToken(token) {
    localStorage.setItem(this.KEY_GITHUB_TOKEN, token.trim());
  },

  async init() {
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const cfg = await res.json();
        if (cfg && cfg.githubRepo) this.REPO = cfg.githubRepo;
      }
    } catch (e) {}

    const tokenInput = document.getElementById('githubTokenInput');
    if (tokenInput && !tokenInput.value) {
      tokenInput.value = this.getToken();
    }
  },

  async sync(properties) {
    if (!properties || !Array.isArray(properties)) return false;

    // 1단계: 백엔드 API (/api/properties/sync) 호출 (로컬 개발 환경 및 Vercel)
    try {
      const apiRes = await fetch('/api/properties/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ properties, githubToken: this.getToken() })
      });
      if (apiRes.ok) {
        const data = await apiRes.json();
        if (data.gitSynced) {
          console.log('GitHub sync via backend git push succeeded');
          return true;
        }
      }
    } catch (e) {
      console.log('Backend sync check passed to GitHub API:', e);
    }

    // 2단계: 클라이언트 직접 GitHub REST API 호출 (Vercel 및 모든 외부 환경)
    let token = this.getToken();
    if (!token) {
      // 토큰이 없으면 대화형 팝업으로 1회 입력 요청
      token = window.prompt('🚀 GitHub 저장소에 실시간으로 업로드하려면 GitHub Personal Access Token(PAT)을 입력해 주세요:\n(1회만 입력하시면 브라우저에 안전하게 기억되어 다음부터 완전 자동 처리됩니다)');
      if (token && token.trim()) {
        this.setToken(token.trim());
        token = token.trim();
        const input = document.getElementById('githubTokenInput');
        if (input) input.value = token;
      } else {
        console.warn('GitHub Token not provided. Stored locally only.');
        return false;
      }
    }

    try {
      const path = 'data/properties.json';
      const url = `https://api.github.com/repos/${this.REPO}/contents/${path}`;

      // 1) 기존 파일 SHA 조회
      let sha = null;
      const getRes = await fetch(url, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      if (getRes.ok) {
        const fileData = await getRes.json();
        sha = fileData.sha;
      }

      // 2) UTF-8 Base64 인코딩 (한글 및 특수문자 완벽 처리)
      const jsonStr = JSON.stringify(properties, null, 2);
      const encodedContent = btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (match, p1) => {
        return String.fromCharCode('0x' + p1);
      }));

      // 3) GitHub API Contents PUT 요청으로 커밋 생성
      const putRes = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
          message: `Auto sync properties [${properties.length} items] - ${new Date().toLocaleString('ko-KR')}`,
          content: encodedContent,
          sha: sha || undefined
        })
      });

      if (putRes.ok) {
        console.log('Successfully committed to GitHub repository via API');
        return true;
      } else {
        const errData = await putRes.json();
        console.error('GitHub API error:', errData);
        if (errData && errData.message && errData.message.includes('Bad credentials')) {
          localStorage.removeItem(this.KEY_GITHUB_TOKEN);
          const newToken = window.prompt('⚠️ 입력된 GitHub 토큰이 유효하지 않습니다.\n올바른 GitHub Personal Access Token(PAT)을 다시 입력해 주세요:');
          if (newToken && newToken.trim()) {
            this.setToken(newToken.trim());
            return this.sync(properties);
          }
        }
        return false;
      }
    } catch (err) {
      console.error('GitHub API sync exception:', err);
      return false;
    }
  }
};

// ==========================================
// 4. 매물 관리자 (PropertyManager)
// ==========================================
const PropertyManager = {
  KEY_PROPERTIES: 'chebol_properties_data',
  KEY_DELETED: 'chebol_deleted_property_ids',
  DATA_VERSION_KEY: 'chebol_properties_version',
  CURRENT_VERSION: '20261125_v1',
  properties: [],

  getDeletedIds() {
    try {
      const raw = localStorage.getItem(this.KEY_DELETED);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  init() {
    const version = localStorage.getItem(this.DATA_VERSION_KEY);
    let stored = localStorage.getItem(this.KEY_PROPERTIES);
    const deletedIds = this.getDeletedIds();

    if (version !== this.CURRENT_VERSION) {
      // 캐시 버전이 변경된 경우 최신 데이터 강제 동기화 플래그 처리
      localStorage.setItem(this.DATA_VERSION_KEY, this.CURRENT_VERSION);
      localStorage.removeItem(this.KEY_PROPERTIES);
      stored = null;
    }

    if (stored) {
      try {
        this.properties = JSON.parse(stored);
        // 삭제된 매물 완벽 배제
        if (deletedIds.length > 0) {
          this.properties = this.properties.filter(p => !deletedIds.includes(p.id));
        }
        // 구버전 캐시 호환: images, mapImageUrl 및 floorType 보정
        this.properties.forEach(p => {
          if (!p.images || !Array.isArray(p.images) || p.images.length === 0) {
            p.images = p.imageUrl ? [p.imageUrl] : [];
          }
          if (!p.floorType) {
            if (p.title && p.title.includes('1502동')) p.floorType = 'D-Type';
            else if (p.title && p.title.includes('101동')) p.floorType = 'A-Type';
            else if (p.title && p.title.includes('108동')) p.floorType = 'C-Type';
          }
          // 도안수목토 아파트인 경우에만 공식 평면도 매칭, 그 외 단지(도안아이파크 등)는 빈값('') 처리
          if (p.title && p.title.includes('수목토')) {
            const raw = (p.floorType || '').toUpperCase();
            if (raw.includes('B') || raw.includes('D')) p.mapImageUrl = 'images/B-Type-Plan03.png';
            else if (raw.includes('C')) p.mapImageUrl = 'images/C-Type-Plan03.png';
            else p.mapImageUrl = 'images/A-Type-Plan03.png';
          } else {
            p.mapImageUrl = '';
          }
        });
      } catch (e) {
        this.properties = [...DEFAULT_PROPERTIES];
        this.save();
      }
    } else {
      this.properties = [...DEFAULT_PROPERTIES];
      this.save();
    }

    // 외부 접속 시 GitHub/서버 최신 매물 실시간 fetch (캐시 무효화 타임스탬프)
    this.fetchRemoteProperties();
  },

  async fetchRemoteProperties() {
    try {
      const deletedIds = this.getDeletedIds();

      // 1순위: GitHub Raw URL (GitHub 커밋 즉시 0.1초 만에 전 세계 실시간 반영)
      const rawUrl = `https://raw.githubusercontent.com/oransee3/SuMokTo-Webpage/main/data/properties.json?t=${Date.now()}`;
      let res = await fetch(rawUrl, { cache: 'no-store' });

      // 2순위: Vercel 정적 파일
      if (!res.ok) {
        res = await fetch(`data/properties.json?t=${Date.now()}`, { cache: 'no-store' });
      }
      // 3순위: 백엔드 API
      if (!res.ok) {
        res = await fetch(`/api/properties?t=${Date.now()}`, { cache: 'no-store' });
      }

      if (res.ok) {
        const data = await res.json();
        let items = Array.isArray(data) ? data : (data.data || []);
        if (items && items.length > 0) {
          // 관계자 모드에서 삭제된 매물 필터링 (다시 부활하지 않도록 영구 방어)
          if (deletedIds.length > 0) {
            items = items.filter(p => !deletedIds.includes(p.id));
          }

          items.forEach(p => {
            if (!p.floorType) {
              if (p.title && p.title.includes('1502동')) p.floorType = 'D-Type';
              else if (p.title && p.title.includes('101동')) p.floorType = 'A-Type';
              else if (p.title && p.title.includes('108동')) p.floorType = 'C-Type';
            }
            // 도안수목토 아파트인 경우에만 공식 평면도 매칭, 그 외 단지는 빈값('') 처리
            if (p.title && p.title.includes('수목토')) {
              const raw = (p.floorType || '').toUpperCase();
              if (raw.includes('B') || raw.includes('D')) p.mapImageUrl = 'images/B-Type-Plan03.png';
              else if (raw.includes('C')) p.mapImageUrl = 'images/C-Type-Plan03.png';
              else p.mapImageUrl = 'images/A-Type-Plan03.png';
            } else {
              p.mapImageUrl = '';
            }
          });
          this.properties = items;
          this.save();
          if (typeof UI !== 'undefined' && UI.renderProperties) {
            UI.renderProperties();
            UI.renderFeaturedProperties();
          }
        }
      }
    } catch (e) {
      console.log('Remote property fetch fallback to local cache:', e);
    }
  },

  save() {
    try {
      localStorage.setItem(this.KEY_PROPERTIES, JSON.stringify(this.properties));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
      if (typeof UI !== 'undefined' && UI.showToast) {
        UI.showToast('브라우저 저장 한도로 인해 CSV 내보내기로 백업을 권장합니다.', 'error');
      }
    }
  },

  getAll() {
    return this.properties;
  },

  getById(id) {
    return this.properties.find(p => p.id === id);
  },

  getPropertyById(id) {
    return this.getById(id);
  },

  add(property) {
    if (!property.id) {
      property.id = 'PROP-' + Date.now().toString().slice(-6);
    }
    // 신규 등록 시 삭제 목록에서 제거 (혹시 같은 ID일 경우 대비)
    try {
      let deletedIds = this.getDeletedIds();
      if (deletedIds.includes(property.id)) {
        deletedIds = deletedIds.filter(d => d !== property.id);
        localStorage.setItem(this.KEY_DELETED, JSON.stringify(deletedIds));
      }
    } catch (e) {}

    this.properties.unshift(property);
    this.save();
    return property;
  },

  update(id, updatedData) {
    const idx = this.properties.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.properties[idx] = { ...this.properties[idx], ...updatedData };
      this.save();
      return true;
    }
    return false;
  },

  delete(id) {
    const idx = this.properties.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.properties.splice(idx, 1);
      this.save();

      // 삭제된 매물 ID 영구 기록 (새로고침 및 원격 동기화 시 부활 방지)
      try {
        const deletedIds = this.getDeletedIds();
        if (!deletedIds.includes(id)) {
          deletedIds.push(id);
          localStorage.setItem(this.KEY_DELETED, JSON.stringify(deletedIds));
        }
        // 탭 간 실시간 동기화 트리거 이벤트 발생
        localStorage.setItem('chebol_properties_last_deleted', JSON.stringify({ id, timestamp: Date.now() }));
      } catch (e) {}

      return true;
    }
    return false;
  },

  resetDefault() {
    this.properties = [...DEFAULT_PROPERTIES];
    this.save();
  },

  importFromCSV(csvText) {
    const parsed = CSVParser.parseCSV(csvText);
    if (parsed.length > 0) {
      this.properties = parsed;
      this.save();
      return { success: true, count: parsed.length };
    }
    return { success: false, message: '올바른 매물 데이터 형식이 아니거나 데이터가 비어 있습니다.' };
  },

  exportToCSV() {
    return CSVParser.toCSV(this.properties);
  }
};

// ==========================================
// 5. 고객 등록 및 카카오 API 연동 관리자 (CustomerManager)
// ==========================================
const CustomerManager = {
  KEY_LEADS: 'chebol_customer_leads',
  KEY_KAKAO_APP_KEY: 'chebol_kakao_app_key',
  cachedServerKey: '',

  async init() {
    let kakaoKey = this.getKakaoKey();

    // 로컬스토리지에 키가 없으면 백엔드 .env 환경 변수(/api/config)에서 로드 시도
    if (!kakaoKey) {
      try {
        const res = await fetch('/api/config');
        if (res.ok) {
          const cfg = await res.json();
          if (cfg && cfg.kakaoJsKey && cfg.kakaoJsKey !== 'your_kakao_javascript_key_here') {
            this.cachedServerKey = cfg.kakaoJsKey;
            kakaoKey = this.cachedServerKey;

            // 관리자 입력 필드에 자동 반영
            const kakaoInput = document.getElementById('kakaoAppKeyInput');
            if (kakaoInput && !kakaoInput.value) {
              kakaoInput.value = kakaoKey;
            }
          }
        }
      } catch (e) {
        // 정적 모드 등 API 미응답 시 예외 무시
      }
    }

    if (kakaoKey && window.Kakao && !window.Kakao.isInitialized()) {
      try {
        window.Kakao.init(kakaoKey);
        console.log('Kakao SDK Initialized');
      } catch (e) {
        console.warn('Kakao init error:', e);
      }
    }
  },

  getKakaoKey() {
    return localStorage.getItem(this.KEY_KAKAO_APP_KEY) || this.cachedServerKey || '';
  },

  setKakaoKey(key) {
    localStorage.setItem(this.KEY_KAKAO_APP_KEY, key.trim());
    if (key && window.Kakao && !window.Kakao.isInitialized()) {
      try {
        window.Kakao.init(key.trim());
      } catch (e) {
        console.error('Failed to init Kakao:', e);
      }
    }
  },

  getLeads() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY_LEADS)) || [];
    } catch (e) {
      return [];
    }
  },

  saveLead(leadData) {
    const leads = this.getLeads();
    const newLead = {
      id: 'LEAD-' + Date.now(),
      createdAt: new Date().toLocaleString('ko-KR'),
      status: '접수완료',
      ...leadData
    };
    leads.unshift(newLead);
    localStorage.setItem(this.KEY_LEADS, JSON.stringify(leads));

    // 카카오톡 알림 전송 시도
    this.sendKakaoNotification(newLead);

    return newLead;
  },

  sendKakaoNotification(lead) {
    const kakaoKey = this.getKakaoKey();
    if (window.Kakao && window.Kakao.isInitialized() && kakaoKey) {
      try {
        // 카카오톡 공유 메시지 또는 나에게 보내기 템플릿 호출 구조
        console.log('Sending Kakao Notification to manager room:', lead);
        // 향후 REST API 또는 Kakao.Share 커스텀 템플릿 연동
      } catch (err) {
        console.error('Kakao notification send error:', err);
      }
    } else {
      console.log('카카오 API Key 미설정: 로컬 데이터베이스에 안전하게 기록되었습니다.');
    }
  },

  exportLeadsToCSV() {
    const leads = this.getLeads();
    const headers = ['id', 'createdAt', 'name', 'phone', 'category', 'targetArea', 'budget', 'message', 'status'];
    const rows = [headers.join(',')];
    leads.forEach(l => {
      const row = headers.map(h => {
        let v = l[h] !== undefined ? String(l[h]) : '';
        if (v.includes(',') || v.includes('"') || v.includes('\n')) {
          v = '"' + v.replace(/"/g, '""') + '"';
        }
        return v;
      });
      rows.push(row.join(','));
    });
    return '\uFEFF' + rows.join('\r\n');
  }
};

// ==========================================
// 6. UI 컨트롤러 및 이벤트 바인딩
// ==========================================
const UI = {
  // 현재 필터 상태
  filters: {
    category: 'ALL',   // ALL, 주거, 상가
    dealType: 'ALL',   // ALL, 매매, 전세, 월세
    keyword: ''
  },

  // 매물 소개 대표 이미지 (1~3장) 관리 상태
  currentGalleryImages: [],
  activePasteTarget: 'gallery', // 'gallery' 또는 'map'

  init() {
    // 브라우저 접속 시 무조건 1열(헤더), 2열(메인 이미지) 최상단 노출 보장
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    if (!window.location.hash || window.location.hash === '#home') {
      window.scrollTo(0, 0);
    }

    AuthManager.init();
    PropertyManager.init();
    CustomerManager.init();
    GitHubSyncManager.init();

    this.bindEvents();
    this.updateAdminUI();
    this.renderProperties();
    this.renderFeaturedProperties();
  },

  // 상단 메뉴 및 바로가기 클릭 시 부드럽고 정확한 섹션 스크롤 이동
  scrollToSection(sectionId, event) {
    if (event) {
      event.preventDefault();
    }
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      try { history.pushState(null, '', '#home'); } catch(e) {}
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        const headerOffset = 80;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        try { history.pushState(null, '', `#${sectionId}`); } catch(e) {}
      }
    }
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
    }
  },

  // DOM 이벤트 등록
  bindEvents() {
    // 1. 상단 좌측 로고 / 상호 / 관계자 모드 버튼 클릭 -> 관계자 모드 상태면 일반 모드로 전환, 일반 모드면 로그인 모달 열기
    const brandLogoBtn = document.getElementById('brandLogoBtn');
    if (brandLogoBtn) {
      brandLogoBtn.addEventListener('click', () => {
        if (AuthManager.isLoggedIn()) {
          this.switchToNormalMode();
        } else {
          this.openModal('loginModal');
          document.getElementById('loginId').focus();
        }
      });
    }

    // 관리자 활성 인디케이터 배지 ('관계자 모드 (대표 중개사)') 클릭 -> 일반 모드로 전환
    const adminIndicatorBadge = document.getElementById('adminIndicatorBadge');
    if (adminIndicatorBadge) {
      adminIndicatorBadge.addEventListener('click', (e) => {
        e.stopPropagation();
        if (AuthManager.isLoggedIn()) {
          this.switchToNormalMode();
        }
      });
    }

    // 2. 로그인 폼
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('loginId').value;
        const pw = document.getElementById('loginPw').value;
        const res = AuthManager.login(id, pw);
        if (res.success) {
          this.closeModal('loginModal');
          this.showToast(`환영합니다, ${res.user.name}님! 관계자 모드가 활성화되었습니다.`);
          this.updateAdminUI();
          this.renderProperties();
          this.renderFeaturedProperties();
        } else {
          this.showToast(res.message, 'error');
        }
      });
    }

    // 3. 로그아웃 (일반 모드로 전환)
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        this.switchToNormalMode();
      });
    }

    // 4. 모바일 메뉴 토글
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
    }

    // 5. 매물 필터 탭 (주거 / 상가)
    const categoryTabs = document.querySelectorAll('.category-tab');
    categoryTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        categoryTabs.forEach(t => {
          t.classList.remove('active', 'bg-gold', 'text-black', 'border-gold', 'text-white');
          t.classList.add('text-gray-400', 'border-dark-border');
        });
        tab.classList.add('active', 'text-white', 'border-gold');
        tab.classList.remove('text-gray-400', 'text-black', 'border-dark-border');
        this.filters.category = tab.dataset.category;
        this.renderProperties();
      });
    });

    // 6. 거래 형태 필터 (매매 / 전세 / 월세)
    const dealTypeTabs = document.querySelectorAll('.deal-type-tab');
    dealTypeTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        dealTypeTabs.forEach(t => t.classList.remove('active', 'text-gold', 'border-b-2', 'border-gold'));
        dealTypeTabs.forEach(t => t.classList.add('text-gray-400'));
        tab.classList.add('active', 'text-gold', 'border-b-2', 'border-gold');
        tab.classList.remove('text-gray-400');
        this.filters.dealType = tab.dataset.deal;
        this.renderProperties();
      });
    });

    // 7. 검색 입력
    const searchInput = document.getElementById('propertySearchInput');
    const searchBtn = document.getElementById('propertySearchBtn');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.filters.keyword = e.target.value.trim().toLowerCase();
        this.renderProperties();
      });
    }
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        if (searchInput) {
          this.filters.keyword = searchInput.value.trim().toLowerCase();
          this.renderProperties();
        }
      });
    }

    // 히어로 섹션 빠른 검색
    const heroSearchInput = document.getElementById('heroSearchInput');
    const heroSearchBtn = document.getElementById('heroSearchBtn');
    if (heroSearchBtn && heroSearchInput) {
      heroSearchBtn.addEventListener('click', () => {
        const val = heroSearchInput.value.trim();
        if (searchInput) {
          searchInput.value = val;
          this.filters.keyword = val.toLowerCase();
          document.getElementById('properties').scrollIntoView({ behavior: 'smooth' });
          this.renderProperties();
        }
      });
    }

    // 8. 매물 등록/수정 모달 폼 제출
    const propertyForm = document.getElementById('propertyForm');
    if (propertyForm) {
      propertyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handlePropertyFormSubmit();
      });
    }

    // 8-1. 면적 입력 시 실시간 평수 자동 계산 미리보기
    const propAreaInput = document.getElementById('propArea');
    const pyungPreview = document.getElementById('propAreaPyungPreview');
    if (propAreaInput && pyungPreview) {
      propAreaInput.addEventListener('input', () => {
        const val = propAreaInput.value.trim();
        const numMatch = val.match(/^(\d+(?:\.\d+)?)/);
        if (numMatch) {
          const m2 = parseFloat(numMatch[1]);
          const pyung = (m2 * 0.3025).toFixed(1);
          pyungPreview.textContent = `약 ${pyung}평`;
          pyungPreview.classList.remove('hidden');
        } else {
          pyungPreview.classList.add('hidden');
        }
      });
    }

    // 9. CSV 다운로드 버튼 (매물 관리)
    const exportCsvBtn = document.getElementById('exportCsvBtn');
    if (exportCsvBtn) {
      exportCsvBtn.addEventListener('click', () => {
        const csv = PropertyManager.exportToCSV();
        const dateStr = new Date().toISOString().slice(0, 10);
        CSVParser.download(`도안수목토_재벌부동산_매물_${dateStr}.csv`, csv);
        this.showToast('매물 CSV 파일이 성공적으로 다운로드되었습니다.');
      });
    }

    // 10. CSV 업로드 인풋
    const importCsvInput = document.getElementById('importCsvInput');
    if (importCsvInput) {
      importCsvInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target.result;
          const res = PropertyManager.importFromCSV(content);
          if (res.success) {
            this.showToast(`CSV 매물 ${res.count}건을 성공적으로 등록 및 업데이트했습니다.`);
            this.renderProperties();
            this.renderFeaturedProperties();
            importCsvInput.value = '';
          } else {
            this.showToast(res.message, 'error');
          }
        };
        reader.readAsText(file, 'utf-8');
      });
    }

    // 11. 초기 샘플 데이터 복원 버튼
    const resetDataBtn = document.getElementById('resetDataBtn');
    if (resetDataBtn) {
      resetDataBtn.addEventListener('click', () => {
        if (confirm('기본 샘플 매물 데이터로 초기화하시겠습니까? (현재 데이터는 덮어써집니다)')) {
          PropertyManager.resetDefault();
          this.renderProperties();
          this.renderFeaturedProperties();
          this.showToast('초기 샘플 매물로 복원되었습니다.');
        }
      });
    }

    // 12. 고객 등록 폼 제출
    const customerForm = document.getElementById('customerRegisterForm');
    if (customerForm) {
      customerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleCustomerFormSubmit();
      });
    }

    // 13. 계정 추가 폼
    const addAccountForm = document.getElementById('addAccountForm');
    if (addAccountForm) {
      addAccountForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('newUserId').value;
        const pw = document.getElementById('newUserPw').value;
        const name = document.getElementById('newUserName').value;
        const role = document.getElementById('newUserRole').value;
        const res = AuthManager.addUser(id, pw, name, role);
        if (res.success) {
          this.showToast(res.message);
          addAccountForm.reset();
          this.renderAdminAccounts();
        } else {
          this.showToast(res.message, 'error');
        }
      });
    }

    // 14. 카카오 앱키 저장
    const saveKakaoKeyBtn = document.getElementById('saveKakaoKeyBtn');
    if (saveKakaoKeyBtn) {
      saveKakaoKeyBtn.addEventListener('click', () => {
        const key = document.getElementById('kakaoAppKeyInput').value;
        CustomerManager.setKakaoKey(key);
        this.showToast('카카오 JavaScript 앱 키가 저장되었습니다.');
      });
    }

    // 14-1. GitHub 실시간 연동 토큰 저장
    const saveGithubTokenBtn = document.getElementById('saveGithubTokenBtn');
    if (saveGithubTokenBtn) {
      saveGithubTokenBtn.addEventListener('click', () => {
        const token = document.getElementById('githubTokenInput').value;
        GitHubSyncManager.setToken(token);
        this.showToast('GitHub 연동 토큰이 저장되었습니다. 이제 매물 저장 시 실시간 업로드됩니다.');
      });
    }

    // 15. 고객 접수 목록 CSV 다운로드
    const exportLeadsCsvBtn = document.getElementById('exportLeadsCsvBtn');
    if (exportLeadsCsvBtn) {
      exportLeadsCsvBtn.addEventListener('click', () => {
        const csv = CustomerManager.exportLeadsToCSV();
        const dateStr = new Date().toISOString().slice(0, 10);
        CSVParser.download(`고객상담접수목록_${dateStr}.csv`, csv);
        this.showToast('고객 접수 데이터 CSV 다운로드가 완료되었습니다.');
      });
    }

    // 16. 주변 현황 지도(Ctrl+V 붙여넣기 및 파일 업로드) 이벤트 바인딩
    this.bindImageUploadEvents();

    // 모달 닫기 버튼 공통 바인딩
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-close-modal');
        this.closeModal(modalId);
      });
    });

    // 모달 바깥 배경(오버레이/백드롭) 클릭 시 창 닫기 공통 바인딩
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        // modal-content 내부 클릭이 아닌 모든 바깥 영역 클릭 시 모달 즉시 닫기
        if (!e.target.closest('.modal-content')) {
          this.closeModal(modal.id);
        }
      });
    });

    // ESC 키 입력 시 열려있는 모달 즉시 닫기
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay:not(.modal-hidden)').forEach(openModalEl => {
          this.closeModal(openModalEl.id);
        });
      }
    });
  },

  // 붙여넣기 활성 타깃 지정 및 시각적 테두리 하이라이트
  setActivePasteTarget(target) {
    this.activePasteTarget = target;
    const mapContainer = document.getElementById('mapSectionContainer');
    const galleryContainer = document.getElementById('gallerySectionContainer');
    if (mapContainer && galleryContainer) {
      if (target === 'map') {
        mapContainer.classList.add('ring-2', 'ring-gold');
        galleryContainer.classList.remove('ring-2', 'ring-gold');
      } else {
        galleryContainer.classList.add('ring-2', 'ring-gold');
        mapContainer.classList.remove('ring-2', 'ring-gold');
      }
    }
  },

  // 원클릭 클립보드 이미지 붙여넣기 버튼 핸들러
  async pasteFromClipboard(target = 'map') {
    this.setActivePasteTarget(target);
    try {
      if (navigator.clipboard && navigator.clipboard.read) {
        const items = await navigator.clipboard.read();
        for (const item of items) {
          const imageType = item.types.find(t => t.startsWith('image/'));
          if (imageType) {
            const blob = await item.getType(imageType);
            const reader = new FileReader();
            reader.onload = (event) => {
              const dataUrl = event.target.result;
              if (target === 'map') {
                this.setMapImage(dataUrl);
                this.showToast('📋 주변 현황 이미지가 클립보드에서 등록되었습니다!');
              } else {
                this.addGalleryImage(dataUrl);
              }
            };
            reader.readAsDataURL(blob);
            return;
          }
        }
      }
    } catch (err) {
      console.log('Clipboard direct read skipped:', err);
    }
    this.showToast(`키보드의 [Ctrl + V]를 눌러 캡처한 사진을 붙여넣으세요.`);
  },

  // 이미지 업로드 및 클립보드 붙여넣기(Ctrl+V) 제어
  bindImageUploadEvents() {
    const mapZone = document.getElementById('mapPasteZone');
    const mapFileInput = document.getElementById('mapFileInput');
    const removeMapBtn = document.getElementById('removeMapBtn');
    const galleryZone = document.getElementById('galleryPasteZone');
    const galleryFileInput = document.getElementById('galleryFileInput');

    // 1) 포커스 타깃 제어 (클릭 시 하이라이트 지정, 단 불필요하게 파일창을 강제로 띄우지 않음)
    if (mapZone) {
      mapZone.addEventListener('click', (e) => {
        this.setActivePasteTarget('map');
      });
      mapZone.addEventListener('focus', () => { this.setActivePasteTarget('map'); });
    }

    if (galleryZone) {
      galleryZone.addEventListener('click', () => { this.setActivePasteTarget('gallery'); });
      galleryZone.addEventListener('focus', () => { this.setActivePasteTarget('gallery'); });
    }

    // 2) 주변 현황 지도 파일 선택
    if (mapFileInput) {
      mapFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            this.setMapImage(event.target.result);
            this.showToast('주변 현황 이미지가 성공적으로 등록되었습니다.');
          };
          reader.readAsDataURL(file);
          mapFileInput.value = '';
        }
      });
    }

    // 3) 매물 소개 이미지 (1~3장) 파일 선택
    if (galleryFileInput) {
      galleryFileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
          const remainingSlots = 3 - this.currentGalleryImages.length;
          const toProcess = files.slice(0, remainingSlots);

          if (files.length > remainingSlots) {
            this.showToast(`최대 3장까지 등록 가능하여 ${remainingSlots}장만 추가되었습니다.`, 'error');
          }

          toProcess.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
              this.addGalleryImage(event.target.result);
            };
            reader.readAsDataURL(file);
          });
          galleryFileInput.value = '';
        }
      });
    }

    // 4) 지도 이미지 삭제 버튼
    if (removeMapBtn) {
      removeMapBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.removeMapImage();
        this.showToast('주변 현황 이미지가 삭제되었습니다.');
      });
    }

    // 5) 전역 클립보드 붙여넣기 (Ctrl+V) 리스너
    window.addEventListener('paste', (e) => {
      const modal = document.getElementById('propertyFormModal');
      // 매물 등록/수정 모달이 열려 있을 때 동작
      if (modal && !modal.classList.contains('modal-hidden')) {
        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        for (let item of items) {
          if (item.type.indexOf('image') !== -1) {
            const file = item.getAsFile();
            const reader = new FileReader();
            reader.onload = (event) => {
              const dataUrl = event.target.result;
              if (this.activePasteTarget === 'map') {
                this.setMapImage(dataUrl);
                this.showToast('📋 클립보드 이미지가 주변 현황 지도에 등록되었습니다!');
              } else {
                this.addGalleryImage(dataUrl);
              }
            };
            reader.readAsDataURL(file);
            e.preventDefault();
            break;
          }
        }
      }
    });

    // 초기 갤러리 슬롯 렌더링
    this.renderGallerySlots();
  },

  // 갤러리 파일 업로드 창 열기
  triggerGalleryUpload() {
    this.activePasteTarget = 'gallery';
    document.getElementById('galleryFileInput')?.click();
  },

  // 고화질 이미지 경량 압축 (Vercel 및 브라우저 로컬 저장소 최적화)
  compressImage(dataUrl, maxWidth = 1000, maxHeight = 800, quality = 0.75) {
    return new Promise((resolve) => {
      if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image')) {
        resolve(dataUrl);
        return;
      }
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  },

  // 매물 소개 이미지 1장 추가 (최대 3장, 자동 압축 최적화)
  async addGalleryImage(dataUrl) {
    if (this.currentGalleryImages.length >= 3) {
      this.showToast('매물 소개 이미지는 최대 3장까지 등록할 수 있습니다. 변경하려면 기존 사진을 삭제해 주세요.', 'error');
      return;
    }
    const optimized = await this.compressImage(dataUrl);
    this.currentGalleryImages.push(optimized);
    this.renderGallerySlots();
    this.showToast(`📋 매물 소개 사진이 등록되었습니다! (${this.currentGalleryImages.length}/3장, 1번이 대표 이미지)`);
  },

  // 매물 소개 이미지 1장 삭제
  removeGalleryImage(index) {
    this.currentGalleryImages.splice(index, 1);
    this.renderGallerySlots();
    this.showToast('매물 소개 이미지가 삭제되었습니다.');
  },

  // 매물 소개 1~3장 슬롯 렌더링
  renderGallerySlots() {
    const grid = document.getElementById('galleryGrid');
    const badge = document.getElementById('galleryCountBadge');
    const urlInput = document.getElementById('propImageUrl');
    const jsonInput = document.getElementById('propImagesJson');

    const count = this.currentGalleryImages.length;
    if (badge) {
      badge.textContent = `${count} / 3장 등록됨`;
      badge.className = count > 0 
        ? 'text-[11px] text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-700'
        : 'text-[11px] text-gray-400 font-bold bg-zinc-800 px-2.5 py-0.5 rounded-full border border-gray-700';
    }

    // 숨김 인풋 동기화 (1번 이미지가 대표 이미지)
    if (urlInput) urlInput.value = this.currentGalleryImages[0] || '';
    if (jsonInput) jsonInput.value = JSON.stringify(this.currentGalleryImages);

    if (!grid) return;

    let html = '';

    // 1) 등록된 이미지 카드들
    this.currentGalleryImages.forEach((img, idx) => {
      html += `
        <div class="relative aspect-video rounded-xl overflow-hidden border ${idx === 0 ? 'border-gold shadow-[0_0_12px_rgba(212,175,55,0.3)]' : 'border-gray-700'} bg-black group">
          <img src="${img}" alt="매물 소개 이미지 ${idx + 1}" class="w-full h-full object-cover">
          <span class="absolute top-2 left-2 ${idx === 0 ? 'bg-gold text-black font-extrabold' : 'bg-black/85 text-gray-200 font-medium'} text-[10px] px-2 py-0.5 rounded-full border border-gold/40 shadow backdrop-blur-sm">
            ${idx === 0 ? '★ 1번 (메인 대표)' : `${idx + 1}번 소개 사진`}
          </span>
          <button type="button" onclick="UI.removeGalleryImage(${idx})" class="absolute top-2 right-2 bg-black/80 hover:bg-red-700 text-white rounded-full p-1.5 transition-colors shadow" title="사진 삭제">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      `;
    });

    // 2) 3장 미만일 때 추가 슬롯 버튼 노출
    if (count < 3) {
      html += `
        <div onclick="UI.triggerGalleryUpload()" class="aspect-video rounded-xl border-2 border-dashed border-gray-600 hover:border-gold hover:bg-gold/5 flex flex-col items-center justify-center cursor-pointer p-3 text-center transition-all group">
          <div class="w-9 h-9 rounded-full bg-gold/15 text-gold flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          </div>
          <span class="text-xs font-bold text-gray-200 group-hover:text-gold transition-colors">${count + 1}번 사진 추가</span>
          <span class="text-[10px] text-gray-400 mt-0.5">클릭 또는 <strong>Ctrl + V</strong></span>
        </div>
      `;
    }

    grid.innerHTML = html;
  },

  // 아파트 단지명 및 평면타입(Type) 지능형 자동 인식 헬퍼
  detectApartmentAndType(title = '', floorType = '') {
    // 1. 아파트명 자동 인식 (띄어쓰기 무관하게 '수목토' 포함 여부 검증)
    const cleanTitle = (title || '').replace(/\s+/g, '');
    const isSuMokTo = cleanTitle.includes('수목토');

    // 2. 타입명 자동 인식 (floorType 입력값 및 title 매물명 양쪽 모두 정밀 분석)
    let detectedType = '';
    const fUpper = (floorType || '').trim().toUpperCase();
    const tCombined = `${floorType} ${title}`.toUpperCase();

    // floorType 인풋 우선 검사 (A, B, C, D 대소문자/형식 무관)
    if (fUpper) {
      if (fUpper.includes('C')) detectedType = 'C';
      else if (fUpper.includes('B')) detectedType = 'B';
      else if (fUpper.includes('D')) detectedType = 'D';
      else if (fUpper.includes('A')) detectedType = 'A';
    }

    // floorType에 기재되지 않은 경우, 매물명(title)에서 타입 자동 추출
    if (!detectedType && title) {
      if (/(?:84[\s\-_]*C|[C][\s\-_]*(?:타입|형|TYPE)|\b[C]\b)/i.test(tCombined)) {
        detectedType = 'C';
      } else if (/(?:84[\s\-_]*B|[B][\s\-_]*(?:타입|형|TYPE)|\b[B]\b)/i.test(tCombined)) {
        detectedType = 'B';
      } else if (/(?:84[\s\-_]*D|[D][\s\-_]*(?:타입|형|TYPE)|\b[D]\b)/i.test(tCombined)) {
        detectedType = 'D';
      } else if (/(?:84[\s\-_]*A|[A][\s\-_]*(?:타입|형|TYPE)|\b[A]\b)/i.test(tCombined)) {
        detectedType = 'A';
      }
    }

    return {
      isSuMokTo,
      detectedType, // 'A', 'B', 'C', 'D'
      standardType: detectedType ? `${detectedType}-Type` : ''
    };
  },

  // 평면타입에 맞는 공식 평면도 이미지 경로 반환 (도안수목토 아파트 전용)
  getFloorPlanImage(floorType = '', title = '') {
    const { isSuMokTo, detectedType } = this.detectApartmentAndType(title, floorType);
    if (!isSuMokTo || !detectedType) {
      return '';
    }

    if (detectedType === 'A') {
      return 'images/A-Type-Plan03.png';
    }
    if (detectedType === 'B' || detectedType === 'D') {
      return 'images/B-Type-Plan03.png';
    }
    if (detectedType === 'C') {
      return 'images/C-Type-Plan03.png';
    }
    return '';
  },

  // 평면안내 이동 대상 URL 반환 (수목토 아파트인 경우 해당 타입 탭 직행, 아이파크는 floor_ipark.html)
  getFloorGuideUrl(title = '', floorType = '') {
    const { isSuMokTo, detectedType } = this.detectApartmentAndType(title, floorType);
    if (isSuMokTo) {
      const t = detectedType || 'A';
      return `floor.html?type=${t}`;
    }
    const clean = (title || '').replace(/\s+/g, '');
    if (clean.includes('아이파크')) {
      return 'floor_ipark.html';
    }
    return 'floor.html';
  },

  // 평면안내 해당 타입으로 새 탭 이동
  goToFloorGuide(title = '', floorType = '') {
    const url = this.getFloorGuideUrl(title, floorType);
    window.open(url, '_blank');
  },

  // 매물 등록&수정 폼에서 입력된 값 기반으로 평면안내 이동
  goToFloorGuideFromForm() {
    const title = document.getElementById('propTitle') ? document.getElementById('propTitle').value : '';
    const floorType = document.getElementById('propFloorType') ? document.getElementById('propFloorType').value : '';
    const { isSuMokTo, detectedType } = this.detectApartmentAndType(title, floorType);

    if (isSuMokTo) {
      const t = detectedType || 'A';
      window.open(`floor.html?type=${t}`, '_blank');
      return;
    }

    const clean = (title || '').replace(/\s+/g, '');
    if (clean.includes('아이파크')) {
      window.open('floor_ipark.html', '_blank');
      return;
    }

    window.open('floor.html', '_blank');
  },

  // 평면타입 입력 시 평면도 자동 매칭 및 미리보기 업데이트 (없으면 흰색 배경만 표시)
  updateAutoFloorPlanPreview() {
    const floorTypeInput = document.getElementById('propFloorType');
    let floorType = floorTypeInput ? floorTypeInput.value.trim() : '';
    const titleInput = document.getElementById('propTitle');
    const title = titleInput ? titleInput.value.trim() : '';
    
    const { isSuMokTo, detectedType, standardType } = this.detectApartmentAndType(title, floorType);

    // 만약 평면타입 칸이 비어있고 매물명에 타입이 적혀있다면 평면타입 칸에 자동으로 채워줌
    if (!floorType && detectedType && floorTypeInput) {
      floorTypeInput.value = standardType;
      floorType = standardType;
    }

    const planImg = this.getFloorPlanImage(floorType, title);
    
    const previewImg = document.getElementById('autoFloorPlanPreview');
    const emptyBox = document.getElementById('autoFloorPlanEmpty');
    const hiddenInput = document.getElementById('propMapImageUrl');
    const badge = document.getElementById('autoFloorPlanBadge');
    const linkBtn = document.getElementById('autoFloorPlanLinkBtn');
    const hoverGuide = document.getElementById('autoFloorPlanHoverGuide');
    const autoBox = document.getElementById('autoFloorPlanBox');
    
    if (planImg) {
      if (previewImg) {
        previewImg.src = planImg;
        previewImg.classList.remove('hidden');
        previewImg.style.display = 'block';
      }
      if (emptyBox) {
        emptyBox.classList.add('hidden');
      }
      if (linkBtn) {
        linkBtn.classList.remove('hidden');
      }
      if (hoverGuide) {
        hoverGuide.classList.remove('hidden');
      }
      if (autoBox) {
        autoBox.classList.add('cursor-pointer');
        autoBox.title = '클릭 시 평면안내 해당 타입으로 이동합니다';
      }
      if (hiddenInput) hiddenInput.value = planImg;
      if (badge) {
        let label = 'A-Type (84.99㎡)';
        if (detectedType === 'B') label = 'B-Type (84.98㎡)';
        else if (detectedType === 'C') label = 'C-Type (84.93㎡)';
        else if (detectedType === 'D') label = 'D-Type (84.98㎡ B호환)';
        badge.className = 'text-[11px] text-emerald-400 bg-emerald-950/80 border border-emerald-700 px-2.5 py-0.5 rounded-full font-bold';
        badge.textContent = `✓ 도안수목토 ${label} 자동 인식 매칭됨`;
      }
    } else {
      // 평면도가 없는 경우: 이미지 숨김, 흰색 배경만 노출
      if (previewImg) {
        previewImg.src = '';
        previewImg.classList.add('hidden');
        previewImg.style.display = 'none';
      }
      if (emptyBox) {
        emptyBox.classList.remove('hidden');
      }
      if (linkBtn) {
        linkBtn.classList.add('hidden');
      }
      if (hoverGuide) {
        hoverGuide.classList.add('hidden');
      }
      if (autoBox) {
        autoBox.classList.remove('cursor-pointer');
        autoBox.title = '';
      }
      if (hiddenInput) hiddenInput.value = '';
      if (badge) {
        badge.className = 'text-[11px] text-gray-400 bg-zinc-800 border border-gray-700 px-2.5 py-0.5 rounded-full font-bold';
        if (title && !isSuMokTo) {
          badge.textContent = '해당 단지 평면도 없음 (흰색 배경)';
        } else if (!detectedType) {
          badge.textContent = '평면타입(A,B,C) 입력 시 자동 매칭';
        } else {
          badge.textContent = '등록된 평면도 없음 (흰색 배경)';
        }
      }
    }
  },

  // 구버전 setMapImage / removeMapImage 호환 유지
  async setMapImage(dataUrl) {
    this.updateAutoFloorPlanPreview();
  },

  removeMapImage() {
    this.updateAutoFloorPlanPreview();
  },

  // 일반 모드로 전환 (관계자 모드 종료 / 로그아웃)
  switchToNormalMode() {
    AuthManager.logout();
    const adminBadge = document.getElementById('adminIndicatorBadge');
    if (adminBadge) {
      adminBadge.classList.remove('flex', 'md:flex');
      adminBadge.classList.add('hidden');
      adminBadge.style.display = 'none';
      adminBadge.innerHTML = '';
    }
    this.closeModal('adminDashboardModal');
    this.closeModal('loginModal');
    this.updateAdminUI();
    this.renderProperties();
    this.renderFeaturedProperties();
    this.showToast('일반 모드로 전환되었습니다.');
  },

  // 관계자 통합 대시보드 모달 열기
  openAdminDashboard() {
    this.openModal('adminDashboardModal');
    this.renderAdminAccounts();
    this.renderAdminLeads();
  },

  // 관계자 모드 UI 상태 동기화
  updateAdminUI() {
    const isLoggedIn = AuthManager.isLoggedIn();
    const currentUser = AuthManager.getCurrentUser();
    const brandLogoBtn = document.getElementById('brandLogoBtn');
    const brandRoleBadge = document.getElementById('brandRoleBadge');
    const adminBadge = document.getElementById('adminIndicatorBadge');
    const adminControls = document.querySelectorAll('.admin-only');
    const mobileAuthText = document.getElementById('mobileAuthText');
    const footerAuthBtn = document.getElementById('footerAuthBtn');

    if (isLoggedIn && currentUser) {
      if (brandLogoBtn) {
        brandLogoBtn.title = '클릭 시 일반 모드로 전환됩니다';
      }
      if (brandRoleBadge) {
        brandRoleBadge.title = '클릭 시 일반 모드로 전환됩니다';
      }
      if (adminBadge) {
        adminBadge.classList.remove('hidden', 'md:hidden');
        adminBadge.classList.add('flex');
        adminBadge.style.display = 'inline-flex';
        adminBadge.title = '클릭 시 일반 모드로 전환됩니다';
        adminBadge.innerHTML = `
          <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
          <span>관계자 모드 (${currentUser.name})</span>
          <span class="ml-1 text-[10px] text-gray-400 hover:text-white" title="일반 모드로 전환">✕</span>
        `;
      }
      if (mobileAuthText) {
        mobileAuthText.textContent = `일반 모드로 전환 (${currentUser.name})`;
      }
      if (footerAuthBtn) {
        footerAuthBtn.textContent = '일반 모드로 전환 (로그아웃)';
      }
      adminControls.forEach(el => el.classList.remove('hidden'));
      if (typeof updateSubscriptionAdminUI === 'function') updateSubscriptionAdminUI();
    } else {
      if (brandLogoBtn) {
        brandLogoBtn.title = '클릭하여 관계자 모드(ID/PW) 열기';
      }
      if (brandRoleBadge) {
        brandRoleBadge.title = '클릭하여 관계자 모드(ID/PW) 열기';
      }
      if (adminBadge) {
        adminBadge.classList.remove('flex', 'md:flex');
        adminBadge.classList.add('hidden');
        adminBadge.style.display = 'none';
        adminBadge.innerHTML = '';
      }
      if (mobileAuthText) {
        mobileAuthText.textContent = '관계자 모드 (관리자 로그인)';
      }
      if (footerAuthBtn) {
        footerAuthBtn.textContent = '관계자 관리자 로그인';
      }
      adminControls.forEach(el => el.classList.add('hidden'));
      if (typeof updateSubscriptionAdminUI === 'function') updateSubscriptionAdminUI();
    }

    // 카카오 키 인풋 불러오기
    const kakaoInput = document.getElementById('kakaoAppKeyInput');
    if (kakaoInput) {
      kakaoInput.value = CustomerManager.getKakaoKey();
    }

    // GitHub 토큰 인풋 불러오기
    const githubTokenInput = document.getElementById('githubTokenInput');
    if (githubTokenInput) {
      githubTokenInput.value = GitHubSyncManager.getToken();
    }
  },

  // '매물검색(주거/상가)' 매물 렌더링
  renderProperties() {
    const container = document.getElementById('propertiesGrid');
    const countBadge = document.getElementById('propertyCountBadge');
    if (!container) return;

    let list = PropertyManager.getAll();

    // 카테고리 필터
    if (this.filters.category !== 'ALL') {
      list = list.filter(p => p.type === this.filters.category);
    }

    // 거래 형태 필터
    if (this.filters.dealType !== 'ALL') {
      list = list.filter(p => p.dealType === this.filters.dealType);
    }

    // 키워드 검색
    if (this.filters.keyword) {
      const q = this.filters.keyword;
      list = list.filter(p => 
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.location && p.location.toLowerCase().includes(q)) ||
        (p.tags && p.tags.toLowerCase().includes(q)) ||
        (p.subType && p.subType.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    if (countBadge) {
      countBadge.textContent = `${list.length}건`;
    }

    if (list.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-16 text-center bg-dark-card border border-dark-border rounded-2xl">
          <svg class="w-16 h-16 mx-auto text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
          <p class="text-gray-300 text-lg font-medium">조건에 일치하는 매물이 없습니다.</p>
          <p class="text-gray-500 text-sm mt-1">검색어나 필터 조건을 변경하여 다시 확인해보세요.</p>
        </div>
      `;
      return;
    }

    const isLoggedIn = AuthManager.isLoggedIn();

    container.innerHTML = list.map(item => this.createPropertyCardHTML(item, isLoggedIn)).join('');
  },

  // '추천 매물' 렌더링
  renderFeaturedProperties() {
    const container = document.getElementById('featuredGrid');
    if (!container) return;

    const list = PropertyManager.getAll().filter(p => p.featured === 'Y');
    const isLoggedIn = AuthManager.isLoggedIn();

    if (list.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-12 text-center text-gray-400">
          현재 등록된 추천 매물이 없습니다.
        </div>
      `;
      return;
    }

    container.innerHTML = list.map(item => this.createFeaturedCardHTML(item, isLoggedIn)).join('');
  },

  // '추천 매물' 전용 깔끔한 콤팩트 카드 HTML 생성 ('매물 상세 설명', '문의 연락처/번호', '배치도/상세', '문의하기' 제외)
  createFeaturedCardHTML(p, isLoggedIn) {
    const dealBadgeColor = p.dealType === '매매' ? 'bg-gold/90 text-black border-gold' : 
                          p.dealType === '전세' ? 'bg-blue-600/90 text-white border-blue-400' : 
                          'bg-emerald-600/90 text-white border-emerald-400';

    const tagsArray = this.parseTags(p.tags);
    const tagsHTML = tagsArray.map(tag => `<span class="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded">${tag}</span>`).join(' ');

    const adminButtons = isLoggedIn ? `
      <div class="border-t border-dark-border pt-3 mt-3 flex justify-end gap-2" onclick="event.stopPropagation()">
        <button onclick="UI.openEditPropertyModal('${p.id}')" class="px-3 py-1 bg-gray-800 hover:bg-gold hover:text-black text-gray-200 text-xs rounded transition-colors duration-200 flex items-center gap-1">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
          수정
        </button>
        <button onclick="UI.deleteProperty('${p.id}')" class="px-3 py-1 bg-red-950 hover:bg-red-700 text-red-300 hover:text-white text-xs rounded transition-colors duration-200 flex items-center gap-1">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          삭제
        </button>
      </div>
    ` : '';

    const mainThumb = (p.images && p.images.length > 0) ? p.images[0] : (p.imageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80');
    const imageCount = (p.images && p.images.length > 0) ? p.images.length : (p.imageUrl ? 1 : 0);

    return `
      <div class="property-card bg-dark-card rounded-2xl overflow-hidden border border-dark-border hover:border-gold/60 transition-all duration-300 group flex flex-col justify-between cursor-pointer shadow-lg hover:shadow-2xl" onclick="UI.showPropertyDetail('${p.id}')">
        <div>
          <div class="relative aspect-16-9 w-full overflow-hidden">
            <img src="${mainThumb}" 
                 onerror="this.src='https://placehold.co/800x600/222222/D4AF37?text=Real+Estate'"
                 alt="${p.title}" 
                 class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500">
            <div class="absolute top-4 left-4 flex gap-2">
              <span class="${dealBadgeColor} text-xs font-bold px-3 py-1 rounded-full border shadow-md">
                ${p.dealType}
              </span>
              <span class="bg-black/75 text-gray-200 text-xs px-2.5 py-1 rounded-full border border-gray-700">
                ${p.type} · ${p.subType}
              </span>
            </div>
            <div class="absolute top-4 right-4 flex gap-1.5 items-center">
              ${p.mapImageUrl ? `
                <div class="bg-black/85 text-emerald-400 border border-emerald-500/50 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow backdrop-blur-sm" title="세대 평면도 첨부됨">
                  📐 평면도
                </div>
              ` : ''}
              <div class="bg-gold/90 text-black text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                ★ 추천
              </div>
            </div>
            ${imageCount > 1 ? `
              <div class="absolute bottom-3 right-3 bg-black/85 text-gray-200 text-[10px] font-bold px-2 py-0.5 rounded-md border border-gray-700 flex items-center gap-1 backdrop-blur-sm">
                <svg class="w-3 h-3 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                ${imageCount}장
              </div>
            ` : ''}
          </div>
          
          <div class="p-5 sm:p-6">
            <div class="flex justify-between items-start mb-1.5">
              <h4 class="text-xl font-bold text-white group-hover:text-gold transition-colors">
                ${p.title}
              </h4>
            </div>
            <p class="text-gray-400 text-sm mb-3 flex items-center gap-1">
              <svg class="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              ${p.location}
            </p>
            <div class="mb-3.5">
              <span class="text-2xl font-bold text-gradient-gold">${p.price}</span>
            </div>
            
            <div class="flex items-center gap-3 sm:gap-4 text-sm text-gray-300 py-2.5 border-y border-dark-border mb-3 flex-wrap">
              ${p.floorType ? `
                <span class="flex items-center gap-1 font-semibold text-white">
                  <svg class="w-4 h-4 text-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                  ${p.floorType}
                </span>
              ` : ''}
              <span class="flex items-center gap-1">
                <svg class="w-4 h-4 text-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
                ${p.area}
              </span>
              <span class="flex items-center gap-1">
                <svg class="w-4 h-4 text-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                ${p.floor}
              </span>
            </div>

            ${tagsArray.length > 0 ? `
              <div class="flex gap-1.5 flex-wrap">
                ${tagsHTML}
              </div>
            ` : ''}

            ${adminButtons}
          </div>
        </div>
      </div>
    `;
  },

  // 태그 문자열 파싱 헬퍼 (공백, 쉼표, 슬래시, # 등 모든 형식 지원 및 입력 글씨 100% 노출)
  parseTags(tagsStr) {
    if (!tagsStr) return [];
    const normalized = String(tagsStr).replace(/#/g, ' #');
    const rawTokens = normalized.split(/[,\/\s\n]+/).map(t => t.trim()).filter(t => t.length > 0 && t !== '#');
    return rawTokens.map(t => t.startsWith('#') ? t : `#${t}`);
  },

  // 매물 카드 컴포넌트 HTML 생성
  createPropertyCardHTML(p, isLoggedIn) {
    const dealBadgeColor = p.dealType === '매매' ? 'bg-gold/90 text-black border-gold' : 
                          p.dealType === '전세' ? 'bg-blue-600/90 text-white border-blue-400' : 
                          'bg-emerald-600/90 text-white border-emerald-400';

    const tagsArray = this.parseTags(p.tags);
    const tagsHTML = tagsArray.map(tag => `<span class="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded">${tag}</span>`).join(' ');

    const adminButtons = isLoggedIn ? `
      <div class="border-t border-dark-border pt-3 mt-3 flex justify-end gap-2">
        <button onclick="UI.openEditPropertyModal('${p.id}')" class="px-3 py-1 bg-gray-800 hover:bg-gold hover:text-black text-gray-200 text-xs rounded transition-colors duration-200 flex items-center gap-1">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
          수정
        </button>
        <button onclick="UI.deleteProperty('${p.id}')" class="px-3 py-1 bg-red-950 hover:bg-red-700 text-red-300 hover:text-white text-xs rounded transition-colors duration-200 flex items-center gap-1">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          삭제
        </button>
      </div>
    ` : '';

    const mainThumb = (p.images && p.images.length > 0) ? p.images[0] : (p.imageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80');
    const imageCount = (p.images && p.images.length > 0) ? p.images.length : (p.imageUrl ? 1 : 0);

    return `
      <div class="property-card bg-dark-card rounded-2xl overflow-hidden border border-dark-border group flex flex-col justify-between">
        <div>
          <div class="relative aspect-16-9 w-full overflow-hidden cursor-pointer" onclick="UI.showPropertyDetail('${p.id}')">
            <img src="${mainThumb}" 
                 onerror="this.src='https://placehold.co/800x600/222222/D4AF37?text=Real+Estate'"
                 alt="${p.title}" 
                 class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500">
            <div class="absolute top-4 left-4 flex gap-2">
              <span class="${dealBadgeColor} text-xs font-bold px-3 py-1 rounded-full border shadow-md">
                ${p.dealType}
              </span>
              <span class="bg-black/75 text-gray-200 text-xs px-2.5 py-1 rounded-full border border-gray-700">
                ${p.type} · ${p.subType}
              </span>
            </div>
            <div class="absolute top-4 right-4 flex gap-1.5 items-center">
              ${p.mapImageUrl ? `
                <div class="bg-black/85 text-emerald-400 border border-emerald-500/50 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow backdrop-blur-sm" title="세대 평면도 첨부됨">
                  📐 평면도
                </div>
              ` : ''}
              ${p.featured === 'Y' ? `
                <div class="bg-gold/90 text-black text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                  ★ 추천
                </div>
              ` : ''}
            </div>
            ${imageCount > 1 ? `
              <div class="absolute bottom-3 right-3 bg-black/85 text-gray-200 text-[10px] font-bold px-2 py-0.5 rounded-md border border-gray-700 flex items-center gap-1 backdrop-blur-sm">
                <svg class="w-3 h-3 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                ${imageCount}장
              </div>
            ` : ''}
          </div>
          
          <div class="p-6">
            <div class="flex justify-between items-start mb-2">
              <h4 class="text-xl font-bold text-white group-hover:text-gold transition-colors cursor-pointer" onclick="UI.showPropertyDetail('${p.id}')">
                ${p.title}
              </h4>
            </div>
            <p class="text-gray-400 text-sm mb-3 flex items-center gap-1">
              <svg class="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              ${p.location}
            </p>
            <div class="mb-4">
              <span class="text-2xl font-bold text-gradient-gold">${p.price}</span>
            </div>
            
            <div class="flex items-center gap-3 sm:gap-4 text-sm text-gray-300 py-3 border-y border-dark-border mb-3 flex-wrap">
              ${p.floorType ? `
                <span class="flex items-center gap-1 font-semibold text-white">
                  <svg class="w-4 h-4 text-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                  ${p.floorType}
                </span>
              ` : ''}
              <span class="flex items-center gap-1">
                <svg class="w-4 h-4 text-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
                ${p.area}
              </span>
              <span class="flex items-center gap-1">
                <svg class="w-4 h-4 text-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                ${p.floor}
              </span>
            </div>

            <div class="flex gap-1.5 flex-wrap mb-3">
              ${tagsHTML}
            </div>

            <!-- 매물 상세 설명 -->
            ${p.description ? `
              <div class="bg-zinc-900/90 border border-dark-border rounded-xl p-3 text-xs text-gray-300 leading-relaxed cursor-pointer hover:border-gold/50 transition-colors mb-3" onclick="UI.showPropertyDetail('${p.id}')">
                <div class="flex items-center gap-1.5 text-gold font-bold text-[11px] mb-1">
                  <svg class="w-3.5 h-3.5 text-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span>매물 상세 설명</span>
                </div>
                <p class="whitespace-pre-line text-gray-200 text-xs leading-normal break-keep">${p.description.trim()}</p>
              </div>
            ` : ''}

            <!-- 문의 연락처 -->
            <div class="pt-2.5 border-t border-dark-border flex items-center justify-between text-xs">
              <span class="text-gray-400 flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                문의 연락처
              </span>
              <a href="tel:${p.contact || '042-546-4900'}" class="text-gold font-bold hover:underline tracking-wide flex items-center gap-1" onclick="event.stopPropagation()">
                <span>${p.contact || '042-546-4900'}</span>
              </a>
            </div>
          </div>
        </div>

        <div class="px-6 pb-6 pt-0">
          <div class="flex gap-2">
            <button onclick="UI.showPropertyDetail('${p.id}')" class="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-gray-200 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5" title="매물 상세 정보 및 평면도 보기">
              ${p.mapImageUrl ? `<svg class="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>` : ''}
              ${p.mapImageUrl ? '평면도 / 상세' : '상세보기'}
            </button>
            <button onclick="UI.openInquiryModal('${p.title}')" class="py-2.5 px-4 bg-gold hover:bg-gold-dark text-black text-sm font-bold rounded-lg transition-colors">
              문의하기
            </button>
          </div>
          ${adminButtons}
        </div>
      </div>
    `;
  },

  // 매물 상세 정보 모달
  showPropertyDetail(id) {
    const p = PropertyManager.getById(id);
    if (!p) return;

    const modalBody = document.getElementById('propertyDetailBody');
    if (!modalBody) return;

    const images = (Array.isArray(p.images) && p.images.length > 0) ? p.images : [p.imageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'];
    const initialMain = images[0];

    modalBody.innerHTML = `
      <div class="space-y-6">
        <div class="space-y-3">
          <div class="relative aspect-16-9 w-full rounded-2xl overflow-hidden border border-dark-border bg-black shadow-2xl">
            <img id="detailMainViewImg" src="${initialMain}" alt="${p.title}" class="w-full h-full object-cover transition-all duration-300">
            <div class="absolute top-4 left-4 flex gap-2">
              <span class="bg-gold text-black text-xs font-bold px-3 py-1 rounded-full shadow">${p.dealType}</span>
              <span class="bg-black/80 text-white text-xs px-3 py-1 rounded-full border border-gray-700">${p.type} / ${p.subType}</span>
            </div>
            ${images.length > 1 ? `
              <div id="detailImageIndexBadge" class="absolute bottom-3 right-3 bg-black/85 text-gold text-xs px-3 py-1 rounded-full border border-gold/40 shadow backdrop-blur-sm">
                1 / ${images.length}
              </div>
            ` : ''}
          </div>

          ${images.length > 1 ? `
            <div class="grid grid-cols-3 gap-2 sm:gap-3">
              ${images.map((img, idx) => `
                <div onclick="document.getElementById('detailMainViewImg').src='${img}'; const badge=document.getElementById('detailImageIndexBadge'); if(badge) badge.textContent='${idx + 1} / ${images.length}'; document.querySelectorAll('.detail-thumb-slot').forEach(el=>el.classList.remove('border-gold', 'ring-2', 'ring-gold')); this.classList.add('border-gold', 'ring-2', 'ring-gold');" 
                     class="detail-thumb-slot ${idx === 0 ? 'border-gold ring-2 ring-gold' : 'border-dark-border'} relative aspect-video rounded-xl overflow-hidden border cursor-pointer hover:border-gold transition-all bg-black group">
                  <img src="${img}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                  <span class="absolute bottom-1 left-1.5 bg-black/85 text-white text-[10px] px-2 py-0.5 rounded font-bold backdrop-blur-sm border border-gray-700">
                    ${idx === 0 ? '★ 대표' : `${idx + 1}번`}
                  </span>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <div class="flex flex-col md:flex-row md:justify-between md:items-end gap-2 border-b border-dark-border pb-4">
          <div>
            <h3 class="text-2xl md:text-3xl font-bold text-white">${p.title}</h3>
            <p class="text-gray-400 mt-1 flex items-center gap-1">
              <svg class="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
              ${p.location}
            </p>
          </div>
          <div class="text-left md:text-right">
            <span class="text-sm text-gray-400 block">희망 거래가</span>
            <span class="text-3xl font-extrabold text-gradient-gold">${p.price}</span>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 bg-zinc-900/80 p-3 sm:p-4 rounded-xl border border-dark-border">
          <div class="min-w-0">
            <span class="text-xs text-gray-400 block mb-0.5">평면타입</span>
            <span class="text-white font-bold whitespace-nowrap text-xs sm:text-[13px] md:text-sm block truncate" style="color: #ffffff !important;">${p.floorType || '-'}</span>
          </div>
          <div class="min-w-0">
            <span class="text-xs text-gray-400 block mb-0.5">면적</span>
            <span class="text-white font-bold whitespace-nowrap text-xs sm:text-[13px] md:text-sm block" style="white-space: nowrap !important; word-break: keep-all; color: #ffffff !important;">${p.area}</span>
          </div>
          <div class="min-w-0">
            <span class="text-xs text-gray-400 block mb-0.5">해당층 / 총층</span>
            <span class="text-white font-bold whitespace-nowrap text-xs sm:text-[13px] md:text-sm block truncate" style="color: #ffffff !important;">${p.floor}</span>
          </div>
          <div class="min-w-0">
            <span class="text-xs text-gray-400 block mb-0.5">매물 유형</span>
            <span class="text-white font-bold whitespace-nowrap text-xs sm:text-[13px] md:text-sm block truncate" style="color: #ffffff !important;">${p.type} (${p.subType})</span>
          </div>
          <div class="min-w-0">
            <span class="text-xs text-gray-400 block mb-0.5">담당 문의</span>
            <span class="text-gold font-bold whitespace-nowrap text-xs sm:text-[13px] md:text-sm block truncate">${p.contact || '042-546-4900'}</span>
          </div>
        </div>

        <div>
          <h4 class="text-lg font-bold text-white mb-2">매물 상세 설명</h4>
          <p class="text-gray-300 leading-relaxed bg-zinc-900/50 p-4 rounded-xl border border-dark-border whitespace-pre-line">${(p.description || '상세 설명이 등록되어 있지 않습니다.').trim()}</p>
        </div>

        ${p.mapImageUrl ? `
          <div class="mt-4 bg-zinc-900/90 border border-gold/40 p-4 rounded-2xl shadow-xl">
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-sm font-bold text-gold flex items-center gap-1.5">
                <svg class="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                ${p.floorType ? `${p.floorType} 공식 세대 평면도` : '평면안내 공식 세대 평면도'}
              </h4>
              <div>
                <a href="${this.getFloorGuideUrl(p.title, p.floorType)}" target="_blank" class="text-[11px] text-yellow-400 hover:text-black hover:bg-yellow-400 bg-zinc-800 px-2.5 py-1 rounded-lg border border-yellow-500/50 transition-colors flex items-center gap-1 font-bold cursor-pointer shadow-sm">
                  <span>평면안내 바로가기 ↗</span>
                </a>
              </div>
            </div>
            <div class="relative rounded-xl overflow-hidden border border-gray-700 bg-white p-4 group cursor-pointer" onclick="UI.goToFloorGuide('${(p.title || '').replace(/'/g, "\\'")}', '${(p.floorType || '').replace(/'/g, "\\'")}')" title="클릭 시 평면안내 해당 타입으로 이동합니다">
              <img src="${p.mapImageUrl}" alt="세대 평면도" class="w-full max-h-[462px] object-contain mx-auto group-hover:scale-105 transition-transform duration-300 drop-shadow">
              <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span class="bg-black/90 text-gold text-xs px-4 py-2 rounded-full border border-gold/60 font-bold shadow-2xl flex items-center gap-1.5 transform group-hover:scale-105 transition-transform">
                  <svg class="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                  평면안내 해당 타입으로 이동 (클릭)
                </span>
              </div>
            </div>
          </div>
        ` : ''}

        <div class="flex flex-wrap gap-2 pt-2">
          ${this.parseTags(p.tags).map(t => `<span class="bg-gray-800 text-gold text-xs px-3 py-1 rounded-full border border-gold/30">${t}</span>`).join('')}
        </div>

        <div class="border-t border-dark-border pt-6 flex flex-col sm:flex-row gap-4">
          <a href="tel:${p.contact || '042-546-4900'}" class="flex-1 bg-gold hover:bg-gold-dark text-black font-bold py-3 px-6 rounded-xl text-center transition-colors flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
            전화 상담 (${p.contact || '042-546-4900'})
          </a>
          <button onclick="UI.closeModal('propertyDetailModal'); UI.openInquiryModal('${p.title}');" class="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 px-6 rounded-xl transition-colors">
            온라인 상담 의뢰하기
          </button>
        </div>
      </div>
    `;

    this.openModal('propertyDetailModal');
  },

  // 매물 등록 모달 오픈
  openAddPropertyModal() {
    if (!AuthManager.isLoggedIn()) {
      this.showToast('관계자 모드로 로그인 후 이용 가능합니다.', 'error');
      this.openModal('loginModal');
      return;
    }
    const form = document.getElementById('propertyForm');
    form.reset();
    document.getElementById('propertyFormId').value = '';
    document.getElementById('propertyModalTitle').textContent = '신규 매물 등록 (관계자)';
    if (document.getElementById('propFloorType')) document.getElementById('propFloorType').value = '';
    
    // 매물 소개 이미지 초기화 및 세대 평면도 자동 매칭
    this.currentGalleryImages = [];
    this.renderGallerySlots();
    this.updateAutoFloorPlanPreview();
    this.setActivePasteTarget('gallery');
    document.getElementById('propAreaPyungPreview')?.classList.add('hidden');

    this.openModal('propertyFormModal');
  },

  // 매물 수정 모달 오픈
  openEditPropertyModal(id) {
    if (!AuthManager.isLoggedIn()) {
      this.showToast('관계자 모드로 로그인 후 이용 가능합니다.', 'error');
      return;
    }
    const p = PropertyManager.getById(id);
    if (!p) return;

    document.getElementById('propertyModalTitle').textContent = '매물 정보 수정';
    document.getElementById('propertyFormId').value = p.id;
    document.getElementById('propType').value = p.type;
    document.getElementById('propSubType').value = p.subType;
    document.getElementById('propDealType').value = p.dealType;
    document.getElementById('propTitle').value = p.title;
    document.getElementById('propLocation').value = p.location;
    document.getElementById('propPrice').value = p.price;
    document.getElementById('propPriceNumber').value = p.priceNumber || '';
    if (document.getElementById('propFloorType')) document.getElementById('propFloorType').value = p.floorType || '';
    document.getElementById('propArea').value = p.area;
    document.getElementById('propAreaPyungPreview')?.classList.add('hidden');
    document.getElementById('propFloor').value = p.floor;
    document.getElementById('propTags').value = p.tags;
    document.getElementById('propDescription').value = p.description;
    document.getElementById('propFeatured').checked = p.featured === 'Y';
    document.getElementById('propContact').value = p.contact || '042-546-4900';

    // 매물 소개 이미지 (1~3장) 동기화
    if (Array.isArray(p.images) && p.images.length > 0) {
      this.currentGalleryImages = [...p.images];
    } else if (p.imageUrl) {
      this.currentGalleryImages = [p.imageUrl];
    } else {
      this.currentGalleryImages = [];
    }
    this.renderGallerySlots();

    // 해당 평면타입에 맞는 공식 평면도 자동 매칭
    this.updateAutoFloorPlanPreview();
    this.setActivePasteTarget('gallery');

    this.openModal('propertyFormModal');
  },

  // 매물 폼 제출 (추가 또는 수정)
  handlePropertyFormSubmit() {
    const editId = document.getElementById('propertyFormId').value;
    const gallery = [...this.currentGalleryImages];
    const defaultImg = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
    const mainImageUrl = gallery[0] || defaultImg;

    // 면적 단위(㎡) 스마트 자동 보정
    let areaVal = document.getElementById('propArea').value.trim();
    if (areaVal) {
      if (!areaVal.includes('㎡')) {
        const matchNum = areaVal.match(/^(\d+(?:\.\d+)?)(.*)$/);
        if (matchNum) {
          const num = parseFloat(matchNum[1]);
          const rest = matchNum[2].trim();
          const pyung = (num * 0.3025).toFixed(0);
          if (rest) {
            areaVal = `${num}㎡ ${rest}`;
          } else {
            areaVal = `${num}㎡ (${pyung}평형)`;
          }
        } else {
          areaVal = `${areaVal}㎡`;
        }
      }
    }

    let floorTypeVal = document.getElementById('propFloorType') ? document.getElementById('propFloorType').value.trim() : '';
    const titleVal = document.getElementById('propTitle').value.trim();
    const { standardType } = this.detectApartmentAndType(titleVal, floorTypeVal);
    if (!floorTypeVal && standardType) {
      floorTypeVal = standardType;
    }
    const autoPlanImg = this.getFloorPlanImage(floorTypeVal, titleVal);

    const locVal = document.getElementById('propLocation').value.trim();
    const propertyData = {
      type: document.getElementById('propType').value,
      subType: document.getElementById('propSubType').value,
      dealType: document.getElementById('propDealType').value,
      title: titleVal,
      location: locVal,
      price: document.getElementById('propPrice').value.trim(),
      priceNumber: Number(document.getElementById('propPriceNumber').value) || 0,
      floorType: floorTypeVal,
      area: areaVal,
      floor: document.getElementById('propFloor').value.trim(),
      tags: this.parseTags(document.getElementById('propTags').value).join(' '),
      description: document.getElementById('propDescription').value.trim(),
      featured: document.getElementById('propFeatured').checked ? 'Y' : 'N',
      imageUrl: mainImageUrl, // 1~3장의 이미지 중 1번이 대표 이미지
      images: gallery.length > 0 ? gallery : [mainImageUrl],
      contact: document.getElementById('propContact').value.trim() || '042-546-4900',
      mapImageUrl: autoPlanImg || document.getElementById('propMapImageUrl').value.trim() || ''
    };

    // 저장 및 실시간 GitHub 동기화 실행 함수
    const finalizeSaveAndSync = (lat, lng) => {
      if (lat && lng) {
        propertyData.lat = lat;
        propertyData.lng = lng;
      }

      if (editId) {
        PropertyManager.update(editId, propertyData);
        this.showToast('매물 정보가 수정되었습니다.');
      } else {
        PropertyManager.add(propertyData);
        this.showToast('새 매물이 등록되었습니다.');
      }

      this.closeModal('propertyFormModal');
      this.renderProperties();
      this.renderFeaturedProperties();

      // GitHub 및 Vercel 실시간 동기화
      this.showToast('🚀 GitHub에 실시간 동기화 및 업로드 진행 중...', 'info');
      GitHubSyncManager.sync(PropertyManager.getAll()).then(success => {
        if (success) {
          this.showToast('✅ GitHub 저장소에 실시간 반영 완료! (Vercel 자동 배포 중)', 'success');
        } else {
          const token = GitHubSyncManager.getToken();
          if (!token) {
            this.showToast('💡 [관계자 모드] 대시보드에서 GitHub 토큰을 등록하시면 실시간 자동 푸시가 연동됩니다.', 'info');
          }
        }
      });
    };

    // 대한민국 전역 주소 카카오 Geocoder 실시간 지오코딩 (위도/경도 자동 생성)
    if (window.kakao && kakao.maps && kakao.maps.services && kakao.maps.services.Geocoder && locVal) {
      const geocoder = new kakao.maps.services.Geocoder();
      let cleanAddr = locVal.replace(/\(.*?\)/g, '').trim();
      const roadMatch = cleanAddr.match(/([가-힣\s]+[시|군|구]\s+[가-힣\s]+[읍|면|동|로|길]\s*[\d\-]+(?:\s*번지)?)/);
      const searchTargetAddr = roadMatch ? roadMatch[1] : cleanAddr;

      geocoder.addressSearch(searchTargetAddr, (result, status) => {
        if (status === kakao.maps.services.Status.OK && result.length > 0) {
          const lat = parseFloat(result[0].y);
          const lng = parseFloat(result[0].x);
          try {
            const cache = JSON.parse(localStorage.getItem('sumokto_geo_cache') || '{}');
            cache[locVal] = { lat, lng };
            cache[searchTargetAddr] = { lat, lng };
            localStorage.setItem('sumokto_geo_cache', JSON.stringify(cache));
          } catch (e) {}
          finalizeSaveAndSync(lat, lng);
        } else {
          // 정제 실패 시 원본 검색 및 읍/면/동 3차 검색 시도
          geocoder.addressSearch(cleanAddr, (res2, status2) => {
            if (status2 === kakao.maps.services.Status.OK && res2.length > 0) {
              const lat2 = parseFloat(res2[0].y);
              const lng2 = parseFloat(res2[0].x);
              try {
                const cache = JSON.parse(localStorage.getItem('sumokto_geo_cache') || '{}');
                cache[locVal] = { lat: lat2, lng: lng2 };
                cache[cleanAddr] = { lat: lat2, lng: lng2 };
                localStorage.setItem('sumokto_geo_cache', JSON.stringify(cache));
              } catch (e) {}
              finalizeSaveAndSync(lat2, lng2);
            } else {
              // 읍/면/동 단위 3차 검색
              const broadMatch = cleanAddr.match(/([가-힣]+[시|군|구]\s+[가-힣]+[읍|면|동])/);
              if (broadMatch) {
                geocoder.addressSearch(broadMatch[1], (res3, status3) => {
                  if (status3 === kakao.maps.services.Status.OK && res3.length > 0) {
                    const lat3 = parseFloat(res3[0].y);
                    const lng3 = parseFloat(res3[0].x);
                    try {
                      const cache = JSON.parse(localStorage.getItem('sumokto_geo_cache') || '{}');
                      cache[locVal] = { lat: lat3, lng: lng3 };
                      localStorage.setItem('sumokto_geo_cache', JSON.stringify(cache));
                    } catch (e) {}
                    finalizeSaveAndSync(lat3, lng3);
                  } else {
                    finalizeSaveAndSync(null, null);
                  }
                });
              } else {
                finalizeSaveAndSync(null, null);
              }
            }
          });
        }
      });
    } else {
      finalizeSaveAndSync(null, null);
    }
  },

  // 매물 삭제
  deleteProperty(id) {
    if (!AuthManager.isLoggedIn()) {
      this.showToast('관계자 모드로 로그인 후 이용 가능합니다.', 'error');
      return;
    }
    if (confirm('정말로 이 매물을 삭제하시겠습니까?')) {
      PropertyManager.delete(id);
      this.showToast('매물이 삭제되었습니다.');
      this.renderProperties();
      this.renderFeaturedProperties();
      this.updateAdminUI();

      // GitHub 및 Vercel 실시간 동기화
      GitHubSyncManager.sync(PropertyManager.getAll()).then(success => {
        if (success) {
          this.showToast('✅ 삭제 상태가 GitHub 저장소에 실시간 반영되었습니다.', 'success');
        }
      });
    }
  },

  // 특정 매물 대상 문의 폼 열기
  openInquiryModal(targetPropertyTitle) {
    const areaInput = document.getElementById('customerTarget');
    if (areaInput && targetPropertyTitle) {
      areaInput.value = `[매물문의] ${targetPropertyTitle}`;
    }
    document.getElementById('consulting').scrollIntoView({ behavior: 'smooth' });
    this.showToast(`'${targetPropertyTitle}' 문의 양식으로 이동합니다.`);
  },

  // 고객 상담 등록 처리
  handleCustomerFormSubmit() {
    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const category = document.getElementById('customerCategory').value;
    const targetArea = document.getElementById('customerTarget').value.trim();
    const budget = document.getElementById('customerBudget').value.trim();
    const message = document.getElementById('customerMessage').value.trim();

    const lead = CustomerManager.saveLead({
      name, phone, category, targetArea, budget, message
    });

    // 폼 초기화
    document.getElementById('customerRegisterForm').reset();

    const kakaoKey = CustomerManager.getKakaoKey();
    let alertMsg = `고객 등록이 완료되었습니다! 전문 공인중개사가 빠른 시일 내에 연락드리겠습니다.`;
    if (kakaoKey) {
      alertMsg += ` (카카오 알림 연동 완료)`;
    } else {
      alertMsg += ` (차후 카카오 API 연동 지원)`;
    }

    this.showToast(alertMsg);
  },

  // 관계자 모달: 계정 목록 렌더링
  renderAdminAccounts() {
    const container = document.getElementById('adminAccountList');
    if (!container) return;

    const users = AuthManager.getUsers();
    const currentUser = AuthManager.getCurrentUser();

    container.innerHTML = users.map(u => `
      <div class="flex items-center justify-between p-3 bg-zinc-900 border border-dark-border rounded-xl">
        <div>
          <span class="font-bold text-white">${u.name}</span>
          <span class="text-xs text-gold ml-2">(${u.role})</span>
          <p class="text-xs text-gray-400">ID: ${u.id} | PW: ••••</p>
        </div>
        <div class="flex gap-2">
          ${(currentUser && currentUser.id === u.id) ? `
            <span class="text-xs text-emerald-400 bg-emerald-950 px-2 py-1 rounded">접속 중</span>
          ` : `
            <button onclick="UI.deleteAdminUser('${u.id}')" class="text-xs text-red-400 hover:text-white bg-red-950/80 hover:bg-red-800 px-2.5 py-1 rounded transition-colors">
              삭제
            </button>
          `}
        </div>
      </div>
    `).join('');
  },

  deleteAdminUser(id) {
    if (confirm(`'${id}' 계정을 삭제하시겠습니까?`)) {
      const res = AuthManager.deleteUser(id);
      if (res.success) {
        this.showToast(res.message);
        this.renderAdminAccounts();
      } else {
        this.showToast(res.message, 'error');
      }
    }
  },

  // 관계자 모달: 고객 접수 목록 렌더링
  renderAdminLeads() {
    const container = document.getElementById('adminLeadList');
    if (!container) return;

    const leads = CustomerManager.getLeads();
    if (leads.length === 0) {
      container.innerHTML = `
        <div class="text-center py-8 text-gray-500 text-sm">
          아직 접수된 고객 상담/의뢰 내역이 없습니다.
        </div>
      `;
      return;
    }

    container.innerHTML = leads.map(l => `
      <div class="p-3 bg-zinc-900 border border-dark-border rounded-xl text-sm">
        <div class="flex justify-between items-center mb-1">
          <span class="font-bold text-white">${l.name} <span class="text-xs font-normal text-gray-400">(${l.phone})</span></span>
          <span class="text-xs bg-gold/20 text-gold px-2 py-0.5 rounded">${l.category}</span>
        </div>
        <p class="text-xs text-gray-300"><strong>관심:</strong> ${l.targetArea || '미기재'} | <strong>예산:</strong> ${l.budget || '미기재'}</p>
        ${l.message ? `<p class="text-xs text-gray-400 mt-1 bg-black/40 p-2 rounded">${l.message}</p>` : ''}
        <div class="text-right text-[10px] text-gray-500 mt-1">${l.createdAt}</div>
      </div>
    `).join('');
  },

  // 모달 제어 헬퍼
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('modal-hidden');
      document.body.classList.add('overflow-hidden');
    }
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('modal-hidden');
      document.body.classList.remove('overflow-hidden');
    }
  },

  // 특정 매물의 공식 세대 평면도 라이트박스 열기
  openLightboxForProperty(id) {
    const p = PropertyManager.getById(id) || (PropertyManager.getPropertyById ? PropertyManager.getPropertyById(id) : null);
    if (!p || !p.mapImageUrl) {
      UI.showToast('등록된 세대 평면도 이미지가 없습니다.', 'error');
      return;
    }
    UI.openLightbox(p.mapImageUrl, `${p.title} (${p.floorType || '세대'} 공식 평면도)`);
  },

  // 전체화면 고화질 라이트박스 뷰어 열기 (화면에 꽉 차게)
  openLightbox(imageUrl, title = '세대 평면도') {
    if (!imageUrl) return;
    const img = document.getElementById('lightboxImage');
    const titleEl = document.getElementById('lightboxTitle');
    const badgeEl = document.querySelector('#imageLightboxModal .bg-gold');
    const newWinBtn = document.getElementById('lightboxNewWindowBtn');

    if (badgeEl) badgeEl.textContent = '현황배치도';
    if (img) img.src = imageUrl;
    if (titleEl) {
      titleEl.textContent = title ? `${title} - 현황배치도 및 주변 위치도` : '현황배치도 및 주변 위치도';
    }
    if (newWinBtn) {
      newWinBtn.onclick = () => UI.openInNewWindow(imageUrl, title);
    }

    UI.openModal('imageLightboxModal');
  },

  // 단지안내 단지배치도 라이트박스 열기
  openComplexGuide() {
    const imageUrl = 'images/단지배치도.png';
    const fallbackUrl = 'images/site_plan.png';
    const title = '도안 수목토 아파트 단지배치도';

    const img = document.getElementById('lightboxImage');
    const titleEl = document.getElementById('lightboxTitle');
    const badgeEl = document.querySelector('#imageLightboxModal .bg-gold');
    const newWinBtn = document.getElementById('lightboxNewWindowBtn');

    if (img) {
      img.onerror = () => { img.src = fallbackUrl; };
      img.src = imageUrl;
    }
    if (badgeEl) badgeEl.textContent = '단지안내';
    if (titleEl) titleEl.textContent = title;
    if (newWinBtn) {
      newWinBtn.onclick = () => UI.openInNewWindow(imageUrl, title);
    }

    UI.openModal('imageLightboxModal');
  },

  // 새 창에서 꽉 찬 고화질로 열기 (브라우저 about:blank 차단 방지 및 제목 지정)
  openInNewWindow(imageUrl, title = '현황배치도') {
    if (!imageUrl) return;
    try {
      const newWin = window.open('', '_blank');
      if (!newWin) {
        this.showToast('브라우저 팝업 차단이 감지되어 전체화면 뷰어로 유지합니다.', 'error');
        return;
      }

      const pageTitle = title ? `${title} - 현황배치도 및 주변 위치도` : '현황배치도 및 주변 위치도';
      const htmlContent = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0d0d0d;
      color: #e5e7eb;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      font-family: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;
    }
    header {
      padding: 12px 20px;
      background: #18181b;
      border-bottom: 1px solid #27272a;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 50;
      box-shadow: 0 4px 12px rgba(0,0,0,0.5);
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 10px;
      overflow: hidden;
    }
    .badge {
      background: #D4AF37;
      color: #000;
      font-weight: 800;
      font-size: 11px;
      padding: 3px 8px;
      border-radius: 4px;
      white-space: nowrap;
    }
    h1 {
      font-size: 14px;
      color: #ffffff;
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .btn-close {
      background: #27272a;
      color: #ffffff;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      border: 1px solid #3f3f46;
      transition: background 0.2s;
      white-space: nowrap;
    }
    .btn-close:hover {
      background: #3f3f46;
      color: #D4AF37;
    }
    .img-wrapper {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      background: radial-gradient(circle at center, #18181b 0%, #0d0d0d 100%);
      overflow: auto;
    }
    img {
      max-width: 98%;
      max-height: 88vh;
      object-fit: contain;
      border-radius: 10px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.85);
      border: 1px solid #27272a;
      transition: transform 0.2s ease;
    }
    footer {
      padding: 8px 16px;
      text-align: center;
      font-size: 11px;
      color: #71717a;
      background: #121214;
      border-top: 1px solid #1f1f23;
    }
  </style>
</head>
<body>
  <header>
    <div class="header-left">
      <span class="badge">현황배치도</span>
      <h1>${pageTitle}</h1>
    </div>
    <button class="btn-close" onclick="window.close()">창 닫기 ✕</button>
  </header>
  <div class="img-wrapper">
    <img src="${imageUrl}" alt="${pageTitle}">
  </div>
  <footer>
    도안수목토 재벌 공인중개사사무소 (042-546-4900)
  </footer>
</body>
</html>`;

      newWin.document.open();
      newWin.document.write(htmlContent);
      newWin.document.close();
    } catch (e) {
      console.error('Failed to open new window:', e);
      this.openLightbox(imageUrl, title);
    }
  },

  // 토스트 알림창
  showToast(message, type = 'success') {
    const toast = document.createElement('div');
    const borderColor = type === 'error' ? 'border-red-500' : 'border-gold';
    const textColor = type === 'error' ? 'text-red-400' : 'text-gold';
    const icon = type === 'error' ? 
      `<svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>` : 
      `<svg class="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`;

    toast.className = `fixed bottom-6 left-6 z-[200] bg-dark-card border ${borderColor} text-white px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3 transition-all duration-300 transform translate-y-4 opacity-0`;
    toast.innerHTML = `
      ${icon}
      <div class="text-sm font-medium text-gray-200">${message}</div>
    `;

    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.remove('translate-y-4', 'opacity-0');
    }, 20);

    setTimeout(() => {
      toast.classList.add('translate-y-4', 'opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
};

// 애플리케이션 시작
document.addEventListener('DOMContentLoaded', () => {
  UI.init();
});

// 모든 리소스(이미지/폰트 등) 로드 완료 후에도 1열, 2열 최상단 표시 보장
window.addEventListener('load', () => {
  if (!window.location.hash || window.location.hash === '#home') {
    window.scrollTo(0, 0);
  }
});

// 탭 간 실시간 매물 변경 감지 (삭제/수정/추가 동기화)
window.addEventListener('storage', (e) => {
  if (e.key === 'chebol_properties_data' || e.key === 'chebol_properties_last_deleted' || e.key === 'chebol_deleted_property_ids') {
    PropertyManager.init();
    if (typeof UI !== 'undefined') {
      if (UI.renderProperties) UI.renderProperties();
      if (UI.renderFeaturedProperties) UI.renderFeaturedProperties();
      if (UI.updateAdminUI) UI.updateAdminUI();
    }
  }
});
