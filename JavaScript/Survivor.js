export class Survivor {
    constructor(x, y) {
        // 크기
        this.width = 50;
        this.height = 50;
        this.color = 'green';

        // 스폰 위치
        this.x = x;
        this.y = y;

        this.gaze = 0;
        this.gazeRatio = 0;
    }


    update(player, deltaTime, zombies){
        // 스폰 시간
    }



    draw(ctx) {

        console.log("시민 스폰" + this.x, this.y);

        // 히트박스 (확인용이라 주석 처리)
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        if (this.gaze<=100) 
            this.gazeRatio = this.width * this.gaze / 100; 

        //게이지 그리기
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y-20, this.gazeRatio, 10);

        ctx.strokeStyle = 'black'; // 테두리
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y-20, this.width, 10);
        
        // const img = new Image();
        // img.src =  "resource/weapon_image/parts.png";
        // ctx.drawImage(img, this.x-13, this.y-14, this.width+25, this.height+25);

    }



    


    
}