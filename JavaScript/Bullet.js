export class Bullet {
    
    constructor(x,y,mouseX,mouseY){
        this.width = 20;
        this.height = 20;

        this.x = x;
        this.y = y;

        this.color = 'red';

        // this.targetX = mouseX - window.innerWidth/2;
        // this.targetY = -1*(mouseY - window.innerHeight/2);
        // this.angle = (this.targetY)/(this.targetX);
        // this.sangsu = this.y - this.angle*this.x;

        // console.log(`X: ${this.x}, Y: ${this.y}`);
        // console.log(`X: ${this.sangsu}`);
        // console.log(`각: ${this.angle}`);
        
        this.speed = 10;

        this.targetX = (mouseX - window.innerWidth/2)*10;
        this.targetY = (mouseY - window.innerHeight/2)*10;
    }

    update(player) {

        // 방향 계산
        const dx = this.targetX;
        const dy = this.targetY;

        // 거리 계산
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