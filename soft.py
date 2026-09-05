from flask import Flask, render_template, redirect, url_for

app = Flask(__name__)

@app.route('/')
def redirect_page():
    return redirect(url_for('rend_pagP'))

@app.route('/menu')
def rend_pagP():
    return render_template('menu.html')

@app.route('/correo')
def correo():
    return render_template('correo.html')

@app.route('/dni_page')
def dniPage():
    return render_template('dni.html')

@app.route('/ajustes')
def page_ajustes():
    return render_template('ajustes.html')

if __name__ == "__main__":
    app.run(debug=True, port=9080)