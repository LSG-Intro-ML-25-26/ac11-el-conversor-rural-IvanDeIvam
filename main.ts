let NPC = SpriteKind.create()
let npcs : Sprite[] = []
function spawn_npcs() {
    let npc: Sprite;
    
    let positions = [[72, 232], [432, 232], [72, 432], [432, 432]]
    for (let pos of positions) {
        npc = sprites.create(assets.image`
            npc-front
        `, NPC)
        npc.setPosition(pos[0], pos[1])
        npcs.push(npc)
    }
}

let npc_to_talk : Sprite = null
game.onUpdate(function check_npc_overlap() {
    
    let overlapping = false
    for (let npc of npcs) {
        if (nena.overlapsWith(npc)) {
            npc_to_talk = npc
            overlapping = true
            break
        }
        
    }
    if (!overlapping) {
        npc_to_talk = null
    }
    
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function on_b_pressed() {
    if (npc_to_talk) {
        game.showLongText("Hola! Puc intercanviar llenya per productes o viceversa.", DialogLayout.Bottom)
    }
    
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function on_down_pressed() {
    animation.runImageAnimation(nena, assets.animation`
            nena-animation-down
            `, 500, false)
})
function chop_tree(tree: Sprite) {
    
    wood += 2
    remove_tree_from_list(tree)
    tree.destroy()
    game.showLongText("Has aconseguit 2kg de llenya, ara en tens " + ("" + ("" + wood)) + "kg", DialogLayout.Bottom)
}

controller.right.onEvent(ControllerButtonEvent.Pressed, function on_right_pressed() {
    animation.runImageAnimation(nena, assets.animation`
            nena-animation-right
            `, 500, false)
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function on_left_pressed() {
    animation.runImageAnimation(nena, assets.animation`
            nena-animation-left
            `, 500, false)
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function on_a_pressed() {
    if (tree_to_chop) {
        chop_tree(tree_to_chop)
    }
    
})
controller.up.onEvent(ControllerButtonEvent.Pressed, function on_up_pressed() {
    animation.runImageAnimation(nena, assets.animation`
            nena-animation-up
            `, 500, false)
})
function spawn_tree() {
    
    if (trees.length >= MAX_TREES) {
        return
    }
    
    tree3 = sprites.create(assets.image`
        tree
        `, SpriteKind.Food)
    x2 = randint(16, scene.screenWidth() - 16)
    y2 = randint(16, scene.screenHeight() - 16)
    tree3.setPosition(x2, y2)
    trees.push(tree3)
}

function remove_tree_from_list(tree2: Sprite) {
    let i = 0
    while (i <= trees.length - 1) {
        if (trees[i] == tree2) {
            trees.removeAt(i)
            return
        }
        
        i += 1
    }
}

game.onUpdate(function check_tree_overlap() {
    
    let overlapping = false
    for (let tree of trees) {
        if (nena.overlapsWith(tree)) {
            tree_to_chop = tree
            overlapping = true
            break
        }
        
    }
    if (!overlapping) {
        tree_to_chop = null
    }
    
})
let y2 = 0
let x2 = 0
let tree3 : Sprite = null
let trees : Sprite[] = []
let tree_to_chop : Sprite = null
let wood = 0
let tree32 : Sprite = null
let MAX_TREES = 0
let nena : Sprite = null
let TREE_SPAWN_TIME = 10000
tiles.setCurrentTilemap(tilemap`
    nivel
    `)
nena = sprites.create(assets.image`
    nena-front
    `, SpriteKind.Player)
scene.cameraFollowSprite(nena)
controller.moveSprite(nena)
spawn_npcs()
MAX_TREES = 10
game.onUpdateInterval(TREE_SPAWN_TIME, function on_update_interval() {
    spawn_tree()
})
