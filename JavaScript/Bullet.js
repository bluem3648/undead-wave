export class Bullet {
    
    constructor(x,y){
        this.width = 20;
        this.height = 20;

        this.x = x;
        this.y = y;

        this.color = 'red';
    }

    update(player) {
        this.x = player.x +10;
        this.y = player.y +10;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    static spawnBullet(player, bullets) {

        let x = player.x +10;
        let y = player.y +10;

        const newBullet = new Bullet(x, y);

        bullets.push(newBullet);
    }


}