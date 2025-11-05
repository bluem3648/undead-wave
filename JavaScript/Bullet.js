export class Bullet {
    
    constructor(x,y){
        this.width = 1;
        this.height = 1;

        this.x = x;
        this.y = y;

        his.color = 'blue';
    }

    update(player) {
        this.x = player.x +10;
        this.y = player.y +10;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    static spawnBullet() {

        const newBullet = new Bullet(x, y);

        bullets.push(newBullet);
    }


}