ASTRA 공유형 웹사이트

중요:
이 버전은 localStorage가 아니라 서버의 data/site-data.json에 데이터를 저장합니다.
따라서 같은 서버 주소로 접속하는 모든 사람이 동일한 아티스트/일정/뉴스 수정 내용을 봅니다.

실행:
1. Node.js 18 이상 설치
2. 이 폴더에서 터미널 실행
3. npm install
4. npm start
5. 브라우저에서 http://localhost:3000 접속

관리자 비밀번호:
기본값: astra12309
실서비스에서는 환경변수 ADMIN_PASSWORD를 반드시 변경하세요.

주의:
index.html을 더블클릭(file://)해서 열면 공유 저장이 작동하지 않습니다.
반드시 Node.js 서버를 실행한 뒤 http://localhost:3000으로 접속해야 합니다.

배포할 때:
Node.js를 실행할 수 있는 호스팅에 이 폴더를 올리고 npm install / npm start를 실행하세요.
data/site-data.json 파일이 유지되는 서버/디스크가 필요합니다.
