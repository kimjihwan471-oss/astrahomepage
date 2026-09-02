const express = require('express');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'astra12309';

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'site-data.json');
fs.mkdirSync(DATA_DIR, { recursive: true });

const DEFAULT_DATA = {
  artists: [
    { id: 1, name: '노바 (NOVA)', group: 'STELLARIS', role: '리더 · 보컬', bio: '무대 위에서 가장 먼저 빛나는 별.', color: '#d4af7a', image: '' },
    { id: 2, name: '루나 (LUNA)', group: 'STELLARIS', role: '메인 댄서', bio: '섬세한 몸짓으로 이야기를 그린다.', color: '#8fb8de', image: '' },
    { id: 3, name: '카이 (KAI)', group: 'ORION BOYS', role: '래퍼 · 프로듀서', bio: '밤하늘의 리듬을 만드는 사람.', color: '#9b90d6', image: '' },
    { id: 4, name: '세라 (SERA)', group: 'SOLO', role: '솔로 아티스트', bio: '혼자서도 은하를 채우는 목소리.', color: '#7ddbde', image: '' }
  ],

  schedule: [
    { id: 1, date: '2026-09-05', title: 'STELLARIS 정규 2집 컴백 쇼케이스', artist: 'STELLARIS', type: '쇼케이스' },
    { id: 2, date: '2026-09-12', title: 'ORION BOYS 팬미팅', artist: 'ORION BOYS', type: '팬미팅' },
    { id: 3, date: '2026-09-20', title: 'SERA 단독 콘서트 〈Nightfall〉', artist: 'SERA', type: '콘서트' },
    { id: 4, date: '2026-10-02', title: 'ASTRA 신인 아티스트 쇼케이스', artist: 'ASTRA', type: '행사' }
  ],

  news: [
    {
      id: 1,
      date: '2026-08-25',
      title: 'ASTRA ENTERTAINMENT, 신인 개발 프로젝트 공식 발표',
      content: 'ASTRA ENTERTAINMENT가 차세대 아티스트 발굴을 위한 신인 개발 프로젝트를 새롭게 시작합니다. 오디션 일정은 추후 공식 채널을 통해 안내됩니다.'
    },
    {
      id: 2,
      date: '2026-08-10',
      title: 'STELLARIS, 첫 번째 월드투어 확정',
      content: 'STELLARIS의 첫 월드투어가 2026년 하반기 아시아 지역을 시작으로 확정되었습니다. 자세한 일정은 SCHEDULE 페이지에서 확인하실 수 있습니다.'
    },
    {
      id: 3,
      date: '2026-07-28',
      title: 'ORION BOYS 신곡 뮤직비디오 공개',
      content: 'ORION BOYS의 새로운 싱글과 뮤직비디오가 공개되었습니다. 많은 관심과 사랑 부탁드립니다.'
    }
  ]
};

function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_DATA, null, 2), 'utf8');
  }

  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
}

function saveData(data) {
  const temp = DATA_FILE + '.tmp';
  fs.writeFileSync(temp, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(temp, DATA_FILE);
}

const sessions = new Map();

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';

  if (!token || !sessions.has(token)) {
    return res.status(401).json({
      error: '관리자 인증이 필요합니다.'
    });
  }

  next();
}

app.use(express.json({ limit: '20mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/data', (req, res) => {
  res.json(loadData());
});

app.post('/api/login', (req, res) => {
  if (!req.body || req.body.password !== ADMIN_PASSWORD) {
    return res.status(401).json({
      error: '비밀번호가 올바르지 않습니다.'
    });
  }

  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, Date.now());

  res.json({ token });
});

app.put('/api/:type', auth, (req, res) => {
  const allowed = ['artists', 'schedule', 'news'];
  const { type } = req.params;

  if (!allowed.includes(type) || !Array.isArray(req.body)) {
    return res.status(400).json({
      error: '잘못된 데이터입니다.'
    });
  }

  const data = loadData();
  data[type] = req.body;

  saveData(data);

  res.json({
    ok: true,
    data
  });
});

app.delete('/api/:type/:id', auth, (req, res) => {
  const allowed = ['artists', 'schedule', 'news'];
  const { type } = req.params;

  if (!allowed.includes(type)) {
    return res.status(400).json({
      error: '잘못된 요청입니다.'
    });
  }

  const id = Number(req.params.id);
  const data = loadData();

  data[type] = data[type].filter(item => item.id !== id);

  saveData(data);

  res.json({
    ok: true,
    data
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`ASTRA server running: http://localhost:${PORT}`);
});