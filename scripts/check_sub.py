import json
transcript_path = r"C:\Users\pablo\.gemini\antigravity-cli\brain\485541bb-be82-4ab0-8b63-6f77754968aa\.system_generated\logs\transcript_full.jsonl"
with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            entry = json.loads(line)
            content = entry.get("content", "")
            if "from agent" in content.lower() and "```tsx" in content:
                print(f"MESSAGE AT STEP {entry.get('step_index')}")
        except: pass
