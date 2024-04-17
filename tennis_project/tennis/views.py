from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.hashers import make_password
from .serializers import TournamentSerializer, PlayerSerializer, EditionSerializer, EntrySerializer, MatchScoreSerializer, PredictionSerializer, UserSerializer
from .models import Tournament, Player, Edition, Entry, MatchScore, Prediction
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
        return Edition.objects.filter(start_date__gte = timezone.now())

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

class PredictionsByUserAndEdition(generics.ListCreateAPIView):
    serializer_class = PredictionSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user = self.kwargs['user']
        edition = self.kwargs['edition']
        return Prediction.objects.filter(Q(user = user) & Q(edition = edition))

class PredictionsUpdate(generics.RetrieveUpdateDestroyAPIView):
    queryset = Prediction.objects.all()
    serializer_class = PredictionSerializer
    permission_classes = [AllowAny]

class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate refresh and access tokens
        refresh = RefreshToken.for_user(user)

        # Construct response data
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