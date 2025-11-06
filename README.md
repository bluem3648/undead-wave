
# Undead Wave

** 꼭 각자 개인 브랜치 파서 해주세요

## 게시판
10/31 박재현 - 플레이어 이동, 적 생성 및 플레이어한테 이동, 맵 구현 완료  
11/04 박재현 - 플레이어 좀비 충돌 함수, hp, 엔딩 화면 구현 (스코어 계산 아직 X)  
11/06 박기태 - 플레이어 경험치 및 레벨, 스탯 구현

## 주요 기능
- undead wave start : 게임 인트로 화면
- 플레이어: 중앙에서 시작하는 파란 사각형(50x50), WASD로 이동
- 좀비: 가장자리에서 스폰되어 플레이어를 따라옴
- 모듈 구조: `Player.js`, `Zombie.js`, `Game-Controll.js`

## 조작법
- W: 위로 이동
- A: 왼쪽으로 이동
- S: 아래로 이동
- D: 오른쪽으로 이동

## 파일 구조 (중요 파일)
- `undead-wave.html` - 게임을 로드하는 HTML
- `Base-Style.css` - 기본 스타일
- `JavaScript/Player.js` - 플레이어 클래스 (export)
- `JavaScript/Zombie.js` - 좀비 클래스 (export)
- `JavaScript/Game-Controll.js` - 게임 루프, 입력 처리 및 스폰 로직 (module)

## 향후 구현 아이디어
- 플레이어와 좀비 충돌 검사(체력/데미지)
- 무기 (공격)
- 스킬 
- 스탯 
- 좀비(러너, 뚱뚱이)
- 보스
- 보스를 잡았다면 난이도 up
- 보급
- 스코어  
- 게임오버
- 스프라이트 이미지/애니메이션 도입
- ui, ux






