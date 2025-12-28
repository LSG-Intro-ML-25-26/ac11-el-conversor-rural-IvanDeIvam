#Conversions per llenya
WOOD_PER_CHICKEN = 6
WOOD_PER_KG_POTATO = 1.33 # 2 / 1.5
WOOD_PER_GOAT = 5
WOOD_PER_EGG = 0.25 # 3 / 12
WOOD_PER_HORSE = 12

NPC = SpriteKind.create()

#Variables
npcs: List[Sprite] = []
npc_to_talk: Sprite = None
tree_to_chop: Sprite = None
trees: List[Sprite] = []
wood = 0
MAX_TREES = 10
TREE_SPAWN_TIME = 500
nena: Sprite = None
y2 = 0
x2 = 0
tree3: Sprite = None

tiles.set_current_tilemap(tilemap("""nivel"""))
nena = sprites.create(assets.image("""nena-front"""), SpriteKind.player)
scene.camera_follow_sprite(nena)
controller.move_sprite(nena)

#Mètodes d'intercanvi

def perform_exchange(product_name: str, wood_price: float, is_animal: bool):
    global wood
    quantity = game.ask_for_number("Quants " + product_name + " vols?", 3)
    
    if quantity <= 0:
        game.show_long_text("Error: Ha de ser una quantitat positiva!", DialogLayout.BOTTOM)
        return

    if is_animal and quantity % 1 != 0:
        game.show_long_text("Error: Només animals sencers!", DialogLayout.BOTTOM)
        return

    total_cost = Math.round_with_precision(quantity * wood_price, 2)

    if wood >= total_cost:
        wood -= total_cost
        wood = Math.round_with_precision(wood, 2)
        game.show_long_text("Has intercanviat " + str(total_cost) + "kg de llenya per " + str(quantity) + " " + product_name, DialogLayout.BOTTOM)
    else:
        game.show_long_text("No tens suficient llenya! Necessites " + str(total_cost) + "kg", DialogLayout.BOTTOM)

def open_market_menu():
    game.show_long_text("Mercat: 1.Gallines, 2.Kg de Patates, 3.Cabres, 4.Ous, 5.Caballs, 6.Exit", DialogLayout.BOTTOM)
    selection = game.ask_for_string("Número de producte (1-6):", 1)
    
    if selection == "1":
        perform_exchange("Gallines", WOOD_PER_CHICKEN, True)
    elif selection == "2":
        perform_exchange("kg de Patates", WOOD_PER_KG_POTATO, False)
    elif selection == "3":
        perform_exchange("Cabres", WOOD_PER_GOAT, True)
    elif selection == "4":
        perform_exchange("Ous", WOOD_PER_EGG, False)
    elif selection == "5":
        perform_exchange("Caballs", WOOD_PER_HORSE, True)
    elif selection == "6":
        game.show_long_text("Adeu!", DialogLayout.BOTTOM)

#Mètodes de NPCs

def spawn_npcs():
    global npcs
    pos_x = [72, 432, 72, 432]
    pos_y = [232, 232, 432, 432]
    
    for i in range(4):
        new_npc = sprites.create(assets.image("""npc-front"""), NPC)
        new_npc.set_position(pos_x[i], pos_y[i])
        npcs.append(new_npc)

def check_npc_overlap():
    global npc_to_talk
    npc_to_talk = None
    for npc_item in npcs:
        if nena.overlaps_with(npc_item):
            npc_to_talk = npc_item
            break

def on_b_pressed():
    if npc_to_talk:
        open_market_menu()

controller.B.on_event(ControllerButtonEvent.PRESSED, on_b_pressed)

#Mètodes d'arbres i llenya

def spawn_tree():
    global tree3, x2, y2
    if len(trees) >= MAX_TREES:
        return
    tree3 = sprites.create(assets.image("""tree"""), SpriteKind.food)
    x2 = randint(16, scene.screen_width() - 16)
    y2 = randint(16, scene.screen_height() - 16)
    tree3.set_position(x2, y2)
    trees.append(tree3)

def remove_tree_from_list(tree_to_remove: Sprite):
    idx = 0
    while idx < len(trees):
        if trees[idx] == tree_to_remove:
            trees.remove_at(idx)
            return
        idx += 1

def chop_tree(tree_target: Sprite):
    global wood
    wood += 2
    remove_tree_from_list(tree_target)
    tree_target.destroy()
    game.show_long_text("Has aconseguit 2kg de llenya, ara en tens " + ("" + str(wood)) + "kg", DialogLayout.BOTTOM)

def check_tree_overlap():
    global tree_to_chop
    tree_to_chop = None
    for t in trees:
        if nena.overlaps_with(t):
            tree_to_chop = t
            break

def on_a_pressed():
    if tree_to_chop:
        chop_tree(tree_to_chop)

controller.A.on_event(ControllerButtonEvent.PRESSED, on_a_pressed)

#Mètodes de botons

def on_down_pressed():
    animation.run_image_animation(nena, assets.animation("""nena-animation-down"""), 500, False)
controller.down.on_event(ControllerButtonEvent.PRESSED, on_down_pressed)

def on_right_pressed():
    animation.run_image_animation(nena, assets.animation("""nena-animation-right"""), 500, False)
controller.right.on_event(ControllerButtonEvent.PRESSED, on_right_pressed)

def on_left_pressed():
    animation.run_image_animation(nena, assets.animation("""nena-animation-left"""), 500, False)
controller.left.on_event(ControllerButtonEvent.PRESSED, on_left_pressed)

def on_up_pressed():
    animation.run_image_animation(nena, assets.animation("""nena-animation-up"""), 500, False)
controller.up.on_event(ControllerButtonEvent.PRESSED, on_up_pressed)

#Altes mètodes (start, update etc)

game.on_update_interval(TREE_SPAWN_TIME, spawn_tree)

def on_game_update():
    check_npc_overlap()
    check_tree_overlap()
game.on_update(on_game_update)

spawn_npcs()