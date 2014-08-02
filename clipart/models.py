# coding=utf-8
from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=50, verbose_name=u'название')
    desc = models.TextField(verbose_name=u'категория', blank=True)

    def __unicode__(self):
        return self.name

    class Meta:
        verbose_name = u'категория'
        verbose_name_plural = u'Категории'


class Picture(models.Model):
    name = models.CharField(max_length=50, verbose_name=u'название')
    src = models.FileField(upload_to='pictures', verbose_name=u'путь')
    categories = models.ManyToManyField(Category)

    def __unicode__(self):
        return self.name

    def image_thumb(self):
        return '<img src="/media/%s" width="100" height="100" />' % self.src

    image_thumb.allow_tags = True
    image_thumb.short_description = u'Превью'

    class Meta:
        verbose_name = u'изображение'
        verbose_name_plural = u'Изображения'
