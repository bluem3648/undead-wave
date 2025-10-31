export class Zombie {
    constructor(x, y) {
        // 좀비 크기
        this.width = 40;
        this.height = 40;
        this.color = 'green';
        this.speed = 2;

        // 스폰 위치
        this.x = x;
        this.y = y;
    }

    // 좀비 위치 업데이트(플레이어를 따라다녀야함)
    update(player){
        // 방향 계산
        const dx = player.x - this.x;
        const dy = player.y - this.y;

        // 거리 계산(sqrt는 제곱근 , 피타고라스 정리를 이용하여 대각선 거리 구함)
        const distance = Math.sqrt(dx * dx + dy * dy);

        if(distance > 0){ 
            // 방향 / 거리 * 속도 (해당 방향으로 속도만큼 이동)
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    static spawnZombie(world, zombies) {
        let x, y;

        // 50% 확률로 좌우에서 스폰, 50% 확률로 상하에서 스폰
        if (Math.random() < 0.5) {
            x = Math.random() * world.width; 
            y = Math.random() < 0.5 ? -30 : world.height + 30; 
        } else {
            x = Math.random() < 0.5 ? -30 : world.width + 30; 
            y = Math.random() * world.height; 
        }

        const newZombie = new Zombie(x, y);

        zombies.push(newZombie);
    }
}