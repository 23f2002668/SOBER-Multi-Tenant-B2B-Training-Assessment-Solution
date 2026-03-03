import random, base64
from flask_cors import CORS
from flask import Flask, render_template, session, redirect, url_for, jsonify, flash, request, Response, send_file, current_app # current_app for sending pdf in email
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt
from flask_login import login_required, LoginManager
from flask_mail import Mail, Message
from flask_sqlalchemy import SQLAlchemy
import os, subprocess, random, time, sqlite3, json, numpy as np, matplotlib, matplotlib.pyplot as plt; matplotlib.use('Agg')
from datetime import datetime, date

# Load environment variables
# load_dotenv()

# Object for Flask Application
app=Flask(__name__)

# Enabling CORS Globally
CORS(app, resources={r"/*": {"origins": "*"}})

# Initialising JWTManager
jwt = JWTManager(app)

app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")

# Secret Key for Flask Application
app.secret_key="x34Er5TTHD6789#D67fgxeuo9@djngkcl%*9#D67fgxeuo9@djngkcl%dbT356"

# Sqlite Database File for Attendance Master Application
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///SOBER_Multi-Tenant_B2B_Training_&_Assessment_Solution_Database.sqlite3"

# Enable Sqlalchemy to Track Changes/Modifications to Object
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = True

# Initialising Sqlalchemy
db = SQLAlchemy(app)


# Defining Database Tables
class Admins(db.Model):
    __tablename__ = "ADMINS"
    Type = db.Column(db.String(20))
    AdminId = db.Column(db.String(30), primary_key=True, unique=True)
    AdminName = db.Column(db.String(50))
    AdminPassword = db.Column(db.String(512))

class CompanyRegistration(db.Model):
    __tablename__ = "CompanyRegistration"
    Type = db.Column(db.String(20))
    CompanyId = db.Column(db.String(30), primary_key=True, unique=True)
    Name = db.Column(db.String(50))
    PANCard = db.Column(db.String(15))
    ComRegistrationNo = db.Column(db.String(12), unique=True)
    ContactNo = db.Column(db.String(15), unique=True)
    ContactEmail = db.Column(db.String(50), unique=True)
    Country = db.Column(db.String(50))
    State = db.Column(db.String(50))
    Password = db.Column(db.String(512))
    Date = db.Column(db.Date)
    Day = db.Column(db.String(10))
    Time = db.Column(db.Time)
         # Active / Inactive

class Departments(db.Model):
    __tablename__ = "Departments"
    DepartmentId = db.Column(db.String(10), primary_key=True, unique=True)
    DepartmentName = db.Column(db.String(50))


class CompanyAdmin(db.Model):
    __tablename__ = "CompanyAdmin"
    Type = db.Column(db.String(20))
    AdminId = db.Column(db.String(30), primary_key=True, unique=True)
    AdminName = db.Column(db.String(50))
    DepartmentId = db.Column(db.String(10), db.ForeignKey("Departments.DepartmentId"))
    CompanyId = db.Column(db.String(30), db.ForeignKey("Departments.DepartmentId"))


class TrainingPrograms(db.Model):
    __tablename__ = "TrainingPrograms"
    ProgramId = db.Column(db.String(30), primary_key=True, unique=True)       # Always starts with 'TRP______'
    ProgramName = db.Column(db.String(50))

class Assessments(db.Model):
    __tablename__ = "Assessments"
    AssessmentId = db.Column(db.String(30), primary_key=True, unique=True)       # Always starts with 'ASS______'
    AssessmentName = db.Column(db.String(50))
    TotalQuestions = db.Column(db.INTEGER)
    MaxMarks = db.Column(db.Integer)
    Duration = db.Column(db.String(100))
    Date = db.Column(db.Date)
    Day = db.Column(db.String(10))
    Time = db.Column(db.Time)


class EmployeeRegistration(db.Model):
    __tablename__ = "EmployeeRegistration"
    Type = db.Column(db.String(20))
    EmployeeId = db.Column(db.String(30), primary_key=True)
    Name = db.Column(db.String(50))
    FatherName = db.Column(db.String(50))
    Photo = db.Column(db.LargeBinary)       # ✅ Why BLOB is better than Base64 in DB ? -->  Base64 adds ~33% extra size but BLOB stores the real image size.
    Signature = db.Column(db.String(100))
    Aadhaar = db.Column(db.String(12), unique=True)    # All employees may or may not have it
    Gender = db.Column(db.String(30))
    DOB = db.Column(db.String(10))
    Mobile = db.Column(db.String(15), unique=True)
    Email = db.Column(db.String(50), unique=True)
    Country = db.Column(db.String(50))
    State = db.Column(db.String(50))
    Password = db.Column(db.String(512))
    Date = db.Column(db.Date)
    Day = db.Column(db.String(10))
    Time = db.Column(db.Time)


class CompanyDetails(db.Model):
    __tablename__ = "CompanyDetails"
    SrNo = db.Column(db.Integer, autoincrement=True, primary_key=True)
    CompanyId = db.Column(db.String(30), db.ForeignKey("CompanyRegistration.CompanyId"))
    SubscriptionID = db.Column(db.String(10), db.ForeignKey("Subscriptions.SubscriptionId"))
    CurrentDepartmentQuota = db.Column(db.INTEGER)
    CurrentEmployeeQuota = db.Column(db.INTEGER)
    CurrentTrainingQuota = db.Column(db.INTEGER)
    CurrentAssessmentQuota = db.Column(db.INTEGER)

class CompanyAdminDetails(db.Model):
    __tablename__ = "CompanyAdminDetails"
    SrNo = db.Column(db.Integer, autoincrement=True, primary_key=True)
    AdminId = db.Column(db.String(30), db.ForeignKey("CompanyAdmin.AdminId"))
    ProgramId = db.Column(db.String(30), db.ForeignKey("TrainingPrograms.ProgramId"))
    AssessmentId = db.Column(db.String(30), db.ForeignKey("Assessments.AssessmentId"))
    DepartmentId = db.Column(db.String(10), db.ForeignKey("Departments.DepartmentId"))
    CompanyId = db.Column(db.String(30), db.ForeignKey("Departments.DepartmentId"))

class EmployeeDetails(db.Model):
    __tablename__ = "EmployeeDetails"
    SrNo = db.Column(db.Integer, primary_key=True, autoincrement=True)
    EmployeeId = db.Column(db.String(30), db.ForeignKey("EmployeeRegistration.EmployeeId"))
    DepartmentId = db.Column(db.String(10), db.ForeignKey("Departments.DepartmentId"))
    CompanyId = db.Column(db.String(30), db.ForeignKey("Departments.DepartmentId"))
    ProgramId = db.Column(db.String(30), db.ForeignKey("TrainingPrograms.ProgramId"))
    AssessmentId = db.Column(db.String(30), db.ForeignKey("Assessments.AssessmentId"))

class DepartmentDetails(db.Model):
    __tablename__ = "DepartmentDetails"
    SrNo = db.Column(db.Integer, primary_key=True, autoincrement=True)
    DepartmentId = db.Column(db.String(10), db.ForeignKey("Departments.DepartmentId"))
    CompanyId = db.Column(db.String(30), db.ForeignKey("Departments.DepartmentId"))

class TrainingProgramsDetails(db.Model):
    # It is used to naming table 'Students' as by default it names the table 'user_details'
    __tablename__ = "TrainingProgramsDetails"
    SrNo = db.Column(db.Integer, primary_key=True, autoincrement=True)
    ProgramId = db.Column(db.String(30), db.ForeignKey("TrainingPrograms.ProgramId"))
    DepartmentId = db.Column(db.String(10), db.ForeignKey("Departments.DepartmentId"))
    CompanyId = db.Column(db.String(30), db.ForeignKey("Departments.DepartmentId"))

class AssessmentsDetails(db.Model):
    # It is used to naming table 'Students' as by default it names the table 'user_details'
    __tablename__ = "AssessmentsDetails"
    SrNo = db.Column(db.Integer, primary_key=True, autoincrement=True)
    AssessmentId = db.Column(db.String(30), db.ForeignKey("Assessments.AssessmentId"))
    DepartmentId = db.Column(db.String(10), db.ForeignKey("Departments.DepartmentId"))
    CompanyId = db.Column(db.String(30), db.ForeignKey("Departments.DepartmentId"))

class Scores(db.Model):
    # It is used to naming table 'Scores' as by default it names the table 'user_details'
    __tablename__ = "Scores"
    SrNo = db.Column(db.Integer, primary_key=True, autoincrement=True)
    EmployeeId = db.Column(db.String(30), db.ForeignKey("EmployeeRegistration.EmployeeId"))
    Program_AssessmentId = db.Column(db.String(30), db.ForeignKey("TrainingPrograms.ProgramId"))
    Score = db.Column(db.Numeric(6, 2))

class Subscriptions(db.Model):
    # It is used to naming table 'Subscriptions' as by default it names the table 'user_details'
    __tablename__ = "Subscriptions"
    SubscriptionId = db.Column(db.String(10), primary_key=True, unique=True)
    SubscriptionsName = db.Column(db.String(50))
    DepartmentQuota = db.Column(db.INTEGER)
    EmployeeQuota = db.Column(db.INTEGER)
    TrainingQuota = db.Column(db.INTEGER)
    AssessmentQuota = db.Column(db.INTEGER)
    Price = db.Column(db.Numeric(5,2))


class Activities(db.Model):
    # It is used to naming table 'Activities' as by default it names the table 'user_details'
    __tablename__ = "Activities"
    ActivityID = db.Column(db.String(10), primary_key=True, unique=True)
    ActivityName = db.Column(db.String(50))
    Description = db.Column(db.String(200))
    DepartmentId = db.Column(db.String(10), db.ForeignKey("Departments.DepartmentId"))
    CompanyId = db.Column(db.String(30), db.ForeignKey("Departments.DepartmentId"))
    Date = db.Column(db.Date)
    Day = db.Column(db.String(10))
    Time = db.Column(db.Time)

class Quotes(db.Model):
    # It is used to naming table 'Quotes' as by default it names the table 'user_details'
    __tablename__ = "Quotes"
    SrNo = db.Column(db.Integer, autoincrement=True)
    QuoteID = db.Column(db.String(10), primary_key=True, unique=True)
    Quote = db.Column(db.String(200))

class Ratings(db.Model):
    # It is used to naming table 'Ratings' as by default it names the table 'user_details'
    __tablename__ = "Ratings"
    SrNo = db.Column(db.Integer, autoincrement=True, primary_key=True)
    EmployeeId = db.Column(db.String(30), db.ForeignKey("EmployeeRegistration.EmployeeId"))
    DepartmentId = db.Column(db.String(10), db.ForeignKey("Departments.DepartmentId"))
    CompanyId = db.Column(db.String(30), db.ForeignKey("Departments.DepartmentId"))
    ProgramId = db.Column(db.String(30), db.ForeignKey("TrainingPrograms.ProgramId"))
    AssessmentId = db.Column(db.String(30), db.ForeignKey("Assessments.AssessmentId"))
    Rating = db.Column(db.Numeric(2, 1))
    Review = db.Column(db.String(200))
    Date = db.Column(db.Date)
    Day = db.Column(db.String(10))
    Time = db.Column(db.Time)



# Email Configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'  # Mail Provider
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv("MAIL_USERNAME")
app.config['MAIL_PASSWORD'] = os.getenv("MAIL_PASSWORD")  # Gmail App Password
app.config['MAIL_DEFAULT_SENDER'] = os.getenv("MAIL_DEFAULT_SENDER")
mail = Mail(app)


# Connect to database
def get_db():
    con = sqlite3.connect("instance/SOBER_Multi-Tenant_B2B_Training_&_Assessment_Solution_Database.sqlite3")
    con.row_factory = sqlite3.Row
    return con

# Delete table
def delete_table(table_name):
    con = get_db()
    cur = con.cursor()
    cur.execute(f"DROP TABLE IF EXISTS {table_name}")
    con.commit()
    con.close()

# Image to Base64 Img
def base64_image(img) :
    b64_bytes = base64.b64encode(img)
    b64_str = b64_bytes.decode("utf-8")
    b64_img = f"data:image/png;base64,{b64_str}"
    return b64_img


# ************************************************************************** Routes ************************************************************************** #


@app.route('/')
def index():
    return "Method Not Allowed ! \n\nThe method is not allowed for the requested URL."

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data["username"]
    usertype = data["usertype"]
    password = data["password"]
    pswd=None

    message="Incorrect Credentials"
    access_token=None

    con = get_db()
    cur = con.cursor()

    if (usertype=="Admin" and password!=""):
        try:
            query1 = """SELECT AdminPassword FROM ADMINS WHERE AdminId=?"""
            cur.execute(query1, (username, ))
            pswd = (cur.fetchone())[0]

        except Exception as e:
            print(e)
            pswd = ""

        if (password==pswd):
            access_token = create_access_token(
                identity = username,
                additional_claims= {"usertype": usertype}
            )
            message="Success"

    elif (usertype=="Company Admin" and password!=""):
        try:
            query1 = """SELECT CompanyId FROM CompanyAdmin WHERE AdminId=?"""
            cur.execute(query1, (username, ))
            cid = (cur.fetchone())[0]

            query2 = """SELECT Password FROM CompanyRegistration WHERE CompanyId=?"""
            cur.execute(query2, (cid, ))
            pswd = (cur.fetchone())[0]

        except Exception as e:
            print(e)
            pswd = ""

        if (password==pswd):
            access_token = create_access_token(
                identity=username,
                additional_claims= {"usertype": usertype}
            )
            message="Success"

    elif (usertype=="Employee" and password!=""):
        try:
            query = """SELECT Password FROM EmployeeRegistration WHERE EmployeeId=? OR EmployeeEmail=?"""
            cur.execute(query, (username, username, ))
            pswd = (cur.fetchone())[0]

        except Exception as e:
            print(e)
            pswd = ""

        if (password==pswd):
            access_token = create_access_token(
                identity=username,
                additional_claims= {"usertype": usertype}
            )
            message="Success"

    else :
        message="Incorrect Credentials"

    if message=="Success":
        return jsonify({
            "message": message,
             "username": username,
             "usertype": usertype,
             "token": access_token
        }), 200
    else:
        return jsonify({
           "message": message,
           "username": username,
           "usertype": usertype,
           "token": access_token
        }), 401

@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    claims = get_jwt()

    return jsonify(username = current_user), 200

@app.route("/admin-dashboard", methods=["GET"])
@jwt_required()
def company_admin_dashboard():
    if (request.method == "GET"):
        username = get_jwt_identity()
        claims = get_jwt()
        usertype = claims.get("usertype")

        try:
          con = get_db()
          cur = con.cursor()

          query1 = """SELECT AdminName, DepartmentId, CompanyId FROM CompanyAdmin WHERE AdminId=?"""
          cur.execute(query1, (username, ))
          data1 = cur.fetchone()

          query2 = """SELECT Name FROM CompanyRegistration WHERE CompanyId=?"""
          cur.execute(query2, (data1[2], ))
          data2 = (cur.fetchone())[0]

          company_logo = ""
          for i in data2.split(" "):
              company_logo += i[0]

          query3 = """SELECT SubscriptionID, CurrentDepartmentQuota, CurrentEmployeeQuota, CurrentTrainingQuota, CurrentAssessmentQuota FROM CompanyDetails WHERE CompanyId=?"""
          cur.execute(query3, (data1[2], ))
          data3 = cur.fetchone()

          query4 = """SELECT SubscriptionsName, DepartmentQuota, EmployeeQuota, TrainingQuota, AssessmentQuota, Price FROM Subscriptions WHERE SubscriptionID=?"""
          cur.execute(query4, (data3[0], ))
          data4 = cur.fetchone()

          return jsonify({
              'name': data1[0],
              'admin_id': username,
              'company_logo': company_logo.upper(),
              'company_name': data2.title(),
              'current_dept_quota': data3[1],
              'current_emp_quota': data3[2],
              'current_trn_quota': data3[3],
              'current_asses_quota': data3[4],
              'subscription': data4[0],
              'total_dept_quota': data4[1],
              'total_emp_quota': data4[2],
              'total_trn_quota': data4[3],
              'total_asses_quota': data4[4],
              'price': data4[5]
          }), 200
        except Exception as e:
            print(e)
            return jsonify({
              'name': '',
              'admin_id': '',
              'company_logo': '',
              'company_name': '',
              'current_dept_quota': 0,
              'current_emp_quota': 0,
              'current_trn_quota': 0,
              'current_asses_quota': 0,
              'subscription': '',
              'total_dept_quota': 0,
              'total_emp_quota': 0,
              'total_trn_quota': 0,
              'total_asses_quota': 0,
              'price': 0
          }), 503


@app.route("/feature-operations", methods=["POST"])
@jwt_required()
def feature_operations():
    data = request.json
    title = data["title"]
    operation = data["operation"]
    adminId = data["adminId"]

    con = get_db()
    cur = con.cursor()

    if (title=="Department" and operation=="ADD"):
        try:
            print("Adding Department . . . ")
            name = data["name"]
            id = data["id"]

            query1 = """SELECT CompanyId FROM CompanyAdmin WHERE AdminId=?"""
            cur.execute(query1, (adminId, ))
            cmpId = (cur.fetchone())[0]

            # Validating the subscription
            (validate, total, current, remaining) = validate_subscription(cmpId, title)

            if (not validate):
                print("Quota has been exhausted!")
                return "Quota has been exhausted!"

            query2 = """INSERT INTO Departments(DepartmentId, DepartmentName) VALUES(?, ?)"""
            cur.execute(query2, (id, name))
            con.commit()

            query3 = """INSERT INTO DepartmentDetails(DepartmentId, CompanyId) VALUES(?, ?)"""
            cur.execute(query3, (id, cmpId))
            con.commit()

            new_quota = current + 1

            print("new_current_dept_quota :", new_quota)

            query4 = """UPDATE CompanyDetails SET CurrentDepartmentQuota=? WHERE CompanyId=?"""
            cur.execute(query4, (new_quota, cmpId))
            con.commit()

            print("Adding Department successfully!")
            return None

        except Exception as error:
            print(error)
            return None

    elif (title=="Employee" and operation=="ADD"):
        try:
            name = data["name"]
            id = data["id"]
            mobile = data["mobile"]
            email = data["email"]
            deptId = data["deptId"]
            pgmId = data["pgmId"]
            assId = data["assId"]

            query1 = """SELECT CompanyId FROM CompanyAdmin WHERE AdminId=?"""
            cur.execute(query1, (adminId, ))
            cmpId = (cur.fetchone())[0]

            # Validating the subscription
            (validate, total, current, remaining) = validate_subscription(cmpId, title)

            if (not validate):
                print("Quota has been exhausted!")
                return "Quota has been exhausted!"

            query2 = """INSERT INTO EmployeeRegistration(EmployeeId, Name, Mobile, Email) VALUES(?, ?, ?, ?)"""
            cur.execute(query2, (id, name, mobile, email))
            con.commit()

            query3 = """INSERT INTO EmployeeDetails(EmployeeId, DepartmentId, CompanyId, ProgramId, AssessmentId) VALUES(?, ?, ?, ?, ?)"""
            cur.execute(query3, (id, deptId, cmpId, pgmId, assId))
            con.commit()

            query3 = """INSERT INTO EmployeeDetails(EmployeeId, DepartmentId, CompanyId, ProgramId, AssessmentId) VALUES(?, ?, ?, ?, ?)"""
            cur.execute(query3, (id, deptId, cmpId, pgmId, assId))
            con.commit()

            new_quota = current + 1

            print("new_current_dept_quota :", new_quota)

            query4 = """UPDATE CompanyDetails SET CurrentEmployeeQuota=? WHERE CompanyId=?"""
            cur.execute(query4, (new_quota, cmpId))
            con.commit()

            print("Adding Department successfully!")
            return None

        except Exception as error:
            print(error)
            return None

    elif (title=="Training" and operation=="ADD"):
        try:
            name = data["name"]
            id = data["id"]
            deptId = data["deptId"]

            query1 = """SELECT CompanyId FROM CompanyAdmin WHERE AdminId=?"""
            cur.execute(query1, (adminId, ))
            cmpId = (cur.fetchone())[0]

            # Validating the subscription
            (validate, total, current, remaining) = validate_subscription(cmpId, title)

            if (not validate):
                print("Quota has been exhausted!")
                return "Quota has been exhausted!"

            query2 = """INSERT INTO TrainingPrograms(ProgramId, ProgramName) VALUES(?, ?)"""
            cur.execute(query2, (id, name))
            con.commit()

            query3 = """INSERT INTO TrainingProgramsDetails(ProgramId, DepartmentId, CompanyId) VALUES(?, ?, ?)"""
            cur.execute(query3, (id, deptId, cmpId))
            con.commit()

            new_quota = current + 1

            print("new_current_dept_quota :", new_quota)

            query4 = """UPDATE CompanyDetails SET CurrentTrainingQuota=? WHERE CompanyId=?"""
            cur.execute(query4, (new_quota, cmpId))
            con.commit()

            print("Adding Training successfully!")
            return None

        except Exception as error:
            print(error)
            return None

    elif (title=="Assessment" and operation=="ADD"):
        print("Creating Assessment . . .")
        try:
            name = data["name"]
            id = data["id"]
            deptId = data["deptId"]

            query1 = """SELECT CompanyId FROM CompanyAdmin WHERE AdminId=?"""
            cur.execute(query1, (adminId, ))
            cmpId = (cur.fetchone())[0]

            # Validating the subscription
            (validate, total, current, remaining) = validate_subscription(cmpId, title)

            if (not validate):
                print("Quota has been exhausted!")
                return "Quota has been exhausted!"

            query2 = """INSERT INTO Assessments(AssessmentId, AssessmentName) VALUES(?, ?)"""
            cur.execute(query2, (id, name))
            con.commit()

            query3 = """INSERT INTO AssessmentsDetails(AssessmentId, DepartmentId, CompanyId) VALUES(?, ?, ?)"""
            cur.execute(query3, (id, deptId, cmpId))
            con.commit()

            new_quota = current + 1

            print("new_current_dept_quota :", new_quota)

            query4 = """UPDATE CompanyDetails SET CurrentAssessmentQuota=? WHERE CompanyId=?"""
            cur.execute(query4, (new_quota, cmpId))
            con.commit()

            print("Adding Assessment successfully!")
            return None

        except Exception as error:
            print(error)
            return None

def validate_subscription(cmp_id, title):
    con = get_db()
    cur = con.cursor()

    print(cmp_id)
    query1 = f"""SELECT SubscriptionID, Current{title}Quota FROM CompanyDetails WHERE CompanyId=?"""
    cur.execute(query1, (cmp_id, ))
    result = cur.fetchone()
    if result:
      subscription_id = result[0]
      current_quota = result[1]

    print(f"subscription_id : {subscription_id}, current_quota : {current_quota}")

    query2 = f"""SELECT {title}Quota FROM Subscriptions WHERE SubscriptionID=?"""
    cur.execute(query2, (subscription_id, ))
    total_quota = (cur.fetchone())[0]

    remaining_quota = total_quota - current_quota

    if (remaining_quota > 0):
        print(True, total_quota, current_quota, remaining_quota)
        return (True, total_quota, current_quota, remaining_quota)
    else:
        print(False, total_quota, current_quota, remaining_quota)
        return (False, total_quota, current_quota, remaining_quota)


if __name__ == '__main__':

    # Build DataBase File
    with app.app_context():
        db.create_all()

    app.debug=True
    app.run(host="0.0.0.0", port=8000)
