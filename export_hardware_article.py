import os
import json
import mysql.connector

db_url = os.getenv("DATABASE_URL")
# Parse connection string
parts = db_url.replace("mysql://", "").split("@")
user_pass = parts[0].split(":")
host_db = parts[1].split("/")
host_port = host_db[0].split(":")

conn = mysql.connector.connect(
    host=host_port[0],
    port=int(host_port[1]) if len(host_port) > 1 else 3306,
    user=user_pass[0],
    password=user_pass[1],
    database=host_db[1].split("?")[0]
)

cursor = conn.cursor()
cursor.execute("SELECT content FROM articles WHERE slug = 'computer-hardware-why-scenic-designers-and-all-theatre-designers-need-to-care'")
result = cursor.fetchone()

if result:
    content = json.loads(result[0])
    with open("/home/ubuntu/hardware-article-current.json", "w") as f:
        json.dump(content, f, indent=2)
    print("Exported hardware article content")
else:
    print("Article not found")

conn.close()
