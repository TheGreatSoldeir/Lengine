
class System {
    constructor() {
        let gameJSON = JSON.parse(document.getElementById("gamejson").innerHTML);
        Object.assign(this, gameJSON);
    }
}
let s;

class GameState {
    constructor() {
        this.currentRoom = s.rooms[s.spawn_room];
        this.dialogueStage = 0;
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
        for(let animation in anims) {
            animation = anims[animation];
            const i = animation.image;
            const t = animation.type;
            const posX = animation.moveX;
            const posY = animation.moveY;
            const sizeX = animation.sizeX / 100;
            const sizeY = animation.sizeY / 100;

            let eImg = document.querySelector(`img[src='${i}']`); // find image by src


            if(t == 1) { // create new image
                if(eImg) {
                    eImg.remove(); // remove if alreay exists.
                }

                eImg = document.createElement("img");
                eImg.src = i;
                eImg.className = "anim";

                // Map posX/Y from -10..10 to 0%..100%
                eImg.style.left = ((posX + 10) / 20 * 100) + "%";
                eImg.style.top  = ((posY + 10) / 20 * 100) + "%";

                // Set size
                eImg.style.transform = `translate(-50%, -50%) scale(${sizeX}, ${sizeY})`;
                eCanvas.appendChild(eImg);
                continue;
            }

            if(!eImg) { // if not found
                continue;
            }

            if(t == 0) { // delete existing image.
                eImg.remove();
                continue;
            }

            if(t == 2) { // animate existing image
                let tX = ((posX + 10) / 20 * 100) + "%";
                let tY  = ((posY + 10) / 20 * 100) + "%";

                eImg.style.transform = `translate(${tX}, ${tY}) scale(${sizeX}, ${sizeY})`;
            }

        }
    }
    displayCurrentRoom() {
        this.displayCurrentDialogue();
        this.displayCurrentLinks();
        this.displayCurrentImages();
    }
}
let gs;

function enterRoom(roomName) {
    gs.currentRoom = s.rooms[roomName];
    gs.displayCurrentRoom();
}

function setup() {
    s = new System();
    gs = new GameState();
    gs.displayCurrentRoom();
}

setup();
