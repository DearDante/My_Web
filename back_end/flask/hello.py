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
    #TODO: calculate the points, show the data.
    data_dict = {}
    nums = 0
    names = []
    u_n = ''

    if request.method == 'POST':
        user_name = request.values['name']
        info = request.values['info']
        data_dict['_id'] = datetime.datetime.now().strftime('%y-%m-%d')
        for i in info.split(';')[:-1]:
            task, complete, skip = i.split(',')
            if skip == 'true':
                data_dict[task] = 'Skip'
                continue
            if complete == 'true': data_dict[task]='Done'
            else: data_dict[task] = 'Nope'
        try:
            web_mongo.add_to_db(user_name, data_dict)
        except:
            web_mongo.update_db(user_name, data_dict,
                                datetime.datetime.now().strftime('%y-%m-%d'))
        return render_template('daily_task.html', method=request.method)

    elif request.method == 'GET':
        user_name = request.args['user']
        count = 1
        try:
            for n in web_mongo.get_tasks(user_name):
                names.append({'value':n,
                              'id': count,
                              'task_id': 'task_id_'+str(count),
                              'task_name': 'task_name_'+str(count),
                              'task_complete': 'task_complete_'+str(count),
                              'task_skip': 'task_skip_'+str(count)})
                count += 1
        except:
            pass
    return render_template('daily_task.html', u_n=user_name,
                           nums=count-1, names=names, method=request.method)

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