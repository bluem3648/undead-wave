// export 클래스를 다른 파일에서 쓸 수 있도록 함
export class Player{
    // 생성자
    constructor(worldWidth, worldHeight){ 
        // 플레이어 크기
        this.width = 50; 
        this.height = 50;
        this.color = 'blue';
        this.speed = 5;

        // 월드 중앙에 플레이어 위치시키기
        this.setInitialPosition(worldWidth, worldHeight);
    }

    setInitialPosition(worldWidth, worldHeight) {
        this.x = worldWidth / 2 - this.width / 2;
        this.y = worldHeight / 2 - this.height / 2;
    }

    // update 플레이어 위치
    update(keys, world) {
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
    }

    // draw 플레이어 그리기
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

}