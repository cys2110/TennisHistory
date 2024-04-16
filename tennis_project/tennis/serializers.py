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
        source = 'p1_no'
    )

    p1 = serializers.HyperlinkedRelatedField(
        view_name = 'player-detail',
        read_only = True
    )

    p1_id = serializers.PrimaryKeyRelatedField(
        queryset = Player.objects.all(),
        source = 'p1'
    )

    p1_name = serializers.CharField(source='p1.full_name', read_only = True)
    p1_country = serializers.CharField(source='p1.country', read_only = True)
    p1_headshot = serializers.CharField(source='p1.headshot', read_only = True)
    p1_seed = serializers.CharField(source='p1_no.seed', read_only = True)
    p1_status = serializers.CharField(source='p1_no.status', read_only = True)

    p2_no = serializers.HyperlinkedRelatedField(
        view_name = 'entry-detail',
        read_only = True
    )

    p2 = serializers.HyperlinkedRelatedField(
        view_name = 'player-detail',
        read_only = True
    )

    p2_id = serializers.PrimaryKeyRelatedField(
        queryset = Player.objects.all(),
        source = 'p2'
    )

    p2_no_id = serializers.PrimaryKeyRelatedField(
        queryset = Entry.objects.all(),
        source = 'p2_no'
    )

    p2_name = serializers.CharField(source='p2.full_name', read_only = True)
    p2_country = serializers.CharField(source='p2.country', read_only = True)
    p2_headshot = serializers.CharField(source='p2.headshot', read_only = True)
    p2_seed = serializers.CharField(source='p2_no.seed', read_only = True)
    p2_status = serializers.CharField(source='p2_no.status', read_only = True)

    winner_id = serializers.HyperlinkedRelatedField(
        view_name = 'player-detail',
        read_only = True
    )

    winner_id_id = serializers.PrimaryKeyRelatedField(
        queryset = Player.objects.all(),
        source = 'winner_id'
    )

    class Meta:
        model = MatchScore
        fields = ('id', 'edition', 'edition_id', 'round', 'match_no', 'p1_no', 'p1_no_id', 'p1', 'p1_id', 'p1_name', 'p1_headshot', 'p1_country', 'p1_seed', 'p1_status', 'p2_no', 'p2_no_id', 'p2', 'p2_id', 'p2_name', 'p2_country', 'p2_headshot', 'p2_seed', 'p2_status', 'winner_id', 'winner_id_id', 'duration_mins', 'incomplete', 'umpire', 'date', 's1p1', 's1p2', 't1p1', 't1p2', 's2p1', 's2p2', 't2p1', 't2p2', 's3p1', 's3p2', 't3p1', 't3p2', 's4p1', 's4p2', 't4p1', 't4p2', 's5p1', 's5p2', 't5p1', 't5p1' )

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

    player_name = serializers.CharField(source='player.full_name', read_only = True)
    player_country = serializers.CharField(source='player.country', read_only = True)
    player_headshot = serializers.CharField(source='player.headshot', read_only = True)

    class Meta:
        model = Entry
        fields = ('id', 'entry_no', 'edition', 'edition_id', 'player', 'player_id', 'player_name', 'player_country', 'player_headshot', 'rank', 'seed', 'status', 'wd', 'ret', 'wo', 'defaulted', 'lda', 'points', 'pm', 'matches')

class EditionSerializer(serializers.HyperlinkedModelSerializer):
    entries = EntrySerializer(
        many = True,
        read_only = True
    )

    tournament = serializers.HyperlinkedRelatedField(
        view_name = 'tournament-detail',
        read_only = True
    )

    tournament_id = serializers.PrimaryKeyRelatedField(
        queryset = Tournament.objects.all(),
        source = 'tournament'
    )

    winner = serializers.HyperlinkedRelatedField(
        view_name = 'player-detail',
        read_only = True
    )

    winner_id = serializers.PrimaryKeyRelatedField(
        queryset = Player.objects.all(),
        source = 'winner'
    )

    winner_name = serializers.CharField(source='winner.full_name', read_only = True)
    winner_country = serializers.CharField(source='winner.country', read_only = True)
    winner_headshot = serializers.CharField(source='winner.headshot', read_only = True)

    finalist = serializers.HyperlinkedRelatedField(
        view_name = 'player-detail',
        read_only = True
    )

    finalist_id = serializers.PrimaryKeyRelatedField(
        queryset = Player.objects.all(),
        source = 'finalist'
    )

    finalist_name = serializers.CharField(source='finalist.full_name', read_only = True)
    finalist_country = serializers.CharField(source='finalist.country', read_only = True)
    finalist_headshot = serializers.CharField(source='finalist.headshot', read_only = True)

    class Meta:
        model = Edition
        fields = ('id', 'edition_no', 'tournament', 'tournament_id', 'tournament_name', 'sponsor_name', 'year', 'start_date', 'end_date', 'category', 'currency', 'pm', 'tfc', 'supervisors', 'venue', 'city', 'country', 'environment', 'surface', 'hard_type', 'winner', 'winner_id', 'winner_name', 'winner_country', 'winner_headshot', 'finalist', 'finalist_id', 'finalist_name', 'finalist_country', 'finalist_headshot', 'final_score', 'winner_pm', 'winner_pts', 'finalist_pm', 'finalist_pts', 'semifinalist_pm', 'semifinalist_pts', 'quarterfinalist_pm', 'quarterfinalist_pts', 'r16_pm', 'r16_pts', 'r32_pm', 'r32_pts', 'r64_pm', 'r64_pts', 'r128_pm', 'r128_pts', 'entries')

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