from flask import Flask, request, render_template,redirect
import web_mongo
import datetime
#TODO: 1. 在前端添加弹窗
#      2. 提交后判断是添加还是更新

app = Flask(__name__)

@app.route('/')
def hello():
    user = {'user': 'Dante'}
    import os
    return render_template('welcome.html',
                           title='Hey',
                           user=user)

@app.route('/daily/', methods=["GET","POST"])
def daily():
    if request.method == 'POST':
        name = request.values.get('username')
        behaviors = request.values.getlist('behaviors')
        if name:
            data = {}
            for i in behaviors:
                data[i] = True
            data['_id'] = datetime.datetime.now().strftime('%y-%m-%d')
            web_mongo.add_to_db(name, data)
    return render_template('daily_task.html', method=request.method)

@app.route('/competition/', methods=["GET", "POST"])
def competition():
    if request.method == 'POST':
        data_dict = {}
        for ele in request.values:
            if ele == 'boss':
                data_dict[ele] = request.values[ele]
            else:
                name, pts = request.values[ele].split(';')
                data_dict[name] = float(pts)
        data_dict['date'] = datetime.datetime.now().strftime('%y-%m-%d')
        web_mongo.add_to_db('competition', data_dict)

    return render_template('competition.html', method=request.method)

if __name__ == '__main__':
    app.run(debug=False )