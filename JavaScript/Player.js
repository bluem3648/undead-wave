// export 클래스를 다른 파일에서 쓸 수 있도록 함
export class Player{
    // 생성자
    constructor(worldWidth, worldHeight){ 
        // 플레이어 크기
        this.width = 50; 
        this.height = 50;
        this.color = 'blue';

        // 월드 중앙에 플레이어 위치시키기
        this.setInitialPosition(worldWidth, worldHeight);

        //플레이어 스테이터스
        this.speed = 2;
        this.maxHp = 4;
        this.hp = this.maxHp;
        this.defense = 0;

        // 무적 상태 관련 변수
        this.isInvincible = false; // 무적 상태 여부(피격 받았을 때)
        this.invincibilityDuration = 1000; // 무적 지속 시간(1초)
        this.invincibilityTimer = 0; // 무적 타이머

        // 경험치 및 레벨
        this.level = 1; // 현재 레벨
        this.exp = 0;   // 현재 경험치
        this.expToNextLevel = 10; // 다음 레벨에 필요한 경험치

        // 스코어
        this.score = 0;
    }

    setInitialPosition(worldWidth, worldHeight) {
        this.x = worldWidth / 2 - this.width / 2;
        this.y = worldHeight / 2 - this.height / 2;
    }

    // update 플레이어 위치
    update(keys, world, deltaTime) {
        if(keys.w) this.y -= this.speed; //위
        if(keys.s) this.y += this.speed; //아래
        if(keys.a) this.x -= this.speed; //왼쪽
        if(keys.d) this.x += this.speed; //오른쪽
        if(keys.ㅈ) this.y -= this.speed; //위
        if(keys.ㄴ) this.y += this.speed; //아래
        if(keys.ㅁ) this.x -= this.speed; //왼쪽
        if(keys.ㅇ) this.x += this.speed; //오른쪽

        // 0보다 왼쪽/위로 못 가게
        this.x = Math.max(0, this.x); 
        this.y = Math.max(0, this.y);

        // 월드 오른쪽/아래쪽 경계를 못 넘게
        this.x = Math.min(world.width - this.width, this.x); 
        this.y = Math.min(world.height - this.height, this.y);

        if(this.isInvincible){
            this.invincibilityTimer += deltaTime;
            if(this.invincibilityTimer >= this.invincibilityDuration){
                this.isInvincible = false;
                this.invincibilityTimer = 0;
            }
        }
    }

    // draw 플레이어 그리기
    draw(ctx, keys) {

        if (keys.d || keys.ㅇ) this.key = "d"
        if (keys.a || keys.ㅁ) this.key = "a"
        const img = new Image();

        //플레이어 캐릭터가 이동 방향 바라보게
        if (this.key == "d") img.src = "resource/player_image/idleRight.gif";
        else if (this.key == "a") img.src = "resource/player_image/idleLeft.png";
        else img.src = "resource/player_image/idleRight.gif";

        if (this.isInvincible) {
            img.src = "resource/player_image/hurt.gif";

            // 무적일 때 잠깐 안 보이게 (깜빡임 효과)
            if (Math.floor(this.ianvincibilityTimer / 100) % 2 === 0)
                return;     
        }

        // 히트박스 크기 (확인용이라 주석처리)
        // ctx.fillStyle = this.color;
        // ctx.fillRect(this.x, this.y, this.width, this.height);
            
        // 캐릭터 이미지 그리기
        if (this.key == "d") ctx.drawImage(img, this.x, this.y-10, this.width+20, this.height+20);
        else if (this.key == "a") ctx.drawImage(img, this.x-20, this.y-10, this.width+20, this.height+20);
        else ctx.drawImage(img, this.x, this.y-10, this.width+20, this.height+20);




        // 체력바 크기 설정
        const barWidth = this.width + 10;
        const barHeight = 6;

        //체력바 위치 설정
        const hpBarX = this.x-5;
        const hpBarY = this.y+this.height+15;

        // 체력바 배경 그리기
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; 
        ctx.fillRect(hpBarX, hpBarY, barWidth, barHeight);

        // 남아있는 체력 그리기
        ctx.fillStyle = 'red'; 
        ctx.fillRect(hpBarX, hpBarY, barWidth * (this.hp/this.maxHp), barHeight);
        ctx.strokeStyle = 'black'; 
        
        // 체력바 테두리 그리기 
        ctx.lineWidth = 2;
        ctx.strokeRect(hpBarX, hpBarY, barWidth, barHeight);

    }

    // 데미지 입는 함수
    takeDamage(amount) {
        if(!this.isInvincible){
            if (this.defense >= 1) {
                this.defense -= 1; 
            } else {
                this.hp -= amount; 
            }

            if (this.hp<0) this.hp = 0; 

            this.isInvincible = true;
            this.invincibilityTimer = 0;
        }
    }

    // 좀비 처치 시 경험치 획득 함수
    getExp(amount) {
        let leveledUp = false;
        this.exp += amount;
        
        // 레벨업 체크 및 처리
        while (this.exp >= this.expToNextLevel) {
            this.levelUp();
            leveledUp = true;
        }

        return leveledUp;
    }

    // 경험치에 따른 레벨 증가 및 스택 획득 함수
    levelUp() {
        this.level++;
        this.exp -= this.expToNextLevel; // 남은 경험치만 유지
        
        // 다음 레벨에 필요한 경험치를 증가시키는 공식
        this.expToNextLevel = Math.floor(this.expToNextLevel * 1.5);
    }

    getAvailableUpgrades() {
        return [
            { 
                name: "체력 향상", 
                description: "최대 체력 +1", 
                effect: () => { 
                    this.maxHp += 1; 
                    this.hp = this.maxHp; 
                } 
            },
            { 
                name: "속도 향상", 
                description: "이동 속도 +1", 
                effect: () => { 
                    this.speed += 1; 
                } 
            },
            { 
                name: "공격력 향상", 
                description: "공격력 +1", 
                effect: () => { 
                    // this.attackDamage += 1; // 추후 공격력 변수 추가 시
                } 
            },
            { 
                name: "방어도 향상", 
                description: "방어도 +1", 
                effect: () => { 
                    this.defense += 1; 
                } 
            }
        ];
    }

    // 선택된 스탯 적용 및 랜덤 선택지 반환
    getUpgradeOptions(count = 3) {
        const upgrades = this.getAvailableUpgrades();
        // 배열을 무작위로 섞기
        for (let i = upgrades.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [upgrades[i], upgrades[j]] = [upgrades[j], upgrades[i]];
        }
        return upgrades.slice(0, count); // 랜덤하게 3개 선택
    }

    applyUpgrade(upgrade) {
        upgrade.effect();
    }
}