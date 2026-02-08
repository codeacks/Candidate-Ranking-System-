import { Card, Text, Badge, Group, Stack, Progress, Avatar } from '@mantine/core';
import { IconBriefcase, IconTools, IconShieldCheck, IconLeaf, IconHeartHandshake } from '@tabler/icons-react';

export default function CandidateCard({ candidate, onSelect }) {
    if (!candidate) return null;

    const scores = [
        { label: 'Crisis Management', value: candidate.crisis_management_score, color: 'red.6', icon: IconShieldCheck },
        { label: 'Sustainability', value: candidate.sustainability_score, color: 'green.6', icon: IconLeaf },
        { label: 'Motivation', value: candidate.team_motivation_score, color: 'blue.6', icon: IconHeartHandshake }
    ];

    return (
        <Card
            p="xl"
            radius="lg"
            className="glass hover-card"
            onClick={() => onSelect && onSelect(candidate)}
            style={{ cursor: 'pointer' }}
        >
            <Group justify="space-between" mb="lg" align="flex-start">
                <Group gap="sm">
                    <Avatar
                        size="md"
                        radius="md"
                        variant="filled"
                        color="blue.8"
                    >
                        {candidate.name?.charAt(0)}
                    </Avatar>
                    <Stack gap={2}>
                        <Text fw={700} size="md" lts={-0.5}>{candidate.name}</Text>
                        <Group gap={6}>
                            <IconBriefcase size={12} color="#868e96" />
                            <Text size="11px" c="dimmed" fw={500}>{candidate.experience_years} Years Exp.</Text>
                        </Group>
                    </Stack>
                </Group>
                {candidate.rank_position && (
                    <Badge
                        variant="filled"
                        color="indigo"
                        size="sm"
                        radius="sm"
                        style={{ height: '24px' }}
                    >
                        #{candidate.rank_position}
                    </Badge>
                )}
            </Group>

            <Group gap={6} mb="xl" wrap="wrap">
                {candidate.skills?.split(', ').slice(0, 3).map((skill, idx) => (
                    <Badge key={idx} size="xs" variant="light" color="gray.6" tt="none">
                        {skill}
                    </Badge>
                ))}
            </Group>

            <Stack gap="md">
                {scores.map((score) => (
                    <div key={score.label}>
                        <Group justify="space-between" mb={6}>
                            <Group gap={6}>
                                <score.icon size={12} color="var(--mantine-color-dimmed)" />
                                <Text size="11px" fw={600} c="dimmed">{score.label}</Text>
                            </Group>
                            <Text size="11px" fw={700} c={score.color}>{score.value?.toFixed(1)}</Text>
                        </Group>
                        <Progress
                            value={(score.value / 10) * 100}
                            color={score.color}
                            size="4px"
                            radius="xl"
                            style={{ background: 'rgba(255,255,255,0.05)' }}
                        />
                    </div>
                ))}
            </Stack>

            <div style={{
                marginTop: '24px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                textAlign: 'center'
            }}>
                <Text size="10px" fw={700} c="dimmed" tt="uppercase" lts={1} mb={4}>Total Performance</Text>
                <Text size="xl" fw={800} c="blue.4">
                    {candidate.total_score?.toFixed(2)}
                </Text>
            </div>
        </Card>
    );
}
