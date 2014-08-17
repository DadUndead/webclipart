from django.contrib import admin
from models import Category, Image


class ImageAdmin(admin.ModelAdmin):
    list_display = ('name', 'image_thumb')


class ImageInline(admin.StackedInline):
    model = Image
    extra = 0


class CategoryAdmin(admin.ModelAdmin):
    inlines = [ImageInline]


admin.site.register(Image, ImageAdmin)
admin.site.register(Category, CategoryAdmin)