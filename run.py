"""
SkillBridge AI - Launcher Script
Starts the FastAPI application and opens the portal in your browser.
"""

import sys
import webbrowser
import threading
import time
import uvicorn

def open_browser():
    time.sleep(1.2)
    url = "http://127.0.0.1:8000"
    print(f"\n[SkillBridge AI] Opening portal in your web browser: {url}\n")
    try:
        webbrowser.open(url)
    except Exception as e:
        print(f"Could not open browser automatically: {e}")

if __name__ == "__main__":
    print("=" * 65)
    print("   SKILLBRIDGE AI - ACADEMIA-INDUSTRY COLLABORATION PORTAL")
    print("      Smart India Hackathon (SIH) Evaluation Platform")
    print("=" * 65)
    print("Server running at: http://127.0.0.1:8000")
    print("Press CTRL+C to terminate.")
    print("=" * 65)

    if "--no-browser" not in sys.argv:
        threading.Thread(target=open_browser, daemon=True).start()

    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=False)
