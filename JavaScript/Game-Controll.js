//------------기본 설정------------//
import { Player } from './Player.js';
import { Zombie } from './Zombie.js';
import { World } from './World.js';
import { Bullet } from './Bullet.js';

const canvas = document.getElementById('GameCanvas');
const ctx = canvas.getContext('2d'); 

//게임 상태
let isGameOver = false;
let lastFrameTime = 0; // 마지막 프레임 시간(deltaTime 계산용)

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

let tempTime = 0;

const SPAWN_INTERVAL = 2000;
let lastSpawn = 0;


//------------키 설정------------//

// 키 상태 저장 객체
const keys = {
    w: false,
    a: false,
    s: false,
    d: false  
};

document.addEventListener('keydown', function(event) {
    if (event.key in keys) {
        keys[event.key] = true;
    }
});

document.addEventListener('keyup', function(event) {
    if (event.key in keys) {
        keys[event.key] = false;
    }
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
    ctx.fillText(`HP: ${player.hp}/${player.maxHp}`, 10, 30);
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

//------------게임 루프------------//
// 게임 함수
function update(timestamp) {

    const deltaTime = timestamp - lastFrameTime;
    lastFrameTime = timestamp;

    if (isGameOver) {
        drawGameOverScreen();
        return;
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





    //총
    console.log('로그');
    if (!tempTime) tempTime = timestamp;
    if ((timestamp - tempTime) >= 100){
        Bullet.spawnBullet(player, bullets);
        tempTime = timestamp;
        console.log('로그');
    }

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
            if(!player.isInvincible) player.takeDamage(1);

            if(player.hp <= 0) {
                isGameOver = true;
            }
        }
    }

    //카메라 변환 해제
    ctx.restore();

    drawUI(ctx);

    // 다음 프레임 요청
    if(!isGameOver){
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
if(!isGameOver) {
    requestAnimationFrame(update);
}