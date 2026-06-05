import json
transcript_path = r"C:\Users\pablo\.gemini\antigravity-cli\brain\485541bb-be82-4ab0-8b63-6f77754968aa\.system_generated\logs\transcript_full.jsonl"
with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            entry = json.loads(line)
            if entry.get("type") == "PLANNER_RESPONSE":
                tcs = entry.get("tool_calls", [])
                for tc in tcs:
                    if tc.get("name") in ["replace_file_content", "multi_replace_file_content"]:
                        args = tc.get("args", {})
                        if args.get("TargetFile", "").endswith("types\\index.ts"):
                            print(json.dumps(args, indent=2))
        except: pass
