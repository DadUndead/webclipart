from django.contrib import admin
from models import Category, Image


admin.site.register(Category)


class ImageAdmin(admin.ModelAdmin):
    list_display = ('name', 'image_thumb')
    list_filter = ['categories']
    filter_horizontal = ['categories']


admin.site.register(Image, ImageAdmin)
