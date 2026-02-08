import { Paper, Group, Text, ThemeIcon, Stack, SimpleGrid } from '@mantine/core';
import { IconUsers, IconChartBar, IconTrophy } from '@tabler/icons-react';

export default function SystemMetrics({ metrics, onMetricClick }) {
    if (!metrics) return null;

    const stats = [
        {
            title: 'Total Candidates',
            value: metrics.totalCandidates || 0,
            icon: IconUsers,
            color: 'blue',
            gradient: 'linear-gradient(135deg, #1971c2 0%, #339af0 100%)'
        },
        {
            title: 'Average Evaluation Score',
            value: metrics.averageScore?.toFixed(2) || '0.00',
            icon: IconChartBar,
            color: 'indigo',
            gradient: 'linear-gradient(135deg, #3b5bdb 0%, #5c7cfa 100%)'
        },
        {
            title: 'Top Performer',
            value: metrics.topCandidate?.name || 'N/A',
            subtitle: metrics.topCandidate ? `Aggregated Score: ${metrics.topCandidate.total_score?.toFixed(2)}` : '',
            icon: IconTrophy,
            color: 'violet',
            gradient: 'linear-gradient(135deg, #5f3dc4 0%, #7e5bef 100%)'
        }
    ];

    return (
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg" mb="xl">
            {stats.map((stat) => (
                <Paper
                    key={stat.title}
                    p="xl"
                    radius="lg"
                    className="glass hover-card"
                    style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
                    onClick={() => onMetricClick && onMetricClick(stat.title)}
                >
                    <div style={{
                        position: 'absolute',
                        top: '-10px',
                        right: '-10px',
                        width: '80px',
                        height: '80px',
                        background: stat.gradient,
                        filter: 'blur(40px)',
                        opacity: 0.15,
                        borderRadius: '50%'
                    }} />

                    <Group justify="space-between" align="flex-start">
                        <Stack gap={4} style={{ flex: 1 }}>
                            <Text size="xs" tt="uppercase" fw={800} c="dimmed" lts={1}>
                                {stat.title}
                            </Text>
                            <Text fw={800} size="28px" lts={-0.5} style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                {stat.value}
                                {stat.title === 'Average Evaluation Score' && <Text span size="sm" fw={500} c="dimmed">/30</Text>}
                            </Text>
                            {stat.subtitle && (
                                <Text size="xs" c="dimmed" fw={500}>{stat.subtitle}</Text>
                            )}
                        </Stack>
                        <ThemeIcon
                            size={56}
                            radius="xl"
                            style={{
                                background: stat.gradient,
                                boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                            }}
                        >
                            <stat.icon size={26} stroke={2} />
                        </ThemeIcon>
                    </Group>
                </Paper>
            ))}
        </SimpleGrid>
    );
}
