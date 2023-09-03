from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
import re
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class UserCredentials(BaseModel):
    email: str
    password: str


def is_valid_email(email):
    # Basic email validation using regular expression
    return re.match(r"[^@]+@[^@]+\.[^@]+", email)


def is_strong_password(password):
    # Password strength criteria: at least 8 characters, at least one uppercase letter, one lowercase letter, and one digit.
    return len(password) >= 8 and any(c.isupper() for c in password) and any(c.islower() for c in password) and any(c.isdigit() for c in password)


@app.post("/validate")
async def validate_credentials(credentials: UserCredentials):
    email = credentials.email
    password = credentials.password

    if not is_valid_email(email):
        raise HTTPException(
            status_code=400, detail="Formato de email inválido.")

    if not is_strong_password(password):
        raise HTTPException(
            status_code=400, detail="Senha fraca, informe uma senha com pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula e um número.")

    return {"message": "Email and password are valid and strong"}
