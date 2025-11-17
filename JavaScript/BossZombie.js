import { Zombie } from './Zombie.js';

export class BossZombie extends Zombie {
    
    constructor(x, y, hpMultiplier = 1.0, speedMultiplier = 1.0, damageMultiplier = 1.0) {
        // 부모 클래스 생성자 호출
        super(x, y, hpMultiplier, speedMultiplier, damageMultiplier);

        // 보스 스탯으로 덮어쓰기
 
        // 외형
        this.width = 100; 
        this.height = 100;
        this.color = 'purple'; 

        // 스탯
        this.speed = 1.5 * speedMultiplier;      
        this.hp = 30 * hpMultiplier;        
        this.currentHp = this.hp;
        this.damage = 2 * damageMultiplier; 
        this.expValue = 20; 

        // hp바 위치 정보
        this.hpPosL = this.x + 3;
        this.hpPosR = this.width - 3 * 2; // 더 넓은 HP 바
        this.hpBar = this.hpPosR; // HP바의 '최대 너비'를 갱신
    }

}