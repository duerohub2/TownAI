extends Control

signal location_clicked(location_id: String)
signal npc_clicked(npc_id: String)

const TILE_W := 86.0
const TILE_H := 43.0
const MAP_W := 21
const MAP_H := 16

const TEX_TREE = preload("res://assets/user/ai_living_city/tree_broadleaf.png")
const TEX_TREE_FLOWERING = preload("res://assets/user/ai_living_city/tree_flowering.png")
const TEX_HOUSE = preload("res://assets/user/ai_living_city/house_red_roof.png")
const TEX_SHOP = preload("res://assets/user/ai_living_city/shop_red_awning.png")
const TEX_CIVIC = preload("res://assets/user/ai_living_city/civic_tower.png")
const TEX_FOUNTAIN = preload("res://assets/user/ai_living_city/fountain.png")
const TEX_PLAYER = preload("res://assets/user/ai_living_city/character_player_avatar.png")
const TEX_NPC_FARMER = preload("res://assets/user/ai_living_city/character_farmer.png")
const TEX_NPC_DOCTOR = preload("res://assets/user/ai_living_city/character_doctor.png")
const TEX_NPC_ADVENTURER = preload("res://assets/user/ai_living_city/character_adventurer.png")

var state: TownGameState
var selected_location := "square"
var selected_npc := ""
var zoom_factor := 0.92
var camera_offset := Vector2(0.0, 40.0)
var _dragging := false
var _drag_origin := Vector2.ZERO
var _drag_start_offset := Vector2.ZERO
var _drag_distance := 0.0
var reduced_motion := false

var district_colors := {
	"square": Color("#F6C56F"),
	"residential": Color("#9CCB9C"),
	"commercial": Color("#F39B84"),
	"industrial": Color("#C8A78A"),
	"civic": Color("#8BBFE7"),
	"park": Color("#76C59B")
}

func _ready() -> void:
	mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
	set_process_input(true)
	queue_redraw()

func set_game_state(value: TownGameState) -> void:
	state = value
	queue_redraw()

func set_selected_location(location_id: String) -> void:
	selected_location = location_id
	selected_npc = ""
	queue_redraw()

func set_zoom(value: float) -> void:
	zoom_factor = clampf(value, 0.70, 1.22)
	queue_redraw()

func change_zoom(amount: float) -> void:
	set_zoom(zoom_factor + amount)

func reset_camera() -> void:
	zoom_factor = 0.92
	camera_offset = Vector2(0.0, 40.0)
	queue_redraw()

func _process(_delta: float) -> void:
	queue_redraw()

func _draw() -> void:
	draw_rect(Rect2(Vector2.ZERO, size), Color("#0B1220"))
	# Soft civic glow behind the town.
	var portrait := size.y > size.x * 1.25
	var glow_center := Vector2(size.x * 0.50, 300.0 if portrait else size.y * 0.45)
	var glow_radius := minf(size.x, 560.0) * (0.36 if portrait else 0.40)
	draw_circle(glow_center, glow_radius, Color("#14253A"))
	for y in range(MAP_H):
		for x in range(MAP_W):
			var cell := Vector2i(x, y)
			var top := _tile_to_screen(cell)
			var district := _district_for_cell(cell)
			var tile_color: Color = district_colors[district]
			if district == selected_location:
				tile_color = tile_color.lightened(0.08)
			else:
				tile_color = tile_color.darkened(0.34)
			_draw_tile(top, tile_color, district == selected_location)
	_draw_roads()
	_draw_landmarks()
	_draw_npcs()
	_draw_player()
	_draw_map_legend()

func _tile_to_screen(cell: Vector2i) -> Vector2:
	var portrait := size.y > size.x * 1.25
	var map_zoom := zoom_factor * (1.35 if portrait else 1.0)
	var origin := Vector2(size.x * 0.50, 175.0 if portrait else 100.0) + camera_offset
	var iso := Vector2((cell.x - cell.y) * TILE_W * 0.5, (cell.x + cell.y) * TILE_H * 0.5)
	return origin + iso * map_zoom

func _draw_tile(top: Vector2, color: Color, highlighted: bool) -> void:
	var half_w := TILE_W * zoom_factor * 0.5
	var half_h := TILE_H * zoom_factor * 0.5
	var points := PackedVector2Array([
		top,
		top + Vector2(half_w, half_h),
		top + Vector2(0.0, half_h * 2.0),
		top + Vector2(-half_w, half_h)
	])
	draw_polygon(points, PackedColorArray([color]))
	draw_polyline(PackedVector2Array([points[0], points[1], points[2], points[3], points[0]]), Color(0.05, 0.10, 0.16, 0.45), 1.2)
	if highlighted:
		draw_polyline(PackedVector2Array([points[0], points[1], points[2], points[3], points[0]]), Color("#55D6BE"), 2.4)

func _district_for_cell(cell: Vector2i) -> String:
		if cell.x >= 7 and cell.x <= 12 and cell.y >= 6 and cell.y <= 9:
			return "square"
		if cell.x <= 6 and cell.y >= 7:
			return "residential"
		if cell.x >= 13 and cell.y >= 7:
			return "commercial"
		if cell.x >= 14 and cell.y <= 5:
			return "civic"
		if cell.x >= 7 and cell.x <= 13 and cell.y >= 10:
			return "industrial"
		return "park"

func _district_center(district: String) -> Vector2i:
	match district:
		"square": return Vector2i(9, 7)
		"residential": return Vector2i(3, 10)
		"commercial": return Vector2i(17, 10)
		"civic": return Vector2i(17, 2)
		"industrial": return Vector2i(10, 13)
		"park": return Vector2i(5, 3)
	return Vector2i(9, 7)

func _draw_roads() -> void:
	var road_color := Color("#D5B98B")
	for cell in [Vector2i(3, 5), Vector2i(4, 5), Vector2i(7, 5), Vector2i(8, 5), Vector2i(6, 3), Vector2i(6, 4)]:
		var top := _tile_to_screen(cell)
		var half_w := TILE_W * zoom_factor * 0.5
		var half_h := TILE_H * zoom_factor * 0.5
		var points := PackedVector2Array([top, top + Vector2(half_w, half_h), top + Vector2(0, half_h * 2), top + Vector2(-half_w, half_h)])
		draw_polyline(PackedVector2Array([points[0], points[1], points[2], points[3], points[0]]), road_color.darkened(0.12), 4.0)

func _draw_landmarks() -> void:
	var landmark_cells := {
			"square": [Vector2i(9, 7)],
			"residential": [Vector2i(2, 9), Vector2i(4, 11), Vector2i(5, 8)],
			"commercial": [Vector2i(16, 9), Vector2i(18, 11), Vector2i(17, 8)],
			"civic": [Vector2i(16, 2)],
			"industrial": [Vector2i(9, 12), Vector2i(12, 13)],
			"park": [Vector2i(4, 2), Vector2i(6, 3), Vector2i(5, 4)]
	}
	for district in landmark_cells.keys():
		for cell in landmark_cells[district]:
			var top := _tile_to_screen(cell)
			if district == "park":
				_draw_tree(top + Vector2(0, -8.0 * zoom_factor))
			elif district == "square":
				_draw_fountain(top)
			elif district == "civic":
				_draw_civic_hall(top)
			else:
				_draw_building(top, district)
		var center := _tile_to_screen(_district_center(district))
		var label: String = str(state.district_by_id(district).get("short", district)) if state else district
		draw_string(ThemeDB.fallback_font, center + Vector2(-38, 52) * zoom_factor, label, HORIZONTAL_ALIGNMENT_LEFT, -1, maxf(11.0 * zoom_factor, 9.0), Color("#F5F7FA"))

func _draw_building(top: Vector2, district: String) -> void:
	var s := zoom_factor
	var base := top + Vector2(0, -4 * s)
	var texture: Texture2D = TEX_SHOP if district == "commercial" else TEX_HOUSE
	var sprite_size := Vector2(58.0, 70.0) * s
	draw_texture_rect(texture, Rect2(base + Vector2(-29.0, -62.0) * s, sprite_size), false)
	return
	# Procedural fallback retained below for platforms without imported art.
	var w := 25 * s
	var h := 26 * s
	var wall := Color("#F5E8D0") if district == "residential" else Color("#FFE1B5")
	var roof := Color("#C86B65") if district == "residential" else Color("#D57A5B")
	var left := PackedVector2Array([base + Vector2(-w, 0), base + Vector2(0, 10*s), base + Vector2(0, 10*s-h), base + Vector2(-w, -h)])
	var right := PackedVector2Array([base + Vector2(0, 10*s), base + Vector2(w, 0), base + Vector2(w, -h), base + Vector2(0, 10*s-h)])
	draw_polygon(left, PackedColorArray([wall.darkened(0.08)]))
	draw_polygon(right, PackedColorArray([wall]))
	draw_line(base + Vector2(0, 10*s-h), base + Vector2(w, -h), roof, 4*s)
	draw_line(base + Vector2(-w, -h), base + Vector2(0, 10*s-h), roof.darkened(0.12), 4*s)
	draw_rect(Rect2(base + Vector2(7*s, -10*s), Vector2(6*s, 9*s)), Color("#6D90A4"))

func _draw_civic_hall(top: Vector2) -> void:
	var s := zoom_factor
	var base := top + Vector2(0, -6*s)
	draw_texture_rect(TEX_CIVIC, Rect2(base + Vector2(-38.0, -96.0) * s, Vector2(76.0, 104.0) * s), false)
	return
	var w := 42*s
	var h := 34*s
	draw_polygon(PackedVector2Array([base + Vector2(-w, 0), base + Vector2(0, 16*s), base + Vector2(w, 0), base + Vector2(0, -16*s)]), PackedColorArray([Color("#D6E7F4")]))
	draw_polygon(PackedVector2Array([base + Vector2(-w*0.72, -7*s), base + Vector2(0, -h), base + Vector2(w*0.72, -7*s), base + Vector2(0, 10*s)]), PackedColorArray([Color("#5C8DB9")]))
	for i in range(3):
		draw_line(base + Vector2(-20*s + i*20*s, -2*s), base + Vector2(-20*s + i*20*s, 19*s), Color("#F7FBFF"), 3*s)

func _draw_tree(position: Vector2) -> void:
	var s := zoom_factor
	draw_texture_rect(TEX_TREE if int(position.x) % 2 == 0 else TEX_TREE_FLOWERING, Rect2(position + Vector2(-27.0, -72.0) * s, Vector2(54.0, 76.0) * s), false)
	return
	draw_line(position + Vector2(0, 2*s), position + Vector2(0, 24*s), Color("#76553A"), 5*s)
	draw_circle(position + Vector2(-10*s, -8*s), 13*s, Color("#397C61"))
	draw_circle(position + Vector2(8*s, -12*s), 15*s, Color("#4D9A6F"))
	draw_circle(position + Vector2(0, -24*s), 12*s, Color("#68B77C"))

func _draw_fountain(top: Vector2) -> void:
	var s := zoom_factor
	draw_texture_rect(TEX_FOUNTAIN, Rect2(top + Vector2(-31.0, -46.0) * s, Vector2(62.0, 66.0) * s), false)
	return
	_draw_ellipse_custom(top + Vector2(0, 6*s), Vector2(28*s, 10*s), Color("#5BAFC0"))
	draw_circle(top + Vector2(0, -6*s), 5*s, Color("#D9F2F3"))
	draw_line(top + Vector2(0, -6*s), top + Vector2(0, -22*s), Color("#B7EEF0"), 3*s)

func _draw_ellipse_custom(center: Vector2, radii: Vector2, color: Color) -> void:
	var points := PackedVector2Array()
	for i in range(24):
		var angle := TAU * float(i) / 24.0
		points.append(center + Vector2(cos(angle) * radii.x, sin(angle) * radii.y))
	draw_colored_polygon(points, color)

func _npc_cell(npc: Dictionary) -> Vector2i:
	var location := state.npc_location(npc) if state else "square"
	var center := _district_center(location)
	var offset := (int(npc.get("id", "a").unicode_at(0)) % 3) - 1
	return center + Vector2i(offset, (int(npc.get("id", "a").unicode_at(0)) % 2))

func _draw_npcs() -> void:
	if state == null:
		return
	for npc in state.npc_templates:
		var cell := _npc_cell(npc)
		var position := _tile_to_screen(cell) + Vector2(0, -18 * zoom_factor)
		var color := Color(str(npc["color"]))
		if str(npc["id"]) == selected_npc:
			draw_circle(position + Vector2(0, -8), 17 * zoom_factor, Color("#55D6BE"))
		draw_circle(position + Vector2(0, -8), 11 * zoom_factor, Color("#FFF4DD"))
		draw_rect(Rect2(position + Vector2(-9, 1) * zoom_factor, Vector2(18, 15) * zoom_factor), color)
		draw_circle(position + Vector2(-4, -10) * zoom_factor, 2.2 * zoom_factor, Color("#233047"))
		draw_circle(position + Vector2(4, -10) * zoom_factor, 2.2 * zoom_factor, Color("#233047"))
		draw_string(ThemeDB.fallback_font, position + Vector2(-20, 29) * zoom_factor, str(npc["name"]), HORIZONTAL_ALIGNMENT_LEFT, -1, maxf(10 * zoom_factor, 8), Color("#E8F1F5"))
func _draw_player() -> void:
	if state == null:
		return
	var cell := _district_center(str(state.data.get("location", "square")))
	var position := _tile_to_screen(cell) + Vector2(0, -25 * zoom_factor)
	draw_texture_rect(TEX_PLAYER, Rect2(position + Vector2(-22.0, -64.0) * zoom_factor, Vector2(44.0, 76.0) * zoom_factor), false)
	draw_string(ThemeDB.fallback_font, position + Vector2(-24, 20) * zoom_factor, "KAMU", HORIZONTAL_ALIGNMENT_LEFT, -1, maxf(10 * zoom_factor, 8), Color("#55D6BE"))
	return
	draw_circle(position + Vector2(0, 4), 17 * zoom_factor, Color(0.05, 0.08, 0.13, 0.35))
	draw_circle(position, 14 * zoom_factor, Color("#55D6BE"))
	draw_circle(position + Vector2(0, -10) * zoom_factor, 8 * zoom_factor, Color("#FFE0B2"))
	draw_rect(Rect2(position + Vector2(-9, -2) * zoom_factor, Vector2(18, 18) * zoom_factor), Color("#315A78"))
	draw_circle(position + Vector2(-3, -11) * zoom_factor, 1.7 * zoom_factor, Color("#122039"))
	draw_circle(position + Vector2(3, -11) * zoom_factor, 1.7 * zoom_factor, Color("#122039"))
	draw_string(ThemeDB.fallback_font, position + Vector2(-24, 34) * zoom_factor, "KAMU", HORIZONTAL_ALIGNMENT_LEFT, -1, maxf(10 * zoom_factor, 8), Color("#55D6BE"))

func _draw_map_legend() -> void:
	var legend_position := Vector2(18, size.y - 34)
	draw_string(ThemeDB.fallback_font, legend_position, "Seret untuk pan  •  Scroll untuk zoom  •  Ketuk distrik atau warga", HORIZONTAL_ALIGNMENT_LEFT, -1, 12, Color("#A9BDD0"))

func _screen_to_cell(screen_position: Vector2) -> Vector2i:
	var portrait := size.y > size.x * 1.25
	var map_zoom := zoom_factor * (1.35 if portrait else 1.0)
	var origin := Vector2(size.x * 0.50, 175.0 if portrait else 100.0) + camera_offset
	var local := (screen_position - origin) / map_zoom
	var sx := local.x / (TILE_W * 0.5)
	var sy := local.y / (TILE_H * 0.5)
	var x := int(round((sx + sy) * 0.5))
	var y := int(round((sy - sx) * 0.5))
	return Vector2i(clampi(x, 0, MAP_W - 1), clampi(y, 0, MAP_H - 1))

func _npc_at(screen_position: Vector2) -> String:
	if state == null:
		return ""
	for npc in state.npc_templates:
		var cell := _npc_cell(npc)
		var position := _tile_to_screen(cell) + Vector2(0, -18 * zoom_factor)
		if screen_position.distance_to(position + Vector2(0, -8) * zoom_factor) < 24 * zoom_factor:
			return str(npc["id"])
	return ""

func _gui_input(event: InputEvent) -> void:
	if event is InputEventMouseButton:
		var mouse_event := event as InputEventMouseButton
		if mouse_event.button_index == MOUSE_BUTTON_WHEEL_UP and mouse_event.pressed:
			change_zoom(0.08)
			accept_event()
			return
		if mouse_event.button_index == MOUSE_BUTTON_WHEEL_DOWN and mouse_event.pressed:
			change_zoom(-0.08)
			accept_event()
			return
		if mouse_event.button_index == MOUSE_BUTTON_LEFT:
			if mouse_event.pressed:
				_dragging = true
				_drag_origin = mouse_event.position
				_drag_start_offset = camera_offset
				_drag_distance = 0.0
			else:
				_dragging = false
				if _drag_distance < 12.0:
					_select_at(mouse_event.position)
			accept_event()
	elif event is InputEventMouseMotion and _dragging:
		var motion := event as InputEventMouseMotion
		_drag_distance = _drag_origin.distance_to(motion.position)
		camera_offset = _drag_start_offset + motion.position - _drag_origin
		queue_redraw()
		accept_event()
	elif event is InputEventScreenTouch:
		var touch := event as InputEventScreenTouch
		if touch.pressed:
			_dragging = true
			_drag_origin = touch.position
			_drag_start_offset = camera_offset
			_drag_distance = 0.0
		else:
			_dragging = false
			if _drag_distance < 16.0:
				_select_at(touch.position)
			accept_event()
	elif event is InputEventScreenDrag and _dragging:
		var drag := event as InputEventScreenDrag
		_drag_distance = _drag_origin.distance_to(drag.position)
		camera_offset = _drag_start_offset + drag.position - _drag_origin
		queue_redraw()
		accept_event()

func _select_at(position: Vector2) -> void:
	var npc_id := _npc_at(position)
	if not npc_id.is_empty():
		selected_npc = npc_id
		npc_clicked.emit(npc_id)
		queue_redraw()
		return
	var cell := _screen_to_cell(position)
	var district := _district_for_cell(cell)
	selected_location = district
	location_clicked.emit(district)
	queue_redraw()
