import pymongo

myclient = pymongo.MongoClient()

mydb = myclient['web_db']

def add_to_db(name, data):
    mytable = mydb[name]
    mytable.insert(data)
    return True