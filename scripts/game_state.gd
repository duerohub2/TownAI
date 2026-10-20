class_name TownGameState
extends Node

signal changed

const SAVE_PATH := "user://townai_save.json"

var data: Dictionary = {}
var _tick_accumulator := 0.0

var districts: Array[Dictionary] = [
	{"id": "square", "name": "Town Square", "short": "Alun-alun", "description": "Pusat kota untuk bertemu warga dan melihat kabar terbaru."},
	{"id": "residential", "name": "Residential District", "short": "Permukiman", "description": "Jalan tenang, rumah warga, dan tempat memulihkan energi."},
	{"id": "commercial", "name": "Commercial District", "short": "Komersial", "description": "Toko, kedai, dan papan lowongan pekerjaan kota."},
	{"id": "civic", "name": "Civic District", "short": "Civic", "description": "Balai kota dan pusat layanan publik."},
	{"id": "park", "name": "Park District", "short": "Taman", "description": "Ruang hijau untuk melepas penat dan bertemu tetangga."}
]

var jobs: Array[Dictionary] = [
	{"id": "courier", "title": "Antar paket", "place": "Commercial District", "duration": "Shift singkat", "reward": 42, "description": "Bantu toko mengantar paket ke sisi lain kota."},
	{"id": "gardener", "title": "Rawat taman", "place": "Park District", "duration": "Shift singkat", "reward": 34, "description": "Rapikan jalur dan tanaman di taman kota."},
	{"id": "clerk", "title": "Jaga loket", "place": "Civic District", "duration": "Shift singkat", "reward": 38, "description": "Bantu warga menemukan layanan di balai kota."}
]

var shop_items: Array[Dictionary] = [
	{"id": "kopi", "name": "Kopi hangat", "price": 12, "effect": "Energi +10", "icon": "☕"},
	{"id": "roti", "name": "Roti panggang", "price": 16, "effect": "Energi +16", "icon": "▰"},
	{"id": "tanaman", "name": "Bibit tanaman", "price": 28, "effect": "Reputasi +2", "icon": "✿"}
]

var npc_templates: Array[Dictionary] = [
	{"id": "mira", "name": "Mira", "role": "Pemilik kedai", "color": "#F59E8B", "schedule": ["commercial", "square", "park", "commercial"], "bio": "Selalu tahu kabar baru dari toko-toko kota."},
	{"id": "bima", "name": "Bima", "role": "Tukang kebun", "color": "#78C89A", "schedule": ["park", "park", "residential", "square"], "bio": "Mengukur kualitas udara sambil merawat taman."},
	{"id": "sari", "name": "Sari", "role": "Petugas balai kota", "color": "#82B6EA", "schedule": ["civic", "civic", "square", "residential"], "bio": "Membantu warga memahami layanan kota."},
	{"id": "jo", "name": "Jo", "role": "Kurir sepeda", "color": "#E8C36A", "schedule": ["commercial", "residential", "commercial", "park"], "bio": "Bergerak cepat dan hafal semua jalan pintas."},
	{"id": "lani", "name": "Lani", "role": "Ilustrator", "color": "#C09BE8", "schedule": ["residential", "park", "square", "commercial"], "bio": "Mencari sudut kota yang punya cahaya paling bagus."}
]

func _ready() -> void:
	load_state()

func _default_state() -> Dictionary:
	return {
		"display_name": "Raka",
		"coins": 120,
		"location": "square",
		"energy": 82,
		"mood": 70,
		"reputation": 8,
		"inventory": {"kopi": 1, "roti": 0, "tanaman": 0},
		"current_job": "",
		"jobs_completed": 0,
		"day": 1,
		"world_hour": 9.5,
		"activity_log": [{"time": "09:30", "text": "Tiba di kota untuk pertama kali."}],
		"npc_affinity": {},
		"reduced_motion": false,
		"last_saved": ""
	}

func load_state() -> void:
	data = _default_state()
	if FileAccess.file_exists(SAVE_PATH):
		var file := FileAccess.open(SAVE_PATH, FileAccess.READ)
		if file:
			var parsed = JSON.parse_string(file.get_as_text())
			if parsed is Dictionary:
				for key in data.keys():
					if parsed.has(key):
						data[key] = parsed[key]
	if not data.has("inventory") or not data["inventory"] is Dictionary:
		data["inventory"] = {"kopi": 0, "roti": 0, "tanaman": 0}
	if not data.has("activity_log") or not data["activity_log"] is Array:
		data["activity_log"] = []

func save_state() -> void:
	data["last_saved"] = Time.get_datetime_string_from_system()
	var file := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if file:
		file.store_string(JSON.stringify(data))
	changed.emit()

func reset_state() -> void:
	data = _default_state()
	save_state()

func district_by_id(id: String) -> Dictionary:
	for district in districts:
		if district["id"] == id:
			return district
	return districts[0]

func district_name(id: String) -> String:
	return str(district_by_id(id).get("name", id))

func current_time_text() -> String:
	var hour := int(floor(float(data.get("world_hour", 9.5))))
	var minutes := int(round((float(data.get("world_hour", 9.5)) - hour) * 60.0))
	if minutes >= 60:
		hour += 1
		minutes = 0
	return "%02d:%02d" % [hour % 24, minutes]

func add_activity(text: String) -> void:
	var log: Array = data.get("activity_log", [])
	log.push_front({"time": current_time_text(), "text": text})
	while log.size() > 7:
		log.pop_back()
	data["activity_log"] = log

func _commit(text: String = "") -> void:
	if not text.is_empty():
		add_activity(text)
	save_state()

func travel(destination_id: String) -> void:
	if destination_id == str(data.get("location", "square")):
		_commit("Menikmati waktu di %s." % district_name(destination_id))
		return
	data["location"] = destination_id
	advance_time(0.25, false)
	_commit("Berjalan menuju %s." % district_name(destination_id))

func advance_time(hours: float, should_save := true) -> void:
	data["world_hour"] = float(data.get("world_hour", 9.5)) + hours
	while float(data["world_hour"]) >= 22.0:
		data["world_hour"] = float(data["world_hour"]) - 14.0
		data["day"] = int(data.get("day", 1)) + 1
	if should_save:
		save_state()

func perform_location_action(location_id: String) -> String:
	var message := ""
	match location_id:
		"square":
			data["mood"] = clampi(int(data.get("mood", 70)) + 6, 0, 100)
			message = "Menyapa warga di alun-alun. Mood +6."
		"residential":
			data["energy"] = clampi(int(data.get("energy", 82)) + 22, 0, 100)
			message = "Beristirahat di permukiman. Energi +22."
		"commercial":
			data["mood"] = clampi(int(data.get("mood", 70)) + 3, 0, 100)
			message = "Melihat etalase toko. Ada banyak hal untuk dibeli."
		"civic":
			data["reputation"] = clampi(int(data.get("reputation", 8)) + 1, 0, 100)
			message = "Membaca papan pengumuman kota. Reputasi +1."
		"park":
			data["energy"] = clampi(int(data.get("energy", 82)) + 10, 0, 100)
			data["mood"] = clampi(int(data.get("mood", 70)) + 12, 0, 100)
			message = "Menikmati udara taman. Energi +10, mood +12."
		_:
			message = "Tidak ada aktivitas khusus di lokasi ini."
	advance_time(0.5, false)
	_commit(message)
	return message

func accept_job(job_id: String) -> bool:
	for job in jobs:
		if job["id"] == job_id:
			data["current_job"] = job_id
			_commit("Mengambil pekerjaan: %s." % job["title"])
			return true
	return false

func current_job() -> Dictionary:
	var id := str(data.get("current_job", ""))
	for job in jobs:
		if job["id"] == id:
			return job
	return {}

func complete_job() -> Dictionary:
	var job := current_job()
	if job.is_empty():
		return {}
	data["coins"] = int(data.get("coins", 0)) + int(job["reward"])
	data["energy"] = clampi(int(data.get("energy", 82)) - 14, 0, 100)
	data["reputation"] = clampi(int(data.get("reputation", 8)) + 2, 0, 100)
	data["jobs_completed"] = int(data.get("jobs_completed", 0)) + 1
	data["current_job"] = ""
	advance_time(2.0, false)
	_commit("Shift selesai: +%d koin dan reputasi +2." % int(job["reward"]))
	return job

func buy_item(item_id: String) -> Dictionary:
	for item in shop_items:
		if item["id"] == item_id:
			var price := int(item["price"])
			if int(data.get("coins", 0)) < price:
				return {"ok": false, "message": "Koin belum cukup untuk membeli %s." % item["name"]}
			data["coins"] = int(data.get("coins", 0)) - price
			var inventory: Dictionary = data.get("inventory", {})
			inventory[item_id] = int(inventory.get(item_id, 0)) + 1
			data["inventory"] = inventory
			if item_id == "kopi":
				data["energy"] = clampi(int(data.get("energy", 82)) + 10, 0, 100)
			elif item_id == "roti":
				data["energy"] = clampi(int(data.get("energy", 82)) + 16, 0, 100)
			elif item_id == "tanaman":
				data["reputation"] = clampi(int(data.get("reputation", 8)) + 2, 0, 100)
			_commit("Membeli %s %s." % [item["icon"], item["name"]])
			return {"ok": true, "message": "%s masuk ke inventory." % item["name"]}
	return {"ok": false, "message": "Item tidak ditemukan."}

func npc_by_id(npc_id: String) -> Dictionary:
	for npc in npc_templates:
		if npc["id"] == npc_id:
			return npc
	return {}

func npc_location(npc: Dictionary) -> String:
	var schedule: Array = npc.get("schedule", ["square"])
	var hour := float(data.get("world_hour", 9.5))
	var slot := int(floor(maxf(hour - 8.0, 0.0) / 3.0)) % maxi(schedule.size(), 1)
	return str(schedule[slot])

func talk_to_npc(npc_id: String) -> String:
	var npc := npc_by_id(npc_id)
	if npc.is_empty():
		return "Warga tidak ditemukan."
	var affinity: Dictionary = data.get("npc_affinity", {})
	var next_value := int(affinity.get(npc_id, 0)) + 1
	affinity[npc_id] = next_value
	data["npc_affinity"] = affinity
	data["mood"] = clampi(int(data.get("mood", 70)) + 5, 0, 100)
	advance_time(0.25, false)
	var lines := ["Kota terasa lebih dekat setelah mengobrol.", "Kamu mendapat cerita baru dari warga.", "Obrolan singkat, tapi menyenangkan."]
	var message: String = lines[next_value % lines.size()]
	_commit("Mengobrol dengan %s. %s" % [npc["name"], message])
	return message

func tick(delta: float) -> void:
	_tick_accumulator += delta
	if _tick_accumulator < 6.0:
		return
	_tick_accumulator = 0.0
	advance_time(0.25, false)
	# NPC schedule changes are deterministic and do not need a server in this MVP.
	save_state()
