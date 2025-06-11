# editor/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import CodeExecutionSerializer
from .tasks import execute_code  # Celery task


class CodeExecutionView(APIView):
    def post(self, request):
        serializer = CodeExecutionSerializer(data=request.data)
        if serializer.is_valid():
            code = serializer.validated_data["code"]
            language = serializer.validated_data["language"]
            # Trigger async task for code execution
            print("langusge:  ", language)
            task = execute_code.delay(code, language)
            # For simplicity, wait for the result (in production, use polling or websockets)
            result = task.get(timeout=40)
            print("result", result)
            return Response({"output": result}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
