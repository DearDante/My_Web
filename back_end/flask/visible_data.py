import pandas as pd
import pymongo

client = pymongo.MongoClient()
db = client['web_db']['competition']

source = pd.DataFrame(list(db.find()))

print(source.head())