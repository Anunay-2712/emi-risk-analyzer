from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import loans, analysis, history

app = FastAPI(title="EMI Risk Analyzer API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(loans.router)
app.include_router(analysis.router)
app.include_router(history.router)

@app.get("/")
def root():
    return {"message": "EMI Risk Analyzer API is running"}