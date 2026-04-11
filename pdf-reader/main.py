from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pdfminer.high_level import extract_text
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from tempfile import NamedTemporaryFile

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_text_from_pdf(file_bytes: bytes) -> str:
    with NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(file_bytes)
        tmp.flush()
        return extract_text(tmp.name)

def compute_score(resume_text: str, job_description: str) -> float:
    vectorizer = TfidfVectorizer().fit_transform([resume_text, job_description])
    score = cosine_similarity(vectorizer[0:1], vectorizer[1:2])[0][0]
    return round(float(score) * 100, 2)

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/score")
async def score_resume(
    pdf: UploadFile = File(...),
    jobDescription: str = Form(""),
):
    """Score a resume against a job description. No DB writes."""
    try:
        contents = await pdf.read()
        resume_text = extract_text_from_pdf(contents)
        match_score = compute_score(resume_text, jobDescription)
        return {"match_score": match_score}
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
