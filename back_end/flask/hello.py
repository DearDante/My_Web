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
    #TODO: read the data from database; calculate the points.
    data_dict = {}
    if request.method == 'POST':
        data_dict['user_name'] = request.values['name']
        data_dict['task_nums'] = request.values['nums']
        info = request.values['info']
        for i in info.split(';')[:-1]:
            task, complete, skip = i.split(',')
            if skip == 'true':
                data_dict[task] = 'Skip'
                continue
            if complete == 'true': data_dict['task']='True'
            else: data_dict[task] = 'False'

        print(data_dict)
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
    app.run(debug=False)