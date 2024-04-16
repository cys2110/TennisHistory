from django.shortcuts import render
from rest_framework import generics
from .serializers import TournamentSerializer, PlayerSerializer, EditionSerializer, EntrySerializer, MatchScoreSerializer
from .models import Tournament, Player, Edition, Entry, MatchScore
from django.utils import timezone
from django.db.models import Q

class TournamentList(generics.ListCreateAPIView):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer

class TournamentDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer

class PlayerList(generics.ListCreateAPIView):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer

class PlayerDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer

class EditionList(generics.ListCreateAPIView):
    queryset = Edition.objects.all()
    serializer_class = EditionSerializer

class EditionDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Edition.objects.all()
    serializer_class = EditionSerializer

class EditionByEditionYear(generics.RetrieveUpdateAPIView):
    serializer_class = EditionSerializer
    queryset = Edition.objects.all()
    lookup_field = 'edition_no'

class UpcomingEditionList(generics.ListAPIView):
    serializer_class = EditionSerializer

    def get_queryset(self):
        return Edition.objects.filter(start_date__gte = timezone.now())

class EditionsByYear(generics.ListAPIView):
    serializer_class = EditionSerializer

    def get_queryset(self):
        year = self.kwargs['year']
        return Edition.objects.filter(year = year)

class EditionsByPlayer(generics.ListAPIView):
    serializer_class = EditionSerializer

    def get_queryset(self):
        player = self.kwargs['player']
        return Edition.objects.filter(Q(winner_id=player) | Q(finalist_id=player))

class EntryList(generics.ListCreateAPIView):
    queryset = Entry.objects.all()
    serializer_class = EntrySerializer

class EntryDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Entry.objects.all()
    serializer_class = EntrySerializer

class EntryByEdition(generics.ListAPIView):
    serializer_class = EntrySerializer

    def get_queryset(self):
        edition = self.kwargs['edition']
        return Entry.objects.filter(edition_id = edition)

class MatchScoreList(generics.ListCreateAPIView):
    queryset = MatchScore.objects.all()
    serializer_class = MatchScoreSerializer

class MatchScoreDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = MatchScore.objects.all()
    serializer_class = MatchScoreSerializer

class MatchByEdition(generics.ListAPIView):
    serializer_class = MatchScoreSerializer

    def get_queryset(self):
        edition = self.kwargs['edition']
        return MatchScore.objects.filter(edition_id = edition)