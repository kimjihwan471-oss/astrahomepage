// ===================== 데이터 =====================
    const STORAGE_KEYS = {
        artists: 'astra_artists_v1',
        schedule: 'astra_schedule_v1',
        news: 'astra_news_v1'
    };
    const ADMIN_PASSWORD = 'astra12309';
    const AVATAR_COLORS = ['#d4af7a', '#9b90d6', '#7ddbde', '#e08fa0', '#8fb8de', '#c9d48f'];

    const DEFAULT_ARTISTS = [
        { id: 1, name: '노바 (NOVA)', group: 'STELLARIS', role: '리더 · 보컬', bio: '무대 위에서 가장 먼저 빛나는 별.', color: '#d4af7a' },
        { id: 2, name: '루나 (LUNA)', group: 'STELLARIS', role: '메인 댄서', bio: '섬세한 몸짓으로 이야기를 그린다.', color: '#8fb8de' },
        { id: 3, name: '카이 (KAI)', group: 'ORION BOYS', role: '래퍼 · 프로듀서', bio: '밤하늘의 리듬을 만드는 사람.', color: '#9b90d6' },
        { id: 4, name: '세라 (SERA)', group: 'SOLO', role: '솔로 아티스트', bio: '혼자서도 은하를 채우는 목소리.', color: '#7ddbde' }
    ];
    const DEFAULT_SCHEDULE = [
        { id: 1, date: '2026-09-05', title: 'STELLARIS 정규 2집 컴백 쇼케이스', artist: 'STELLARIS', type: '쇼케이스' },
        { id: 2, date: '2026-09-12', title: 'ORION BOYS 팬미팅', artist: 'ORION BOYS', type: '팬미팅' },
        { id: 3, date: '2026-09-20', title: 'SERA 단독 콘서트 〈Nightfall〉', artist: 'SERA', type: '콘서트' },
        { id: 4, date: '2026-10-02', title: 'ASTRA 신인 아티스트 쇼케이스', artist: 'ASTRA', type: '행사' }
    ];
    const DEFAULT_NEWS = [
        { id: 1, date: '2026-08-25', title: 'ASTRA ENTERTAINMENT, 신인 개발 프로젝트 공식 발표', content: 'ASTRA ENTERTAINMENT가 차세대 아티스트 발굴을 위한 신인 개발 프로젝트를 새롭게 시작합니다. 오디션 일정은 추후 공식 채널을 통해 안내됩니다.' },
        { id: 2, date: '2026-08-10', title: 'STELLARIS, 첫 번째 월드투어 확정', content: 'STELLARIS의 첫 월드투어가 2026년 하반기 아시아 지역을 시작으로 확정되었습니다. 자세한 일정은 SCHEDULE 페이지에서 확인하실 수 있습니다.' },
        { id: 3, date: '2026-07-28', title: 'ORION BOYS 신곡 뮤직비디오 공개', content: 'ORION BOYS의 새로운 싱글과 뮤직비디오가 공개되었습니다. 많은 관심과 사랑 부탁드립니다.' }
    ];

    function loadData(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            if (!raw) { localStorage.setItem(key, JSON.stringify(fallback)); return JSON.parse(JSON.stringify(fallback)); }
            return JSON.parse(raw);
        } catch (e) { return JSON.parse(JSON.stringify(fallback)); }
    }
    function saveData(key, data) { localStorage.setItem(key, JSON.stringify(data)); }

    let artists = loadData(STORAGE_KEYS.artists, DEFAULT_ARTISTS);
    let schedule = loadData(STORAGE_KEYS.schedule, DEFAULT_SCHEDULE);
    let news = loadData(STORAGE_KEYS.news, DEFAULT_NEWS);

    function nextId(list) { return list.length ? Math.max(...list.map(i => i.id)) + 1 : 1; }

    // ===================== 별빛 배경 =====================
    function buildStarfield() {
        const field = document.getElementById('starfield');
        const count = window.innerWidth < 600 ? 60 : 120;
        for (let i = 0; i < count; i++) {
            const s = document.createElement('div');
            s.className = 'star-dot';
            const size = (Math.random() * 1.8 + 0.6).toFixed(1);
            s.style.width = size + 'px';
            s.style.height = size + 'px';
            s.style.top = Math.random() * 100 + '%';
            s.style.left = Math.random() * 100 + '%';
            s.style.animationDelay = (Math.random() * 4).toFixed(2) + 's';
            s.style.animationDuration = (3 + Math.random() * 3).toFixed(2) + 's';
            field.appendChild(s);
        }
    }

    // ===================== 히어로 별자리 (북두칠성 모티프) =====================
    function buildConstellation() {
        const points = [
            [40, 70], [115, 95], [185, 115], [255, 100],
            [315, 60], [340, 140], [270, 170]
        ];
        const lines = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,3]];
        const radii = [3.2, 2.6, 3, 3.6, 2.6, 2.8, 3.2];

        let svg = `<svg viewBox="0 0 380 220" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">`;
        lines.forEach(([a, b]) => {
            svg += `<line x1="${points[a][0]}" y1="${points[a][1]}" x2="${points[b][0]}" y2="${points[b][1]}" />`;
        });
        points.forEach((p, i) => {
            const delay = (i * 0.45).toFixed(2);
            svg += `<circle class="star-point" cx="${p[0]}" cy="${p[1]}" r="${radii[i]}" style="--base-r:${radii[i]}; animation-delay:${delay}s;" fill="#f5f3ec" />`;
        });
        svg += `</svg>`;
        document.getElementById('constellation').innerHTML = svg;
    }

    // 마우스 패럴랙스 (데스크톱만)
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            const el = document.getElementById('constellation');
            if (!el) return;
            const x = (e.clientX / window.innerWidth - 0.5) * 16;
            const y = (e.clientY / window.innerHeight - 0.5) * 16;
            el.style.transform = `translate(calc(-50% + ${x}px), calc(-55% + ${y}px))`;
        });
    }

    // ===================== 렌더링 =====================
    function formatDate(dateStr) {
        const d = new Date(dateStr + 'T00:00:00');
        const days = ['일','월','화','수','목','금','토'];
        return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')} (${days[d.getDay()]})`;
    }

    function renderArtists() {
        const grid = document.getElementById('artistGrid');
        grid.innerHTML = artists.map(a => `
            <div class="artist-card">
                <div class="item-admin-controls">
                    <label class="icon-btn photo-btn" title="사진 추가" for="artist-photo-${a.id}">📷</label>
                    <input id="artist-photo-${a.id}" class="file-input" type="file" accept="image/*" onchange="quickUploadArtistImage(${a.id}, this)">
                    <button class="icon-btn" onclick="openArtistModal(${a.id})" title="수정">✎</button>
                    <button class="icon-btn danger" onclick="deleteItem('artists', ${a.id})" title="삭제">✕</button>
                </div>
                <div class="artist-avatar ${a.image ? 'has-image' : ''}" style="background-color:${a.color};">
                    ${a.image ? `<img src="${a.image}" alt="${a.name} 사진">` : a.name.charAt(0)}
                </div>
                <span class="artist-group-tag">${a.group}</span>
                <h3>${a.name}</h3>
                <p class="artist-role">${a.role}</p>
                <p class="artist-bio">${a.bio}</p>
            </div>
        `).join('');
    }

    function quickUploadArtistImage(id, input) {
        const file = input.files && input.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            alert('이미지 파일만 선택할 수 있습니다.');
            input.value = '';
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const item = artists.find(a => a.id === id);
            if (!item) return;
            item.image = e.target.result;
            saveData(STORAGE_KEYS.artists, artists);
            renderArtists();
        };
        reader.readAsDataURL(file);
    }

    function renderSchedule() {
        const list = document.getElementById('scheduleList');
        const sorted = [...schedule].sort((a, b) => a.date.localeCompare(b.date));
        list.innerHTML = sorted.map(s => `
            <div class="schedule-item">
                <div class="schedule-date">${formatDate(s.date)}</div>
                <div style="display:flex; align-items:center;">
                    <span class="schedule-type">${s.type}</span>
                    <div class="item-admin-controls">
                        <button class="icon-btn" onclick="openScheduleModal(${s.id})" title="수정">✎</button>
                        <button class="icon-btn danger" onclick="deleteItem('schedule', ${s.id})" title="삭제">✕</button>
                    </div>
                </div>
                <h4>${s.title}</h4>
                <p class="schedule-artist">${s.artist}</p>
            </div>
        `).join('');
    }

    function renderNews() {
        const list = document.getElementById('newsList');
        const sorted = [...news].sort((a, b) => b.date.localeCompare(a.date));
        const newest = sorted[0] ? sorted[0].id : null;
        list.innerHTML = sorted.map(n => `
            <div class="news-item" id="news-${n.id}">
                <div class="news-top" onclick="toggleNews(${n.id})" style="cursor:pointer;">
                    <div>
                        <span class="news-date">${formatDate(n.date)}</span>
                        <h4 style="display:inline;">　${n.title}${n.id === newest ? '<span class="news-badge-new">NEW</span>' : ''}</h4>
                    </div>
                    <div class="item-admin-controls" onclick="event.stopPropagation();">
                        <button class="icon-btn" onclick="openNewsModal(${n.id})" title="수정">✎</button>
                        <button class="icon-btn danger" onclick="deleteItem('news', ${n.id})" title="삭제">✕</button>
                    </div>
                </div>
                <div class="news-body">${n.content}</div>
                <div class="news-toggle-cue" onclick="toggleNews(${n.id})" style="cursor:pointer;">더 보기 ▾</div>
            </div>
        `).join('');
    }

    function toggleNews(id) {
        const el = document.getElementById('news-' + id);
        if (el) el.classList.toggle('open');
    }

    function renderAll() { renderArtists(); renderSchedule(); renderNews(); }

    function deleteItem(type, id) {
        if (!confirm('정말 삭제하시겠습니까?')) return;
        if (type === 'artists') { artists = artists.filter(i => i.id !== id); saveData(STORAGE_KEYS.artists, artists); renderArtists(); }
        if (type === 'schedule') { schedule = schedule.filter(i => i.id !== id); saveData(STORAGE_KEYS.schedule, schedule); renderSchedule(); }
        if (type === 'news') { news = news.filter(i => i.id !== id); saveData(STORAGE_KEYS.news, news); renderNews(); }
    }

    // ===================== 공용 폼 모달 =====================
    const formModal = document.getElementById('formModal');
    const formModalBody = document.getElementById('formModalBody');

    function closeFormModal() { formModal.classList.remove('open'); }

    function openArtistModal(id) {
        const item = artists.find(a => a.id === id) || { name: '', group: '', role: '', bio: '', color: AVATAR_COLORS[0], image: '' };
        pendingArtistImage = item.image || '';
        formModalBody.innerHTML = `
            <h3>${id ? '아티스트 수정' : '아티스트 추가'}</h3>
            <div class="field"><label>이름</label><input id="f-name" value="${item.name}" placeholder="예: 노바 (NOVA)"></div>
            <div class="field"><label>소속 그룹</label><input id="f-group" value="${item.group}" placeholder="예: STELLARIS"></div>
            <div class="field"><label>포지션</label><input id="f-role" value="${item.role}" placeholder="예: 리더 · 보컬"></div>
            <div class="field"><label>소개</label><textarea id="f-bio" placeholder="짧은 소개">${item.bio}</textarea></div>
            <div class="field">
                <label>아티스트 사진</label>
                <div class="image-upload-box">
                    <div class="image-preview" id="imagePreview">${item.image ? `<img src="${item.image}" alt="미리보기">` : '사진 없음'}</div>
                    <div class="image-upload-actions">
                        <label class="file-label" for="f-image">사진 선택</label>
                        <input class="file-input" type="file" id="f-image" accept="image/*" onchange="previewArtistImage(this)">
                        <button type="button" class="btn" onclick="removeArtistImage()">사진 제거</button>
                    </div>
                    <p class="image-note">JPG, PNG, WEBP 등의 이미지 파일을 선택할 수 있습니다. 사진은 이 브라우저의 저장공간에 보관됩니다.</p>
                </div>
            </div>
            <div class="field"><label>사진이 없을 때 사용할 색상</label>
                <div class="color-options">
                    ${AVATAR_COLORS.map(c => `<div class="color-dot ${c === item.color ? 'selected' : ''}" style="background:${c};" data-color="${c}" onclick="selectColor(this)"></div>`).join('')}
                </div>
            </div>
            <p class="modal-error" id="f-error"></p>
            <div class="modal-actions">
                <button class="btn" onclick="closeFormModal()">취소</button>
                <button class="btn primary" onclick="submitArtist(${id || 'null'})">저장</button>
            </div>
        `;
        formModal.classList.add('open');
    }

    let pendingArtistImage = '';

    function selectColor(el) {
        el.parentElement.querySelectorAll('.color-dot').forEach(d => d.classList.remove('selected'));
        el.classList.add('selected');
    }

    function previewArtistImage(input) {
        const file = input.files && input.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            document.getElementById('f-error').textContent = '이미지 파일만 선택할 수 있습니다.';
            input.value = '';
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            pendingArtistImage = e.target.result;
            const preview = document.getElementById('imagePreview');
            preview.innerHTML = `<img src="${pendingArtistImage}" alt="미리보기">`;
            document.getElementById('f-error').textContent = '';
        };
        reader.readAsDataURL(file);
    }

    function removeArtistImage() {
        pendingArtistImage = '';
        const input = document.getElementById('f-image');
        if (input) input.value = '';
        const preview = document.getElementById('imagePreview');
        if (preview) preview.innerHTML = '사진 없음';
    }

    function submitArtist(id) {
        const name = document.getElementById('f-name').value.trim();
        const group = document.getElementById('f-group').value.trim();
        const role = document.getElementById('f-role').value.trim();
        const bio = document.getElementById('f-bio').value.trim();
        const colorEl = formModalBody.querySelector('.color-dot.selected');
        const color = colorEl ? colorEl.dataset.color : AVATAR_COLORS[0];
        if (!name || !group || !role) { document.getElementById('f-error').textContent = '이름, 그룹, 포지션은 필수입니다.'; return; }
        if (id) {
            const item = artists.find(a => a.id === id);
            Object.assign(item, { name, group, role, bio, color, image: pendingArtistImage });
        } else {
            artists.push({ id: nextId(artists), name, group, role, bio, color, image: pendingArtistImage });
        }
        saveData(STORAGE_KEYS.artists, artists);
        renderArtists();
        pendingArtistImage = '';
        closeFormModal();
    }

    function openScheduleModal(id) {
        const item = schedule.find(s => s.id === id) || { date: '', title: '', artist: '', type: '쇼케이스' };
        formModalBody.innerHTML = `
            <h3>${id ? '일정 수정' : '일정 추가'}</h3>
            <div class="field"><label>날짜</label><input type="date" id="f-date" value="${item.date}"></div>
            <div class="field"><label>제목</label><input id="f-title" value="${item.title}" placeholder="예: STELLARIS 컴백 쇼케이스"></div>
            <div class="field"><label>아티스트 / 팀</label><input id="f-artist" value="${item.artist}" placeholder="예: STELLARIS"></div>
            <div class="field"><label>유형</label>
                <select id="f-type">
                    ${['쇼케이스','팬미팅','콘서트','방송','행사','기타'].map(t => `<option ${t === item.type ? 'selected' : ''}>${t}</option>`).join('')}
                </select>
            </div>
            <p class="modal-error" id="f-error"></p>
            <div class="modal-actions">
                <button class="btn" onclick="closeFormModal()">취소</button>
                <button class="btn primary" onclick="submitSchedule(${id || 'null'})">저장</button>
            </div>
        `;
        formModal.classList.add('open');
    }

    function submitSchedule(id) {
        const date = document.getElementById('f-date').value;
        const title = document.getElementById('f-title').value.trim();
        const artist = document.getElementById('f-artist').value.trim();
        const type = document.getElementById('f-type').value;
        if (!date || !title || !artist) { document.getElementById('f-error').textContent = '날짜, 제목, 아티스트는 필수입니다.'; return; }
        if (id) {
            const item = schedule.find(s => s.id === id);
            Object.assign(item, { date, title, artist, type });
        } else {
            schedule.push({ id: nextId(schedule), date, title, artist, type });
        }
        saveData(STORAGE_KEYS.schedule, schedule);
        renderSchedule();
        closeFormModal();
    }

    function openNewsModal(id) {
        const item = news.find(n => n.id === id) || { date: '', title: '', content: '' };
        formModalBody.innerHTML = `
            <h3>${id ? '소식 수정' : '소식 추가'}</h3>
            <div class="field"><label>날짜</label><input type="date" id="f-date" value="${item.date}"></div>
            <div class="field"><label>제목</label><input id="f-title" value="${item.title}" placeholder="공지 제목"></div>
            <div class="field"><label>내용</label><textarea id="f-content" placeholder="공지 내용">${item.content}</textarea></div>
            <p class="modal-error" id="f-error"></p>
            <div class="modal-actions">
                <button class="btn" onclick="closeFormModal()">취소</button>
                <button class="btn primary" onclick="submitNews(${id || 'null'})">저장</button>
            </div>
        `;
        formModal.classList.add('open');
    }

    function submitNews(id) {
        const date = document.getElementById('f-date').value;
        const title = document.getElementById('f-title').value.trim();
        const content = document.getElementById('f-content').value.trim();
        if (!date || !title) { document.getElementById('f-error').textContent = '날짜와 제목은 필수입니다.'; return; }
        if (id) {
            const item = news.find(n => n.id === id);
            Object.assign(item, { date, title, content });
        } else {
            news.push({ id: nextId(news), date, title, content });
        }
        saveData(STORAGE_KEYS.news, news);
        renderNews();
        closeFormModal();
    }

    document.getElementById('addArtistBtn').addEventListener('click', () => openArtistModal(null));
    document.getElementById('addScheduleBtn').addEventListener('click', () => openScheduleModal(null));
    document.getElementById('addNewsBtn').addEventListener('click', () => openNewsModal(null));
    formModal.addEventListener('click', (e) => { if (e.target === formModal) closeFormModal(); });

    // ===================== 관리자 모드 =====================
    const adminModal = document.getElementById('adminModal');
    const adminPwInput = document.getElementById('adminPwInput');
    const adminError = document.getElementById('adminError');

    function setAdminState(on) {
        document.body.classList.toggle('is-admin', on);
        if (on) sessionStorage.setItem('astra_admin', 'true');
        else sessionStorage.removeItem('astra_admin');
    }

    if (sessionStorage.getItem('astra_admin') === 'true') setAdminState(true);

    document.getElementById('adminEntry').addEventListener('click', () => {
        if (document.body.classList.contains('is-admin')) {
            if (confirm('관리자 모드를 종료할까요?')) setAdminState(false);
            return;
        }
        adminPwInput.value = '';
        adminError.textContent = '';
        adminModal.classList.add('open');
        setTimeout(() => adminPwInput.focus(), 50);
    });
    document.getElementById('adminCancelBtn').addEventListener('click', () => adminModal.classList.remove('open'));
    document.getElementById('adminSubmitBtn').addEventListener('click', submitAdminPw);
    adminPwInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') submitAdminPw(); });
    adminModal.addEventListener('click', (e) => { if (e.target === adminModal) adminModal.classList.remove('open'); });

    function submitAdminPw() {
        if (adminPwInput.value.trim() === ADMIN_PASSWORD) {
            setAdminState(true);
            adminModal.classList.remove('open');
        } else {
            adminError.textContent = '비밀번호가 올바르지 않습니다.';
        }
    }
    document.getElementById('adminExit').addEventListener('click', () => setAdminState(false));

    // ===================== 내비게이션 / 모바일 메뉴 =====================
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 40));

    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
    }));

    // ===================== 스크롤 리빌 =====================
    const revealEls = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('in-view'); });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));

    // ===================== 초기화 =====================
    buildStarfield();
    buildConstellation();
    renderAll();
