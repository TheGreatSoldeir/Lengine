
class System {
    constructor() {
        const j = document.getElementById("gamejson").innerHTML;
        let gameJSON = JSON.parse(j);
        Object.assign(this, gameJSON);
    }
}
let s;

function r(id) { // function to return room object by room id
    return s.rooms[id];
}
// func ripped from editorscript
function setElementVisibility(element, visible) {
  if (visible) {
    element.style.display = "";
  } else {
    element.style.display = "none";
  }
}


class Player {
    constructor() {
        this.hp = 100;
        this.items = [];
    }
}
class Enemy {
    constructor(entityName) {
        this.fightEntity = s.fights[entityName]
        this.hp = this.fightEntity.hp;
    }
}

class GameState {
    constructor() {
        this.currentRoom = r(s.spawn_room);
        this.dialogueStage = 0;
        this.player = new Player();
        this.enemy = null;
    }
    getCurrentDialogue() {
        return this.currentRoom.dialogue[this.dialogueStage];
    }
    displayCurrentDialogue() {
        const d = this.getCurrentDialogue()
        const eText = document.getElementById("roomText");
        eText.innerHTML = d["text"];
        const eTalker = document.getElementById("talkerName");
        talkerName = d["talkerName"];
        eTalker.innerHTML = talkerName;
        eTalker.style.color = s.talkers[talkerName].color;

        // dialoguehax
        let maxDialogue = this.currentRoom.dialogue.length;
        let dB = document.getElementById("dialogueButton");
        let l = document.getElementById("links");
        if (this.dialogueStage+1 >= maxDialogue) {
            // if dialogue is finished:
            setElementVisibility(dB, false);
            setElementVisibility(l, true);
        } else { // if not finished:
            setElementVisibility(dB, true);
            setElementVisibility(l, false);
            this.dialogueStage += 1;
        }
    }
    displayCurrentLinks() {
        let links = this.currentRoom.links;
        const eLinks = document.getElementById("links");
        let ih = "";
        for(let rName in links) {
                ih += `<button class="linkButton" onclick="enterRoom('${rName}')">
            ${links[rName]}
            </button>`
        }
        eLinks.innerHTML = ih;
    }
    displayCurrentImages() {
        const bg = this.currentRoom.background;
        const eCanvas = document.getElementById("allCanvas");
        eCanvas.style.backgroundImage = `url(${bg})`


        const anims = this.currentRoom.animations;
        let activeImages = [];
        for(let animation in anims) {
            animation = anims[animation];
            const i = animation.image;
            const t = animation.type;
            const posX = animation.moveX;
            const posY = animation.moveY;
            const sizeX = animation.sizeX / 100;
            const sizeY = animation.sizeY / 100;

            activeImages.push(i);

            let eImg = document.querySelector(`img[src='${i}']`); // find image by src


            if(t == 0) { // enforce image presence
                if(eImg) {
                    continue; // ignore if alr exists
                }

                eImg = document.createElement("img");
                eImg.src = i;
                eImg.className = "anim";

                // Map posX/Y from -10..10 to 0%..100%
                eImg.style.left = "50%";
                eImg.style.top  = "50%";

                // Set size
                eImg.style.transform = `translate(-50%, -50%) scale(${sizeX}, ${sizeY})`;
                eCanvas.appendChild(eImg);
                continue;
            }



            if(t == 2 && eImg) { // delete existing image.
                eImg.remove();
                continue;
            }

            if(t == 1) { // animate existing image
                if(!eImg) { // if not found, create new
                    eImg = document.createElement("img");
                    eImg.src = i;
                    eImg.className = "anim";
                    eCanvas.appendChild(eImg);
                }
                let tX = ((posX + 10) / 20 * 100) + "%";
                let tY  = ((posY + 10) / 20 * 100) + "%";

                eImg.style.transform = `translate(${tX}, ${tY}) scale(${sizeX}, ${sizeY})`;
            }
        }
        // remove inactive images
        for(let image in s.images) {
            image = s.images[image];
            if(activeImages.indexOf(image) >=0) { // if image is active
                continue;
            }
            let eImg = document.querySelector(`img[src='${image}']`); // find inactive img
            if(eImg) {
                eImg.remove();
            }
        }


    }

    checkToReplace() {
        if(this.currentRoom.replaceItem == "")
            null;
        else if(this.player.items.includes(this.currentRoom.replaceItem))
            return r(this.currentRoom.replaceRoom);

        if(this.enemy != null) { // boss death
            if (this.enemy.hp < 1) {
                let eR = this.enemy.fightEntity.endRoom;
                this.enemy = null;
                return r(eR);
            }
        }
        if(this.currentRoom.id == "ENEMY") {
            let attackCount = this.enemy.fightEntity.attacks.length;
            let i = Math.floor(Math.random() * attackCount); // random int
            return r(this.enemy.fightEntity.attacks[i]);
        }
    }

    dropItems() {
        let i = this.currentRoom.itemDrop;
        if(i == "" || this.player.items.includes(i))
            return;
        this.player.items.push(i);

    }

    roomFightEffects() {
        let bbDIV = document.getElementById("bHPDiv");
        if(this.enemy != null) { // boss hp
            let hp = Math.max(0, this.enemy.hp + this.currentRoom.hpBoss);
            hp = Math.min(this.enemy.fightEntity.hp, hp);
            this.enemy.hp = hp;
            // display
            setElementVisibility(bbDIV, true);
            document.getElementById("bossHP").value = hp;
        } else {
            setElementVisibility(bbDIV, false);
        }
        // player hp
        let hp = this.currentRoom.hpPlayer + this.player.hp;
        hp = Math.max(0, hp);
        hp = Math.min(100, hp);
        this.player.hp = hp;
        // display
        document.getElementById("playerHP").value = hp;

    }

    playerDeath() {
        let e = document.getElementById("ctrl");
        setElementVisibility(e, false);
        e = document.getElementById("deathscreen");
        console.log(e);
        setElementVisibility(e, true);
    }

    displayCurrentRoom() {
        this.dialogueStage = 0;
        let check = this.checkToReplace();
        if(check != null) {
            this.currentRoom = check;
            this.displayCurrentRoom();
            return;
        }
        if(this.player.hp < 1) { // player death / game over
            this.playerDeath();
            return;
        }
        // check to start boss
        if(this.currentRoom.startFight != "") {
            this.enemy = new Enemy(this.currentRoom.startFight);
        }

        this.roomFightEffects();
        this.dropItems();
        // display shit
        this.displayCurrentDialogue();
        this.displayCurrentLinks();
        this.displayCurrentImages();
    }
}
let gs;

function enterRoom(roomName) {
    gs.currentRoom = r(roomName);
    gs.displayCurrentRoom();
}

function setup() {
    s = new System();
    gs = new GameState();
    gs.displayCurrentRoom();
    document.getElementById("deathscreen").style.display = "none";

}

function copySave() {
    navigator.clipboard.writeText(JSON.stringify(gs));
}
async function importSave() {
    let x = await navigator.clipboard.readText();
    gs2 = JSON.parse(x);
    gs = Object.assign(new GameState(), gs2);
    gs.displayCurrentRoom();
}

setup();
