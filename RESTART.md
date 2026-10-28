# swea 세션 키퍼 — 새 PC·웹 작업 인계

작성: 2026-10-28 (Asia/Seoul).

저장소: https://github.com/qkrcjsdlr10/swea-session-keeper

받을 브랜치: `main`.

```powershell
git clone --branch main https://github.com/qkrcjsdlr10/swea-session-keeper.git
```

## 새 PC 설정

Git으로 받은 폴더를 Chrome의 확장 프로그램 관리 화면에서 개발자 모드 → 압축해제된 확장 프로그램 로드로 선택한다. 실행 소스는 `manifest.json`, `background.js`, `popup.*`이다. ZIP은 배포본이므로 작업할 때는 소스 폴더를 사용한다. 설치는 브라우저에서 사용자가 수행한다.

## Git에 없는 항목 복원

| 항목 | 복원 방법 |
| --- | --- |
| SWEA 로그인 쿠키 | 새 PC의 Chrome에서 SWEA에 직접 로그인. 쿠키를 Git이나 Markdown에 복사하지 않는다. |
| `chrome.storage`의 ON/OFF·간격·기록 | 확장 프로그램 팝업에서 다시 설정. 기록은 브라우저 프로필별 데이터다. |
| 확장 프로그램 로드 상태 | PC별로 소스 폴더를 다시 로드. API 키·`.env`·npm 설치는 필요하지 않다. |

정적 확인: Node.js가 있다면 `node --check background.js`, `node --check popup.js`. 실제 세션 유지 여부는 로그인한 브라우저에서 별도 확인한다. [README.txt](README.txt)를 읽는다.

## 대화와 코드 이어가기

- 이 저장소를 연결한 Cloud 작업은 웹에서 같은 작업을 다시 열어 이어간다. 로컬 채팅이 Git으로 이동하거나 기존 채팅이 Cloud로 자동 이전되는 것은 아니다.
- 작업 시작: `git status --short --branch`로 현재 변경과 브랜치를 확인한다. 다른 작업이 있으면 강제 초기화하지 않는다.
- 처음에는 `git clone` 후 아래 지정 브랜치로 전환한다. 다음부터 같은 브랜치에서 `git pull --ff-only`한다. 충돌·분기가 있으면 중단해 확인한다.
- 작업 종료: HANDOFF.md의 완료·미완료·실행한 검증·다음 명령을 갱신하고 검토한 소스만 commit/push한다. `.env`, 로그인 쿠키, 실제 키, 가상환경은 올리지 않는다.
- 새 로컬 Codex 대화의 첫 요청: “AGENTS.md가 있으면 먼저 읽고, RESTART.md와 HANDOFF.md를 읽어 현재 브랜치·실제 파일을 대조한 뒤 이어서 작업해 줘. 없는 설정은 예시에서 생성하되 기존 파일을 덮어쓰지 말고, 비밀 값은 출력하지 마.”
- Cloud 환경 생성/게시 여부, 패키지 설치 여부, 실제 서비스 동작은 각각 확인한다. 이 문서 파일의 존재만으로 등록·실행 성공을 주장하지 않는다.
