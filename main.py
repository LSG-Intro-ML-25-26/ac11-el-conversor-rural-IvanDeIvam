TREE_SPAWN_TIME = 10000

def create_tree(x: number, y: number):
    global tree3
    tree3 = sprites.create(assets.image("""
        tree
        """), SpriteKind.food)
    tree3.set_position(x, y)
    tree3.set_flag(SpriteFlag.STAY_IN_SCREEN, False)

def on_down_pressed():
    animation.run_image_animation(nena,
        assets.animation("""
            nena-animation-down
            """),
        500,
        False)
controller.down.on_event(ControllerButtonEvent.PRESSED, on_down_pressed)

def chop_tree(tree: Sprite):
    global wood
    wood += 2

    remove_tree_from_list(tree)
    tree.destroy()

    game.show_long_text("Has aconseguit 2kg de llenya, ara en tens " + ("" + str(wood)) + "kg",
        DialogLayout.BOTTOM)

def remove_tree_from_list(tree: Sprite):
    for i in range(len(trees)):
        if trees[i] == tree:
            trees.remove_at(i)
            return

def spawn_tree():
    if len(trees) >= MAX_TREES:
        return
    
    tree = sprites.create(assets.image("tree"), SpriteKind.food)

    x = randint(16, scene.screen_width() - 16)
    y = randint(16, scene.screen_height() - 16)
    tree.set_position(x, y)
    trees.append(tree)

def spawn_tree_loop():
    spawn_tree()
game.on_update_interval(TREE_SPAWN_TIME, spawn_tree_loop)

def on_right_pressed():
    animation.run_image_animation(nena,
        assets.animation("""
            nena-animation-right
            """),
        500,
        False)
controller.right.on_event(ControllerButtonEvent.PRESSED, on_right_pressed)

def on_left_pressed():
    animation.run_image_animation(nena,
        assets.animation("""
            nena-animation-left
            """),
        500,
        False)
controller.left.on_event(ControllerButtonEvent.PRESSED, on_left_pressed)

def on_a_pressed():
    if tree_to_chop:
        chop_tree(tree_to_chop)
controller.A.on_event(ControllerButtonEvent.PRESSED, on_a_pressed)

def on_up_pressed():
    animation.run_image_animation(nena,
        assets.animation("""
            nena-animation-up
            """),
        500,
        False)
controller.up.on_event(ControllerButtonEvent.PRESSED, on_up_pressed)

def on_on_overlap(player2, tree2):
    global tree_to_chop
    tree_to_chop = tree2
sprites.on_overlap(SpriteKind.player, SpriteKind.food, on_on_overlap)

tree_to_chop: Sprite = None
wood = 0
tree3: Sprite = None
nena: Sprite = None
tiles.set_current_tilemap(tilemap("""
    nivel
    """))
nena = sprites.create(assets.image("""
    nena-front
    """), SpriteKind.player)
scene.camera_follow_sprite(nena)
controller.move_sprite(nena)
MAX_TREES = 10
trees: List[Sprite] = []
create_tree(40, 40)
create_tree(120, 60)
create_tree(80, 120)
create_tree(200, 100)