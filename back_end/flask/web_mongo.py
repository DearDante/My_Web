import pymongo

myclient = pymongo.MongoClient()

mydb = myclient['web_db']

def add_to_db(name, data):
    mytable = mydb[name]
    mytable.insert(data)
    return True

def update_db(name, data, date):
    index = {'_id': date}
    new_value = {"$set": data}
    mytable = mydb[name]
    mytable.update_one(index, new_value)

def read_from_db(name):
    mytable = mydb[name]
    return mytable.find()

def get_tasks(name):
    info = read_from_db(name)[0]
    info.pop('_id')
    return list(info.keys())
