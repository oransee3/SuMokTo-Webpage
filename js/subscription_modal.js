/**
 * 도안수목토 재벌부동산 분양 정보 팝업 모달 전용 스크립트
 * - 01.png 당근부동산 썸네일 리스트 카드 스타일
 * - 4개 이후 상·하 스크롤바 작동 (max-h 4개 높이 제한)
 * - 8개 이상부터 하단 페이지 넘버링(Pagination) 자동 노출
 */

// 대전 도안신도시 및 인근 핵심 분양 단지 데이터 (8개 이상 구성)
const SUBSCRIPTION_DATA = [
    {
        id: 'sub-1',
        title: '힐스테이트 도안리버파크',
        tag: '도안 2-2',
        tagBg: 'bg-carrot',
        scale: '분양 5,329세대',
        scaleSub: '(84㎡~162㎡)',
        specs: '유성구 학하동 · 공급 34~65평형 · 최고 35층',
        badges: [
            { text: '청약홈 접수', style: 'bg-[#0d2a1f] text-[#3fb950] border-[#238636]/40' },
            { text: '안심 권리분석', style: 'bg-[#0c2340] text-[#58a6ff] border-[#1f6feb]/40' }
        ],
        desc: '“진잠천 수변공원을 품은 5천세대 매머드급 랜드마크”',
        img: 'images/단지조감도_2K.jpg'
    },
    {
        id: 'sub-2',
        title: '도안 푸르지오 디아델',
        tag: '도안 2-5',
        tagBg: 'bg-blue-600',
        scale: '분양 1,514세대',
        scaleSub: '(59㎡~215㎡)',
        specs: '서구 용계동 · 공급 24~80평형 · 최고 32층',
        badges: [
            { text: '트램 2호선 역세권', style: 'bg-[#0d2a1f] text-[#3fb950] border-[#238636]/40' },
            { text: '안심송금', style: 'bg-[#0c2340] text-[#58a6ff] border-[#1f6feb]/40' }
        ],
        desc: '“도안대로 직결 및 대전 도시철도 2호선 트램 초역세권 프리미엄”',
        img: 'images/단지투시도_2K.jpg'
    },
    {
        id: 'sub-3',
        title: '도안 중심상업지구 프리미엄 상가',
        tag: '수익형',
        tagBg: 'bg-emerald-600',
        scale: '분양 / 임대 맞춤 상담',
        scaleSub: '',
        specs: '서구 도안동 · 배후 1.2만 세대 항아리 상권 · 1~7층',
        badges: [
            { text: '독점 업종 지정', style: 'bg-[#0d2a1f] text-[#3fb950] border-[#238636]/40' },
            { text: '수익률 분석', style: 'bg-[#0c2340] text-[#58a6ff] border-[#1f6feb]/40' }
        ],
        desc: '“수목토·아이파크 2,300여 세대 정문 독점 관문 상권”',
        img: 'images/preview_complex.jpg'
    },
    {
        id: 'sub-4',
        title: '도안 2단계 신규 후속 공급 예정 단지',
        tag: '공급예정',
        tagBg: 'bg-purple-600',
        scale: '사전 청약 상담 접수 중',
        scaleSub: '',
        specs: '대전 유성구/서구 도안신도시 핵심권역 · 중대형 평형',
        badges: [
            { text: '사전 관심고객', style: 'bg-[#0d2a1f] text-[#3fb950] border-[#238636]/40' },
            { text: '일정 실시간 안내', style: 'bg-[#0c2340] text-[#58a6ff] border-[#1f6feb]/40' }
        ],
        desc: '“도안신도시 프리미엄 주거벨트의 완성, VIP 사전 안내”',
        img: 'images/bird_view_2k.jpg'
    },
    {
        id: 'sub-5',
        title: '도안 우미린 트리쉐이드',
        tag: '도안 2-3',
        tagBg: 'bg-indigo-600',
        scale: '분양 1,754세대',
        scaleSub: '(84㎡~201㎡)',
        specs: '유성구 복용동 · 공급 34~78평형 · 최고 38층',
        badges: [
            { text: '초품아 단지', style: 'bg-[#0d2a1f] text-[#3fb950] border-[#238636]/40' },
            { text: '유성천 수변공원', style: 'bg-[#0c2340] text-[#58a6ff] border-[#1f6feb]/40' }
        ],
        desc: '“단지 앞 초등학교 및 유성천 수변공원을 품은 숲세권 프리미엄”',
        img: 'images/단지배치도_2K.jpg'
    },
    {
        id: 'sub-6',
        title: '힐스테이트 도안퍼스트',
        tag: '주거용 오피스텔',
        tagBg: 'bg-teal-600',
        scale: '분양 432실',
        scaleSub: '(전용 84㎡ 아파텔)',
        specs: '유성구 용계동 · 전용 84㎡ 주거형 · 최고 29층',
        badges: [
            { text: '도안대로 역세권', style: 'bg-[#0d2a1f] text-[#3fb950] border-[#238636]/40' },
            { text: '즉시 입주가능', style: 'bg-[#0c2340] text-[#58a6ff] border-[#1f6feb]/40' }
        ],
        desc: '“도안신도시 중심상업지구 도보 생활권, 하이엔드 주거형 오피스텔”',
        img: 'images/view_2k.jpg'
    },
    {
        id: 'sub-7',
        title: '관저 푸르지오 센트럴파크',
        tag: '관저지구',
        tagBg: 'bg-amber-600',
        scale: '분양 660세대',
        scaleSub: '(84㎡ 단일)',
        specs: '서구 관저동 · 공급 34평형 · 최고 25층',
        badges: [
            { text: '구봉산 숲세권', style: 'bg-[#0d2a1f] text-[#3fb950] border-[#238636]/40' },
            { text: '건양대병원 인접', style: 'bg-[#0c2340] text-[#58a6ff] border-[#1f6feb]/40' }
        ],
        desc: '“도안신도시 인접 생활권, 구봉산 파노라마 숲세권 힐링 단지”',
        img: 'images/단지조감도_2K.jpg'
    },
    {
        id: 'sub-8',
        title: '대전 유성 하늘채 리버뷰',
        tag: '수변특화',
        tagBg: 'bg-cyan-600',
        scale: '분양 980세대',
        scaleSub: '(84㎡~120㎡)',
        specs: '유성구 원신흥동 · 공급 34~48평형 · 최고 30층',
        badges: [
            { text: '영구 갑천조망', style: 'bg-[#0d2a1f] text-[#3fb950] border-[#238636]/40' },
            { text: '도안호수공원 인접', style: 'bg-[#0c2340] text-[#58a6ff] border-[#1f6feb]/40' }
        ],
        desc: '“갑천 파노라마 조망과 도안호수공원을 동시에 누리는 프리미엄”',
        img: 'images/단지투시도_2K.jpg'
    }
];

let currentSubPage = 1;
const SUB_ITEMS_PER_PAGE = 6; // 한 페이지당 6개 (4개 높이 제한으로 4개 초과분은 스크롤바로 위아래 확인)

function renderSubscriptionList(page) {
    currentSubPage = page || 1;
    const container = document.getElementById('subItemListContainer');
    const paginationContainer = document.getElementById('subPaginationContainer');
    if (!container) return;

    const totalItems = SUBSCRIPTION_DATA.length;
    const totalPages = Math.ceil(totalItems / SUB_ITEMS_PER_PAGE);
    if (currentSubPage > totalPages) currentSubPage = totalPages;
    if (currentSubPage < 1) currentSubPage = 1;

    const startIdx = (currentSubPage - 1) * SUB_ITEMS_PER_PAGE;
    const pageItems = SUBSCRIPTION_DATA.slice(startIdx, startIdx + SUB_ITEMS_PER_PAGE);

    // 1. 목록 렌더링 (확대된 모달 창에 맞춘 시원한 썸네일 및 타이포그래피)
    container.innerHTML = pageItems.map((item, index) => {
        const topPaddingClass = index > 0 ? 'pt-3 sm:pt-3.5' : '';
        const badgesHtml = item.badges.map(b => 
            `<span class="px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold rounded-md border ${b.style}">${b.text}</span>`
        ).join('');

        return `
            <div onclick="window.open('subscription.html', '_blank')" class="flex gap-4 sm:gap-5 p-3 sm:p-4 rounded-2xl hover:bg-zinc-900/80 transition-colors cursor-pointer group relative ${topPaddingClass}">
                <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-zinc-900 shrink-0 relative shadow-inner">
                    <img src="${item.img}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onerror="this.src='images/preview_complex.jpg'">
                    <span class="absolute top-1.5 left-1.5 px-2 py-0.5 text-[10px] font-bold rounded ${item.tagBg} text-white shadow">
                        ${item.tag}
                    </span>
                </div>
                <div class="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                        <div class="flex items-start justify-between gap-1">
                            <h4 class="text-base sm:text-lg font-bold text-white group-hover:text-gold transition-colors truncate">
                                ${item.title}
                            </h4>
                            <button type="button" onclick="event.stopPropagation(); this.classList.toggle('text-red-500');" class="text-gray-500 hover:text-red-500 transition-colors p-1 -mr-1 shrink-0" title="관심 단지 등록">
                                <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                            </button>
                        </div>
                        <div class="text-base sm:text-lg font-black text-[#58a6ff] tracking-tight mt-1">
                            ${item.scale} ${item.scaleSub ? `<span class="text-xs sm:text-sm text-gray-400 font-normal ml-1">${item.scaleSub}</span>` : ''}
                        </div>
                        <p class="text-xs sm:text-[13px] text-gray-400 mt-1 truncate">
                            ${item.specs}
                        </p>
                    </div>
                    <div>
                        <div class="flex flex-wrap items-center gap-1.5 mt-2">
                            ${badgesHtml}
                        </div>
                        <p class="text-xs sm:text-[13px] text-gray-300 mt-1.5 truncate font-normal">
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

function openSubscriptionModal() {
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

document.addEventListener('DOMContentLoaded', () => {
    renderSubscriptionList(1);
});

// ESC 키 입력 시 모달 닫기
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeSubscriptionModal();
    }
});
