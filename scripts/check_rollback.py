import json
transcript_path = r"C:\Users\pablo\.gemini\antigravity-cli\brain\485541bb-be82-4ab0-8b63-6f77754968aa\.system_generated\logs\transcript_full.jsonl"
with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            entry = json.loads(line)
            if entry.get("source") == "USER_EXPLICIT" and "vuelvas dentro de esta conversaci" in entry.get("content", ""):
                print(f"ROLLBACK COMMAND AT STEP: {entry.get('step_index')}")
                break
        except: pass
