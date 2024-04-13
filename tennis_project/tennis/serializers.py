from rest_framework import serializers
from .models import Tournament, Player, Edition, Entry, MatchScore

class MatchScoreSerializer(serializers.HyperlinkedModelSerializer):
    edition = serializers.HyperlinkedRelatedField(
        view_name = 'edition-detail',
        read_only = True
    )

    edition_id = serializers.PrimaryKeyRelatedField(
        queryset = Edition.objects.all(),
        source = 'edition'
    )

    p1_no = serializers.HyperlinkedRelatedField(
        view_name = 'entry-detail',
        read_only = True
    )

    p1_no_id = serializers.PrimaryKeyRelatedField(
        queryset = Entry.objects.all(),
        source = 'entry'
    )

    p1 = serializers.HyperlinkedRelatedField(
        view_name = 'player-detail',
        read_only = True
    )

    p1_id = serializers.PrimaryKeyRelatedField(
        queryset = Player.objects.all(),
        source = 'player'
    )

    p2_no = serializers.HyperlinkedRelatedField(
        view_name = 'entry-detail',
        read_only = True
    )

    p2_no_id = serializers.PrimaryKeyRelatedField(
        queryset = Entry.objects.all(),
        source = 'entry'
    )

    p2 = serializers.HyperlinkedRelatedField(
        view_name = 'player-detail',
        read_only = True
    )

    p2_id = serializers.PrimaryKeyRelatedField(
        queryset = Player.objects.all(),
        source = 'player'
    )

    winner_id = serializers.HyperlinkedRelatedField(
        view_name = 'player-detail',
        read_only = True
    )

    winner_id_id = serializers.PrimaryKeyRelatedField(
        queryset = Player.objects.all(),
        source = 'player'
    )

    class Meta:
        model = MatchScore
        fields = ('id', 'edition', 'edition_id', 'round', 'match_no', 'p1_no', 'p1_no_id', 'p1', 'p1_id', 'p2_no', 'p2_no_id', 'p2', 'p2_id', 'winner_id', 'winner_id_id', 'duration_mins', 'incomplete', 'umpire', 'date', 's1p1', 's1p2', 't1p1', 't1p2', 's2p1', 's2p2', 't2p1', 't2p2', 's3p1', 's3p2', 't3p1', 't3p2', 's4p1', 's4p2', 't4p1', 't4p2', 's5p1', 's5p2', 't5p1', 't5p1' )

class EntrySerializer(serializers.HyperlinkedModelSerializer):
    matches = MatchScoreSerializer(
        many = True,
        read_only = True
    )

    edition = serializers.HyperlinkedRelatedField(
        view_name = 'edition-detail',
        read_only = True
    )

    edition_id = serializers.PrimaryKeyRelatedField(
        queryset = Edition.objects.all(),
        source = 'edition'
    )

    player = serializers.HyperlinkedRelatedField(
        view_name = 'player-detail',
        read_only = True
    )

    player_id = serializers.PrimaryKeyRelatedField(
        queryset = Player.objects.all(),
        source = 'player'
    )

    class Meta:
        model = Entry
        fields = ('id', 'entry_no', 'edition', 'edition_id', 'player', 'player_id', 'rank', 'seed', 'status', 'wd', 'ret', 'wo', 'defaulted', 'points', 'pm', 'matches')

class EditionSerializer(serializers.HyperlinkedModelSerializer):
    entries = EntrySerializer(
        many = True,
        read_only = True
    )

    winner = serializers.HyperlinkedRelatedField(
        view_name = 'tournament-detail',
        read_only = True
    )

    winner_id = serializers.PrimaryKeyRelatedField(
        queryset = Tournament.objects.all(),
        source = 'tournament'
    )

    winner = serializers.HyperlinkedRelatedField(
        view_name = 'player-detail',
        read_only = True
    )

    winner_id = serializers.PrimaryKeyRelatedField(
        queryset = Player.objects.all(),
        source = 'player'
    )

    finalist = serializers.HyperlinkedRelatedField(
        view_name = 'player-detail',
        read_only = True
    )

    finalist_id = serializers.PrimaryKeyRelatedField(
        queryset = Player.objects.all(),
        source = 'player'
    )

    class Meta:
        model = Edition
        fields = ('id', 'edition_no', 'tournament', 'tournament_id', 'sponsor_name', 'year', 'start_date', 'end_date', 'category', 'currency', 'pm', 'tfc', 'supervisors', 'venue', 'city', 'country', 'environment', 'surface', 'hard_type', 'winner', 'winner_id', 'finalist', 'finalist_id', 'final_score', 'winner_pm', 'winner_pts', 'finalist_pm', 'finalist_pts', 'semifinalist_pm', 'semifinalist_pts', 'quarterfinalist_pm', 'quarterfinalist_pts', 'r16_pm', 'r16_pts', 'r32_pm', 'r32_pts', 'r64_pm', 'r64_pts', 'r128_pm', 'r128_pts', 'entries')

class PlayerSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Player
        fields = ('id', 'first_name', 'last_name', 'full_name', 'status', 'turned_pro', 'retired', 'country', 'country_yr', 'prev_country', 'prev_country_yr', 'first_country', 'dob', 'rh', 'bh1', 'height_cm', 'height_ft', 'coaches', 'preferred_surfaces', 'age_started', 'career_high', 'ch_date', 'pm_USD', 'titles', 'win', 'loss', 'gladiator', 'headshot', 'ao_round', 'ao_years', 'rg_round', 'rg_years', 'wimbledon_round', 'wimbledon_years', 'uso_round', 'uso_years', 'finals_round', 'finals_years', 'davis_round', 'davis_years', 'olympics_round', 'olympics_years', 'hopman_round', 'hopman_years', 'gs_cup_round', 'gs_cup_years')

class TournamentSerializer(serializers.HyperlinkedModelSerializer):
    editions = EditionSerializer(
        many = True,
        read_only = True
    )

    class Meta:
        model = Tournament
        fields = ('id', 'name', 'start_year', 'end_year', 'website', 'editions')