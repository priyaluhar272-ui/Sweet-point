import os
import random
import smtplib

from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy import text
from dotenv import load_dotenv

from database import engine

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


# Load .env
load_dotenv()


# Gmail configuration
SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")


print("SMTP EMAIL:", SMTP_EMAIL)
print("SMTP PASSWORD SET:", bool(SMTP_PASSWORD))


# FastAPI Router
router = APIRouter()


# Request structure
class ForgotPasswordRequest(BaseModel):
    email: str


# -------------------------------------------------
# SEND OTP EMAIL
# -------------------------------------------------

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

                <!-- HEADER -->

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


                <!-- MESSAGE -->

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


                <!-- OTP -->

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


                <!-- FOOTER -->

                <p style="
                    font-size: 14px;
                    color: #555555;
                    line-height: 1.6;
                ">
                    Regards,<br>
                    <b>Scoop Aura</b>
                </p>


                <hr style="
                    border: none;
                    border-top: 1px solid #eeeeee;
                    margin-top: 30px;
                ">


                <p style="
                    font-size: 12px;
                    color: #999999;
                    text-align: center;
                ">
                </p>

            </div>

        </body>
    </html>
    """


    # Create email
    message = MIMEMultipart("alternative")

    message["From"] = SMTP_EMAIL
    message["To"] = email
    message["Subject"] = "Password Reset OTP"


    # Attach HTML
    message.attach(
        MIMEText(html_content, "html")
    )


    # Connect to Gmail SMTP
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


# -------------------------------------------------
# FORGOT PASSWORD API
# -------------------------------------------------

@router.post("/forgot-password")
def forgot_password(data: ForgotPasswordRequest):

    email = data.email.strip()


    print("================================")
    print("Forgot Password API called")
    print("Email received:", email)
    print("================================")


    # ---------------------------------------------
    # Check empty email
    # ---------------------------------------------

    if not email:

        return {
            "success": False,
            "message": "Please enter your email."
        }


    # ---------------------------------------------
    # Check email in database
    # ---------------------------------------------

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


    # ---------------------------------------------
    # Email not registered
    # ---------------------------------------------

    if not user:

        print("Email not registered.")

        return {
            "success": False,
            "message": "This Email Is Not Registered Yet!"
        }


    # ---------------------------------------------
    # Generate 4-digit OTP
    # ---------------------------------------------

    otp = str(
        random.randint(1000, 9999)
    )

    print("Generated OTP:", otp)


    # ---------------------------------------------
    # Send OTP
    # ---------------------------------------------

    try:

        send_otp_email(
            email,
            otp
        )

        print("OTP email sent successfully.")


        return {
            "success": True,
            "message": "OTP sent successfully.",
            "email": email
        }


    except Exception as e:

        print("OTP email error:", e)


        return {
            "success": False,
            "message": "Failed to send OTP. Try again.",
            "error": str(e)
        }