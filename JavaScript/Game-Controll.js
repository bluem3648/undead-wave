//------------기본 설정------------//
import { Player } from './Player.js';;
import { World } from './World.js';
import { drawUI, drawGameOverScreen, drawUpgradeOptions, calculateUpgradeOptionBounds, statUI } from './Ui.js';
import { EnemyManager } from './EnemyManager.js';
import { WeaponManager } from './WeaponManager.js';
import { Parts } from './Parts.js';
import { PartsManager } from './PartsManager.js';
import { SurvivorManager } from './SurvivorManager.js';

const canvas = document.getElementById('GameCanvas');
const ctx = canvas.getContext('2d'); 

//게임 상태
let lastFrameTime = 0; // 마지막 프레임 시간(deltaTime 계산용)
const GAME_STATE = {
    PLAYING: 'playing',
    UPGRADING: 'upgrading', // 레벨업 선택 중
    GAMEOVER: 'gameover'
};
let currentState = GAME_STATE.PLAYING;
let currentUpgradeOptions = []; // 레벨업 시 보여줄 3가지 선택지

// 캔버스 크기 설정 함수
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

// 창 크기 변경 시 캔버스 크기 조정
window.addEventListener('resize', resizeCanvas);

//맵
const world = new World(5000, 5000);



//------------게임 객체 생성------------//

const player = new Player(world.width, world.height);
const enemyManager = new EnemyManager(world);
const weaponManager = new WeaponManager(player);
const partsManager = new PartsManager();
const survivorManager = new SurvivorManager();




//------------이미지 로드------------//
const zombieImg = [
    "resource/zombie_image/zombieRight.png",
     "resource/zombie_image/zombieLeft.png"
]

const bulletImg = [
    "",
    "resource/bullet_image/bullet1.png",
    "resource/bullet_image/bullet2.png",
    "resource/bullet_image/bullet3.png",
    "resource/bullet_image/bullet4.png",
    "resource/bullet_image/bullet5.png",
    "resource/bullet_image/bullet6.png",
    "resource/bullet_image/bullet7.png",
    "resource/bullet_image/bullet8.png"
]

const worldImg = "undead%20wave%20start/demo2_12.png"




//------------키 설정------------//

// 키 상태 저장 객체
const keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    ㅁ: false,
    ㄴ: false,
    ㅇ: false,
    ㅈ: false
};

let isSpace = false;

document.addEventListener('keydown', function(event) {
    const key = event.key.toLowerCase();
    
    // 총 모드 전환
    if (key == "1") weaponManager.setWeapon("pistol");
    if (key == "2") 
        if (partsManager.num>=20) 
            weaponManager.setWeapon("shotgun");
    if (key == "3") 
        if (partsManager.num>=50)
            weaponManager.setWeapon("rifle");
    if (key == "4") 
        if (partsManager.num>=100)
            weaponManager.setWeapon("bomb");

    // 스탯창 띄우기
    if (key === ' ' || key === 'space')
        isSpace = !(isSpace);

    // 스킬 사용
    if (event.key === 'Shift') {
        player.startRoll();
    }
    if (event.key === 'e') {
        weaponManager.castRay(Date.now());
    }
    if (event.key === 'q') {
        if (player.startbackstep()) weaponManager.castCone();
    }

    if (key in keys) {
        keys[key] = true;
    }
});

document.addEventListener('keyup', function(event) {
    const key = event.key.toLowerCase();
    if (event.key in keys) {
        keys[event.key] = false;
    }
});

// --- 마우스 클릭 이벤트 리스너 추가 (레벨업 선택지 처리) ---
document.addEventListener('click', function(event) {
    if (currentState === GAME_STATE.UPGRADING) {
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        for (const option of currentUpgradeOptions) {

            if (!option.bounds) continue

            const bounds = option.bounds;
            // 박스 내 클릭인지 확인
            if (mouseX >= bounds.x && mouseX <= bounds.x + bounds.width &&
                mouseY >= bounds.y && mouseY <= bounds.y + bounds.height) {
                
                // 스탯 적용
                player.applyUpgrade(option); 
                
                // 게임 상태를 PLAYING으로 복귀
                currentState = GAME_STATE.PLAYING;
                currentUpgradeOptions = [];
                
                break; // 선택했으므로 반복문 종료
            }
        }
    }
});

//------------마우스 위치 값------------//
let mouseX=0;
let mouseY=0;

document.addEventListener('mousemove', function(event) {
  mouseX = event.clientX;
  mouseY = event.clientY;
});


//------------게임 루프------------//
// 게임 함수
function update(timestamp) {

    if (!lastFrameTime) lastFrameTime = timestamp;
    const deltaTime = timestamp - lastFrameTime;
    lastFrameTime = timestamp;

    if (currentState === GAME_STATE.GAMEOVER) {
        drawGameOverScreen(ctx, canvas, player.score);
        return;
    }

    // 레벨업으로 인한 스텟 선택 중일 시 멈춤
    if (currentState === GAME_STATE.UPGRADING) {
        clearCanvas();
        drawPausedGame(ctx); // 배경(맵, 플레이어, 적) 그리기 (헬퍼 함수)
        drawUI(ctx, player, weaponManager.shootMod); // UI 그리기 (UI.js 호출)
        drawUpgradeOptions(ctx, canvas, currentUpgradeOptions); // 선택지 그리기 (UI.js 호출)
        requestAnimationFrame(update); // 다음 그리기 요청
        return; 
    }

     // 시민 소환 로직
    if(survivorManager.isSpawn == false)
        if (survivorManager.newSurvivor == null) 
            survivorManager.spawnSurvivor(player);



    // 일반 플레이 상태 업데이트
    clearCanvas();

    // 플레이어, 적 스폰, 무기 업데이트
    player.update(keys, world, deltaTime, timestamp);
    enemyManager.updateSpawning(timestamp);
    weaponManager.update(timestamp, mouseX, mouseY, world);
    partsManager.updateAndCollide(player);
    survivorManager.updateAndCollide(player)

    //충돌 처리 로직
    const collisionResults = enemyManager.updateAndCollide(player, weaponManager, deltaTime, partsManager, timestamp);
    
    if (collisionResults.playerDied) {
        currentState = GAME_STATE.GAMEOVER;
    }
    if (collisionResults.didLevelUp) {
        currentState = GAME_STATE.UPGRADING;
        currentUpgradeOptions = player.getUpgradeOptions(3);
        calculateUpgradeOptionBounds(canvas, currentUpgradeOptions);
    }

    // 카메라 효과 및 맵 그리기
    // 카메라 위치 계산
    let cameraX = -player.x + canvas.width / 2;
    let cameraY = -player.y + canvas.height / 2;

    // 카메라가 월드 경계를 넘지 않도록 제한
    cameraX = Math.min(cameraX, 0);
    cameraY = Math.min(cameraY, 0);
    cameraX = Math.max(cameraX, canvas.width - world.width);
    cameraY = Math.max(cameraY, canvas.height - world.height);

    // 카메라 변환 적용
    ctx.save();
    ctx.translate(cameraX, cameraY);

    // 그리기
    world.draw(ctx, worldImg);
    world.drawFence(ctx, player);
    player.draw(ctx, keys); 
    enemyManager.draw(ctx, player, zombieImg);
    weaponManager.draw(ctx, bulletImg);
    partsManager.draw(ctx);
    survivorManager.drawSuvivor(ctx);
    survivorManager.drawImage(ctx, deltaTime);


    //카메라 변환 해제
    ctx.restore();

    drawUI(ctx, player, weaponManager.shootMod, partsManager.num);
    statUI(isSpace, ctx, player);

    requestAnimationFrame(update);
}

// 일시정지 상태에서의 그리기 함수
function drawPausedGame(ctx) {
    // (update 루프의 카메라 로직과 동일)
    let cameraX = -player.x + canvas.width / 2;
    let cameraY = -player.y + canvas.height / 2;
    cameraX = Math.min(cameraX, 0);
    cameraY = Math.min(cameraY, 0);
    cameraX = Math.max(cameraX, canvas.width - world.width);
    cameraY = Math.max(cameraY, canvas.height - world.height);
    
    ctx.save();
    ctx.translate(cameraX, cameraY);
    // (업데이트 없이 그리기만 호출)
    world.draw(ctx, worldImg);
    player.draw(ctx, keys);
    enemyManager.draw(ctx, player, zombieImg);
    weaponManager.draw(ctx, bulletImg);
    ctx.restore();
}

// 캔버스 초기화
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}


// 게임 루프 시작
if(currentState !== GAME_STATE.GAMEOVER) {
    requestAnimationFrame(update);
}