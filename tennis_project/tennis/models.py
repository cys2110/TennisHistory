from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey


class CategoryChoices(models.TextChoices):
    ATP250 = '250', 'ATP 250'
    ATP500 = '500', 'ATP 500'
    ATP1000 = '1000', 'ATP Masters 1000'
    GS = 'GS', 'Grand Slam'
    F = 'F', 'Finals'
    T = 'T', 'Team'

class CurrencyChoices(models.TextChoices):
    AUD = 'AUD', 'A$'
    USD = 'USD', '$'
    GBP = 'GBP', '£'
    EUR = 'EUR', '€'

class EnvironmentChoices(models.TextChoices):
    INDOOR = 'I', 'Indoor'
    OUTDOOR = 'O', 'Outdoor'

class SurfaceChoices(models.TextChoices):
    CLAY = 'Cl', 'Clay'
    CARPET = 'C', 'Carpet'
    GRASS = 'G', 'Grass'
    HARD = 'H', 'Hard'

class HardChoices(models.TextChoices):
    LAYKOLD = 'L', 'Laykold'
    PLEXICUSHION = 'PC', 'Plexicushion'
    PLEXIPAVE = 'PP', 'Plexipave'
    ACRYLIC = 'A', 'Acrylic on wood'
    GREENSET = 'G', 'Greenset'
    REBOUNDACE = 'RA', 'Rebound ace'
    OPTICOURT = 'O', 'Opticourt'
    RUKORT = 'R', 'Rukort'
    DECOTURF = 'DT', 'Decoturf'
    SPORTMASTER = 'SM', 'SportMaster'

class RoundChoices(models.TextChoices):
    R128 = '128', 'Round of 128'
    R64 = '64', 'Round of 64'
    R32 = '32', 'Round of 32'
    R16 = '16', 'Round of 16'
    QF = 'QF', 'Quarterfinals'
    SF = 'SF', 'Semifinals'
    F = 'F', 'Final'
    W = 'W', 'Win'
    RR = 'RR', 'Round robin'
    G = 'G', 'Gold'
    S = 'S', 'Silver'
    B = 'B', 'Bronze'
    A = 'A', 'Alternate'

class IncompleteChoices(models.TextChoices):
    BYE = 'B', 'Bye'
    DEFAULT = 'D', 'Default'
    RETIREMENT = 'R', 'Retirement'
    WALKOVER = 'WO', 'Walkover'

class StatusChoices(models.TextChoices):
    ALT = 'A', 'Alt'
    LL = 'LL', 'LL'
    PR = 'PR', 'PR'
    Q = 'Q', 'Q'
    SE = 'SE', 'SE'
    WC = 'WC', 'WC'

class Tournament(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField()
    start_year = models.IntegerField()
    end_year = models.IntegerField(null=True, blank=True)
    website = models.URLField(null=True, blank=True)

    def __str__(self):
        return self.name

class Player(models.Model):
    id = models.CharField(primary_key=True)
    first_name = models.CharField()
    last_name = models.CharField()
    full_name = models.CharField()
    status = models.BooleanField()
    turned_pro = models.IntegerField(null=True, blank=True)
    retired = models.IntegerField(null=True, blank=True)
    country = models.CharField(max_length=3)
    country_yr = models.IntegerField(null=True, blank=True)
    prev_country = models.CharField(max_length=3, null=True, blank=True)
    prev_country_yr = models.IntegerField(null=True, blank=True)
    first_country = models.CharField(max_length=3, null=True, blank=True)
    dob = models.DateField(null=True, blank=True)
    rh = models.BooleanField(null=True, blank=True)
    bh1 = models.BooleanField(null=True, blank=True)
    height_cm = models.IntegerField(null=True, blank=True)
    height_ft = models.CharField(null=True, blank=True)
    coaches = ArrayField(models.CharField(null=True, blank=True), null=True, blank=True)
    preferred_surfaces = ArrayField(models.CharField(max_length=2, choices=SurfaceChoices.choices), null=True, blank=True)
    age_started = models.IntegerField(null=True, blank=True)
    career_high = models.IntegerField(null=True, blank=True)
    ch_date = models.DateField(null=True, blank=True)
    pm_USD = models.IntegerField(default=0)
    titles = models.IntegerField(default=0)
    win = models.IntegerField(default=0)
    loss = models.IntegerField(default=0)
    gladiator = models.BooleanField(default=False)
    headshot = models.BooleanField(default=False)
    ao_round = models.CharField(max_length=3, choices=RoundChoices.choices, null=True, blank=True)
    ao_years = ArrayField(models.IntegerField(null=True, blank=True), null=True, blank=True)
    rg_round = models.CharField(max_length=3, choices=RoundChoices.choices, null=True, blank=True)
    rg_years = ArrayField(models.IntegerField(null=True, blank=True), null=True, blank=True)
    wimbledon_round = models.CharField(max_length=3, choices=RoundChoices.choices, null=True, blank=True)
    wimbledon_years = ArrayField(models.IntegerField(null=True, blank=True), null=True, blank=True)
    uso_round = models.CharField(max_length=3, choices=RoundChoices.choices, null=True, blank=True)
    uso_years = ArrayField(models.IntegerField(null=True, blank=True), null=True, blank=True)
    finals_round = models.CharField(max_length=3, choices=RoundChoices.choices, null=True, blank=True)
    finals_years = ArrayField(models.IntegerField(null=True, blank=True), null=True, blank=True)
    davis_round = models.CharField(max_length=3, choices=RoundChoices.choices, null=True, blank=True)
    davis_years = ArrayField(models.IntegerField(null=True, blank=True), null=True, blank=True)
    olympics_round = models.CharField(max_length=3, choices=RoundChoices.choices, null=True, blank=True)
    olympics_years = ArrayField(models.IntegerField(null=True, blank=True), null=True, blank=True)
    hopman_round = models.CharField(max_length=3, choices=RoundChoices.choices, null=True, blank=True)
    hopman_years = ArrayField(models.IntegerField(null=True, blank=True), null=True, blank=True)
    gs_cup_round = models.CharField(max_length=3, choices=RoundChoices.choices, null=True, blank=True)
    gs_cup_years = ArrayField(models.IntegerField(null=True, blank=True), null=True, blank=True)
    wct_round = models.CharField(max_length=3, choices=RoundChoices.choices, null=True, blank=True)
    wct_years = ArrayField(models.IntegerField(null=True, blank=True), null=True, blank=True)

    def __str__(self):
        return self.full_name

class Edition(models.Model):
    edition_no = models.IntegerField()
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='editions')
    tournament_name = models.CharField(null=True, blank=True)
    sponsor_name = models.CharField(null=True, blank=True)
    year = models.IntegerField()
    start_date = models.DateField()
    end_date = models.DateField()
    category = models.CharField(max_length=4, choices=CategoryChoices.choices, null=True, blank=True)
    currency = models.CharField(max_length=3, choices=CurrencyChoices.choices, null=True, blank=True)
    pm = models.IntegerField(null=True, blank=True)
    tfc = models.IntegerField(null=True, blank=True)
    supervisors = ArrayField(models.CharField(null=True, blank=True), null=True, blank=True)
    venue = models.CharField(null=True, blank=True)
    city = models.CharField()
    country = models.CharField(max_length=3)
    environment = models.CharField(max_length=1, choices=EnvironmentChoices.choices)
    surface = models.CharField(max_length=2, choices=SurfaceChoices.choices)
    hard_type = models.CharField(max_length=2, choices=HardChoices.choices, null=True, blank=True)
    winner = models.ForeignKey(Player, on_delete=models.SET_NULL, related_name='title_wins', null=True, blank=True)
    finalist = models.ForeignKey(Player, on_delete=models.SET_NULL, related_name='finals', null=True, blank=True)
    final_score = models.CharField(max_length=20, null=True, blank=True)
    winner_pm = models.IntegerField(null=True, blank=True)
    winner_pts = models.IntegerField(null=True, blank=True)
    finalist_pm = models.IntegerField(null=True, blank=True)
    finalist_pts = models.IntegerField(null=True, blank=True)
    semifinalist_pm = models.IntegerField(null=True, blank=True)
    semifinalist_pts = models.IntegerField(null=True, blank=True)
    quarterfinalist_pm = models.IntegerField(null=True, blank=True)
    quarterfinalist_pts = models.IntegerField(null=True, blank=True)
    r16_pm = models.IntegerField(null=True, blank=True)
    r16_pts = models.IntegerField(null=True, blank=True)
    r32_pm = models.IntegerField(null=True, blank=True)
    r32_pts = models.IntegerField(null=True, blank=True)
    r64_pm = models.IntegerField(null=True, blank=True)
    r64_pts = models.IntegerField(null=True, blank=True)
    r128_pm = models.IntegerField(null=True, blank=True)
    r128_pts = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.tournament_name} {self.year}"

class Entry(models.Model):
    entry_no = models.IntegerField(null=True, blank=True)
    edition = models.ForeignKey(Edition, on_delete=models.CASCADE, related_name='entries')
    player = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='editions')
    rank = models.IntegerField(null=True, blank=True)
    seed = models.IntegerField(null=True, blank=True)
    status = models.CharField(max_length=2, choices=StatusChoices.choices, null=True, blank=True)
    wd = models.CharField(null=True, blank=True)
    ret = models.CharField(null=True, blank=True)
    wo = models.CharField(null=True, blank=True)
    lda = models.IntegerField(null=True, blank=True)
    defaulted = models.CharField(null=True, blank=True)
    points = models.IntegerField(null=True, blank=True)
    pm = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.edition} {self.player}"

class MatchScore(models.Model):
    edition = models.ForeignKey(Edition, on_delete=models.CASCADE, related_name='matches')
    round = models.CharField(max_length=3, choices=RoundChoices.choices)
    match_no = models.IntegerField(null=True, blank=True)
    p1_no = models.ForeignKey(Entry, on_delete=models.CASCADE, related_name='entry_matches_1', null=True, blank=True)
    p1 = models.ForeignKey(Player, on_delete=models.SET_NULL, related_name='p1_matches', null=True, blank=True)
    p2_no = models.ForeignKey(Entry, on_delete=models.CASCADE, related_name='entry_matches_2', null=True, blank=True)
    p2 = models.ForeignKey(Player, on_delete=models.SET_NULL, related_name='p2_matches', null=True, blank=True)
    winner_id = models.ForeignKey(Player, on_delete=models.SET_NULL, related_name='player_wins', null=True, blank=True)
    duration_mins = models.IntegerField(null=True, blank=True)
    incomplete = models.CharField(max_length=2, choices=IncompleteChoices.choices, null=True, blank=True)
    umpire = models.CharField(null=True, blank=True)
    date = models.DateField(null=True, blank=True)
    s1p1 = models.IntegerField(null=True, blank=True)
    s1p2 = models.IntegerField(null=True, blank=True)
    t1p1 = models.IntegerField(null=True, blank=True)
    t1p2 = models.IntegerField(null=True, blank=True)
    s2p1 = models.IntegerField(null=True, blank=True)
    s2p2 = models.IntegerField(null=True, blank=True)
    t2p1 = models.IntegerField(null=True, blank=True)
    t2p2 = models.IntegerField(null=True, blank=True)
    s3p1 = models.IntegerField(null=True, blank=True)
    s3p2 = models.IntegerField(null=True, blank=True)
    t3p1 = models.IntegerField(null=True, blank=True)
    t3p2 = models.IntegerField(null=True, blank=True)
    s4p1 = models.IntegerField(null=True, blank=True)
    s4p2 = models.IntegerField(null=True, blank=True)
    t4p1 = models.IntegerField(null=True, blank=True)
    t4p2 = models.IntegerField(null=True, blank=True)
    s5p1 = models.IntegerField(null=True, blank=True)
    s5p2 = models.IntegerField(null=True, blank=True)
    t5p1 = models.IntegerField(null=True, blank=True)
    t5p2 = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.edition} {self.round} {self.match_no}"
    
    class Meta:
        indexes = [
            models.Index(fields=['edition', 'p1_no', 'p1', 'p2_no', 'p2'])
        ]

class LikedTournaments(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
    liked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} {self.tournament}"

class LikedEditions(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    edition = models.ForeignKey(Edition, on_delete=models.CASCADE)
    liked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} {self.edition}"

class LikedPlayer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    liked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} {self.player}"