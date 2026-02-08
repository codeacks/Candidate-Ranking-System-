import { Table, Badge, Text, Group, Avatar, Paper, Title, ActionIcon, Stack } from '@mantine/core';
import { IconTrophy, IconMedal, IconChevronRight } from '@tabler/icons-react';

const getRankBadge = (rank) => {
    if (rank === 1) return <Avatar color="yellow.6" size="md" radius="xl" style={{ boxShadow: '0 0 15px rgba(250, 176, 5, 0.4)' }}><IconTrophy size={20} /></Avatar>;
    if (rank === 2) return <Avatar color="gray.4" size="md" radius="xl"><IconMedal size={20} /></Avatar>;
    if (rank === 3) return <Avatar color="orange.8" size="md" radius="xl"><IconMedal size={20} /></Avatar>;
    return (
        <Avatar color="dark.4" size="md" radius="xl" variant="outline">
            <Text size="sm" fw={700}>{rank}</Text>
        </Avatar>
    );
};

export default function Leaderboard({ data, onSelect }) {
    if (!data || data.length === 0) {
        return (
            <Paper p="xl" radius="lg" withBorder className="glass">
                <Text c="dimmed" ta="center">Waiting for ranking data...</Text>
            </Paper>
        );
    }

    const rows = data.slice(0, 10).map((candidate) => (
        <Table.Tr
            key={candidate.candidate_id || candidate.id}
            onClick={() => onSelect && onSelect(candidate)}
            style={{ cursor: 'pointer' }}
        >
            <Table.Td style={{ width: '80px' }}>
                <Group justify="center">
                    {getRankBadge(candidate.rank_position)}
                </Group>
            </Table.Td>
            <Table.Td>
                <Group gap="sm">
                    <Avatar color="blue" radius="xl" size="sm" src={null}>
                        {candidate.name?.charAt(0)}
                    </Avatar>
                    <Stack gap={0}>
                        <Text fw={600} size="sm">{candidate.name}</Text>
                        <Text size="11px" c="dimmed">{candidate.experience_years} years experience</Text>
                    </Stack>
                </Group>
            </Table.Td>
            <Table.Td>
                <Stack gap={2}>
                    <Text fw={700} size="sm" c="blue.4">
                        {candidate.total_score?.toFixed(2)}
                    </Text>
                    <Text size="10px" c="dimmed">AGGREGATED SCORE</Text>
                </Stack>
            </Table.Td>
            <Table.Td>
                <ActionIcon variant="subtle" color="gray" radius="xl">
                    <IconChevronRight size={16} />
                </ActionIcon>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Paper p="24px" radius="lg" className="glass" style={{ height: '100%' }}>
            <Title order={3} mb="xl" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="title-underline">Leaderboard</span>
                <Badge variant="light" color="blue" size="sm" radius="sm">TOP 10</Badge>
            </Title>
            <Table className="premium-table" verticalSpacing="md">
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th style={{ textAlign: 'center' }}>Rank</Table.Th>
                        <Table.Th>Candidate Details</Table.Th>
                        <Table.Th>Performance</Table.Th>
                        <Table.Th></Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </Paper>
    );
}
