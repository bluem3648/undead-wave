//------------기본 설정------------//
import { Player } from './Player.js';
import { Zombie } from './Zombie.js';
import { World } from './World.js';

const canvas = document.getElementById('GameCanvas');
const ctx = canvas.getContext('2d'); 



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




//------------게임 루프------------//
// 게임 함수
function update(timestamp) {
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
    player.update(keys, world);
    // 플레이어 그리기
    player.draw(ctx);

    // 좀비 위치 업데이트 및 그리기
    zombies.forEach(zombie => {
        zombie.update(player);
        zombie.draw(ctx);
    });

    ctx.restore();

    // 다음 프레임 요청
    requestAnimationFrame(update);
}

// 캔버스 초기화
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}


// 게임 루프 시작
requestAnimationFrame(update);