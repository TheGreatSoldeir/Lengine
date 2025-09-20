
class System {
    constructor() {
        let gameJSON = JSON.parse(document.getElementById("gamejson").innerHTML);
        Object.assign(this, gameJSON);
    }
}
s = new System();

class GameState {
    constructor() {
        this.currentRoom = s.rooms[s.spawn_room];
        this.dialogueStage = 0;
    }
    get_current_dialogue() {
        return this.currentRoom.dialogue[this.dialogueStage];
    }
    display_current_dialogue() {
        const d = this.get_current_dialogue()
        const eText = document.getElementById("roomText");
        eText.innerHTML = d["text"];
        const eTalker = document.getElementById("talkerName");
        eTalker.innerHTML = d["talkerName"];
    }
    display_links() {
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
    displayRoom() {
        this.display_current_dialogue();
        this.display_links();
    }
}
gs = new GameState();

function enterRoom(roomName) {
    gs.currentRoom = s.rooms[roomName];
    gs.displayRoom();
}