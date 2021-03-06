from django.contrib import admin
from trimit.models import Page, UserProfile, Review, Treatment, Specialities
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
import tagulous.admin


class MyUserAdmin(UserAdmin):

    def group(self, user):
        for group in user.groups.all():
            if group.name == 'hairdressers':
                return 'hairdresser'
            if group.name == 'users':
                return 'user'

    group.short_description = 'Account Type'

    list_display = ('username', 'email', 'group', 'is_staff')


# admin.site.register(Page)
tagulous.admin.register(Page)
admin.site.register(UserProfile)
admin.site.register(Review)
admin.site.register(Treatment)

admin.site.unregister(User)
admin.site.register(User, MyUserAdmin)
tagulous.admin.register(Specialities)
