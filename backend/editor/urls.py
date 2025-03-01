from django.urls import path
from .views import CodeExecutionView

app_name = "editor"

urlpatterns = [
    path("execute", CodeExecutionView.as_view(), name="code_execute"),
]
