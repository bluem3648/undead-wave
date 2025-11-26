import { Survivor } from "./Survivor.js";
import { checkCollision } from './Utils.js'; 

export class SurvivorManager {

    constructor() {
        this.newSurvivor;
        this.isSpawn = false;
    }



    updateAndCollide(player) {
    
        // 플레이어랑 충돌 시 
        if (this.newSurvivor != null) {
            if(checkCollision(player, this.newSurvivor)) {
                this.newSurvivor.gaze += 0.7;
                if (this.newSurvivor.gaze >= 100) {
                    this.deleteSurvivor();
                }
                    
                
            }
        }
        
        
    }


    spawnSurvivor(player) {
            
        let x, y;
        
        do {

            // 대충 플레이어와 먼 곳에 소환
            if (Math.random() < 0.5) x = player.x + 1000;
            else x = player.x - 1000;
            if (Math.random() < 0.5) y = player.y + 1000;
            else y = player.y - 1000;

        } while ((x<700) || (x>4000) || (y<700) || (y>4000)) //월드 범위 내에 소환될 때까지 반복
        
        this.isSpawn = true;
        this.newSurvivor = new Survivor(x, y);
    }


    deleteSurvivor() {
        this.newSurvivor = null;
        this.isSpawn = false;
    }

    drawSuvivor(ctx) {
        if (this.newSurvivor != null)
            this.newSurvivor.draw(ctx);
    }

}