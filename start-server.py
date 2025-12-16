#!/usr/bin/env python3
"""
Simple HTTP server for Solar Decision Maharashtra website
Run this file to start the local development server
"""

import http.server
import socketserver
import webbrowser
import os

# Set port
PORT = 8081

# Change to public directory
import sys
import os

# Check if we're in the right directory
if not os.path.exists('index.html'):
    # Try to change to public directory
    if os.path.exists('public'):
        os.chdir('public')
    else:
        print("Error: Could not find index.html or public directory")
        print("Please run from the project root directory")
        sys.exit(1)

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers for development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def guess_type(self, path):
        mime = super().guess_type(path)
        # Ensure HTML files are served with correct MIME type
        if path.endswith('.html'):
            return 'text/html'
        return mime

# Start server
with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
    print(f"\nSolar Decision Maharashtra Server Started")
    print(f"Local URL: http://localhost:{PORT}")
    print(f"HomePage: http://localhost:{PORT}/index.html")
    print(f"Calculator: http://localhost:{PORT}/index.html#calculator")
    print(f"Pune Page: http://localhost:{PORT}/solar-installation-cost-pune.html")
    print(f"Mumbai Page: http://localhost:{PORT}/solar-installation-cost-mumbai.html")
    print(f"Nagpur Page: http://localhost:{PORT}/solar-installation-cost-nagpur.html")
    print(f"Comparison: http://localhost:{PORT}/solar-vs-grid-electricity-maharashtra.html")
    print(f"\nPress Ctrl+C to stop the server\n")

    # Open browser automatically
    webbrowser.open(f'http://localhost:{PORT}')

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped. Goodbye!")