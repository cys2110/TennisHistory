from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('tournaments/', views.TournamentList.as_view(), name='tournament_list'),
    path('tournaments/<int:pk>', views.TournamentDetail.as_view(), name='tournament-detail'),
    path('players/', views.PlayerList.as_view(), name='player_list'),
    path('players/<str:pk>', views.PlayerDetail.as_view(), name='player-detail'),
    path('editions/', views.EditionList.as_view(), name='edition_list'),
    path('editions/<int:pk>', views.EditionDetail.as_view(), name='edition-detail'),
    path('editions/edition-no/<int:edition_no>', views.EditionByEditionYear.as_view(), name='editionNo'),
    path('editions/upcoming', views.UpcomingEditionList.as_view(), name='upcoming-editions'),
    path('editions/year/<int:year>', views.EditionsByYear.as_view(), name='editions-by-year'),
    path('editions/player/<str:player>', views.EditionsByPlayer.as_view(), name='editions-by-player'),
    path('entries/', views.EntryList.as_view(), name='entry_list'),
    path('entries/<int:pk>', views.EntryDetail.as_view(), name='entry-detail'),
    path('entries/edition/<int:edition>', views.EntryByEdition.as_view(), name='entry-by-edition'),
    path('match-scores/', views.MatchScoreList.as_view(), name='matchscore_list'),
    path('match-score/<int:pk>', views.MatchScoreDetail.as_view(), name='match-score-detail'),
    path('match-scores/edition/<int:edition>', views.MatchByEdition.as_view(), name='matches-by-edition'),
    path('users/', views.UserList.as_view(), name='user_list'),
    path('users/<int:pk>/', views.UserDetail.as_view(), name='user_detail'),
    path('user/username/<str:username>/', views.UserByUsername.as_view(), name='username_detail'),
    path('likes/players/', views.LikedPlayerList.as_view(), name='liked-player-list'),
    path('likes/players/<int:pk>/', views.LikedPlayerDetail.as_view(), name='liked-player-detail'),
    path('likes/tournaments/', views.LikedTournamentList.as_view(), name='liked-tournament-list'),
    path('likes/tournaments/<int:pk>/', views.LikedTournamentDetail.as_view(), name='liked-tournament-detail'),
    path('likes/editions/', views.LikedEditionsList.as_view(), name='liked-edition-list'),
    path('likes/editions/<int:pk>/', views.LikedEditionDetail.as_view(), name='liked-edition-detail'),
    path('search/<str:search>', views.SearchView.as_view(), name='search-results')
]