/**
 * 도안수목토 재벌부동산 분양 정보 팝업 모달 전용 스크립트
 * - 01.png 당근부동산 썸네일 리스트 카드 스타일
 * - 4개 이후 상·하 스크롤바 작동 (max-h 4개 높이 제한)
 * - 8개 이상부터 하단 페이지 넘버링(Pagination) 자동 노출
 */

// 분양 단지 데이터 (사용자 요청: 기본 내용 삭제 및 4개 칸 간격 유지, 관리자 등록 단지 로컬스토리지 연동)
const SUBSCRIPTION_DATA = [];
try {
    const savedCustomSubs = localStorage.getItem('sumokto_custom_subscriptions');
    if (savedCustomSubs) {
        const parsed = JSON.parse(savedCustomSubs);
        if (Array.isArray(parsed) && parsed.length > 0) {
            SUBSCRIPTION_DATA.push(...parsed);
        }
    }
} catch (e) {}

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
        container.innerHTML = [1, 2, 3, 4].map(n => `
            <div class="flex gap-4 sm:gap-4.5 py-2 sm:py-2.5 px-3 sm:px-3.5 rounded-2xl hover:bg-zinc-900/40 transition-colors group relative items-center" style="min-height: 142px; height: 142px;">
                <div class="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl border border-dashed border-zinc-800/80 bg-zinc-900/40 shrink-0"></div>
                <div class="flex-1 min-w-0 flex flex-col justify-between py-1 h-20 sm:h-22">
                </div>
            </div>
        `).join('');

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

    // 1. 목록 렌더링 (와이드 모달 창 & 4개 온전히 표시 최적화)
    container.innerHTML = pageItems.map((item, index) => {
        const badgesHtml = item.badges.map(b => 
            `<span class="px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold rounded-md border ${b.style}">${b.text}</span>`
        ).join('');

        return `
            <div onclick="window.open('subscription.html', '_blank')" class="flex gap-4 sm:gap-4.5 py-2 sm:py-2.5 px-3 sm:px-3.5 rounded-2xl hover:bg-zinc-900/80 transition-colors cursor-pointer group relative">
                <div class="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden bg-zinc-900 shrink-0 relative shadow-inner">
                    <img src="${item.img}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onerror="this.src='images/preview_complex.jpg'">
                    <span class="absolute top-1.5 left-1.5 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold rounded ${item.tagBg} text-white shadow">
                        ${item.tag}
                    </span>
                </div>
                <div class="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                        <div class="flex items-start justify-between gap-1">
                            <h4 class="text-base sm:text-[17px] font-bold text-white group-hover:text-gold transition-colors truncate">
                                ${item.title}
                            </h4>
                            <button type="button" onclick="event.stopPropagation(); this.classList.toggle('text-red-500');" class="text-gray-500 hover:text-red-500 transition-colors p-1 -mr-1 shrink-0" title="관심 단지 등록">
                                <svg class="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                            </button>
                        </div>
                        <div class="text-[14px] sm:text-[16px] font-black text-[#58a6ff] tracking-tight mt-0.5">
                            ${item.scale} ${item.scaleSub ? `<span class="text-xs sm:text-[13px] text-gray-400 font-normal ml-1">${item.scaleSub}</span>` : ''}
                        </div>
                        <p class="text-[11px] sm:text-xs text-gray-400 mt-0.5 truncate">
                            ${item.specs}
                        </p>
                    </div>
                    <div>
                        <div class="flex flex-wrap items-center gap-1.5 mt-1">
                            ${badgesHtml}
                        </div>
                        <p class="text-[11px] sm:text-xs text-gray-300 mt-0.5 truncate font-normal">
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
                            <input type="text" id="subInputTag" placeholder="예: 105타입, 119타입 분양중" class="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-sm focus:border-gold outline-none">
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
                    <div class="flex items-center justify-end gap-2 pt-2.5 border-t border-zinc-800 shrink-0">
                        <button type="button" onclick="closeAddSubscriptionModal()" class="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-gray-300 text-xs font-bold rounded-xl transition-colors">취소</button>
                        <button type="submit" class="px-5 py-2 bg-gold hover:bg-gold-dark text-black text-xs font-bold rounded-xl transition-colors shadow">등록 완료</button>
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
        if (previewImg) { previewImg.src = ''; previewImg.classList.add('hidden'); }
        if (placeholder) placeholder.classList.remove('hidden');
        if (statusText) statusText.textContent = '미선택 시 기본 조감도 이미지가 적용됩니다.';
    }
    addModal.classList.remove('hidden');
}

function closeAddSubscriptionModal() {
    const m = document.getElementById('addSubscriptionModal');
    if (m) m.classList.add('hidden');
}

function handleSubscriptionSubmit(e) {
    e.preventDefault();
    const title = document.getElementById('subInputTitle').value.trim();
    if (!title) return;

    const tag = document.getElementById('subInputTag').value.trim() || '신규분양';
    const scale = document.getElementById('subInputScale').value.trim() || '상담 접수 중';
    const specs = document.getElementById('subInputSpecs').value.trim() || '도안신도시 핵심 권역';
    const desc = document.getElementById('subInputDesc').value.trim() || '“도안수목토 재벌부동산 엄선 추천 단지”';
    const img = currentCompressedSubImg || 'images/preview_complex.jpg';

    const newItem = {
        id: 'sub-custom-' + Date.now(),
        title: title,
        tag: tag,
        tagBg: 'bg-carrot',
        scale: scale,
        scaleSub: '',
        specs: specs,
        badges: [
            { text: '사전 접수', style: 'bg-[#0d2a1f] text-[#3fb950] border-[#238636]/40' },
            { text: '전문 상담', style: 'bg-[#0c2340] text-[#58a6ff] border-[#1f6feb]/40' }
        ],
        desc: desc,
        img: img
    };

    SUBSCRIPTION_DATA.unshift(newItem);
    try {
        localStorage.setItem('sumokto_custom_subscriptions', JSON.stringify(SUBSCRIPTION_DATA));
    } catch (err) {}

    closeAddSubscriptionModal();
    renderSubscriptionList(1);
    if (typeof UI !== 'undefined' && typeof UI.showToast === 'function') {
        UI.showToast(`[${title}] 신규 분양 정보가 성공적으로 등록되었습니다.`);
    } else {
        console.log(`[${title}] 신규 분양 정보 등록 완료`);
    }
}


function openSubscriptionModal() {
    updateSubscriptionAdminUI();
    renderSubscriptionList(currentSubPage || 1);
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

document.addEventListener('DOMContentLoaded', () => {
    renderSubscriptionList(1);
});

// ESC 키 입력 시 모달 닫기
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeSubscriptionModal();
    }
});
