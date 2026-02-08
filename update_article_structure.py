#!/usr/bin/env python3
import os
import json
import mysql.connector

# Get database URL from environment
db_url = os.getenv('DATABASE_URL', '')
# Parse connection string (format: mysql://user:pass@host:port/dbname)
if db_url.startswith('mysql://'):
    db_url = db_url[8:]  # Remove 'mysql://'
    
parts = db_url.split('@')
user_pass = parts[0].split(':')
host_db = parts[1].split('/')
host_port = host_db[0].split(':')

user = user_pass[0]
password = user_pass[1] if len(user_pass) > 1 else ''
host = host_port[0]
port = int(host_port[1]) if len(host_port) > 1 else 3306
database = host_db[1].split('?')[0] if len(host_db) > 1 else ''

# Article content with proper structure
content = [
    {
        "type": "paragraph",
        "content": "If your students call you a tech guru, you know the flood of emails asking, \"Which computer should I buy?\" It's a rite of passage. The array of options, each tailored to a specific budget, can make anyone feel a slight sense of anxiety. But fear not! We must teach our students to thrive in today's digital world. Incorporating computer literacy into our curricula is paramount, and here's why."
    },
    {
        "type": "heading",
        "level": 2,
        "text": "Bridging Generational Gaps in Computer Literacy",
        "id": "bridging-generational-gaps"
    },
    {
        "type": "paragraph",
        "content": "Society often assumes that students are inherently tech-savvy. Memes joke about Millennials teaching their Boomer bosses how to create a PDF. However, the reality is that our Gen Z students are the iPad generation. They're accustomed to mobile software designed for intuitive navigation with a few finger gestures."
    },
    {
        "type": "paragraph",
        "content": "Traditional PC software can be overwhelming with its myriad hotkeys and hidden menus. Even software like AutoCAD, which has been around since 1982, relies on a command bar that can seem archaic to digital natives."
    },
    {
        "type": "heading",
        "level": 2,
        "text": "A Curriculum Tailored to the Future",
        "id": "curriculum-tailored-future"
    },
    {
        "type": "paragraph",
        "content": "I've integrated computer literacy into my Digital Rendering Course, a required class for all production students. Here's a glimpse of how I structure the course:"
    },
    {
        "type": "image",
        "url": "https://cdn.manus.space/prod-user-assets/3a8f2b1d-c4e5-4f9e-8c7a-9d6e5f4a3b2c/computer-literacy-student-coding.png",
        "alt": "Theatre student working in dramatic theatrical space with cyan stage lighting",
        "caption": "Modern theatre students need guidance navigating traditional desktop software interfaces in professional production environments"
    },
    {
        "type": "heading",
        "level": 2,
        "text": "Day 1: Unraveling Computer Hardware",
        "id": "day-1-hardware"
    },
    {
        "type": "list",
        "listType": "bullet",
        "items": [
            "Types of Computers: Strengths and Weaknesses",
            "Operating Systems: Demystified",
            "Hardware Components: From Motherboards to GPUs",
            "The Brain of the Computer: CPU and CPU Cores",
            "Navigating Graphics: Understanding the GPU",
            "Balancing Act: Understanding RAM",
            "Storage Wars: SSD vs. HDD",
            "Accessories: Their Importance"
        ]
    },
    {
        "type": "quote",
        "text": "I've found that quirky anecdotes help demystify complex ideas. For example, I compare the CPU to the brain and the RAM to a juggler balancing coursework. This session teaches students to assess their software and hardware needs for wise investments."
    },
    {
        "type": "image",
        "url": "https://cdn.manus.space/prod-user-assets/3a8f2b1d-c4e5-4f9e-8c7a-9d6e5f4a3b2c/computer-literacy-hardware.png",
        "alt": "Computer hardware components with dramatic cyan lighting",
        "caption": "Understanding hardware components empowers students to make informed purchasing decisions based on their specific software needs"
    },
    {
        "type": "heading",
        "level": 2,
        "text": "Day 2: Mastering File Management and Storage",
        "id": "day-2-file-management"
    },
    {
        "type": "list",
        "listType": "bullet",
        "items": [
            "Organizing Chaos: File Naming Schemes",
            "Folder Hierarchy: The Art of Organizing",
            "Files Over Time: Managing and Removing",
            "The Ageless Files: Storage on Physical Drives",
            "Embracing the Cloud: Services, Benefits, and Drawbacks"
        ]
    },
    {
        "type": "quote",
        "text": "This session teaches key file management skills. It stresses the importance of teamwork and collaboration in production environments where multiple team members need access to the same files."
    },
    {
        "type": "heading",
        "level": 2,
        "text": "Day 3: The Rise of Artificial Intelligence",
        "id": "day-3-ai"
    },
    {
        "type": "list",
        "listType": "bullet",
        "items": [
            "A Journey Through AI History",
            "AI vs Traditional Computing: How They Differ",
            "Meeting Chat GPT: Understanding AI Generators",
            "Impact of AI on the Art Industry",
            "Ethics in AI: Navigating Uncharted Territory"
        ]
    },
    {
        "type": "paragraph",
        "content": "The final lecture dives into the relevance of AI in today's society. It's intriguing how students know of AI tools but haven't explored them deeply. Many haven't made AI art or used ChatGPT for creative purposes. The ethics discussion sparks engaging debates and leads to personal growth."
    },
    {
        "type": "image",
        "url": "https://cdn.manus.space/prod-user-assets/3a8f2b1d-c4e5-4f9e-8c7a-9d6e5f4a3b2c/computer-literacy-ai-interface.png",
        "alt": "Holographic AI interface with cyan graphics floating above laptop",
        "caption": "Exploring AI tools opens new creative possibilities for theatre production students while raising important ethical questions"
    },
    {
        "type": "heading",
        "level": 2,
        "text": "Empowering Students for the Future",
        "id": "empowering-students"
    },
    {
        "type": "paragraph",
        "content": "The demand for tech competency in theatre production is soaring in today's digital age. We must integrate computer skills education into the theatre production curriculum to empower students to make informed decisions about the technology that supports their craft."
    },
    {
        "type": "paragraph",
        "content": "Students shouldn't rely solely on intuition when making technology choices. A well-versed student can match their hardware needs based on software specifications and find the best value for their specific requirements. This knowledge dispels the myth that they must spend thousands on a high-end computer when a mid-range option might suffice."
    },
    {
        "type": "paragraph",
        "content": "By aligning courses with current technology trends, we bridge the digital divide and make education accessible to all, regardless of background or location. This fosters a more inclusive, diverse community of theatre practitioners who will thrive in an industry increasingly driven by innovation and creativity."
    },
    {
        "type": "heading",
        "level": 2,
        "text": "Conclusion",
        "id": "conclusion"
    },
    {
        "type": "paragraph",
        "content": "Computer literacy in our curriculums isn't just about technical skills. It's about giving students the confidence to navigate a rapidly changing digital world. We want to empower them for a future where technology plays an increasingly central role in theatre production."
    },
    {
        "type": "paragraph",
        "content": "Let's bridge the gap between generations and create a more tech-savvy, informed generation of theatre production professionals who can harness technology to bring their creative visions to life."
    },
    {
        "type": "faq",
        "items": [
            {
                "question": "Why is computer literacy important for theatre students?",
                "answer": "Computer literacy empowers theatre students to make informed technology decisions, understand the tools they use daily, and adapt to an increasingly digital industry. It bridges the gap between mobile-first Gen Z students and traditional desktop software used in professional production environments."
            },
            {
                "question": "What computer specs do theatre students actually need?",
                "answer": "It depends on their specific software requirements. Students should match hardware specs to their software needs rather than buying the most expensive option. Understanding CPU cores, RAM requirements, and GPU capabilities helps students find the best value for their workflow."
            },
            {
                "question": "How do I teach Gen Z students about traditional PC software?",
                "answer": "Use relatable analogies and hands-on demonstrations. Gen Z students are accustomed to intuitive mobile interfaces, so breaking down complex desktop software into digestible concepts with real-world examples helps bridge the learning gap."
            },
            {
                "question": "Should theatre programs teach AI tools?",
                "answer": "Yes. AI is increasingly relevant in creative industries. Teaching students about AI tools like ChatGPT and image generators, along with the ethical considerations, prepares them for the evolving landscape of theatre production and creative work."
            },
            {
                "question": "How can I integrate computer literacy into existing curriculum?",
                "answer": "Start by identifying where technology intersects with your existing coursework. Dedicate class time to hardware basics, file management, and emerging technologies. Use practical examples relevant to theatre production to make the content engaging and applicable."
            }
        ]
    }
]

try:
    conn = mysql.connector.connect(
        host=host,
        port=port,
        user=user,
        password=password,
        database=database
    )
    cursor = conn.cursor()
    
    # Update article content
    content_json = json.dumps(content, ensure_ascii=False)
    cursor.execute(
        "UPDATE articles SET content = %s WHERE slug = %s",
        (content_json, 'empowering-theatre-students-with-computer-literacy')
    )
    
    conn.commit()
    print(f"✅ Article updated successfully! Rows affected: {cursor.rowcount}")
    
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"❌ Error: {e}")
