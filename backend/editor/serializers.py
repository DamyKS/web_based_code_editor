# editor/serializers.py
from rest_framework import serializers


class CodeExecutionSerializer(serializers.Serializer):
    code = serializers.CharField()
    language = serializers.CharField()
