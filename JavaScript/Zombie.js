export class Zombie {
    constructor(x, y) {
        // 좀비 크기
        this.width = 40;
        this.height = 40;
        this.color = 'green';

        // 스폰 위치
        this.x = x;
        this.y = y;

        // 좀비 스테이터스
        this.speed = 2;
        this.hp = 3;
        this.currentHp = this.hp;

        // hp바 위치 정보
        this.hpPosL = this.x+3;
        this.hpPosR = this.width-3*2;
        this.hpBar = this.hpPosR;
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
        // 좀비 몸체 그리기
        // ctx.fillStyle = this.color;
        // ctx.fillRect(this.x, this.y, this.width, this.height);
        const img = new Image();
        img.src = "undead%20wave%20start/zombie.png";
        ctx.drawImage(img, this.x-10, this.y-10, this.width+25, this.height+25);

        // 좀비 체력바 그리기
        this.hpPosL = this.x+3;
        this.hpPosR = this.hpBar/this.hp*this.currentHp;
        ctx.fillStyle = 'red';
        ctx.fillRect(this.hpPosL, this.y-15, this.hpPosR, 3);
    }


    // 좀비 데미지 받기
    takeDamage(amount) {
        this.currentHp -= amount;
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