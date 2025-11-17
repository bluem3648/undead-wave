import { Zombie } from './Zombie.js';
import { checkCollision } from './Utils.js'; 


export class EnemyManager {
    constructor(world) {
        this.world = world;
        this.zombies = []; // 일반 좀비 목록

        // 스폰 설정
        this.SPAWN_INTERVAL = 2000;
        this.lastSpawn = 0;
    }

    /**
     * @param {number} timestamp - 현재 시간
     */
    
    updateSpawning(timestamp) {
        
        //일반 좀비 스폰
        if (!this.lastSpawn) this.lastSpawn = timestamp;
        if (timestamp - this.lastSpawn >= this.SPAWN_INTERVAL) {
            Zombie.spawnZombie(this.world, this.zombies);
            this.lastSpawn = timestamp;
        }
    }

    /**
     * @param {Player} player - 플레이어 객체
     * @param {WeaponManager} weaponManager - 무기 관리자
     * @param {number} deltaTime - 프레임 간 시간 차이
     * @returns {object} - { playerDied: boolean, didLevelUp: boolean } 게임 상태 변경 여부
     */

    updateAndCollide(player, weaponManager, deltaTime) {
        let playerDied = false;
        let didLevelUp = false;

        // 일반 좀비 업데이트 및 충돌
        for (let i = this.zombies.length - 1; i >= 0; i--) {
            const zombie = this.zombies[i];
            
            zombie.update(player); 

            // 충돌 A: 플레이어 vs 좀비
            if (checkCollision(player, zombie)) {
                if (!player.isInvincible) player.takeDamage(1); // 원본 코드에서는 데미지 1 고정
                if (player.hp <= 0) playerDied = true;
            }

            // 충돌 B: 총알 vs 좀비
            for (const bullet of weaponManager.bullets) {
                if(checkCollision(bullet, zombie)) {
                    let damage = 0;
                    const shootMod = weaponManager.shootMod; // 현재 무기 모드
                    
                    if (shootMod === "pistol") damage = bullet.pistolDamage;
                    else if (shootMod === "shotgun") damage = bullet.shotgunDamage;
                    else if (shootMod === "rifle") damage = bullet.rifleDamage;

                    zombie.takeDamage(damage); 
                    
                    if (zombie.currentHp <= 0) {
                        // 좀비 사망 처리
                        const expGained = 1; 
                        const levelUp = player.getExp(expGained); // 경험치 획득
                        if (levelUp) didLevelUp = true; // 레벨업 발생
                        
                        player.score++; // 점수 획득
                        this.zombies.splice(i, 1); // 좀비 제거
                    }
                    
                    weaponManager.removeBullet(bullet); // 총알 제거
                    break; 
                }
            }     
            
            // 충돌 C: 폭탄 vs 좀비
            for (const bomb of weaponManager.bombs) {
                if(checkCollision(bomb, zombie)) {
                    zombie.takeDamage(bomb.damage); 
                    if (zombie.currentHp <= 0) {
                        // (폭탄에 죽었을 때도 경험치/점수 처리)
                        const expGained = 1; 
                        const levelUp = player.getExp(expGained);
                        if (levelUp) didLevelUp = true;
                        
                        player.score++;
                        this.zombies.splice(i, 1); // 좀비 제거
                        break; 
                    }
                }
            }
        }

        // 최종 결과 반환
        return { playerDied, didLevelUp };
    }

    draw(ctx) {
        this.zombies.forEach(zombie => zombie.draw(ctx));
    }
}