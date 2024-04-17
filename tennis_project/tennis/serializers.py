from rest_framework import serializers
from .models import Tournament, Player, Edition, Entry, MatchScore, LikedPlayer, LikedEditions, LikedTournaments
from django.contrib.auth.models import User

class MatchScoreSerializer(serializers.HyperlinkedModelSerializer):
    edition_id = serializers.PrimaryKeyRelatedField(
        queryset = Edition.objects.all(),
        source = 'edition'
    )

    p1_no_id = serializers.PrimaryKeyRelatedField(
        queryset = Entry.objects.all(),
        source = 'p1_no'
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

    winner_id_id = serializers.PrimaryKeyRelatedField(
        queryset = Player.objects.all(),
        source = 'winner_id'
    )

    class Meta:
        model = MatchScore
        fields = ('id', 'edition', 'edition_id', 'round', 'match_no', 'p1_no_id', 'p1_id', 'p1_name', 'p1_headshot', 'p1_country', 'p1_seed', 'p1_status', 'p2_no_id', 'p2_id', 'p2_name', 'p2_country', 'p2_headshot', 'p2_seed', 'p2_status', 'winner_id_id', 'duration_mins', 'incomplete', 'umpire', 'date', 's1p1', 's1p2', 't1p1', 't1p2', 's2p1', 's2p2', 't2p1', 't2p2', 's3p1', 's3p2', 't3p1', 't3p2', 's4p1', 's4p2', 't4p1', 't4p2', 's5p1', 's5p2', 't5p1', 't5p1' )

    def get_p1_data(self, obj):
        if obj.p1:
            p1_data = {
                'id': obj.p1_id,
                'name': obj.p1.full_name,
                'country': obj.p1.country,
                'headshot': obj.p1.headshot,
                'seed': obj.p1_no.seed if obj.p1_no else None,
                'status': obj.p1_no.status if obj.p1_no else None,
            }
            return p1_data
        else:
            return None

    def get_p2_data(self, obj):
        if obj.p2:
            p2_data = {
                'id': obj.p2_id,
                'name': obj.p2.full_name,
                'country': obj.p2.country,
                'headshot': obj.p2.headshot,
                'seed': obj.p2_no.seed if obj.p2_no else None,
                'status': obj.p2_no.status if obj.p2_no else None,
            }
            return p2_data
        else:
            return None

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['p1_data'] = self.get_p1_data(instance)
        representation['p2_data'] = self.get_p2_data(instance)
        return representation

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

class UserSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'email', 'first_name', 'last_name')
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User.objects.create(**validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user

class LikedPlayerSerializer(serializers.HyperlinkedModelSerializer):
    player_id = serializers.PrimaryKeyRelatedField(
        queryset = Player.objects.all(),
        source = 'player'
    )

    player_name = serializers.CharField(source = 'player.full_name', read_only = True)
    player_country = serializers.CharField(source='player.country', read_only = True)
    player_headshot = serializers.CharField(source='player.headshot', read_only = True)

    user_id = serializers.PrimaryKeyRelatedField (
        queryset = User.objects.all(),
        source = 'user'
    )

    class Meta:
        model = LikedPlayer
        fields = ('id', 'user_id', 'player_id', 'player_name', 'player_country', 'player_headshot', 'liked_at')

class LikedTournamentSerializer(serializers.HyperlinkedModelSerializer):
    tournament_id = serializers.PrimaryKeyRelatedField(
        queryset = Tournament.objects.all(),
        source = 'tournament'
    )

    tournament_name = serializers.CharField(source = 'tournament.name', read_only = True)
    tournament_end = serializers.IntegerField(source = 'tournament.end_year', read_only = True)

    user_id = serializers.PrimaryKeyRelatedField (
        queryset = User.objects.all(),
        source = 'user'
    )

    class Meta:
        model = LikedTournaments
        fields = ('id', 'user_id', 'tournament_id', 'tournament_name', 'tournament_end', 'liked_at')

class LikedEditionSerializer(serializers.HyperlinkedModelSerializer):
    edition_id = serializers.PrimaryKeyRelatedField(
        queryset = Edition.objects.all(),
        source = 'edition'
    )

    tournament_name = serializers.CharField(source = 'edition.tournament_name', read_only = True)
    edition_name = serializers.CharField(source='edition.sponsor_name', read_only = True)
    edition_city = serializers.CharField(source='edition.city', read_only = True)
    edition_country = serializers.CharField(source='edition.country', read_only = True)
    edition_start = serializers.CharField(source='edition.start_date', read_only = True)
    edition_end = serializers.CharField(source='edition.end_date', read_only = True)

    user_id = serializers.PrimaryKeyRelatedField (
        queryset = User.objects.all(),
        source = 'user'
    )

    class Meta:
        model = LikedEditions
        fields = ('id', 'user_id', 'edition_id', 'tournament_name', 'edition_name', 'edition_city', 'edition_country', 'edition_start', 'edition_end', 'liked_at')