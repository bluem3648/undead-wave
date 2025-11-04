// export 클래스를 다른 파일에서 쓸 수 있도록 함
export class Player{
    // 생성자
    constructor(worldWidth, worldHeight){ 
        // 플레이어 크기
        this.width = 50; 
        this.height = 50;
        this.color = 'blue';

        // 월드 중앙에 플레이어 위치시키기
        this.setInitialPosition(worldWidth, worldHeight);

        //플레이어 스테이터스
        this.speed = 5;
        this.maxHp = 4;
        this.hp = this.maxHp;

        // 무적 상태 관련 변수
        this.isInvincible = false; // 무적 상태 여부(피격 받았을 때)
        this.invincibilityDuration = 1000; // 무적 지속 시간(1초)
        this.invincibilityTimer = 0; // 무적 타이머

        // 스코어
        this.score = 0;
    }

    setInitialPosition(worldWidth, worldHeight) {
        this.x = worldWidth / 2 - this.width / 2;
        this.y = worldHeight / 2 - this.height / 2;
    }

    // update 플레이어 위치
    update(keys, world, deltaTime) {
        if(keys.w) this.y -= this.speed; //위
        if(keys.s) this.y += this.speed; //아래
        if(keys.a) this.x -= this.speed; //왼쪽
        if(keys.d) this.x += this.speed; //오른쪽

        // 0보다 왼쪽/위로 못 가게
        this.x = Math.max(0, this.x); 
        this.y = Math.max(0, this.y);

        // 월드 오른쪽/아래쪽 경계를 못 넘게
        this.x = Math.min(world.width - this.width, this.x); 
        this.y = Math.min(world.height - this.height, this.y);

        if(this.isInvincible){
            this.invincibilityTimer += deltaTime;
            if(this.invincibilityTimer >= this.invincibilityDuration){
                this.isInvincible = false;
                this.invincibilityTimer = 0;
            }
        }
    }

    // draw 플레이어 그리기
    draw(ctx) {
        if (this.isInvincible && Math.floor(this.invincibilityTimer / 100) % 2 === 0) {
            // 무적일 때 잠깐 안 보이게 (깜빡임 효과)
            return; 
        }

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    // 데미지 입는 함수
    takeDamage(amount) {
        if(!this.isInvincible){
            this.hp -= amount;
            this.isInvincible = true;
            this.invincibilityTimer = 0;
        }
    }

}