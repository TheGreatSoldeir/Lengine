class Room {
    constructor(id) {
        this.id = id;
        this.dialogue = []
        this.animations = []
        this.links = {}
    }
    set_background(filename) {
        if (filename != null && filename != "") {
           this.background = filename;
        }
        else delete this.background;
    }
    set_replacement_key(key) {
        if(key != null && key != "") {
            this.replace_key = key;
        }
        else delete this.replace_key;
    }
    add_dialogue() {
        this.dialogue.push({
            talker: null,
            text: ""
        })
    }
    edit_dialogue(index, new_talker, new_text) {
        this.dialogue[index].talker = new_talker;
        this.dialogue[index].text = new_text;
    }
    remove_dialogue(index){
        this.dialogue.splice(index);
    }
    add_animation() {
        this.animations.push({
            clear: false,
            posx: 0,
            posy: 0,
            size_x: 1.0,
            size_y: 1.0
        })
    }
    change_animation(index, new_animation) {
        this.animations[index] = new_animation;
    }
    remove_animation(index) {
        this.animations.splice(index);
    }
    set_link(room_id, text) {
        this.links[room_id] = text;
    }
    remove_link(room_id) {
        delete this.links[room_id]
    }
}

class System {
    constructor() {
        this.rooms = {};
    }
    add_room(id) {
        this.rooms[id] = new Room();
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
}