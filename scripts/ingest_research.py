import os
import glob
import pdfplumber

RESEARCH_ROOT = "import_DR"
KNOWLEDGE_DIR = ".agent/knowledge/imported_research"

def extract_text_from_pdf(pdf_path):
    text_content = []
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for i, page in enumerate(pdf.pages):
                text = page.extract_text()
                if text:
                    text_content.append(f"## Page {i+1}\n\n{text}\n")
    except Exception as e:
        print(f"Error reading {pdf_path}: {e}")
        return None
    return "\n".join(text_content)

def ingest():
    print(f"Scanning {RESEARCH_ROOT}...")
    
    if not os.path.exists(KNOWLEDGE_DIR):
        os.makedirs(KNOWLEDGE_DIR)

    # Walk through the research directory
    for root, dirs, files in os.walk(RESEARCH_ROOT):
        for file in files:
            if file.lower().endswith(".pdf"):
                pdf_path = os.path.join(root, file)
                print(f"Processing {pdf_path}...")
                
                content = extract_text_from_pdf(pdf_path)
                if content:
                    # Determine category from folder name
                    rel_path = os.path.relpath(root, RESEARCH_ROOT)
                    if rel_path == ".":
                        category = "general"
                    else:
                        category = rel_path.replace(os.path.sep, "_")
                    
                    output_dir = os.path.join(KNOWLEDGE_DIR, category)
                    os.makedirs(output_dir, exist_ok=True)
                    
                    filename = os.path.splitext(file)[0].replace(" ", "_") + ".md"
                    output_path = os.path.join(output_dir, filename)
                    
                    with open(output_path, "w", encoding="utf-8") as f:
                        f.write(f"# {file}\n\n{content}")
                    print(f"Saved to {output_path}")

if __name__ == "__main__":
    ingest()
