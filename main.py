NPC = SpriteKind.create()

npcs: List[Sprite] = []

def spawn_npcs():
    global npcs
    positions = [(72, 232), (432, 232), (72, 432), (432, 432)]
    for pos in positions:
        npc = sprites.create(assets.image("""
            npc-front
        """), NPC)
        npc.set_position(pos[0], pos[1])
        npcs.append(npc)

npc_to_talk: Sprite = None

def check_npc_overlap():
    global npc_to_talk
    overlapping = False
    for npc in npcs:
        if nena.overlaps_with(npc):
            npc_to_talk = npc
            overlapping = True
            break
    if not overlapping:
        npc_to_talk = None

game.on_update(check_npc_overlap)

def on_b_pressed():
    if npc_to_talk:
        game.show_long_text("Hola! Puc intercanviar llenya per productes o viceversa.", DialogLayout.BOTTOM)

controller.B.on_event(ControllerButtonEvent.PRESSED, on_b_pressed)

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

def spawn_tree():
    global tree3, x2, y2
    if len(trees) >= MAX_TREES:
        return
    tree3 = sprites.create(assets.image("""
        tree
        """), SpriteKind.food)
    x2 = randint(16, scene.screen_width() - 16)
    y2 = randint(16, scene.screen_height() - 16)
    tree3.set_position(x2, y2)
    trees.append(tree3)

def remove_tree_from_list(tree2: Sprite):
    i = 0
    while i <= len(trees) - 1:
        if trees[i] == tree2:
            trees.remove_at(i)
            return
        i += 1

def check_tree_overlap():
    global tree_to_chop
    overlapping = False
    for tree in trees:
        if nena.overlaps_with(tree):
            tree_to_chop = tree
            overlapping = True
            break
    if not overlapping:
        tree_to_chop = None

game.on_update(check_tree_overlap)

y2 = 0
x2 = 0
tree3: Sprite = None
trees: List[Sprite] = []
tree_to_chop: Sprite = None
wood = 0
tree32: Sprite = None
MAX_TREES = 0
nena: Sprite = None
TREE_SPAWN_TIME = 10000
tiles.set_current_tilemap(tilemap("""
    nivel
    """))
nena = sprites.create(assets.image("""
    nena-front
    """), SpriteKind.player)
scene.camera_follow_sprite(nena)
controller.move_sprite(nena)
spawn_npcs()
MAX_TREES = 10

def on_update_interval():
    spawn_tree()
game.on_update_interval(TREE_SPAWN_TIME, on_update_interval)
