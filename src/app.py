# app.py
import os
from flask import Flask,render_template,request,redirect
import socket
import pyodbc

app = Flask(__name__)
SERVER = 'database'
DATABASE = 'Trident'
USERNAME = 'sa'
PASSWORD = 'Admin@9018#'
driver = 'ODBC Driver 18 for SQL Server'
login_timeout = 60
##### os environment added for sqlserver cert
os.environ['REQUESTS_CA_BUNDLE'] = '/etc/ssl/certs/sqlserver.crt'

def connection():
    s = '' #Your server name 
    d = 'CarSales' 
    u = '' #Your login
    p = '' #Your login password
    cstr = f'DRIVER={driver};SERVER={SERVER};DATABASE={DATABASE};UID={USERNAME};PWD={PASSWORD};LOGIN_TIMEOUT={login_timeout};encrypt=true;
    TrustServerCertificate=true;'
    #cstr = 'SERVER={SERVER};DATABASE={DATABASE};UID={USERNAME};PWD={PASSWORD}'
    conn = pyodbc.connect(cstr)
    return conn

#function to fetch hostname and host_ip
def fetchdetails():
    hostname=socket.gethostname()
    host_ip=socket.gethostbyname(hostname)
    return str(hostname),str(host_ip)

# Route to the root URL
@app.route('/dining')
def dining():
    return render_template('dining.html');


# Route to a custom endpoint
@app.route('/greet/<name>')
def greet(name):
    return f'Hello, {name}! Welcome to Flask on Docker.'

@app.route('/getHotel')
def getHotel():
    cars = []
    conn = connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM dbo.Trident")
    for row in cursor.fetchall():
        cars.append({"id": row[0], "dining": row[1], "year": row[2], "price": row[3]})
    conn.close()
    return render_template("hotelstatus.html", cars = cars)


@app.route('/addhotelDetails', methods=['GET','POST'])
def addhotelDetails():
    if request.method == 'GET':
        return render_template("hotelform.html")
    if request.method == 'POST':
        id = int(request.form["id"])
        dining = request.form["name"]
        year = int(request.form["year"])
        price = float(request.form["price"])
        conn = connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO dbo.Trident (id, dining, year, price) VALUES (?, ?, ?, ?)", id, dining, year, price)
        conn.commit()
        conn.close()
        return redirect('/getHotel')     

        # insert_query = '''INSERT INTO Trident (employee_id, first_name, surname, address_1, address_2, address_3, eircode, mobile_number, pps_number, alt_email_address, job_title, location, reports_to, business_unit, part_orfulltime) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);'''
        # conn= pyodbc.connect(f'DRIVER={{ODBC Driver 18 for SQL Server}};SERVER={SERVER};DATABASE={DATABASE};UID={USERNAME};PWD={PASSWORD}')
        # cursor = conn.cursor()
        # cursor.execute(insert_query, (employee_id, first_name, surname, job_title, location, reports_to, business_unit, part_orfulltime, address_1 , address_2, address_3, eircode, mobile_number, alt_email_address, pps_number))    
        # conn.commit()

if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0', port=5000)