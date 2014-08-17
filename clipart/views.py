# coding=utf-8
from django.http import HttpResponse
from django.shortcuts import render
from models import Category, Image

import json


def index(request):
    """
    домашняя и единственная страничка сайта
    :param request:
    :return:
    """
    return render(request, 'clipart/index.html')


def get_categories(request):
    """
    Возвращает список категорий картинок
    :param request:
    :return:
    """
    data = [{"id": cat.id, "name": cat.name} for cat in Category.objects.all()]
    return render_json(data)


def get_images(request):
    """
    Возвращает список картинок
    :param request:
    :return:
    """
    categories = []
    param = request.GET.get('categories')
    if param is not None:
        categories = map(int, param.split(','))

    data = [{"src": pic.src.url, "name": pic.name}
            for pic in Image.objects.filter(category__in=categories)]
    return render_json(data)


def render_json(data):
    return HttpResponse(
        json.dumps(data),
        content_type="application/json"
    )
