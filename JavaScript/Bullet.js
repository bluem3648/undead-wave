export class Bullet {
    
    constructor(x,y,mouseX,mouseY){
        this.width = 20;
        this.height = 20;

        this.x = x;
        this.y = y;

        this.color = 'red';

        this.targetX = mouseX;
        this.targetY = mouseY;
        this.angle = (mouseY - mouseY)/(this.x - this.y);
        
        this.speed = 5;
    }

    update(player) {
        // this.x = this.x + this.speed;
        // this.y = this.angle*(this.x-this.targetX)+this.targetY;

        // 방향 계산
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;

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

    static spawnBullet(mouseX, mouseY, bullets, player) {

        //총알 처음 생성 위치
        this.x = player.x +10;
        this.y = player.y +10;

        const newBullet = new Bullet(this.x, this.y, mouseX, mouseY);

        bullets.push(newBullet);
    }


}