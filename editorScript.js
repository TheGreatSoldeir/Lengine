class Animation {
    constructor() {
        this.image = "";
        this.type = 0;
        this.moveX = this.moveY = 0;
        this.sizeX = this.sizeY = 100;
    }
}

class Dialogue {
    constructor() {
        this.text = "";
        this.talkerName = "";
    }
}

class Talker {
    constructor(name) {
        this.name = name;
        this.color = "#ffffff";
    }
}

class Room {
    constructor(id) {
        this.id = id;
        this.dialogue = [];
        this.animations = [];
        this.links = {};
        this.background = "";
        this.itemDrop = "";
        this.replaceItem = "";
        this.replaceRoom = "";
        this.startFight = "";
        this.hpPlayer = 0;
        this.hpBoss = 0;
    }
    set_background(filename) {
        if (filename != null && filename != "") {
           this.background = filename;
        }
        else this.background = "";
    }
    set_replacement_key(key) {
        if(key != null && key != "") {
            this.replace_key = key;
        }
        else this.replace_key = "";
    }
    add_dialogue() {
        this.dialogue.push(new Dialogue());
    }
    remove_dialogue(index){
        this.dialogue.splice(index, 1);
    }
    add_animation() {
        this.animations.push(new Animation());
    }
    remove_animation(index) {
        this.animations.splice(index, 1);
    }
    add_link(room_id) {
        this.links[room_id] = "...";
    }
    remove_link(room_id) {
        delete this.links[room_id]
    }
}

class FightEntity {
    constructor(name) {
        this.name = name;
        this.hp = 100;
        this.attacks = [];
        this.endRoom = "";
    }
    addAttack(r) {
        this.attacks.push(r);
    }
    removeAttack(r) {
        this.attacks.splice(this.attacks.indexOf(r), 1);
    }
}

class System {
    constructor() {
        this.rooms = {};
        this.images = [];
        this.talkers = {};
        this.fights = {};
        this.add_talker("");
        this.spawn_room = null;
        this.current_room = null;
        this.current_fight = null;
    }
    add_room(id) {
        this.rooms[id] = new Room(id);
    }
    remove_room(id) {
        delete this.rooms[id]
    }
    get_room(id) {
        return this.rooms[id];
    }
    contains_roomid(id) {
        return id in this.rooms;
    }
    add_fight(name) {
        this.fights[name] = new FightEntity(name);
    }
    remove_fight(name) {
        delete this.fights[name];
    }
    add_image(name) {
        this.images.push(name);
    }
    has_image(name) {
        return this.images.indexOf(name) != -1;
    }
    remove_image(name) {
        this.images.splice(this.images.indexOf(name), 1);
    }
    add_talker(name) {
        this.talkers[name] = new Talker(name);
    }
    remove_talker(name) {
        delete this.talkers[name];
    }
}

// CODE HERE =================================================================

let sys = new System();
function log(text) {
    e = document.getElementById("log_output");
    e.innerHTML = text + "<br>" + e.innerHTML;
}
function setElementVisibility(element, visible) {
  if (visible) {
    element.style.display = "";
  } else {
    element.style.display = "none";
  }
}
function generate_overview() {
    e = document.getElementById("spawnSelect");
    ih = "";
    allRooms = Object.keys(sys.rooms);
    for (let rN in allRooms) {
        ih += `<option>${allRooms[rN]}</option>`
    }
    e.innerHTML = ih;
    e.value = sys.spawn_room == null ? "" : sys.spawn_room;

    e = document.getElementById("all_rooms");
    e.innerHTML = "";
    for(let rid in sys.rooms) {
        e.innerHTML += `
            <span class="room_listing">
                <rb style="background-color: unset;" onclick="view_room('${rid}')"> ${rid} </rb>
                <button ondblclick="delete_room('${rid}')">X</button>
            </span>
        `
    }
    e = document.getElementById("image_list");
    e.innerHTML = ""
    for(let img in sys.images) {
        img = sys.images[img];
        e.innerHTML += `
        <div>
                        ${img}
                        <button onclick="view_img('${img}')">
                            VIEW
                        </button>
                        <button onclick="delete_img('${img}')">
                            DELETE
                        </button>
                    </div>
        `
    }
    e = document.getElementById("all_talkers");
    e.innerHTML = "";
    for(let n in sys.talkers) {
        c = sys.talkers[n].color;
        e.innerHTML += `<div>
        ${n}
        <input type=color id="color${n}" value="${c}" onchange="updateTColor('${n}')">
        <button onclick="deleteTalker('${n}')">DELETE</button>
        </div>`
    }

    e = document.getElementById("fight_entities");
    e.innerHTML = "";
    for(let fight in sys.fights) {
        e.innerHTML += `
        <div>
        ${fight}
        <button onclick="viewFightEntity('${fight}')"> VIEW</button>
        <button onclick="deleteFightEntity('${fight}')"> DELETE </button>

        </div>
        `
    }

}
function delete_room(rid) {
    view_room(null);
    if(sys.spawn_room == rid) {
        sys.spawn_room = null;
    }
    sys.remove_room(rid);
    generate_overview();
    log(`Room ${rid} deleted.`)
}
function delete_img(name) {
    sys.remove_image(name);
    generate_overview();
    log(`Image ${name} deleted.`)
}
function deleteTalker(name) {
    sys.remove_talker(name);
    generate_overview();
    log(`Talker ${name} removed.`)
}
function view_img(name) {
    document.getElementById("imgview").src = name;
}
function add_images_to_select(element) {
    element.innerHTML = "<option></option>"
    for(let i = 0; i < sys.images.length; i++) {
        element.innerHTML += `<option>${sys.images[i]}</option>`
    }
}

function updateSpawnRoom() {
    v = document.getElementById("spawnSelect").value;
    sys.spawn_room = v;
}

function updateBG() {
    sys.current_room.set_background(document.getElementById("bgSelect").value);
}

function animationUpdate(animationI, what) {
    a = sys.current_room.animations[animationI];
    table = {
        mx: "moveX",
        my: "moveY",
        sx: "sizeX",
        sy: "sizeY",
        i: "image",
        t: "type"
    }
    newVal = document.getElementById(`animation${animationI}${what}`).value;
    if(what != "i") {
        newVal = parseInt(newVal);
    }
    a[table[what]] = newVal;
}
function liAnimation(i) {
    a = sys.current_room.animations[i];
    r = `
    <li id="animation${i}">
    type: <select id="animation${i}t" onchange="animationUpdate(${i}, 't')">
    <option value=0>sustain/appear</option>
    <option value=1>move</option>
    <option value=2>delete</option>
    </select> <br>
    image: <select id="animation${i}i" onchange="animationUpdate(${i}, 'i')">
    </select> <br>
    posXY:
    <input type="number" id="animation${i}mx" value="${a.moveX}"
    onchange="animationUpdate(${i}, 'mx')">
    <input type="number" id="animation${i}my" value="${a.moveY}"
    onchange="animationUpdate(${i}, 'my')">
    <br> sizeXY:
    <input type="number" id="animation${i}sx" value="${a.sizeX}"
    onchange="animationUpdate(${i}, 'sx')">
    <input type="number" id="animation${i}sy" value="${a.sizeY}"
    onchange="animationUpdate(${i}, 'sy')">
    <br>
    <button onclick="deleteAnimation(${i})">REMOVE</button>
    </li>
    `;
    return r;
}
function deleteAnimation(i) {
    sys.current_room.remove_animation(i);
    viewAnimations();
}
function viewAnimations() {
    r = sys.current_room;
    let animationsCopy = r.animations || [];
    list = document.getElementById("animations");
    list.innerHTML = "";
    for(let i = 0; i < animationsCopy.length; i++) {
        list.innerHTML += liAnimation(i);
    }
    t = {
        0: "sustain/appear",
        1: "move",
        2: "delete"
    }
    for(let i = 0; i < animationsCopy.length; i++) {
        iE = list.querySelector(`#animation${i}i`);
        add_images_to_select(iE);
        iE.value = animationsCopy[i].image;
        list.querySelector(`#animation${i}t`).value = animationsCopy[i].type;
    }

}

function addAnimation() {
    sys.current_room.add_animation();
    viewAnimations();
}



function addDialogue() {
    sys.current_room.add_dialogue();
    viewDialogue();
}

function updateDialogue(i) {
    d = sys.current_room.dialogue[i];
    d.talkerName = document.getElementById(`talker${i}`).value;
    d.text = document.getElementById(`dText${i}`).value;
}

function removeDialogue(i) {
    sys.current_room.remove_dialogue(i);
    viewDialogue();
}

function liDialogue(i) {
    d = sys.current_room.dialogue[i];
    r = `
    <li>
    <select id="talker${i}" value="${d.talkerName}" onchange="updateDialogue(${i})">`
    for(let talker in sys.talkers) {
        r += `<option>${talker}</option>`;
    }
    r += `
    </select>
    <textarea id="dText${i}" class="dialogue" onchange="updateDialogue(${i})">${d.text}</textarea>
    <button onclick="removeDialogue(${i})">-</button>
    </li>
    `
    return r;
}

function viewDialogue() {
    r = sys.current_room;
    let dialogueCopy = r.dialogue || [];
    list = document.getElementById("dialogue");
    list.innerHTML = "";
    for(let i = 0; i < dialogueCopy.length; i++) {
        list.innerHTML += liDialogue(i);
    }
    for(let i = 0; i < dialogueCopy.length; i++) {
        list.querySelector(`#talker${i}`).value = dialogueCopy[i].talkerName;
    }
}

function addLink() {
    rN = document.getElementById("linkselect").value;
    if(rN=="") {
        log("Select a room to add a link.");
        return;
    }
    sys.current_room.add_link(rN);
    viewLinks();
}

function updateLink(roomName) {
    t = document.getElementById(`linkT${roomName}`).value;
    sys.current_room.links[roomName] = t;
}


function removeLink(roomName) {
    sys.current_room.remove_link(roomName);
    viewLinks();
}

function setupLinkSelect() {
    ih = "";
    if(sys.current_room != null) {
        allRooms = Object.keys(sys.rooms);
        // remove doubles
        for(let linkRoom in sys.current_room.links) {
            allRooms.splice(allRooms.indexOf(linkRoom), 1);
        }
        for (let rN in allRooms) {
            ih += `<option>${allRooms[rN]}</option>`
        }
    }
    document.getElementById("linkselect").innerHTML = ih;
}

function liLink(roomName) {
    text = sys.current_room.links[roomName];
    r = `<li>
    ${roomName}
    <input id="linkT${roomName}" value="${text}" onchange="updateLink('${roomName}')">
    <button onclick="removeLink('${roomName}')">-</button>
    </li>`
    return r;
}

function viewLinks() {
    e = document.getElementById("links");
    e.innerHTML = "";
    for(rN in sys.current_room.links) {
        e.innerHTML += liLink(rN);
    }
    setupLinkSelect();
}

function updateItemDrop() {
    sys.current_room.itemDrop = document.getElementById("itemDrop").value;
}

function updateReplaceRoom() {
    sys.current_room.replaceItem = document.getElementById("replaceItem").value;
    sys.current_room.replaceRoom = document.getElementById("replaceRoomSelect").value;
}

function updateTColor(name) {
    log(`Color of ${name} changed.`);
    c = document.getElementById(`color${name}`).value;
    sys.talkers[name].color = c;
}

function addTalker() {
    i = document.getElementById("addTalker");
    t = i.value;
    i.value = "";
    if (t in sys.talkers) {
        log(`talker ${t} already exists.`);
        return;
    }
    sys.add_talker(t);
    log(`talker ${t} added.`);
    generate_overview();
}

function viewRoomRefresh() {
    view_room(sys.current_room.id);
}

function outputJSON() {
    tArea = document.getElementById("output");
    const clonedSys = Object.assign({}, sys);
    delete clonedSys["current_room"];
    tArea.value = JSON.stringify(clonedSys);
}

function importJSON() {
    tArea = document.getElementById("output");
    json = tArea.value;
    log("IMPORTING: " + json);
    x = Object.assign(new System(), JSON.parse(json));
    for (let room in x.rooms) {
        x.rooms[room] = Object.assign(new Room(room), x.rooms[room]);
    }
    for(let fight in x.fights) {
        x.fights[fight] = Object.assign(new FightEntity(fight), x.fights[fight]);
    }
    sys = x;
    setup();
}
function copyOutputJSON() {
    tArea = document.getElementById("output");
    navigator.clipboard.writeText(tArea.value);
}

function updateRoomFight() {
    r = sys.current_room;
    player = parseInt(document.getElementById("hpPlayer").value);
    boss = parseInt(document.getElementById("hpBoss").value);
    r.hpPlayer = player;
    r.hpBoss = boss;

    fight = document.getElementById("sFightSelect").value;
    r.startFight = fight;

}

function addFightEntity() {
    let eNF = document.getElementById("addFightEntity");
    let nfn = eNF.value;
    eNF.value = "";
    if(nfn in sys.fights) {
        log(`FightEntity ${nfn} already exists.`);
        return;
    }
    sys.add_fight(nfn);
    log(`FightEntity ${nfn} successfully added.`);
    generate_overview();
}
function deleteFightEntity(name) {
    viewFightEntity(null);
    sys.remove_fight(name);
    generate_overview();
}

function fightRemoveAttack(name) {
    sys.current_fight.removeAttack(name);
    viewFightRefresh();
}

function fightAddAttack() {
    e = document.getElementById("fightAttackSel");
    if (e.value != "") {
        sys.current_fight.addAttack(e.value);
    }
    viewFightRefresh();
}

function updateFight() {
    sys.current_fight.hp = parseInt(document.getElementById("bossHP").value);
    sys.current_fight.endRoom = document.getElementById("fightEndRoom").value;
}

function viewFightEntity(name) {
    eView = document.getElementById("fightView");
    if(name == null) {
        sys.current_fight = null;
        setElementVisibility(eView, false);
        return;
    }
    f = sys.fights[name];
    sys.current_fight = f;
    setElementVisibility(eView, true);

    // title
    document.getElementById("fightName").innerHTML = name;
    document.getElementById("bossHP").value = f.hp.toString();
    // select new attack
    let eAttacks = document.getElementById("fightAttackSel");
    let eEndRoom = document.getElementById("fightEndRoom");
    ih = ``;
    let ih2 = ``
    for(let r in sys.rooms) {
        if(f.attacks.indexOf(r) < 0) { // check if already has attack
            ih += `<option>${r}</option>`;
        }
        ih2 += `<option>${r}</option>`;
    }
    eAttacks.innerHTML = ih;
    eEndRoom.innerHTML = ih2;
    eEndRoom.value = f.endRoom;
    // generate LI for all attacks
    eAttacks = document.getElementById("fightAttacks");
    ih = ``;
    for(let r in f.attacks) {
        r = f.attacks[r];
        ih += `<li>${r} <button onclick="fightRemoveAttack('${r}')">-</button></li>`
    }
    eAttacks.innerHTML = ih;
}

function viewFightRefresh() {
    viewFightEntity(sys.current_fight.name);
}

function view_room(room_id) {
    // if disable room view
    d = document.getElementById("room_view");
    if(room_id == null) {
        sys.current_room = null;
        setElementVisibility(d, false);
        return;
    } // else:
    r = sys.get_room(room_id);
    sys.current_room = r;
    setElementVisibility(d, true);

    // title
    document.getElementById("room_name").innerHTML = room_id;

    // replace if item setup
    ih = "";
    allRooms = Object.keys(sys.rooms);
    allRooms.splice(allRooms.indexOf(room_id), 1); // remove room itself
    for (let rN in allRooms) {
        ih += `<option>${allRooms[rN]}</option>`
    }
    rrs = document.getElementById("replaceRoomSelect");
    rrs.innerHTML = ih;
    rrs.value = r.replaceRoom;
    document.getElementById("replaceItem").value = r.replaceItem;


    // background image setup
    bImage = document.getElementById("bgSelect");
    add_images_to_select(bImage);
    bImage.value = r.background

    // itemdrop setup
    itemDrop = document.getElementById("itemDrop");
    itemDrop.value = r.itemDrop;

    // damage and fightselect setup

    fightSelect = document.getElementById("sFightSelect");
    fightSelect.innerHTML = "";
    ih = `<option></option>`;
    for(fight in sys.fights) {
        ih += `<option>${fight}</option>`;
    }
    fightSelect.innerHTML = ih;
    fightSelect.value = r.startFight;
    document.getElementById("hpPlayer").value = r.hpPlayer.toString();
    document.getElementById("hpBoss").value = r.hpBoss.toString();
    // animations setup
    viewAnimations();
    viewDialogue();
    viewLinks();
}
function setup() {
    // view null
    view_room(null);
    viewFightEntity(null);
    // gen first overview
    generate_overview();
    // new room input
    newroom_input = document.getElementById("new_room");
    newroom_input.ondblclick = function() {
        rn = newroom_input.value;
        if (sys.contains_roomid(rn)) {
            log("Room " + rn + " already exists.");
        }
        else {
            sys.add_room(newroom_input.value);
            generate_overview()
            log("Room created: "+rn);
            newroom_input.value = "";
        }
    }
    // new image input
    newimage_input = document.getElementById("add_image");
    newimage_input.ondblclick = function() {
        img = "i/" + newimage_input.value;
        if(sys.has_image(img)) {
            log(`Image ${img} already exists.`);
        } else {
            sys.add_image(img);
            generate_overview();
            log(`Image ${img} created.`)
            newimage_input.value = "";
        }
    }

}

setup();
