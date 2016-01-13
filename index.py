import math
import random
import web
import json
import csv
from cStringIO import StringIO

urls = (
    '/data.csv', 'CsvData',
    '/data.json', 'JsonData'
)
app = web.application(urls, globals())


class JsonData:
    def __init__(self):
        pass

    def GET(self):
        return json.dumps([{
                               'name': "Person {0}".format(i),
                               'index': i,
                               'count': random.randint(2, 20),
                               'x': random.randint(5, 1000),
                               'y': random.randint(5, 490)
                           } for i in range(100)])


class CsvData:
    def __init__(self):
        pass

    def GET(self):
        sf = StringIO()
        csv_writer = csv.writer(sf)
        csv_writer.writerow(['name', 'index', 'count', 'x', 'y'])
        csv_writer.writerows([(
                                  "Person {0}".format(i), i,
                                  random.randint(2, 20),
                                  random.randint(5, 1000),
                                  random.randint(5, 490)
                              ) for i in range(100)])
        sf.seek(0)
        return sf.read()


if __name__ == "__main__":
    app.run()
