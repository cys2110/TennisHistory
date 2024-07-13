<template>
    <tr >
        <td>
            <v-chip
                :to="{name: 'H2H', params: {p1Name: encodeName(playerName), p1Id: playerId, p2Name: `${match.opp_first_name}_${match.opp_last_name}`, p2Id: match.opp_id}}"
            >
                H2H
            </v-chip>
        </td>
    </tr>
</template>