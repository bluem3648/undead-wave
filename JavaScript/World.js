export class World {
    constructor(width, height){
        //맵 크기
        this.width = width;
        this.height = height;  

        //맵의 디자인
        this.backgroundColor = '#2c3e50'; // 어두운 파란색 배경
        this.borderColor = 'white'; // 약간 더 밝은 파란색 테두리
        this.borderWidth = 10; // 테두리 두께
    }

    draw(ctx) {
        //맵의 '바탕' (월드 크기만큼)
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(0, 0, this.width, this.height);
        
        // 맵의 '테두리' (월드 가장자리)
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = this.borderWidth;

        // 테두리 두께 때문에 안쪽으로 살짝 그려지게 조정 
        const halfBorder = this.borderWidth / 2;
        ctx.strokeRect(halfBorder, halfBorder, 
                       this.width - this.borderWidth, 
                       this.height - this.borderWidth);
    }
}