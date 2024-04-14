from django.urls import path
from . import views

urlpatterns = [
    path('tournaments/', views.TournamentList.as_view(), name='tournament_list'),
    path('tournaments/<int:pk>', views.TournamentDetail.as_view(), name='tournament-detail'),
    path('players/', views.PlayerList.as_view(), name='player_list'),
    path('players/<str:pk>', views.PlayerDetail.as_view(), name='player-detail'),
    path('editions/', views.EditionList.as_view(), name='edition_list'),
    path('editions/<int:pk>', views.EditionDetail.as_view(), name='edition-detail'),
    path('editions/upcoming', views.UpcomingEditionList.as_view(), name='upcoming-editions'),
    path('editions/year/<int:year>', views.EditionsByYear.as_view(), name='editions-by-year'),
    path('entries/', views.EntryList.as_view(), name='entry_list'),
    path('entries/<int:pk>', views.EntryDetail.as_view(), name='entry-detail'),
    path('match-scores/', views.MatchScoreList.as_view(), name='matchscore_list'),
    path('match-score/<int:pk>', views.MatchScoreDetail.as_view(), name='match-score-detail')
]