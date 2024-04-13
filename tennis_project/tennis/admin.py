from django.contrib import admin
from .models import Tournament, Player, Edition, Entry, MatchScore

admin.site.register(Tournament)
admin.site.register(Player)
admin.site.register(Edition)
admin.site.register(Entry)
admin.site.register(MatchScore)