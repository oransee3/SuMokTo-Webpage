/**
 * 도안수목토 재벌부동산 분양 정보 팝업 모달 전용 스크립트
 * - 01.png 당근부동산 썸네일 리스트 카드 스타일
 * - 4개 이후 상·하 스크롤바 작동 (max-h 4개 높이 제한)
 * - 8개 이상부터 하단 페이지 넘버링(Pagination) 자동 노출
 */

// 기본 분양 정보 프리셋 (핸드폰 모바일, 신규 기기 접속 시에도 100% 동일한 분양 내용이 노출되도록 보장)
const DEFAULT_SUBSCRIPTION_DATA = [
    {
        id: 'sub-preset-1',
        title: '대전 선화동 하늘채 루시에르',
        tag: '105타입, 119타입 분양중',
        tagBg: 'bg-carrot',
        scale: '총 998세대',
        scaleSub: '',
        specs: '대전광역시 중구 선화동 95-3 일원',
        desc: '“트램 2호선 역세권, 중구청 건립 수혜지역”',
        homepage: 'https://domus-vision.com',
        youtube: 'https://www.youtube.com/watch?v=yDVMokqyoD8',
        badges: [
            { text: '분양중', style: 'bg-[#2d1200] text-[#ff7a22] border-[#ff7a22]/50 shadow-sm' }
        ],
        img: 'images/sub_hanulche_thumb.jpg',
        thumbnail: 'images/sub_hanulche_thumb.jpg',
        lat: 36.33481,
        lng: 127.41979
    }
];

// 분양 단지 데이터 (서버 및 로컬스토리지 연동, PC·모바일 100% 실시간 공유)
const SUBSCRIPTION_DATA = [];
try {
    const savedCustomSubs = localStorage.getItem('sumokto_custom_subscriptions');
    if (savedCustomSubs !== null) {
        const parsed = JSON.parse(savedCustomSubs);
        if (Array.isArray(parsed) && parsed.length > 0) {
            parsed.forEach(item => {
                if (item.id === 'sub-preset-1' || item.img === 'images/view_2k.jpg' || !item.img) {
                    item.img = 'images/sub_hanulche_thumb.jpg';
                    item.thumbnail = 'images/sub_hanulche_thumb.jpg';
                }
                if (item.id === 'sub-preset-1' || (item.title && item.title.includes('하늘채'))) {
                    if (!item.homepage || item.homepage.includes('hanulche.co.kr')) item.homepage = 'https://domus-vision.com';
                    if (!item.youtube || item.youtube === 'https://youtube.com' || item.youtube.includes('yDVMokqyod8')) item.youtube = 'https://www.youtube.com/watch?v=yDVMokqyoD8';
                }
            });
            SUBSCRIPTION_DATA.push(...parsed);
        }
    }
} catch (e) {}

// 로컬스토리지에 저장된 데이터가 없는 경우 기본 분양 프리셋 자동 탑재 (PC·모바일 빈 모달 방지)
if (SUBSCRIPTION_DATA.length === 0) {
    SUBSCRIPTION_DATA.push(...DEFAULT_SUBSCRIPTION_DATA);
}

// data/subscriptions.json 서버 데이터 비동기 동기화 (PC-모바일 실시간 값 공유)
async function syncServerSubscriptions() {
    try {
        const res = await fetch('data/subscriptions.json?t=' + Date.now(), { cache: 'no-store' });
        if (res.ok) {
            const list = await res.json();
            if (Array.isArray(list)) {
                // 서버에서 삭제되어 빈 배열([])인 경우도 100% 실시간 모바일 동기화 반영
                SUBSCRIPTION_DATA.length = 0;
                SUBSCRIPTION_DATA.push(...list);
                try {
                    localStorage.setItem('sumokto_custom_subscriptions', JSON.stringify(SUBSCRIPTION_DATA));
                } catch (e) {}
                renderSubscriptionList(currentSubPage || 1);
            }
        }
    } catch (e) {}
}
syncServerSubscriptions();

let currentSubPage = 1;
const SUB_ITEMS_PER_PAGE = 6; // 한 페이지당 6개 (4개 높이 제한으로 4개 초과분은 스크롤바로 위아래 확인)

function renderSubscriptionList(page) {
    currentSubPage = page || 1;
    const container = document.getElementById('subItemListContainer');
    const paginationContainer = document.getElementById('subPaginationContainer');
    if (!container) return;

    // 분양 정보 데이터가 없거나 내용이 삭제된 경우: 4개 칸의 간격 및 레이아웃을 100% 동일하게 유지하는 빈 슬롯 4개 렌더링
    const validItems = SUBSCRIPTION_DATA.filter(item => item && (item.title || item.img));
    if (validItems.length === 0) {
        container.innerHTML = `
            <div class="py-12 flex flex-col items-center justify-center text-center text-gray-400">
                <svg class="w-12 h-12 mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <p class="text-sm font-semibold text-gray-300">현재 등록된 분양 정보가 없습니다.</p>
                <p class="text-xs text-gray-500 mt-1">PC 데스크탑 관계자 모드에서 신규 분양 정보를 등록할 수 있습니다.</p>
            </div>
        `;

        container.scrollTop = 0;

        if (paginationContainer) {
            paginationContainer.classList.add('hidden');
            paginationContainer.innerHTML = '';
        }
        return;
    }

    const totalItems = validItems.length;
    const totalPages = Math.ceil(totalItems / SUB_ITEMS_PER_PAGE);
    if (currentSubPage > totalPages) currentSubPage = totalPages;
    if (currentSubPage < 1) currentSubPage = 1;

    const startIdx = (currentSubPage - 1) * SUB_ITEMS_PER_PAGE;
    const pageItems = validItems.slice(startIdx, startIdx + SUB_ITEMS_PER_PAGE);

    // 1. 목록 렌더링 (와이드 모달 창 & 4개 온전히 표시 & 썸네일 흰색글씨 제거 & 카드 클릭 새창 차단 & 홈페이지·유튜브 링크 & 상태 배지 '사전접수'/'분양중' & 관리자 전용 ✕ 삭제 버튼)
    const isAdmin = checkAdminMode();

    container.innerHTML = pageItems.map((item, index) => {
        // 분류/태그 항목에 '분양중' 키워드가 있으면 '분양중', 그 외에는 모두 '사전접수'로 2가지 배지만 노출
        const tagText = (item.tag || '').trim();
        const isSaleActive = tagText.includes('분양중');
        const statusBadgeHtml = isSaleActive ? `
            <span class="px-2 py-0.5 text-[10px] sm:text-[11px] font-bold rounded-md border bg-[#2d1200] text-[#ff7a22] border-[#ff7a22]/50 shadow-sm shrink-0">분양중</span>
        ` : `
            <span class="px-2 py-0.5 text-[10px] sm:text-[11px] font-bold rounded-md border bg-[#0d2a1f] text-[#3fb950] border-[#238636]/50 shadow-sm shrink-0">사전접수</span>
        `;

        // 관리자 모드에서만 삭제 버튼 노출 (일반 모드에서는 완전 제거)
        const deleteBtnHtml = isAdmin ? `
            <button type="button" onclick="event.stopPropagation(); deleteSubscriptionItem('${item.id}');" class="sub-delete-btn px-2.5 py-1 rounded-lg bg-red-950/80 hover:bg-red-800 text-red-300 hover:text-white border border-red-700/60 text-xs font-bold transition-all shadow flex items-center gap-1 shrink-0 cursor-pointer" title="해당 분양 정보 삭제">
                <span class="text-red-400 font-black text-xs leading-none">✕</span>
                <span>삭제</span>
            </button>
        ` : '';

        // 홈페이지 / 유튜브 바로가기 링크 버튼
        let linksHtml = '';
        if (item.homepage) {
            linksHtml += `
                <a href="${item.homepage}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-950/70 hover:bg-blue-900 text-blue-300 hover:text-white border border-blue-700/50 text-[10px] sm:text-[11px] font-bold transition-colors shadow-sm shrink-0 cursor-pointer" title="공식 홈페이지 바로가기">
                    <svg class="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
                    <span>홈페이지</span>
                </a>
            `;
        }
        if (item.youtube) {
            linksHtml += `
                <a href="${item.youtube}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-950/70 hover:bg-red-900 text-red-300 hover:text-white border border-red-700/50 text-[10px] sm:text-[11px] font-bold transition-colors shadow-sm shrink-0 cursor-pointer" title="유튜브 영상 바로가기">
                    <svg class="w-2.5 h-2.5 text-red-500 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    <span>유튜브</span>
                </a>
            `;
        }

        return `
            <div class="flex gap-3 sm:gap-4.5 py-2.5 sm:py-2.5 px-3 sm:px-3.5 rounded-2xl hover:bg-zinc-900/50 transition-colors cursor-default relative items-center" style="min-height: 136px;">
                <!-- 문구 내용 전체 높이와 1:1로 완벽하게 일치하는 썸네일 이미지 -->
                <div class="w-[116px] h-[116px] sm:w-[126px] sm:h-[126px] rounded-2xl overflow-hidden bg-zinc-900 shrink-0 relative shadow-inner border border-zinc-800/80">
                    <img src="${item.img}" alt="${item.title}" class="w-full h-full object-cover" onerror="this.src='images/preview_complex.jpg'">
                </div>
                <!-- 문구 내용 전체 컬럼: 제목, 세대수, 주소, 배지한줄, 설명이 썸네일과 정확히 일치 -->
                <div class="flex-1 min-w-0 flex flex-col justify-center py-0.5 gap-1 sm:gap-1.5">
                    <div>
                        <div class="flex items-start justify-between gap-2">
                            <h4 class="text-[14.5px] sm:text-[17px] font-bold text-white tracking-tight truncate leading-tight">
                                ${item.title}
                            </h4>
                            <!-- 관리자 모드 전용 ✕ 삭제 버튼 (일반 모드에서는 빈 문자열로 미노출) -->
                            ${deleteBtnHtml}
                        </div>
                        <div class="text-[13.5px] sm:text-[16px] font-black text-[#58a6ff] tracking-tight mt-0.5">
                            ${item.scale} ${item.scaleSub ? `<span class="text-xs sm:text-[13px] text-gray-400 font-normal ml-1">${item.scaleSub}</span>` : ''}
                        </div>
                        <p class="text-[11px] sm:text-xs text-gray-400 mt-0.5 truncate">
                            ${item.specs}
                        </p>
                    </div>
                    <div>
                        <div class="flex items-center gap-1 sm:gap-1.5 mt-0.5 flex-nowrap overflow-hidden">
                            ${statusBadgeHtml}
                            ${linksHtml}
                        </div>
                        <p class="text-[11px] sm:text-xs text-gray-300 mt-1 truncate font-normal">
                            ${item.desc}
                        </p>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // 페이지 변경 시 스크롤 위치 맨 위로 복귀
    container.scrollTop = 0;

    // 2. 8개 이상부터 하단 페이지 넘버 노출
    if (paginationContainer) {
        if (totalItems >= 8 && totalPages > 1) {
            paginationContainer.classList.remove('hidden');
            let pagesHtml = '';

            // 이전 화살표 버튼
            pagesHtml += `
                <button type="button" onclick="renderSubscriptionList(${currentSubPage - 1})" class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors text-xs font-bold ${currentSubPage === 1 ? 'text-gray-600 cursor-not-allowed bg-zinc-900' : 'text-gray-300 hover:text-white bg-zinc-800 hover:bg-zinc-700'}" ${currentSubPage === 1 ? 'disabled' : ''} aria-label="이전 페이지">
                    ‹
                </button>
            `;

            // 페이지 넘버 버튼들
            for (let p = 1; p <= totalPages; p++) {
                const isActive = p === currentSubPage;
                pagesHtml += `
                    <button type="button" onclick="renderSubscriptionList(${p})" class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors text-xs font-bold ${isActive ? 'bg-carrot text-white font-black shadow-md ring-1 ring-white/20' : 'bg-zinc-800 hover:bg-zinc-700 text-gray-300 hover:text-white'}">
                        ${p}
                    </button>
                `;
            }

            // 다음 화살표 버튼
            pagesHtml += `
                <button type="button" onclick="renderSubscriptionList(${currentSubPage + 1})" class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors text-xs font-bold ${currentSubPage === totalPages ? 'text-gray-600 cursor-not-allowed bg-zinc-900' : 'text-gray-300 hover:text-white bg-zinc-800 hover:bg-zinc-700'}" ${currentSubPage === totalPages ? 'disabled' : ''} aria-label="다음 페이지">
                    ›
                </button>
            `;

            // 총 건수 정보
            pagesHtml += `
                <span class="text-xs text-gray-400 ml-2 font-medium">
                    (총 <strong class="text-gold font-bold">${totalItems}</strong>개 단지)
                </span>
            `;

            paginationContainer.innerHTML = pagesHtml;
        } else {
            // 8개 미만이거나 단일 페이지일 때 하단 넘버 숨김
            paginationContainer.classList.add('hidden');
            paginationContainer.innerHTML = '';
        }
    }
}

// ==========================================
// 마우스가 창 밖에서 마우스 휠을 움직여도 배경이 전혀 움직이지 않도록 하는 스크롤 차단 핸들러
// ==========================================
function handleModalWheel(e) {
    const modal = document.getElementById('subscriptionModal');
    if (!modal || modal.classList.contains('hidden')) return;

    const modalPanel = modal.querySelector('.sub-modal-panel');
    const scrollContainer = document.getElementById('subItemListContainer');

    // 1. 마우스가 모달 창 밖(배경 오버레이)에 있을 때는 휠 스크롤 100% 무조건 차단
    if (!modalPanel || !modalPanel.contains(e.target)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    // 2. 모달 창 내부에 있더라도 스크롤 리스트 영역이 아닌 곳(헤더, 푸터, 넘버링 바 등) 위일 때도 차단
    if (!scrollContainer || !scrollContainer.contains(e.target)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    // 3. 스크롤 리스트 끝단에서 휠 굴릴 때 배경으로 스크롤이 넘어가는 체이닝(Scroll Chaining) 방지
    const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
    const isScrollUp = e.deltaY < 0;
    const isScrollDown = e.deltaY > 0;

    if (isScrollUp && scrollTop <= 0) {
        e.preventDefault();
        return false;
    }
    if (isScrollDown && (scrollTop + clientHeight >= scrollHeight - 1)) {
        e.preventDefault();
        return false;
    }
}

function handleModalTouchMove(e) {
    const modal = document.getElementById('subscriptionModal');
    if (!modal || modal.classList.contains('hidden')) return;

    const modalPanel = modal.querySelector('.sub-modal-panel');
    const scrollContainer = document.getElementById('subItemListContainer');

    // 모달 밖 터치 스크롤 차단
    if (!modalPanel || !modalPanel.contains(e.target) || (scrollContainer && !scrollContainer.contains(e.target))) {
        e.preventDefault();
    }
}

let isModalWheelLocked = false;
function lockModalScroll() {
    if (isModalWheelLocked) return;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    window.addEventListener('wheel', handleModalWheel, { passive: false });
    window.addEventListener('touchmove', handleModalTouchMove, { passive: false });
    isModalWheelLocked = true;
}

function unlockModalScroll() {
    if (!isModalWheelLocked) return;
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    window.removeEventListener('wheel', handleModalWheel);
    window.removeEventListener('touchmove', handleModalTouchMove);
    isModalWheelLocked = false;
}


// ==========================================
// 관리자(관계자) 모드 감지 및 신규 분양 정보 등록 UI 제어
// ==========================================
function checkAdminMode() {
    // [요청 반영]: 'PC 데스크탑'(화면 너비 768px 이상)에서만 관계자 모드로 분양 정보 추가/편집/삭제 가능
    const isDesktop = window.innerWidth >= 768;
    if (!isDesktop) return false;

    try {
        if (typeof AuthManager !== 'undefined' && typeof AuthManager.isLoggedIn === 'function') {
            return AuthManager.isLoggedIn();
        }
        return sessionStorage.getItem('chebol_current_user') !== null;
    } catch (e) {
        return false;
    }
}

function updateSubscriptionAdminUI() {
    const isAdmin = checkAdminMode();
    const adminBtn = document.getElementById('adminAddSubscriptionBtn');
    if (adminBtn) {
        if (isAdmin) {
            adminBtn.classList.remove('hidden');
            adminBtn.style.display = 'inline-flex';
        } else {
            adminBtn.classList.add('hidden');
            adminBtn.style.display = 'none';
        }
    }
}


let currentCompressedSubImg = null;

// 이미지 파일을 썸네일 크기(최대 240x240) 및 저용량(JPEG 0.75, ~20KB)으로 압축하는 함수
function compressImageToThumbnail(file, callback) {
    if (!file || !file.type.startsWith('image/')) {
        if (typeof UI !== 'undefined' && typeof UI.showToast === 'function') {
            UI.showToast('이미지 파일만 선택 가능합니다.', 'error');
        }
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            // 썸네일 규격: 최대 240px
            const maxDim = 240;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > maxDim) {
                    height = Math.round((height * maxDim) / width);
                    width = maxDim;
                }
            } else {
                if (height > maxDim) {
                    width = Math.round((width * maxDim) / height);
                    height = maxDim;
                }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // JPEG 75% 품질로 압축 (용량 15~25KB 수준으로 극소화)
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75);
            
            // 용량 계산 (KB 단위)
            const origSizeKB = Math.round(file.size / 1024);
            const compSizeKB = Math.round((compressedBase64.length * 3 / 4) / 1024);

            callback(compressedBase64, origSizeKB, compSizeKB);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function handleSubscriptionImageSelect(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const statusText = document.getElementById('subImgStatusText');
    const previewImg = document.getElementById('subImgPreview');
    const placeholder = document.getElementById('subImgPlaceholder');

    if (statusText) statusText.textContent = '이미지 압축 중...';

    compressImageToThumbnail(file, function(compressedBase64, origKB, compKB) {
        currentCompressedSubImg = compressedBase64;

        if (previewImg) {
            previewImg.src = compressedBase64;
            previewImg.classList.remove('hidden');
        }
        if (placeholder) {
            placeholder.classList.add('hidden');
        }
        if (statusText) {
            statusText.innerHTML = `<span class="text-emerald-400 font-bold">✓ 썸네일 최적화 완료</span> <span class="text-gray-400">(${origKB}KB → <strong>${compKB}KB</strong>)</span>`;
        }
    });
}


function openAddSubscriptionModal() {
    currentCompressedSubImg = null;
    let addModal = document.getElementById('addSubscriptionModal');
    if (!addModal) {
        const div = document.createElement('div');
        div.id = 'addSubscriptionModal';
        div.className = 'fixed inset-0 z-[250] bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none';
        div.innerHTML = `
            <div class="bg-[#1e1e22] border border-zinc-700 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative max-h-[92vh] flex flex-col overflow-hidden" onclick="event.stopPropagation()">
                <div class="flex items-center justify-between pb-3.5 border-b border-zinc-800 shrink-0">
                    <h3 class="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-gold"></span>
                        <span>신규 분양 정보 등록</span>
                    </h3>
                    <button type="button" onclick="closeAddSubscriptionModal()" class="w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 text-gray-400 hover:text-white flex items-center justify-center text-sm font-bold transition-colors">✕</button>
                </div>
                <form id="addSubscriptionForm" onsubmit="handleSubscriptionSubmit(event)" class="mt-3.5 space-y-3 overflow-y-auto sub-custom-scrollbar pr-1">
                    <!-- 썸네일 이미지 업로드 및 실시간 압축 영역 -->
                    <div class="bg-zinc-900/80 p-3 rounded-2xl border border-zinc-800">
                        <label class="block text-xs font-semibold text-gray-200 mb-1.5">
                            단지 썸네일 이미지 <span class="text-[11px] text-gold font-normal">(업로드 시 썸네일 규격 자동 압축·저용량 저장)</span>
                        </label>
                        <div class="flex items-center gap-3">
                            <!-- 썸네일 미리보기 박스 -->
                            <div id="subImgPreviewContainer" class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-dashed border-zinc-700 bg-zinc-950 overflow-hidden flex items-center justify-center shrink-0 relative shadow-inner">
                                <img id="subImgPreview" src="" alt="썸네일 미리보기" class="hidden w-full h-full object-cover">
                                <div id="subImgPlaceholder" class="flex flex-col items-center justify-center text-gray-500 text-[10px] text-center p-1">
                                    <svg class="w-5 h-5 text-gray-500 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                    <span>사진 추가</span>
                                </div>
                            </div>
                            <!-- 파일 첨부 버튼 -->
                            <div class="flex-1 min-w-0">
                                <label for="subFileInput" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-bold text-gray-200 hover:text-white cursor-pointer transition-colors shadow-sm">
                                    <svg class="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                                    <span>사진 파일 선택</span>
                                </label>
                                <input type="file" id="subFileInput" accept="image/*" class="hidden" onchange="handleSubscriptionImageSelect(event)">
                                <p id="subImgStatusText" class="text-[11px] text-gray-400 mt-1 truncate">
                                    미선택 시 기본 조감도 이미지가 적용됩니다.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-300 mb-1">단지명 / 프로젝트명 <span class="text-red-400">*</span></label>
                        <input type="text" id="subInputTitle" required placeholder="예: 대전 선화동 하늘채 루시에르" class="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-sm focus:border-gold outline-none">
                    </div>
                    <div class="grid grid-cols-2 gap-2.5">
                        <div>
                            <label class="block text-xs font-semibold text-gray-300 mb-1">분류 / 태그</label>
                            <input type="text" id="subInputTag" placeholder="예: 105타입 분양중 ('분양중' 포함 시 분양중, 그 외 사전접수)" class="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-sm focus:border-gold outline-none">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-300 mb-1">공급 규모</label>
                            <input type="text" id="subInputScale" placeholder="예: 총 998세대" class="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-sm focus:border-gold outline-none">
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-gray-300 mb-1">상세 위치 / 공급 면적</label>
                        <input type="text" id="subInputSpecs" placeholder="예: 대전광역시 중구 선화동 95-3 일원" class="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-sm focus:border-gold outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-gray-300 mb-1">핵심 특징 / 설명</label>
                        <input type="text" id="subInputDesc" placeholder="예: “트램 2호선 역세권, 중구청 건립 수혜지역”" class="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-sm focus:border-gold outline-none">
                    </div>
                    <!-- 홈페이지 URL 링크 & 유튜브 URL 링크 입력 영역 -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                            <label class="block text-xs font-semibold text-gray-300 mb-1 flex items-center gap-1.5">
                                <svg class="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
                                <span>홈페이지 URL 링크</span>
                            </label>
                            <input type="url" id="subInputHomepage" placeholder="예: https://www.hanulche.co.kr" class="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-xs sm:text-sm focus:border-gold outline-none">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-300 mb-1 flex items-center gap-1.5">
                                <svg class="w-3.5 h-3.5 text-red-500 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                                <span>유튜브 URL 링크</span>
                            </label>
                            <input type="url" id="subInputYoutube" placeholder="예: https://www.youtube.com/watch?v=..." class="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-xs sm:text-sm focus:border-gold outline-none">
                        </div>
                    </div>
                    <div class="flex items-center justify-between pt-2.5 border-t border-zinc-800 shrink-0">
                        <button type="button" onclick="promptGithubTokenManual()" class="inline-flex items-center gap-1 text-[11px] text-gray-400 hover:text-gold transition-colors py-1.5 px-2.5 rounded-xl bg-zinc-800/70 hover:bg-zinc-700 border border-zinc-700/60" title="저장된 GitHub Personal Access Token(PAT) 확인 및 변경">
                            <span>⚙</span>
                            <span>토큰 변경</span>
                        </button>
                        <div class="flex items-center gap-2">
                            <button type="button" onclick="closeAddSubscriptionModal()" class="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-gray-300 text-xs font-bold rounded-xl transition-colors">취소</button>
                            <button type="submit" class="px-5 py-2 bg-gold hover:bg-gold-dark text-black text-xs font-bold rounded-xl transition-colors shadow flex items-center gap-1.5">
                                <span>🔑</span>
                                <span>GitHub 토큰으로 저장</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(div);
        addModal = div;
    } else {
        // 기존 폼 초기화
        const form = document.getElementById('addSubscriptionForm');
        if (form) form.reset();
        const previewImg = document.getElementById('subImgPreview');
        const placeholder = document.getElementById('subImgPlaceholder');
        const statusText = document.getElementById('subImgStatusText');
        const hpInput = document.getElementById('subInputHomepage');
        const ytInput = document.getElementById('subInputYoutube');
        if (previewImg) { previewImg.src = ''; previewImg.classList.add('hidden'); }
        if (placeholder) placeholder.classList.remove('hidden');
        if (statusText) statusText.textContent = '미선택 시 기본 조감도 이미지가 적용됩니다.';
        if (hpInput) hpInput.value = '';
        if (ytInput) ytInput.value = '';
    }
    addModal.classList.remove('hidden');
}

function closeAddSubscriptionModal() {
    const m = document.getElementById('addSubscriptionModal');
    if (m) m.classList.add('hidden');
}


// ==========================================
// 등록된 분양 정보 삭제 함수 (관리자 전용)
// ==========================================
// GitHub 토큰 수동 입력 및 관리 유틸
// ==========================================
function promptGithubTokenManual() {
    const currentToken = (typeof GitHubSyncManager !== 'undefined' && GitHubSyncManager.getToken()) 
        ? GitHubSyncManager.getToken() 
        : (localStorage.getItem('chebol_github_token') || '');
    
    const input = window.prompt(
        `🔑 GitHub Personal Access Token(PAT)을 입력해 주세요:\n(토큰을 입력하시면 원격 GitHub 저장소에 실시간 저장되어 모바일과 100% 동기화됩니다)`,
        currentToken || ''
    );
    if (input !== null) {
        const trimmed = input.trim();
        if (trimmed) {
            if (typeof GitHubSyncManager !== 'undefined' && typeof GitHubSyncManager.setToken === 'function') {
                GitHubSyncManager.setToken(trimmed);
            } else {
                localStorage.setItem('chebol_github_token', trimmed);
            }
            if (typeof UI !== 'undefined' && typeof UI.showToast === 'function') {
                UI.showToast('✓ GitHub 토큰이 안전하게 저장되었습니다.', 'success');
            } else {
                alert('✓ GitHub 토큰이 안전하게 저장되었습니다.');
            }
            return trimmed;
        } else {
            localStorage.removeItem('chebol_github_token');
            if (typeof UI !== 'undefined' && typeof UI.showToast === 'function') {
                UI.showToast('GitHub 토큰이 초기화되었습니다.', 'warning');
            }
            return '';
        }
    }
    return currentToken;
}
window.promptGithubTokenManual = promptGithubTokenManual;

// ==========================================
// 분양 정보 원격 서버 및 GitHub 실시간 동기화 (PC-모바일 기기간 값 공유)
// ==========================================
async function syncSubscriptionToServer(data, forcePrompt = false) {
    if (!Array.isArray(data)) return;
    try {
        localStorage.setItem('sumokto_custom_subscriptions', JSON.stringify(data));
    } catch(e) {}

    // GitHub API 동기화 (PC-모바일 실시간 값 공유)
    try {
        let token = (typeof GitHubSyncManager !== 'undefined' && GitHubSyncManager.getToken()) 
            ? GitHubSyncManager.getToken() 
            : (localStorage.getItem('chebol_github_token') || '');
        const repo = (typeof GitHubSyncManager !== 'undefined' && GitHubSyncManager.REPO) 
            ? GitHubSyncManager.REPO 
            : 'oransee3/SuMokTo-Webpage';

        // 토큰이 없거나 강제 입력 요청 시 무조건 입력 창 띄우기
        if (!token || forcePrompt) {
            token = window.prompt(
                `🚀 GitHub 저장소에 실시간으로 업로드하려면 GitHub Personal Access Token(PAT)을 입력해 주세요:\n(1회만 입력하시면 브라우저에 안전하게 기억되어 다음부터 완전 자동 처리됩니다)`,
                token || ''
            );
            if (token && token.trim()) {
                token = token.trim();
                if (typeof GitHubSyncManager !== 'undefined' && typeof GitHubSyncManager.setToken === 'function') {
                    GitHubSyncManager.setToken(token);
                } else {
                    localStorage.setItem('chebol_github_token', token);
                }
            } else {
                token = '';
            }
        }

        if (!token) {
            // 토큰 미입력 시 재확인 창 제공 (원하면 즉시 다시 입력창 띄움)
            if (confirm(`GitHub 토큰이 입력되지 않아 로컬 브라우저에만 임시 보관되었습니다.\n지금 GitHub 토큰을 입력하여 실시간 서버(모바일 공유)에 저장하시겠습니까?`)) {
                return syncSubscriptionToServer(data, true);
            }
            return;
        }

        const path = 'data/subscriptions.json';
        const url = `https://api.github.com/repos/${repo}/contents/${path}`;
        let sha = null;
        let getRes = await fetch(url, {
            headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' }
        });

        // 토큰이 유효하지 않은 경우 (401 Bad credentials / 403 Forbidden)
        if (getRes.status === 401 || getRes.status === 403) {
            localStorage.removeItem('chebol_github_token');
            const retryToken = window.prompt(`⚠️ 저장된 GitHub 토큰이 만료되었거나 유효하지 않습니다.\n올바른 GitHub Personal Access Token(PAT)을 다시 입력해 주세요:`);
            if (retryToken && retryToken.trim()) {
                token = retryToken.trim();
                if (typeof GitHubSyncManager !== 'undefined' && typeof GitHubSyncManager.setToken === 'function') {
                    GitHubSyncManager.setToken(token);
                } else {
                    localStorage.setItem('chebol_github_token', token);
                }
                getRes = await fetch(url, {
                    headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' }
                });
            } else {
                return;
            }
        }

        if (getRes.ok) {
            const fData = await getRes.json();
            sha = fData.sha;
        }

        const cleanData = data.map(item => ({
            id: item.id,
            title: item.title,
            tag: item.tag || '',
            tagBg: item.tagBg || 'bg-carrot',
            scale: item.scale || '',
            scaleSub: item.scaleSub || '',
            specs: item.specs || item.address || '',
            desc: item.desc || '',
            homepage: item.homepage || item.homepageUrl || '',
            youtube: item.youtube || item.youtubeUrl || '',
            badges: item.badges || [],
            img: item.img || item.thumbnail || '',
            thumbnail: item.thumbnail || item.img || '',
            lat: item.lat || (item.title && item.title.includes('하늘채') ? 36.33481 : 36.33481),
            lng: item.lng || (item.title && item.title.includes('하늘채') ? 127.41979 : 127.41979)
        }));
        const jsonStr = JSON.stringify(cleanData, null, 2);
        const contentBase64 = btoa(unescape(encodeURIComponent(jsonStr)));
        const body = {
            message: `feat: sync subscriptions data (${new Date().toLocaleString('ko-KR')})`,
            content: contentBase64,
            branch: 'main'
        };
        if (sha) body.sha = sha;
        const putRes = await fetch(url, {
            method: 'PUT',
            headers: { 'Authorization': `token ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (putRes.ok) {
            console.log('GitHub subscriptions sync succeeded');
            if (typeof UI !== 'undefined' && typeof UI.showToast === 'function') {
                UI.showToast('✓ 분양 정보가 GitHub 및 서버에 실시간 저장되었습니다 (모바일 자동 반영).', 'success');
            } else {
                alert('✓ 분양 정보가 GitHub 및 서버에 실시간 저장되었습니다 (모바일 자동 반영).');
            }
        } else {
            console.warn('GitHub subscriptions sync PUT failed:', putRes.status);
            if (putRes.status === 401 || putRes.status === 403) {
                localStorage.removeItem('chebol_github_token');
                if (confirm(`GitHub 토큰 권한 문제로 저장이 완료되지 않았습니다.\n토큰을 다시 입력하여 재시도하시겠습니까?`)) {
                    syncSubscriptionToServer(data, true);
                }
            }
        }
    } catch (err) {
        console.warn('Subscription remote sync error:', err);
    }
}

function deleteSubscriptionItem(id) {
    if (!id) return;
    if (!checkAdminMode()) {
        if (typeof UI !== 'undefined' && typeof UI.showToast === 'function') {
            UI.showToast('삭제 권한이 없습니다. 관리자 로그인이 필요합니다.', 'warning');
        }
        return;
    }
    const item = SUBSCRIPTION_DATA.find(i => i.id === id);
    const title = item ? item.title : '해당';
    const confirmDelete = confirm(`'${title}' 분양 정보를 삭제하시겠습니까?`);
    if (!confirmDelete) return;

    const idx = SUBSCRIPTION_DATA.findIndex(i => i.id === id);
    if (idx !== -1) {
        SUBSCRIPTION_DATA.splice(idx, 1);
        syncSubscriptionToServer(SUBSCRIPTION_DATA);

        renderSubscriptionList(currentSubPage || 1);

        if (typeof UI !== 'undefined' && typeof UI.showToast === 'function') {
            UI.showToast(`'${title}' 분양 정보가 성공적으로 삭제되었습니다.`);
        } else {
            console.log(`'${title}' 삭제 완료`);
        }
    }
}

function handleSubscriptionSubmit(e) {
    e.preventDefault();
    const title = document.getElementById('subInputTitle').value.trim();
    if (!title) return;

    const tag = document.getElementById('subInputTag').value.trim() || '신규분양';
    const scale = document.getElementById('subInputScale').value.trim() || '상담 접수 중';
    const specs = document.getElementById('subInputSpecs').value.trim() || '도안신도시 핵심 권역';
    const desc = document.getElementById('subInputDesc').value.trim() || '“도안수목토 재벌부동산 엄선 추천 단지”';
    const homepage = document.getElementById('subInputHomepage') ? document.getElementById('subInputHomepage').value.trim() : '';
    const youtube = document.getElementById('subInputYoutube') ? document.getElementById('subInputYoutube').value.trim() : '';
    const img = currentCompressedSubImg || 'images/preview_complex.jpg';

    // 분류/태그에 '분양중' 키워드가 있으면 '분양중', 그 외에는 모두 '사전접수' 단일 배지 적용
    const isSaleActive = tag.includes('분양중');
    const badgeText = isSaleActive ? '분양중' : '사전접수';
    const badgeStyle = isSaleActive 
        ? 'bg-[#2d1200] text-[#ff7a22] border-[#ff7a22]/50 shadow-sm' 
        : 'bg-[#0d2a1f] text-[#3fb950] border-[#238636]/50 shadow-sm';

    const newItem = {
        id: 'sub-custom-' + Date.now(),
        title: title,
        tag: tag,
        tagBg: 'bg-carrot',
        scale: scale,
        scaleSub: '',
        specs: specs,
        desc: desc,
        homepage: homepage,
        youtube: youtube,
        badges: [
            { text: badgeText, style: badgeStyle }
        ],
        img: img,
        thumbnail: img,
        lat: 36.33481,
        lng: 127.41979
    };

    // [신규 분양 등록 자동 Geocoding]: 입력된 분양 주소 정밀 위경도 실시간 추출
    const proceedSave = (lat, lng) => {
        if (lat && lng) {
            newItem.lat = lat;
            newItem.lng = lng;
            // 지오코딩 캐시 저장
            try {
                const cache = JSON.parse(localStorage.getItem('sumokto_geo_cache') || '{}');
                cache[specs] = { lat: lat, lng: lng };
                localStorage.setItem('sumokto_geo_cache', JSON.stringify(cache));
            } catch (err) {}
        }
        SUBSCRIPTION_DATA.unshift(newItem);
        syncSubscriptionToServer(SUBSCRIPTION_DATA);

        closeAddSubscriptionModal();
        renderSubscriptionList(1);
        if (typeof UI !== 'undefined' && typeof UI.showToast === 'function') {
            UI.showToast(`[${title}] 신규 분양 정보가 성공적으로 등록되었습니다.`);
        } else {
            console.log(`[${title}] 신규 분양 정보 등록 완료`);
        }
    };

    // 1. 주소 정제 및 카카오 Geocoder 실시간 비동기 변환 (대한민국 전국 어디나 자동 지원)
    let cleanAddr = specs.replace(/\(.*?\)/g, '')
                         .replace(/\[.*?\]/g, '')
                         .replace(/일원.*$/g, '')
                         .replace(/외\s*\d+.*$/g, '')
                         .replace(/일대.*$/g, '')
                         .trim();
    const roadMatch = cleanAddr.match(/([가-힣\s]+[시|군|구]\s+[가-힣\s]+[읍|면|동|로|길]\s*[\d\-]+(?:\s*번지)?)/);
    const searchTarget = roadMatch ? roadMatch[1].trim() : (cleanAddr || specs);

    const fallbackSave = () => {
        try {
            const cache = JSON.parse(localStorage.getItem('sumokto_geo_cache') || '{}');
            const hit = cache[specs] || cache[cleanAddr] || cache[searchTarget];
            if (hit && hit.lat && hit.lng) {
                proceedSave(hit.lat, hit.lng);
                return;
            }
        } catch (e) {}
        proceedSave(36.33481, 127.41979);
    };

    if (typeof kakao !== 'undefined' && kakao.maps && kakao.maps.services && kakao.maps.services.Geocoder) {
        const geocoder = new kakao.maps.services.Geocoder();
        geocoder.addressSearch(searchTarget, function(result, status) {
            if (status === kakao.maps.services.Status.OK && result.length > 0) {
                proceedSave(parseFloat(result[0].y), parseFloat(result[0].x));
            } else {
                // 2차: 읍/면/동 단위로 재검색
                const broadMatch = searchTarget.match(/([가-힣]+[시|군|구]\s+[가-힣]+[읍|면|동])/);
                if (broadMatch) {
                    geocoder.addressSearch(broadMatch[1], function(res2, status2) {
                        if (status2 === kakao.maps.services.Status.OK && res2.length > 0) {
                            proceedSave(parseFloat(res2[0].y), parseFloat(res2[0].x));
                        } else {
                            fallbackSave();
                        }
                    });
                } else {
                    fallbackSave();
                }
            }
        });
    } else {
        fallbackSave();
    }
}


function openSubscriptionModal() {
    updateSubscriptionAdminUI();
    renderSubscriptionList(currentSubPage || 1);
    syncServerSubscriptions();
    const m = document.getElementById('subscriptionModal');
    if (m) {
        m.classList.remove('hidden');
        lockModalScroll();
    }
}

function closeSubscriptionModal() {
    const m = document.getElementById('subscriptionModal');
    if (m) {
        m.classList.add('hidden');
        unlockModalScroll();
    }
}

// 전역 바인딩 및 이벤트 리스너
window.openSubscriptionModal = openSubscriptionModal;
window.closeSubscriptionModal = closeSubscriptionModal;
window.renderSubscriptionList = renderSubscriptionList;
window.updateSubscriptionAdminUI = updateSubscriptionAdminUI;
window.openAddSubscriptionModal = openAddSubscriptionModal;
window.closeAddSubscriptionModal = closeAddSubscriptionModal;
window.handleSubscriptionSubmit = handleSubscriptionSubmit;
window.handleSubscriptionImageSelect = handleSubscriptionImageSelect;
window.compressImageToThumbnail = compressImageToThumbnail;
window.deleteSubscriptionItem = deleteSubscriptionItem;
window.SUBSCRIPTION_DATA = SUBSCRIPTION_DATA;

document.addEventListener('DOMContentLoaded', () => {
    renderSubscriptionList(1);
});

// ESC 키 입력 시 모달 닫기
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeSubscriptionModal();
    }
});
