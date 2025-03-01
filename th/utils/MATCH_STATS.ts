export default {
    service: [
        {
            key: 'aces',
            label: 'Aces'
        },
        {
            key: 'dfs',
            label: 'Double faults'
        },
        {
            label: 'First serve',
            percent: true
        },
        {
            key: 'serve1',
            label: '1st serve points won',
            percent: true
        },
        {
            key: 'serve2',
            label: '2nd serve points won',
            percent: true
        },
        {
            key: 'bps_saved',
            label: 'Break points saved',
            percent: true
        }
    ],
    return: [
        {
            key: 'ret1',
            label: '1st serve return points won'
        },
        {
            key: 'ret2',
            label: '2nd serve return points won'
        },
        {
            key: 'bps_converted',
            label: 'Break points converted'
        }
    ],
    points: [
        {
            key: 'winners',
            label: 'Winners'
        },
        {
            key: 'ues',
            label: 'Unforced errors'
        },
        {
            key: 'net',
            label: 'Net points won'
        },
        {
            label: 'Service points won'
        },
        {
            label: 'Return points won'
        },
        {
            label: 'Total points won'
        }
    ],
    service_speed: [
        {
            key: 'max_speed',
            label: 'Max speed'
        },
        {
            key: 'avg1_speed',
            label: '1st serve average speed'
        },
        {
            key: 'avg2_speed',
            label: '2nd serve average speed'
        }
    ]
}