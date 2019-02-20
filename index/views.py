from django.shortcuts import render
from django.http import HttpResponse
import json

def index(request):
    return render(request, 'index/index.html')

def check(request):
    return HttpResponse(json.dumps({'type': 'data', 'value': 'exists'}))