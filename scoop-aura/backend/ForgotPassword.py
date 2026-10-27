
import os
import random
import smtplib
import bcrypt

from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy import text
from dotenv import load_dotenv

from database import engine

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


# =========================================================
# LOAD ENVIRONMENT VARIABLES
# =========================================================

load_dotenv()

SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

print("SMTP EMAIL:", SMTP_EMAIL)
print("SMTP PASSWORD SET:", bool(SMTP_PASSWORD))


# =========================================================
# FASTAPI ROUTER
# =========================================================

router = APIRouter()


# =========================================================
# TEMPORARY OTP STORAGE
# =========================================================

# Example:
# {
#     "user@gmail.com": "4827"
# }

otp_storage = {}


# Stores whether OTP was successfully verified

# Example:
# {
#     "user@gmail.com": True
# }

verified_users = {}


# =========================================================
# REQUEST MODELS
# =========================================================

class ForgotPasswordRequest(BaseModel):
    email: str


class VerifyOTPRequest(BaseModel):
    email: str
    otp: str


class ResetPasswordRequest(BaseModel):
    email: str
    new_password: str
    confirm_password: str


# =========================================================
# SEND OTP EMAIL
# =========================================================

def send_otp_email(email, otp):

    html_content = f"""
    <html>

        <body style="
            margin: 0;
            padding: 0;
            background-color: #f9fafb;
            font-family: Helvetica, Arial, sans-serif;
        ">

            <div style="
                max-width: 600px;
                margin: 40px auto;
                background: #ffffff;
                padding: 35px;
                border-radius: 10px;
                box-shadow: 0 5px 20px rgba(0,0,0,0.08);
            ">

                <div style="
                    border-bottom: 1px solid #eeeeee;
                    padding-bottom: 15px;
                ">

                    <h1 style="
                        color: #e94b89;
                        margin: 0;
                    ">
                        SCOOP AURA
                    </h1>

                </div>

                <p style="
                    font-size: 18px;
                    color: #333333;
                    margin-top: 30px;
                ">
                    Hi,
                </p>

                <p style="
                    font-size: 15px;
                    color: #555555;
                    line-height: 1.6;
                ">
                    Thank you for choosing Scoop Aura.
                    Use the following OTP to complete your
                    password reset procedure.
                </p>

                <p style="
                    font-size: 15px;
                    color: #555555;
                    line-height: 1.6;
                ">
                    Your OTP is valid for
                    <b>5 minutes</b>.
                </p>

                <div style="
                    text-align: center;
                    margin: 35px 0;
                ">

                    <span style="
                        display: inline-block;
                        background-color: #e94b89;
                        color: white;
                        padding: 12px 25px;
                        font-size: 30px;
                        font-weight: bold;
                        border-radius: 7px;
                        letter-spacing: 7px;
                    ">
                        {otp}
                    </span>

                </div>

                <p style="
                    font-size: 14px;
                    color: #555555;
                    line-height: 1.6;
                ">
                    Regards,<br>
                    <b>Scoop Aura</b>
                </p>

            </div>

        </body>

    </html>
    """

    message = MIMEMultipart("alternative")

    message["From"] = SMTP_EMAIL
    message["To"] = email
    message["Subject"] = "Password Reset OTP"

    message.attach(
        MIMEText(html_content, "html")
    )

    # Gmail SMTP
    with smtplib.SMTP("smtp.gmail.com", 587) as server:

        server.starttls()

        server.login(
            SMTP_EMAIL,
            SMTP_PASSWORD
        )

        server.sendmail(
            SMTP_EMAIL,
            email,
            message.as_string()
        )


# =========================================================
# FORGOT PASSWORD
# =========================================================

@router.post("/forgot-password")
def forgot_password(data: ForgotPasswordRequest):

    # Normalize email
    email = data.email.strip().lower()

    print()
    print("========================================")
    print("FORGOT PASSWORD API")
    print("Email received:", email)
    print("========================================")

    # -----------------------------------------------------
    # CHECK EMAIL
    # -----------------------------------------------------

    if not email:

        return {
            "success": False,
            "message": "Please enter your email."
        }

    # -----------------------------------------------------
    # CHECK USER IN DATABASE
    # -----------------------------------------------------

    try:

        with engine.connect() as connection:

            result = connection.execute(
                text("""
                    SELECT id, name, email
                    FROM users
                    WHERE LOWER(email) = LOWER(:email)
                """),
                {
                    "email": email
                }
            )

            user = result.fetchone()

    except Exception as e:

        print("Database error:", e)

        return {
            "success": False,
            "message": "Database error occurred.",
            "error": str(e)
        }

    # -----------------------------------------------------
    # EMAIL NOT REGISTERED
    # -----------------------------------------------------

    if not user:

        print("Email not registered.")

        return {
            "success": False,
            "message": "This Email Is Not Registered Yet!"
        }

    # -----------------------------------------------------
    # GENERATE 4 DIGIT OTP
    # -----------------------------------------------------

    otp = str(
        random.randint(1000, 9999)
    )

    print()
    print("Generated OTP:", otp)

    # -----------------------------------------------------
    # SEND OTP EMAIL
    # -----------------------------------------------------

    try:

        send_otp_email(
            email,
            otp
        )

        print("OTP email sent successfully.")

    except Exception as e:

        print("OTP email error:", e)

        return {
            "success": False,
            "message": "Failed to send OTP. Try again.",
            "error": str(e)
        }

    # -----------------------------------------------------
    # STORE OTP
    # -----------------------------------------------------

    otp_storage[email] = otp

    # User must verify new OTP again
    verified_users[email] = False

    print()
    print("OTP STORED")
    print("Email:", email)
    print("Stored OTP:", otp)
    print("========================================")

    return {
        "success": True,
        "message": "OTP sent successfully.",
        "email": email
    }


# =========================================================
# VERIFY OTP
# =========================================================

@router.post("/verify-otp")
def verify_otp(data: VerifyOTPRequest):

    # Normalize email
    email = data.email.strip().lower()

    # Normalize OTP
    entered_otp = str(data.otp).strip()

    print()
    print("========================================")
    print("VERIFY OTP API")
    print("Email:", email)
    print("Entered OTP:", entered_otp)
    print("========================================")

    # -----------------------------------------------------
    # CHECK WHETHER OTP EXISTS
    # -----------------------------------------------------

    if email not in otp_storage:

        print("No OTP found for this email.")

        return {
            "success": False,
            "message": "OTP expired or not requested."
        }

    # -----------------------------------------------------
    # GET STORED OTP
    # -----------------------------------------------------

    stored_otp = str(
        otp_storage[email]
    ).strip()

    print("Stored OTP:", stored_otp)
    print("Entered OTP:", entered_otp)

    # -----------------------------------------------------
    # COMPARE OTP
    # -----------------------------------------------------

    if entered_otp != stored_otp:

        print("OTP DOES NOT MATCH")
        print("========================================")

        return {
            "success": False,
            "message": "Invalid OTP."
        }

    # -----------------------------------------------------
    # OTP MATCHED
    # -----------------------------------------------------

    print("OTP MATCHED SUCCESSFULLY")

    # Mark email as verified
    verified_users[email] = True

    # Remove OTP so it cannot be reused
    del otp_storage[email]

    print("User marked as verified.")
    print("OTP removed from storage.")
    print("========================================")

    return {
        "success": True,
        "message": "OTP verified successfully.",
        "email": email
    }


# =========================================================
# RESET PASSWORD
# =========================================================

@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest):

    # Normalize email
    email = data.email.strip().lower()

    new_password = data.new_password
    confirm_password = data.confirm_password

    print()
    print("========================================")
    print("RESET PASSWORD API")
    print("Email:", email)
    print("========================================")

    # -----------------------------------------------------
    # CHECK OTP VERIFICATION
    # -----------------------------------------------------

    if verified_users.get(email) != True:

        print("OTP verification missing.")

        return {
            "success": False,
            "message": "OTP verification required."
        }

    # -----------------------------------------------------
    # CHECK NEW PASSWORD
    # -----------------------------------------------------

    if not new_password:

        return {
            "success": False,
            "message": "Please enter a new password."
        }

    # -----------------------------------------------------
    # PASSWORD LENGTH
    # -----------------------------------------------------

    if len(new_password) < 8:

        return {
            "success": False,
            "message": "Password must be at least 8 characters."
        }

    # -----------------------------------------------------
    # CONFIRM PASSWORD
    # -----------------------------------------------------

    if new_password != confirm_password:

        return {
            "success": False,
            "message": "Passwords do not match."
        }

    # -----------------------------------------------------
    # HASH NEW PASSWORD
    # -----------------------------------------------------

    password_hash = bcrypt.hashpw(
        new_password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    print("New password hashed successfully.")

    # -----------------------------------------------------
    # UPDATE DATABASE
    # -----------------------------------------------------

    try:

        with engine.begin() as connection:

            result = connection.execute(
                text("""
                    UPDATE users
                    SET password_hash = :password_hash
                    WHERE LOWER(email) = LOWER(:email)
                """),
                {
                    "password_hash": password_hash,
                    "email": email
                }
            )

            # User doesn't exist
            if result.rowcount == 0:

                print("User not found.")

                return {
                    "success": False,
                    "message": "User not found."
                }

    except Exception as e:

        print("Password update error:", e)

        return {
            "success": False,
            "message": "Failed to update password.",
            "error": str(e)
        }

    # -----------------------------------------------------
    # REMOVE VERIFICATION STATUS
    # -----------------------------------------------------

    verified_users.pop(
        email,
        None
    )

    print("Password updated successfully.")
    print("Verification status removed.")
    print("========================================")

    return {
        "success": True,
        "message": "Password reset successfully."
    }
