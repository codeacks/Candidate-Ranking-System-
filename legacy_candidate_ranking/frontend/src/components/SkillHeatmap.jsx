import { Paper, Title, Text, Group, Badge, useMantineColorScheme, useComputedColorScheme } from '@mantine/core';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function SkillHeatmap({ data }) {
    const computedColorScheme = useComputedColorScheme('dark', { getInitialValueInEffect: true });

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <Paper p="md" shadow="xl" className="glass" style={{ border: '1px solid rgba(128,128,128,0.2)' }}>
                    <Text size="xs" fw={700} mb="xs" c={computedColorScheme === 'dark' ? 'white' : 'black'}>{label}</Text>
                    {payload.map((entry, index) => (
                        <Group key={index} gap="xs" justify="space-between" minWidth={140}>
                            <Group gap={6}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: entry.color }} />
                                <Text size="11px" fw={500} c="dimmed">{entry.name}</Text>
                            </Group>
                            <Text size="11px" fw={700} c={computedColorScheme === 'dark' ? 'white' : 'black'}>{entry.value.toFixed(1)}</Text>
                        </Group>
                    ))}
                </Paper>
            );
        }
        return null;
    };

    if (!data || data.length === 0) {
        return (
            <Paper p="xl" radius="lg" className="glass">
                <Text c="dimmed" ta="center">Awaiting analytical data...</Text>
            </Paper>
        );
    }

    const chartData = data.slice(0, 12).map((candidate) => ({
        name: candidate.name?.split(' ')[0] || 'Unknown',
        Crisis: candidate.crisis_management_score || 0,
        Sustainability: candidate.sustainability_score || 0,
        Motivation: candidate.team_motivation_score || 0
    }));

    return (
        <Paper p="24px" radius="lg" className="glass">
            <Title order={3} mb="xl" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="title-underline">Performance Analytics</span>
                <Badge variant="dot" color="teal" size="sm">REAL-TIME</Badge>
            </Title>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis
                        dataKey="name"
                        stroke="#495057"
                        tick={{ fontSize: 11, fontWeight: 500 }}
                        axisLine={false}
                        tickLine={false}
                        dy={10}
                    />
                    <YAxis
                        stroke="#495057"
                        domain={[0, 10]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fontWeight: 500 }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                    <Legend
                        iconType="circle"
                        wrapperStyle={{ paddingTop: '30px', fontSize: '11px', fontWeight: 600, color: '#868e96' }}
                    />
                    <Bar name="Crisis Management" dataKey="Crisis" fill="#fa5252" radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar name="Sustainability" dataKey="Sustainability" fill="#40c057" radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar name="Team Motivation" dataKey="Motivation" fill="#339af0" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
            </ResponsiveContainer>
        </Paper>
    );
}
