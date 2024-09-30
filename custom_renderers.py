from rest_framework.renderers import JSONRenderer
from bson import ObjectId
import json

class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super().default(obj)

class CustomJSONRenderer(JSONRenderer):
    encoder_class = CustomJSONEncoder