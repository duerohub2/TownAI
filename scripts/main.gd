extends Control

const TownGameStateType = preload("res://scripts/game_state.gd")
const CityMapType = preload("res://scripts/city_map.gd")

var state: TownGameState
var city_map: Control
var header: PanelContainer
var sidebar: PanelContainer
var footer: PanelContainer
var toast_label: Label
var coins_label: Label
var clock_label: Label
var save_label: Label
var location_label: Label
var location_desc: Label
var profile_label: Label
var needs_label: Label
var activity_label: Label
var npc_label: Label
var talk_button: Button
var primary_action_button: Button
var jobs_box: VBoxContainer
var shop_box: VBoxContainer
var inventory_label: Label
var job_status_label: Label
var work_button: Button
var work_progress: ProgressBar
var reduced_motion_check: CheckButton
var selected_location := "square"
var selected_npc_id := ""
var working := false
var work_elapsed := 0.0
var toast_elapsed := 0.0

var palette := {
	"panel": Color("#152238"),
	"panel_soft": Color("#1B2C44"),
	"border": Color("#29435B"),
	"text": Color("#F6F4EE"),
	"muted": Color("#A9BDD0"),
	"teal": Color("#55D6BE"),
	"amber": Color("#F6C56F"),
	"red": Color("#F59E8B")
}

func _ready() -> void:
	state = TownGameStateType.new()
	state.name = "TownGameState"
	add_child(state)
	state.changed.connect(_refresh_all)
	_build_city_map()
	_build_header()
	_build_sidebar()
	_build_footer()
	resized.connect(_layout_responsive)
	_layout_responsive()
	_refresh_all()

func _process(delta: float) -> void:
	state.tick(delta)
	if working:
		work_elapsed += delta
		work_progress.value = minf(work_elapsed / 3.4, 1.0) * 100.0
		if work_elapsed >= 3.4:
			working = false
			work_elapsed = 0.0
			var completed := state.complete_job()
			if not completed.is_empty():
				_show_toast("Shift selesai. +%d koin" % int(completed["reward"]))
			_refresh_all()
	if toast_elapsed > 0.0:
		toast_elapsed -= delta
		if toast_elapsed <= 0.0:
			toast_label.text = ""

func _build_city_map() -> void:
	city_map = CityMapType.new()
	city_map.name = "CityMap"
	city_map.mouse_filter = Control.MOUSE_FILTER_STOP
	city_map.set_game_state(state)
	city_map.location_clicked.connect(_on_location_clicked)
	city_map.npc_clicked.connect(_on_npc_clicked)
	add_child(city_map)

func _build_header() -> void:
	header = PanelContainer.new()
	header.name = "Header"
	header.add_theme_stylebox_override("panel", _panel_style(palette["panel"], palette["border"], 14))
	header.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(header)
	var row := HBoxContainer.new()
	row.add_theme_constant_override("separation", 12)
	row.add_theme_constant_override("margin_left", 14)
	header.add_child(row)
	var brand := Label.new()
	brand.text = "AI LIVING CITY"
	brand.add_theme_font_size_override("font_size", 20)
	brand.add_theme_color_override("font_color", palette["teal"])
	row.add_child(brand)
	var subtitle := _label("kota kecil, cerita besar", 12, palette["muted"])
	subtitle.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	row.add_child(subtitle)
	var spacer := Control.new()
	spacer.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	row.add_child(spacer)
	coins_label = _label("◈ 120", 15, palette["amber"])
	row.add_child(coins_label)
	clock_label = _label("Hari 1 09:30", 14, palette["text"])
	row.add_child(clock_label)
	save_label = _label("● Tersimpan lokal", 12, palette["teal"])
	row.add_child(save_label)
	var zoom_out := _button("−", 40)
	zoom_out.tooltip_text = "Perkecil peta"
	zoom_out.pressed.connect(func(): city_map.change_zoom(-0.08))
	row.add_child(zoom_out)
	var zoom_in := _button("+", 40)
	zoom_in.tooltip_text = "Perbesar peta"
	zoom_in.pressed.connect(func(): city_map.change_zoom(0.08))
	row.add_child(zoom_in)
	reduced_motion_check = CheckButton.new()
	reduced_motion_check.text = "Minim animasi"
	reduced_motion_check.add_theme_font_size_override("font_size", 11)
	reduced_motion_check.add_theme_color_override("font_color", palette["muted"])
	reduced_motion_check.toggled.connect(_on_reduced_motion_toggled)
	row.add_child(reduced_motion_check)

func _build_sidebar() -> void:
	sidebar = PanelContainer.new()
	sidebar.name = "ContextPanel"
	sidebar.add_theme_stylebox_override("panel", _panel_style(palette["panel"], palette["border"], 16))
	add_child(sidebar)
	var margin := MarginContainer.new()
	margin.add_theme_constant_override("margin_left", 18)
	margin.add_theme_constant_override("margin_right", 18)
	margin.add_theme_constant_override("margin_top", 16)
	margin.add_theme_constant_override("margin_bottom", 14)
	sidebar.add_child(margin)
	var scroll := ScrollContainer.new()
	scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	margin.add_child(scroll)
	var content := VBoxContainer.new()
	content.add_theme_constant_override("separation", 9)
	scroll.add_child(content)
	content.add_child(_eyebrow("PROFIL PENGHUNI"))
	profile_label = _label("Raka", 18, palette["text"])
	content.add_child(profile_label)
	needs_label = _label("Energi 82  •  Mood 70  •  Reputasi 8", 12, palette["muted"])
	needs_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	content.add_child(needs_label)
	content.add_child(_separator())
	content.add_child(_eyebrow("LOKASI TERPILIH"))
	location_label = _label("Town Square", 17, palette["amber"])
	content.add_child(location_label)
	location_desc = _label("", 12, palette["muted"])
	location_desc.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	content.add_child(location_desc)
	primary_action_button = _button("Lakukan aktivitas", 0)
	primary_action_button.pressed.connect(_on_primary_action)
	content.add_child(primary_action_button)
	content.add_child(_separator())
	content.add_child(_eyebrow("WARGA DI SEKITAR"))
	npc_label = _label("Pilih warga di peta untuk melihat profilnya.", 12, palette["muted"])
	npc_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	content.add_child(npc_label)
	talk_button = _button("Sapa warga", 0)
	talk_button.pressed.connect(_on_talk)
	content.add_child(talk_button)
	content.add_child(_separator())
	content.add_child(_eyebrow("PEKERJAAN"))
	job_status_label = _label("Belum ada pekerjaan aktif.", 12, palette["muted"])
	job_status_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	content.add_child(job_status_label)
	work_progress = ProgressBar.new()
	work_progress.max_value = 100.0
	work_progress.value = 0.0
	work_progress.show_percentage = false
	work_progress.custom_minimum_size = Vector2(0, 7)
	content.add_child(work_progress)
	work_button = _button("Mulai shift", 0)
	work_button.pressed.connect(_start_work)
	content.add_child(work_button)
	jobs_box = VBoxContainer.new()
	jobs_box.add_theme_constant_override("separation", 6)
	content.add_child(jobs_box)
	content.add_child(_separator())
	content.add_child(_eyebrow("TOKO DASAR"))
	var shop_hint := _label("Belanja hanya tersedia di Commercial District.", 11, palette["muted"])
	shop_hint.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	content.add_child(shop_hint)
	shop_box = VBoxContainer.new()
	shop_box.add_theme_constant_override("separation", 6)
	content.add_child(shop_box)
	content.add_child(_separator())
	content.add_child(_eyebrow("INVENTORY"))
	inventory_label = _label("", 12, palette["text"])
	inventory_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	content.add_child(inventory_label)
	var reset_button := _button("Reset progres lokal", 0)
	reset_button.add_theme_color_override("font_color", palette["red"])
	reset_button.pressed.connect(_reset_progress)
	content.add_child(reset_button)

func _build_footer() -> void:
	footer = PanelContainer.new()
	footer.name = "Footer"
	footer.add_theme_stylebox_override("panel", _panel_style(Color("#101B2C"), Color("#21384E"), 12))
	footer.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(footer)
	var row := HBoxContainer.new()
	row.add_theme_constant_override("separation", 10)
	footer.add_child(row)
	var dot := Label.new()
	dot.text = "●"
	dot.add_theme_color_override("font_color", palette["teal"])
	row.add_child(dot)
	toast_label = _label("Pilih distrik di peta untuk mulai.", 12, palette["text"])
	toast_label.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	row.add_child(toast_label)
	var hint := _label("MVP offline • progres tersimpan di perangkat ini", 11, palette["muted"])
	row.add_child(hint)

func _layout_responsive() -> void:
	if not is_instance_valid(city_map):
		return
	# Web export may keep a wide logical canvas while the browser exposes a tall portrait viewport.
	var compact := size.x < 700.0 or size.y > size.x * 1.25
	city_map.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	city_map.offset_top = 78.0
	city_map.offset_left = 0.0
	if compact:
		var mobile_panel_height := 520.0
		city_map.offset_right = 0.0
		city_map.offset_bottom = -(mobile_panel_height + 42.0)
		sidebar.anchor_left = 0.0
		sidebar.anchor_right = 1.0
		sidebar.anchor_top = 0.0
		sidebar.anchor_bottom = 1.0
		sidebar.offset_left = 12.0
		sidebar.offset_right = -12.0
		sidebar.offset_top = size.y - mobile_panel_height
		sidebar.offset_bottom = -42.0
	else:
		city_map.offset_right = -332.0
		city_map.offset_bottom = -44.0
		sidebar.anchor_left = 1.0
		sidebar.anchor_right = 1.0
		sidebar.anchor_top = 0.0
		sidebar.anchor_bottom = 1.0
		sidebar.offset_left = -318.0
		sidebar.offset_right = -14.0
		sidebar.offset_top = 82.0
		sidebar.offset_bottom = -44.0
	header.set_anchors_preset(Control.PRESET_TOP_WIDE)
	header.offset_left = 14.0
	header.offset_right = -14.0
	header.offset_top = 14.0
	header.offset_bottom = 68.0
	footer.set_anchors_preset(Control.PRESET_BOTTOM_WIDE)
	footer.offset_left = 14.0
	footer.offset_right = -14.0
	footer.offset_top = -38.0
	footer.offset_bottom = -12.0

func _apply_responsive_layout() -> void:
	_layout_responsive()

func _refresh_all() -> void:
	if not is_instance_valid(state) or not is_instance_valid(location_label):
		return
	var district := state.district_by_id(selected_location)
	coins_label.text = "◈ %d" % int(state.data.get("coins", 0))
	clock_label.text = "Hari %d  %s" % [int(state.data.get("day", 1)), state.current_time_text()]
	save_label.text = "● Tersimpan lokal"
	profile_label.text = "%s  •  Penghuni #001" % str(state.data.get("display_name", "Raka"))
	needs_label.text = "Energi %d  •  Mood %d  •  Reputasi %d" % [int(state.data.get("energy", 0)), int(state.data.get("mood", 0)), int(state.data.get("reputation", 0))]
	location_label.text = str(district.get("name", selected_location))
	location_desc.text = str(district.get("description", ""))
	primary_action_button.text = _action_label(selected_location)
	_refresh_npc()
	_refresh_jobs()
	_refresh_shop()
	_refresh_inventory()
	city_map.set_selected_location(selected_location)
	city_map.reduced_motion = bool(state.data.get("reduced_motion", false))
	reduced_motion_check.button_pressed = city_map.reduced_motion

func _refresh_npc() -> void:
	if selected_npc_id.is_empty():
		npc_label.text = "Pilih warga di peta untuk melihat profilnya."
		talk_button.disabled = true
		return
	var npc := state.npc_by_id(selected_npc_id)
	if npc.is_empty():
		return
	var affinity: Dictionary = state.data.get("npc_affinity", {})
	npc_label.text = "%s  •  %s\n%s\nJadwal sekarang: %s\nKedekatan: %d" % [npc["name"], npc["role"], npc["bio"], state.district_name(state.npc_location(npc)), int(affinity.get(selected_npc_id, 0))]
	talk_button.disabled = false

func _refresh_jobs() -> void:
	for child in jobs_box.get_children():
		child.queue_free()
	var current := state.current_job()
	if not current.is_empty():
		job_status_label.text = "Aktif: %s\n%s • reward %d koin" % [current["title"], current["place"], int(current["reward"])]
		work_button.disabled = working
	else:
		job_status_label.text = "Belum ada pekerjaan aktif. Pilih satu untuk memulai rutinitas."
		work_button.disabled = true
	work_progress.value = 0.0
	for job in state.jobs:
		var job_button := _button("%s  ·  +%d ◈" % [job["title"], int(job["reward"])], 0)
		job_button.tooltip_text = str(job["description"])
		job_button.disabled = not current.is_empty() or working
		job_button.pressed.connect(_accept_job.bind(str(job["id"])))
		jobs_box.add_child(job_button)

func _refresh_shop() -> void:
	for child in shop_box.get_children():
		child.queue_free()
	for item in state.shop_items:
		var item_button := _button("%s %s  ·  %d ◈" % [item["icon"], item["name"], int(item["price"])], 0)
		item_button.tooltip_text = str(item["effect"])
		item_button.disabled = selected_location != "commercial" or int(state.data.get("coins", 0)) < int(item["price"])
		item_button.pressed.connect(_buy_item.bind(str(item["id"])))
		shop_box.add_child(item_button)

func _refresh_inventory() -> void:
	var inventory: Dictionary = state.data.get("inventory", {})
	inventory_label.text = "☕ Kopi hangat  ×%d\n▰ Roti panggang  ×%d\n✿ Bibit tanaman  ×%d\n\nShift selesai: %d" % [int(inventory.get("kopi", 0)), int(inventory.get("roti", 0)), int(inventory.get("tanaman", 0)), int(state.data.get("jobs_completed", 0))]

func _action_label(location_id: String) -> String:
	match location_id:
		"square": return "Sapa suasana alun-alun"
		"residential": return "Istirahat di permukiman"
		"commercial": return "Lihat aktivitas toko"
		"civic": return "Baca pengumuman kota"
		"park": return "Santai di taman"
	return "Lakukan aktivitas"

func _on_location_clicked(location_id: String) -> void:
	selected_location = location_id
	selected_npc_id = ""
	state.travel(location_id)
	_show_toast("Kamu tiba di %s." % state.district_name(location_id))
	_refresh_all()

func _on_npc_clicked(npc_id: String) -> void:
	selected_npc_id = npc_id
	var npc := state.npc_by_id(npc_id)
	selected_location = state.npc_location(npc)
	_show_toast("%s sedang berada di %s." % [npc["name"], state.district_name(selected_location)])
	_refresh_all()

func _on_primary_action() -> void:
	var message := state.perform_location_action(selected_location)
	_show_toast(message)
	_refresh_all()

func _on_talk() -> void:
	if selected_npc_id.is_empty():
		return
	var message := state.talk_to_npc(selected_npc_id)
	_show_toast(message)
	_refresh_all()

func _accept_job(job_id: String) -> void:
	if state.accept_job(job_id):
		_show_toast("Pekerjaan diterima. Tekan Mulai shift saat siap.")
		_refresh_all()

func _start_work() -> void:
	if state.current_job().is_empty() or working:
		return
	working = true
	work_elapsed = 0.0
	work_progress.value = 0.0
	_show_toast("Shift dimulai. Selesaikan aktivitas ini...")
	_refresh_all()

func _buy_item(item_id: String) -> void:
	var result := state.buy_item(item_id)
	_show_toast(str(result.get("message", "")))
	_refresh_all()

func _on_reduced_motion_toggled(enabled: bool) -> void:
	if state == null:
		return
	state.data["reduced_motion"] = enabled
	city_map.reduced_motion = enabled
	state.save_state()
	_show_toast("Pengaturan animasi diperbarui.")

func _reset_progress() -> void:
	working = false
	selected_location = "square"
	selected_npc_id = ""
	state.reset_state()
	_show_toast("Progres lokal direset ke awal kota.")
	_refresh_all()

func _show_toast(message: String) -> void:
	toast_label.text = message
	toast_elapsed = 4.0

func _label(text: String, font_size: int, color: Color) -> Label:
	var label := Label.new()
	label.text = text
	label.add_theme_font_size_override("font_size", font_size)
	label.add_theme_color_override("font_color", color)
	return label

func _eyebrow(text: String) -> Label:
	var label := _label(text, 10, palette["teal"])
	label.text = text
	return label

func _button(text: String, width: float) -> Button:
	var button := Button.new()
	button.text = text
	button.custom_minimum_size = Vector2(width, 34) if width > 0 else Vector2(0, 34)
	button.add_theme_font_size_override("font_size", 12)
	button.add_theme_color_override("font_color", palette["text"])
	button.add_theme_color_override("font_hover_color", Color.WHITE)
	button.add_theme_stylebox_override("normal", _panel_style(palette["panel_soft"], palette["border"], 8))
	button.add_theme_stylebox_override("hover", _panel_style(Color("#28445C"), palette["teal"], 8))
	button.add_theme_stylebox_override("pressed", _panel_style(Color("#315A78"), palette["teal"], 8))
	button.add_theme_stylebox_override("disabled", _panel_style(Color("#162236"), Color("#22364B"), 8))
	return button

func _separator() -> HSeparator:
	var separator := HSeparator.new()
	separator.add_theme_constant_override("separation", 4)
	separator.add_theme_color_override("separator", palette["border"])
	return separator

func _panel_style(background: Color, border: Color, radius: int) -> StyleBoxFlat:
	var style := StyleBoxFlat.new()
	style.bg_color = background
	style.border_color = border
	style.set_border_width_all(1)
	style.set_corner_radius_all(radius)
	style.content_margin_left = 10
	style.content_margin_right = 10
	style.content_margin_top = 6
	style.content_margin_bottom = 6
	return style
