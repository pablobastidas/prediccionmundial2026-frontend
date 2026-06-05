import json
transcript_path = r"C:\Users\pablo\.gemini\antigravity-cli\brain\485541bb-be82-4ab0-8b63-6f77754968aa\.system_generated\logs\transcript_full.jsonl"
with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            entry = json.loads(line)
            if entry.get("type") == "PLANNER_RESPONSE":
                tcs = entry.get("tool_calls", [])
                for tc in tcs:
                    if tc.get("name") in ["replace_file_content", "write_to_file", "multi_replace_file_content"]:
                        args = tc.get("args", {})
                        tf = args.get("TargetFile", "")
                        print(f"STEP {entry.get('step_index')}: {tc.get('name')} -> {tf}")
        except: pass
