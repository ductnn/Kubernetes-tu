import json
import base64

with open('./etcd-kv.json') as f:
    data = json.load(f)

for k in data['kvs']:
    print(base64.b64decode(k['key']))

# print(data['kvs'].key)
print(data['header'])
