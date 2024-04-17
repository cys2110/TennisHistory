from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import filters
from .serializers import TournamentSerializer, PlayerSerializer, EditionSerializer, EntrySerializer, MatchScoreSerializer, UserSerializer, LikedEditionSerializer, LikedPlayerSerializer, LikedTournamentSerializer
from .models import Tournament, Player, Edition, Entry, MatchScore, LikedEditions, LikedPlayer, LikedTournaments
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models import Q

class TournamentList(generics.ListCreateAPIView):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer
    permission_classes = [AllowAny]

class TournamentDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer
    permission_classes = [AllowAny]

class PlayerList(generics.ListCreateAPIView):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer
    permission_classes = [AllowAny]

class PlayerDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer
    permission_classes = [AllowAny]

class EditionList(generics.ListCreateAPIView):
    queryset = Edition.objects.all()
    serializer_class = EditionSerializer
    permission_classes = [AllowAny]

class EditionDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Edition.objects.all()
    serializer_class = EditionSerializer
    permission_classes = [AllowAny]

class EditionByEditionYear(generics.RetrieveUpdateAPIView):
    serializer_class = EditionSerializer
    queryset = Edition.objects.all()
    lookup_field = 'edition_no'
    permission_classes = [AllowAny]

class UpcomingEditionList(generics.ListAPIView):
    serializer_class = EditionSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Edition.objects.filter(end_date__gte = timezone.now())

class EditionsByYear(generics.ListAPIView):
    serializer_class = EditionSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        year = self.kwargs['year']
        return Edition.objects.filter(year = year)

class EditionsByPlayer(generics.ListAPIView):
    serializer_class = EditionSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        player = self.kwargs['player']
        return Edition.objects.filter(Q(winner_id=player) | Q(finalist_id=player))

class EntryList(generics.ListCreateAPIView):
    queryset = Entry.objects.all()
    serializer_class = EntrySerializer
    permission_classes = [AllowAny]

class EntryDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Entry.objects.all()
    serializer_class = EntrySerializer
    permission_classes = [AllowAny]

class EntryByEdition(generics.ListAPIView):
    serializer_class = EntrySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        edition = self.kwargs['edition']
        return Entry.objects.filter(edition_id = edition)

class MatchScoreList(generics.ListCreateAPIView):
    queryset = MatchScore.objects.all()
    serializer_class = MatchScoreSerializer
    permission_classes = [AllowAny]

class MatchScoreDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = MatchScore.objects.all()
    serializer_class = MatchScoreSerializer
    permission_classes = [AllowAny]

class MatchByEdition(generics.ListAPIView):
    serializer_class = MatchScoreSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        edition = self.kwargs['edition']
        return MatchScore.objects.filter(edition_id = edition)

class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)

        response_data = {
            'user': serializer.data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

        return Response(response_data, status=status.HTTP_201_CREATED)

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

class UserByUsername(generics.ListAPIView):
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        username = self.kwargs['username']
        return User.objects.filter(username = username)

class LikedPlayerList(generics.ListCreateAPIView):
    serializer_class = LikedPlayerSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return LikedPlayer.objects.filter(user=user)

class LikedPlayerDetail(generics.DestroyAPIView):
    queryset = LikedPlayer.objects.all()
    serializer_class = LikedPlayerSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

class LikedTournamentList(generics.ListCreateAPIView):
    serializer_class = LikedTournamentSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return LikedTournaments.objects.filter(user=user)

class LikedTournamentDetail(generics.DestroyAPIView):
    queryset = LikedTournaments.objects.all()
    serializer_class = LikedTournamentSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

class LikedEditionsList(generics.ListCreateAPIView):
    serializer_class = LikedEditionSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return LikedEditions.objects.filter(user=user)

class LikedEditionDetail(generics.DestroyAPIView):
    queryset = LikedEditions.objects.all()
    serializer_class = LikedEditionSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

class SearchView(generics.ListAPIView):
    serializer_class = None
    queryset = None

    def get_queryset(self):
        search = self.kwargs['search']
        queryset = {
            'players': Player.objects.filter(full_name__icontains = search),
            'tournaments': Tournament.objects.filter(name__icontains = search)
        }
        return queryset
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        player_serializer = PlayerSerializer(queryset['players'], many=True, context={'request': request})
        tournament_serializer = TournamentSerializer(queryset['tournaments'], many=True, context={'request': request})
        serialized_data = {
            'players': player_serializer.data,
            'tournaments': tournament_serializer.data
        }
        return Response(serialized_data)
