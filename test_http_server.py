"""
End-to-end HTTP integration test for SkillBridge AI
Starts server in background thread, validates HTML & JSON responses, and exits.
"""

import threading
import time
import urllib.request
import json
import uvicorn

server_started = False

def run_server():
    config = uvicorn.Config("app:app", host="127.0.0.1", port=8001, log_level="warning")
    server = uvicorn.Server(config)
    server.run()

if __name__ == "__main__":
    t = threading.Thread(target=run_server, daemon=True)
    t.start()
    time.sleep(2.0)  # Wait for server to bind

    base_url = "http://127.0.0.1:8001"
    print(">>> Testing HTTP Endpoints against Live Server...")

    # 1. Test Index HTML
    req = urllib.request.urlopen(f"{base_url}/")
    html_content = req.read().decode('utf-8')
    assert "<title>SkillBridge AI" in html_content, "HTML Title check failed"
    print(" [PASS] GET / -> HTTP 200 (Index HTML served successfully)")

    # 2. Test CSS
    req_css = urllib.request.urlopen(f"{base_url}/static/css/style.css")
    assert req_css.status == 200, "CSS status failed"
    print(" [PASS] GET /static/css/style.css -> HTTP 200 (Stylesheets served)")

    # 3. Test JS
    req_js = urllib.request.urlopen(f"{base_url}/static/js/app.js")
    assert req_js.status == 200, "JS status failed"
    print(" [PASS] GET /static/js/app.js -> HTTP 200 (Scripts served)")

    # 4. Test API Users
    req_api = urllib.request.urlopen(f"{base_url}/api/users")
    users = json.loads(req_api.read().decode('utf-8'))
    assert len(users["users"]) >= 4, "Users API check failed"
    print(f" [PASS] GET /api/users -> HTTP 200 ({len(users['users'])} users returned)")

    # 5. Test Skill Gap Radar API
    req_gap = urllib.request.urlopen(f"{base_url}/api/students/1/gap-analysis")
    gap = json.loads(req_gap.read().decode('utf-8'))
    assert "radar" in gap, "Gap API check failed"
    print(f" [PASS] GET /api/students/1/gap-analysis -> HTTP 200 (Radar data loaded)")

    print("\n>>> LIVE SERVER VERIFICATION COMPLETED SUCCESSFULLY! <<<")
