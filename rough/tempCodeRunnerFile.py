import random
from flask_cors import CORS
from flask import Flask, render_template, session, redirect, url_for, jsonify, flash, request, Response, send_file, current_app # current_app for sending pdf in email
from flask_login import login_required, LoginManager
from flask_mail import Mail, Message
from flask_sqlalchemy import SQLAlchemy
import os, subprocess, random, time, sqlite3, json, numpy as np, matplotlib, matplotlib.pyplot as plt; matplotlib.use('Agg')
from string import ascii_letters
from datetime import datetime, date
from werkzeug.security import generate_password_hash, check_password_hash
from threading import Thread
from reportlab.lib import pdfencrypt, colors
from reportlab.lib.units import inch
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Image, Spacer, Table, TableStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.lib.enums import TA_JUSTIFY, TA_CENTER, TA_RIGHT, TA_LEFT