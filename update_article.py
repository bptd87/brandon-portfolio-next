#!/usr/bin/env python3
import json
import mysql.connector
import os
from urllib.parse import urlparse

# Parse DATABASE_URL
db_url = os.environ['DATABASE_URL']
parsed = urlparse(db_url)

# Read the enhanced content
with open('computer-literacy-content.json', 'r') as f:
    content = json.load(f)

# Connect to database
conn = mysql.connector.connect(
    host=parsed.hostname,
    port=parsed.port,
    user=parsed.username,
    password=parsed.password,
    database=parsed.path[1:]  # Remove leading slash
)

cursor = conn.cursor()

# Update the article
content_json = json.dumps(content)
cursor.execute(
    "UPDATE articles SET content = %s, updatedAt = NOW() WHERE slug = %s",
    (content_json, 'empowering-theatre-students-with-computer-literacy')
)

conn.commit()
print(f"✅ Article updated successfully! ({cursor.rowcount} row affected)")
print("Enhanced with:")
print("- 3 inline images with captions")
print("- Proper section formatting")
print("- Pull quotes for key insights")
print("- No FAQ section")
print("- No drop cap formatting")

cursor.close()
conn.end()
