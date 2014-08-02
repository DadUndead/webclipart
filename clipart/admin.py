from django.contrib import admin
from models import Category, Picture


admin.site.register(Category)


class PictureAdmin(admin.ModelAdmin):
    list_display = ('name', 'image_thumb')
    list_filter = ['categories']
    filter_horizontal = ['categories']


admin.site.register(Picture, PictureAdmin)
