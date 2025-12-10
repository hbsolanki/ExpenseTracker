from django.db import models
class User(models.Model):
    name = models.CharField(max_length=150)
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=255)
    image = models.ImageField(upload_to="user/", null=True, blank=True)

    @property
    def is_authenticated(self):
        return True

    @property
    def is_staff(self):
        return False

    @property
    def is_superuser(self):
        return False

    def has_perm(self, perm, obj=None):
        return False

    def has_perms(self, perm_list):
        return False

    def has_module_perms(self, app_label):
        return False
