//------------기본 설정------------//
import { Player } from './Player.js';
import { Zombie } from './Zombie.js';
import { World } from './World.js';
import { Bullet } from './Bullet.js';

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
const world = new World(3000, 3000);



//------------게임 객체 생성------------//

// 플레이어 객체 생성
const player = new Player(world.width, world.height);

// 좀비 객체 생성(좀비는 여러 마리 -> 배열로 관리)
const zombies = [];

const bullets = [];

const SPAWN_INTERVAL = 2000;
let lastSpawn = 0;

let shootTime = 0; //총알 장전 시간 용


//------------키 설정------------//

// 키 상태 저장 객체
const keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    e: false, // 'E' 키를 임시 경험치 획득용으로 추가
    ㅁ: false,
    ㄴ: false,
    ㅇ: false,
    ㅈ: false  
};

document.addEventListener('keydown', function(event) {
    const key = event.key.toLowerCase();
    
    if (key in keys) {
        keys[key] = true;
    }

    // --- 'E' 키 입력 시 경험치 획득 로직 (테스트용) ---
    if (key === 'e' && currentState === GAME_STATE.PLAYING) {
        const TEMP_EXP_GAIN = 5; 
        const didLevelUp = player.getExp(TEMP_EXP_GAIN); 
        
        // 레벨업이 발생했으면 상태 전환
        if (didLevelUp) {
            currentState = GAME_STATE.UPGRADING;
            currentUpgradeOptions = player.getUpgradeOptions(3);
            calculateUpgradeOptionBounds(); // UPGRADING 상태 전환 직후 좌표 계산 및 저장
        }
    }
});

document.addEventListener('keyup', function(event) {
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




//------------충돌 판정 함수------------//
function checkCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

// --- UI 그리기 함수 ---
function drawUI(ctx) {
    // 플레이어 HP 표시 
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';

    // hp 텍스트 표시
    let hpText = `HP: ${player.hp}/${player.maxHp}`;
    if (player.defense >= 1) {  // 방어도 1 이상인 경우 텍스트 
        hpText += ` | DEF: ${player.defense}`;
    }
    ctx.fillText(hpText, 10, 30);

    // 경험치 바 표시
    const barWidth = 200;
    const barHeight = 20;
    const barX = 10;
    const barY = 50;
    
    // 현재 경험치 비율 계산
    const expRatio = player.exp / player.expToNextLevel;
    
    // 1. 경험치 바 배경 (검은색)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(barX, barY, barWidth, barHeight);

    // 2. 경험치 채워진 부분 (노란색/금색)
    ctx.fillStyle = 'gold';
    ctx.fillRect(barX, barY, barWidth * expRatio, barHeight);

    // 3. 경험치 바 테두리
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, barWidth, barHeight);

    // 4. 레벨 및 경험치 텍스트
    ctx.fillStyle = 'white';
    ctx.textAlign = 'left';
    ctx.font = '16px Arial';
    ctx.fillText(
        `Lv. ${player.level} - EXP: ${player.exp} / ${player.expToNextLevel}`, 
        barX + barWidth + 10, barY + 15
    );
}

// --- 게임 오버 화면 그리기 함수 ---
function drawGameOverScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = '50px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);

    ctx.font = '30px Arial';
    ctx.fillText(`Score: ${player.score}`, canvas.width / 2, canvas.height / 2 + 60);
    
    ctx.font = '20px Arial';
    ctx.fillText('Press F5 to Restart', canvas.width / 2, canvas.height / 2 + 100);
}

// --- 레벨업 선택지 그리기 함수 ---
function calculateUpgradeOptionBounds() {
    const boxWidth = 250;
    const boxHeight = 350;
    const padding = 30;
    
    // 세 개의 박스를 중앙에 배치하기 위한 계산
    const totalWidth = boxWidth * 3 + padding * 2;
    let startX = canvas.width / 2 - totalWidth / 2;
    const startY = canvas.height / 2 - boxHeight / 2;

    for (let i = 0; i < currentUpgradeOptions.length; i++) {
        const x = startX + i * (boxWidth + padding);
        const y = startY;
        
        // 좌표를 계산하여 옵션 객체에 bounds 속성을 미리 저장
        currentUpgradeOptions[i].bounds = { x: x, y: y, width: boxWidth, height: boxHeight };
    }
}

function drawUpgradeOptions(ctx) {
    // 반투명 오버레이
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.textAlign = 'center';
    ctx.fillStyle = 'yellow';
    ctx.font = '40px Arial';
    ctx.fillText('스킬 선택', canvas.width / 2, canvas.height / 2 - 200);

    const boxWidth = 250;
    const boxHeight = 350;
    const padding = 30;
    
    // 세 개의 박스를 중앙에 배치
    const totalWidth = boxWidth * 3 + padding * 2;
    let startX = canvas.width / 2 - totalWidth / 2;
    const startY = canvas.height / 2 - boxHeight / 2;

    for (let i = 0; i < currentUpgradeOptions.length; i++) {
        const option = currentUpgradeOptions[i];
        const x = startX + i * (boxWidth + padding);
        const y = startY;

        // 박스 그리기
        ctx.fillStyle = '#34495e'; // 어두운 색
        ctx.fillRect(x, y, boxWidth, boxHeight);
        ctx.strokeStyle = 'gold';
        ctx.lineWidth = 5;
        ctx.strokeRect(x, y, boxWidth, boxHeight);

        // 제목
        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.fillText(option.name, x + boxWidth / 2, y + 40);

        // 설명
        ctx.font = '18px Arial';
        ctx.fillStyle = '#bdc3c7';
        ctx.fillText(option.description, x + boxWidth / 2, y + 100);
    }
}

//------------게임 루프------------//
// 게임 함수
function update(timestamp) {

    const deltaTime = timestamp - lastFrameTime;
    lastFrameTime = timestamp;

    if (currentState === GAME_STATE.GAMEOVER) {
        drawGameOverScreen();
        return;
    }

    // 레벨업으로 인한 스텟 선택 중일 시 멈춤
    if (currentState === GAME_STATE.UPGRADING) {
        clearCanvas();
        
        // 카메라 변환 적용 (맵이 배경으로 보이도록)
        ctx.save();

        // 카메라 위치 계산 및 적용
        let cameraX = -player.x + canvas.width / 2;
        let cameraY = -player.y + canvas.height / 2;
        cameraX = Math.min(cameraX, 0);
        cameraY = Math.max(cameraY, canvas.height - world.height);
        ctx.translate(cameraX, cameraY);
        world.draw(ctx); // 배경으로 월드 그리기
        
        // 객체 업데이트 없이 그리기만
        player.draw(ctx);
        zombies.forEach(z => z.draw(ctx));

        ctx.restore(); // 카메라 변환 해제

        drawUI(ctx);
        drawUpgradeOptions(ctx); // 선택지 UI 그리기
        
        requestAnimationFrame(update); // 프레임 반복은 유지
        return; // 상호작용 로직 스킵
    }

    clearCanvas();

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

    world.draw(ctx);

    // 스폰 처리
    if (!lastSpawn) lastSpawn = timestamp;
    if (timestamp - lastSpawn >= SPAWN_INTERVAL) {
            Zombie.spawnZombie(world, zombies);
            lastSpawn = timestamp;
    }

    // 플레이어 위치 업데이트
    player.update(keys, world, deltaTime);
    player.draw(ctx);





    //총알 소환
    if (!shootTime) shootTime = timestamp;
    if ((timestamp - shootTime) >= 500){
        Bullet.spawnBullet(mouseX, mouseY, bullets, player);
        shootTime = timestamp;
    }

    //총알 업데이트
    for(let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        bullet.update(player);
        bullet.draw(ctx);
    }



    

    // 좀비 위치 업데이트 및 그리기
    for(let i = zombies.length - 1; i >= 0; i--) {
        const zombie = zombies[i];
        zombie.update(player);
        zombie.draw(ctx);

        if(checkCollision(player, zombie)) {
            /* 좀비 처치 시 경험치 획득 함수 (좀비 사망 로직이 없으므로 임시 주석 처리)
            if (isDead) {
                // 좀비 처치 시 경험치 획득 및 레벨업 체크
                const didLevelUp = player.getExp(zombie.expValue); 

                if (didLevelUp) {
                    currentState = GAME_STATE.UPGRADING;
                    currentUpgradeOptions = player.getUpgradeOptions(3);
                }

                player.score++;
                zombies.splice(i, 1);
                continue;
            }
            */

            if(!player.isInvincible) player.takeDamage(1);

            if(player.hp <= 0) {
                currentState = GAME_STATE.GAMEOVER;
            }
        }
    }

    //카메라 변환 해제
    ctx.restore();

    drawUI(ctx);

    // 다음 프레임 요청
    if(currentState !== GAME_STATE.GAMEOVER){
        requestAnimationFrame(update);
    }
    else {
        drawGameOverScreen();
    }
}

// 캔버스 초기화
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}


// 게임 루프 시작
if(currentState !== GAME_STATE.GAMEOVER) {
    requestAnimationFrame(update);
}