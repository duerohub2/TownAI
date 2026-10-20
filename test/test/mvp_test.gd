extends Node

var failures: PackedStringArray = []
var checks := 0

func _ready() -> void:
	call_deferred("_run")

func _check(condition: bool, message: String) -> void:
	checks += 1
	if not condition:
		failures.append(message)

func _run() -> void:
	var packed: PackedScene = load("res://scenes/main.tscn")
	_check(packed != null, "main scene harus dapat dimuat")
	if packed == null:
		_finish()
		return
	var main := packed.instantiate()
	get_tree().root.add_child(main)
	await get_tree().process_frame
	await get_tree().process_frame
	_check(main.get_node_or_null("CityMap") != null, "peta kota harus hadir pada boot")
	_check(main.get_node_or_null("Header") != null, "header status harus hadir pada boot")
	_check(main.get_node_or_null("ContextPanel") != null, "panel konteks harus hadir pada boot")
	var state := main.get_node_or_null("TownGameState") as TownGameState
	_check(state != null, "state permainan harus hadir pada boot")
	if state != null:
		state.reset_state()
		_check(int(state.data.get("coins", 0)) == 120, "state awal harus memiliki 120 koin")
		state.travel("commercial")
		_check(str(state.data.get("location", "")) == "commercial", "perjalanan harus mengubah lokasi")
		var purchase: Dictionary = state.buy_item("kopi")
		_check(bool(purchase.get("ok", false)), "pembelian item dasar harus berhasil dengan saldo cukup")
		_check(int((state.data.get("inventory", {}) as Dictionary).get("kopi", 0)) == 2, "inventory harus bertambah setelah pembelian")
		_check(int(state.data.get("coins", 0)) == 108, "pembelian harus mengurangi saldo secara deterministik")
		state.accept_job("courier")
		_check(not state.current_job().is_empty(), "pekerjaan harus dapat diterima")
		state.complete_job()
		_check(int(state.data.get("coins", 0)) == 150, "shift selesai harus memberi reward koin")
		_check(int(state.data.get("jobs_completed", 0)) == 1, "counter shift selesai harus bertambah")
		_check((state.data.get("activity_log", []) as Array).size() > 0, "aktivitas harus dicatat")
	state.queue_free()
	main.queue_free()
	await get_tree().process_frame
	_finish()

func _finish() -> void:
	if failures.is_empty():
		print("[ai-living-city-tests] PASS: %d checks" % checks)
		get_tree().quit(0)
	else:
		for failure in failures:
			push_error("[ai-living-city-tests] " + failure)
		print("[ai-living-city-tests] FAIL: %d failures across %d checks" % [failures.size(), checks])
		get_tree().quit(1)
