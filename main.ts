let TREE_SPAWN_TIME = 10000
function create_tree(x: number, y: number) {
    
    tree3 = sprites.create(assets.image`
        tree
        `, SpriteKind.Food)
    tree3.setPosition(x, y)
    tree3.setFlag(SpriteFlag.StayInScreen, false)
}

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

function remove_tree_from_list(tree: Sprite) {
    for (let i = 0; i < trees.length; i++) {
        if (trees[i] == tree) {
            trees.removeAt(i)
            return
        }
        
    }
}

function spawn_tree() {
    if (trees.length >= MAX_TREES) {
        return
    }
    
    let tree = sprites.create(assets.image`tree`, SpriteKind.Food)
    let x = randint(16, scene.screenWidth() - 16)
    let y = randint(16, scene.screenHeight() - 16)
    tree.setPosition(x, y)
    trees.push(tree)
}

game.onUpdateInterval(TREE_SPAWN_TIME, function spawn_tree_loop() {
    spawn_tree()
})
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
sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function on_on_overlap(player2: Sprite, tree2: Sprite) {
    
    tree_to_chop = tree2
})
let tree_to_chop : Sprite = null
let wood = 0
let tree3 : Sprite = null
let nena : Sprite = null
tiles.setCurrentTilemap(tilemap`
    nivel
    `)
nena = sprites.create(assets.image`
    nena-front
    `, SpriteKind.Player)
scene.cameraFollowSprite(nena)
controller.moveSprite(nena)
let MAX_TREES = 10
let trees : Sprite[] = []
create_tree(40, 40)
create_tree(120, 60)
create_tree(80, 120)
create_tree(200, 100)
