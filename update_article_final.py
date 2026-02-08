import json
import os
import mysql.connector

# Read the updated content
with open('/home/ubuntu/brandon-portfolio-v2/computer-literacy-updated.json', 'r') as f:
    content = json.load(f)

# Get database URL from environment
db_url = os.getenv('DATABASE_URL')

# Parse connection string
# Format: mysql://user:password@host:port/database
db_url = db_url.replace('mysql://', '')
user_pass, host_db = db_url.split('@')
user, password = user_pass.split(':')
host_port, database = host_db.split('/')
host, port = host_port.split(':')

# Connect to database
conn = mysql.connector.connect(
    host=host,
    port=int(port),
    user=user,
    password=password,
    database=database
)

cursor = conn.cursor()

# Update the article content
content_json = json.dumps(content)
cursor.execute(
    "UPDATE articles SET content = %s WHERE slug = 'empowering-theatre-students-with-computer-literacy'",
    (content_json,)
)

conn.commit()
print(f"Updated article successfully! Rows affected: {cursor.rowcount}")

cursor.close()
conn.close()
