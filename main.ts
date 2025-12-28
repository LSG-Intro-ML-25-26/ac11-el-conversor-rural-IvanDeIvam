// Conversions per llenya
let WOOD_PER_CHICKEN = 6
let WOOD_PER_KG_POTATO = 1.33
//  2 / 1.5
let WOOD_PER_GOAT = 5
let WOOD_PER_EGG = 0.25
//  3 / 12
let WOOD_PER_HORSE = 12
let NPC = SpriteKind.create()
// Variables
let npcs : Sprite[] = []
let npc_to_talk : Sprite = null
let tree_to_chop : Sprite = null
let trees : Sprite[] = []
let wood = 0
let MAX_TREES = 10
let TREE_SPAWN_TIME = 500
let nena : Sprite = null
let y2 = 0
let x2 = 0
let tree3 : Sprite = null
tiles.setCurrentTilemap(tilemap`nivel`)
nena = sprites.create(assets.image`nena-front`, SpriteKind.Player)
scene.cameraFollowSprite(nena)
controller.moveSprite(nena)
// Mètodes d'intercanvi
function perform_exchange(product_name: string, wood_price: number, is_animal: boolean) {
    
    let quantity = game.askForNumber("Quants " + product_name + " vols?", 3)
    if (quantity <= 0) {
        game.showLongText("Error: Ha de ser una quantitat positiva!", DialogLayout.Bottom)
        return
    }
    
    if (is_animal && quantity % 1 != 0) {
        game.showLongText("Error: Només animals sencers!", DialogLayout.Bottom)
        return
    }
    
    let total_cost = Math.roundWithPrecision(quantity * wood_price, 2)
    if (wood >= total_cost) {
        wood -= total_cost
        wood = Math.roundWithPrecision(wood, 2)
        game.showLongText("Has intercanviat " + ("" + total_cost) + "kg de llenya per " + ("" + quantity) + " " + product_name, DialogLayout.Bottom)
    } else {
        game.showLongText("No tens suficient llenya! Necessites " + ("" + total_cost) + "kg", DialogLayout.Bottom)
    }
    
}

function open_market_menu() {
    game.showLongText("Mercat: 1.Gallines, 2.Kg de Patates, 3.Cabres, 4.Ous, 5.Caballs, 6.Exit", DialogLayout.Bottom)
    let selection = game.askForString("Número de producte (1-6):", 1)
    if (selection == "1") {
        perform_exchange("Gallines", WOOD_PER_CHICKEN, true)
    } else if (selection == "2") {
        perform_exchange("kg de Patates", WOOD_PER_KG_POTATO, false)
    } else if (selection == "3") {
        perform_exchange("Cabres", WOOD_PER_GOAT, true)
    } else if (selection == "4") {
        perform_exchange("Ous", WOOD_PER_EGG, false)
    } else if (selection == "5") {
        perform_exchange("Caballs", WOOD_PER_HORSE, true)
    } else if (selection == "6") {
        game.showLongText("Adeu!", DialogLayout.Bottom)
    }
    
}

// Mètodes de NPCs
function spawn_npcs() {
    let new_npc: Sprite;
    
    let pos_x = [72, 432, 72, 432]
    let pos_y = [232, 232, 432, 432]
    for (let i = 0; i < 4; i++) {
        new_npc = sprites.create(assets.image`npc-front`, NPC)
        new_npc.setPosition(pos_x[i], pos_y[i])
        npcs.push(new_npc)
    }
}

function check_npc_overlap() {
    
    npc_to_talk = null
    for (let npc_item of npcs) {
        if (nena.overlapsWith(npc_item)) {
            npc_to_talk = npc_item
            break
        }
        
    }
}

controller.B.onEvent(ControllerButtonEvent.Pressed, function on_b_pressed() {
    if (npc_to_talk) {
        open_market_menu()
    }
    
})
// Mètodes d'arbres i llenya
function remove_tree_from_list(tree_to_remove: Sprite) {
    let idx = 0
    while (idx < trees.length) {
        if (trees[idx] == tree_to_remove) {
            trees.removeAt(idx)
            return
        }
        
        idx += 1
    }
}

function chop_tree(tree_target: Sprite) {
    
    wood += 2
    remove_tree_from_list(tree_target)
    tree_target.destroy()
    game.showLongText("Has aconseguit 2kg de llenya, ara en tens " + ("" + ("" + wood)) + "kg", DialogLayout.Bottom)
}

function check_tree_overlap() {
    
    tree_to_chop = null
    for (let t of trees) {
        if (nena.overlapsWith(t)) {
            tree_to_chop = t
            break
        }
        
    }
}

controller.A.onEvent(ControllerButtonEvent.Pressed, function on_a_pressed() {
    if (tree_to_chop) {
        chop_tree(tree_to_chop)
    }
    
})
// Mètodes de botons
controller.down.onEvent(ControllerButtonEvent.Pressed, function on_down_pressed() {
    animation.runImageAnimation(nena, assets.animation`nena-animation-down`, 500, false)
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function on_right_pressed() {
    animation.runImageAnimation(nena, assets.animation`nena-animation-right`, 500, false)
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function on_left_pressed() {
    animation.runImageAnimation(nena, assets.animation`nena-animation-left`, 500, false)
})
controller.up.onEvent(ControllerButtonEvent.Pressed, function on_up_pressed() {
    animation.runImageAnimation(nena, assets.animation`nena-animation-up`, 500, false)
})
// Altes mètodes (start, update etc)
game.onUpdateInterval(TREE_SPAWN_TIME, function spawn_tree() {
    
    if (trees.length >= MAX_TREES) {
        return
    }
    
    tree3 = sprites.create(assets.image`tree`, SpriteKind.Food)
    x2 = randint(16, scene.screenWidth() - 16)
    y2 = randint(16, scene.screenHeight() - 16)
    tree3.setPosition(x2, y2)
    trees.push(tree3)
})
game.onUpdate(function on_game_update() {
    check_npc_overlap()
    check_tree_overlap()
})
spawn_npcs()
