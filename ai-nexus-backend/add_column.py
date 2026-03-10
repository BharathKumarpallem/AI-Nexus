import sqlite3
import os

db_path = os.path.join(os.getcwd(), 'nexus.db')
print(f"Targeting: {db_path}")

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute('ALTER TABLE users ADD COLUMN full_name TEXT')
    conn.commit()
    conn.close()
    print("Column full_name added successfully.")
except sqlite3.OperationalError as e:
    if "duplicate column name" in str(e).lower():
        print("Column full_name already exists.")
    else:
        print(f"OperationalError: {e}")
except Exception as e:
    print(f"Error: {e}")
