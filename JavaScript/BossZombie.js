import { Zombie } from './Zombie.js';

export class BossZombie extends Zombie {
    
    constructor(x, y) {
        // 부모 클래스 생성자 호출
        super(x, y);

        // 보스 스탯으로 덮어쓰기

        // 외형
        this.width = 100; 
        this.height = 100;
        this.color = 'purple'; 

        // 스탯
        this.speed = 1.5;      
        this.hp = 10;        
        this.currentHp = this.hp;
        this.damage = 2; 
        this.expValue = 20; 

        // hp바 위치 정보
        this.hpPosL = this.x + 3;
        this.hpPosR = this.width - 3 * 2; // 더 넓은 HP 바
        this.hpBar = this.hpPosR; // HP바의 '최대 너비'를 갱신
    }

}