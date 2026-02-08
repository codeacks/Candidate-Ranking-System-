import { Paper, Title, Text, Group, Stack, Badge, Avatar, Progress, SimpleGrid, Divider, Box, Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconBriefcase, IconCertificate, IconShieldCheck, IconLeaf, IconHeartHandshake, IconChartLine, IconShare } from '@tabler/icons-react';

export default function CandidateDetail({ candidate }) {
    if (!candidate) return null;

    const handleShare = () => {
        notifications.show({
            title: 'Profile Shared',
            message: `Candidate profile for ${candidate.name} has been shared with the HR regional team.`,
            color: 'green',
            icon: <IconShare size={16} />,
        });
    };

    const scores = [
        { label: 'Crisis Management', value: candidate.crisis_management_score, color: 'red.6', icon: IconShieldCheck, description: 'Ability to handle industrial emergencies and critical safety protocols.' },
        { label: 'Sustainability', value: candidate.sustainability_score, color: 'green.6', icon: IconLeaf, description: 'Knowledge of circular economy, waste reduction, and eco-efficiency.' },
        { label: 'Team Motivation', value: candidate.team_motivation_score, color: 'blue.6', icon: IconHeartHandshake, description: 'Leadership capacity and operational team engagement levels.' }
    ];

    return (
        <Stack gap="xl">
            {/* Header section */}
            <Group justify="space-between" align="flex-start">
                <Group gap="lg">
                    <Avatar size={80} radius="md" color="blue" variant="filled">
                        {candidate.name?.charAt(0)}
                    </Avatar>
                    <Stack gap={4}>
                        <Title order={2} c="white" style={{ letterSpacing: '-1px' }}>{candidate.name}</Title>
                        <Group gap="xs">
                            <Badge variant="light" color="blue" size="sm" radius="sm">Rank #{candidate.rank_position}</Badge>
                            <Text size="sm" c="dimmed" fw={600}>{candidate.experience_years} Years Experience</Text>
                        </Group>
                    </Stack>
                </Group>
                <Paper p="md" radius="md" className="glass" style={{ textAlign: 'center', minWidth: '120px' }}>
                    <Text size="xs" fw={800} tt="uppercase" c="dimmed" mb={4}>AI Aggregate</Text>
                    <Text size="xl" fw={900} c="blue.4">{candidate.total_score?.toFixed(2)}</Text>
                </Paper>
            </Group>

            <Divider opacity={0.1} />

            {/* Content sections */}
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
                <Stack gap="lg">
                    <Group gap="xs">
                        <IconCertificate size={20} color="var(--mantine-color-blue-4)" />
                        <Title order={4} c="white">Professional Skills</Title>
                    </Group>
                    <Group gap="xs">
                        {candidate.skills?.split(', ').map((skill, idx) => (
                            <Badge key={idx} variant="outline" color="gray" size="md" tt="none">
                                {skill}
                            </Badge>
                        ))}
                    </Group>

                    <Box mt="md">
                        <Group gap="xs" mb="md">
                            <IconChartLine size={20} color="var(--mantine-color-blue-4)" />
                            <Title order={4} c="white">Competency Analysis</Title>
                        </Group>
                        <Text size="sm" c="dimmed" mb="xl">
                            The following metrics represent an AI-synthesized evaluation of {candidate.name}'s industrial management capabilities based on their historical data and skills profile.
                        </Text>
                    </Box>
                </Stack>

                <Stack gap="xl">
                    {scores.map((score) => (
                        <div key={score.label}>
                            <Group justify="space-between" mb={8}>
                                <Group gap="xs">
                                    <score.icon size={18} color="var(--mantine-color-dimmed)" />
                                    <Text fw={700} size="sm">{score.label}</Text>
                                </Group>
                                <Text fw={800} c={score.color}>{score.value?.toFixed(1)}/10</Text>
                            </Group>
                            <Progress
                                value={(score.value / 10) * 100}
                                color={score.color}
                                size="lg"
                                radius="xl"
                                striped
                                animated
                                style={{ background: 'rgba(255,255,255,0.03)' }}
                            />
                            <Text size="xs" c="dimmed" mt={8} italic>{score.description}</Text>
                        </div>
                    ))}
                </Stack>
            </SimpleGrid>

            <Divider opacity={0.1} />

            <Paper p="md" radius="md" className="glass" style={{ background: 'rgba(51, 154, 240, 0.05) !important' }}>
                <Group justify="space-between" align="center">
                    <Text size="sm" c="blue.2" fw={500} style={{ flex: 1 }}>
                        💡 <strong>Hiring Manager Tip:</strong> This candidate shows exceptional strength in <strong>{scores.sort((a, b) => b.value - a.value)[0].label}</strong>. Their background in {candidate.experience_years} years of operations makes them a prime choice for the Recycling Line Manager role.
                    </Text>
                    <Button
                        variant="gradient"
                        gradient={{ from: 'blue', to: 'cyan' }}
                        leftSection={<IconShare size={16} />}
                        onClick={handleShare}
                        radius="md"
                    >
                        Share with HR
                    </Button>
                </Group>
            </Paper>
        </Stack>
    );
}
