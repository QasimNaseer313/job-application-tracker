from django.urls import path
from .views import JobApplicationListCreateView, JobApplicationDetailView

urlpatterns = [
    path('', JobApplicationListCreateView.as_view(), name='job-list-create'),
    path('<int:pk>/', JobApplicationDetailView.as_view(), name='job-detail'),
]
