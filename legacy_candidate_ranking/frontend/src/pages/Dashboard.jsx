import { useState, useEffect, useRef } from 'react';
import { Container, Title, Text, Grid, Stack, Loader, Center, SimpleGrid, Button, Group, ActionIcon, Box, Modal, Paper, useMantineColorScheme, useComputedColorScheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconRefresh, IconSearch, IconBell, IconTrophy, IconSun, IconMoon } from '@tabler/icons-react';
import Leaderboard from '../components/Leaderboard';
import CandidateCard from '../components/CandidateCard';
import SkillHeatmap from '../components/SkillHeatmap';
import SystemMetrics from '../components/SystemMetrics';
import CandidateDetail from '../components/CandidateDetail';
import TalentUpload from '../components/TalentUpload';
import { getRankings, getSystemMetrics, recalculateRankings } from '../services/api';

export default function Dashboard() {
    const [rankings, setRankings] = useState([]);
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [opened, { open, close }] = useDisclosure(false);
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('dark', { getInitialValueInEffect: true });

    const metricsRef = useRef(null);
    const leaderboardRef = useRef(null);
    const analyticsRef = useRef(null);
    const repositoryRef = useRef(null);

    const fetchData = async () => {
        try {
            const [rankingsRes, metricsRes] = await Promise.all([
                getRankings(),
                getSystemMetrics()
            ]);
            setRankings(rankingsRes.data || []);
            setMetrics(metricsRes.data || null);
            setError(null);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('System synchronization failed. Connection to backend lost.');
        } finally {
            setLoading(false);
        }
    };

    const handleMetricClick = (title) => {
        if (title === 'Total Candidates') {
            repositoryRef.current?.scrollIntoView({ behavior: 'smooth' });
        } else if (title === 'Top Performer') {
            if (metrics?.topCandidate) {
                // We need the full candidate object for the detail modal
                // Find it in rankings
                const top = rankings.find(r => r.name === metrics.topCandidate.name);
                if (top) handleSelectCandidate(top);
            }
        } else if (title === 'Average Evaluation Score') {
            analyticsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await recalculateRankings();
            await fetchData();
        } catch (err) {
            console.error('Error refreshing:', err);
        } finally {
            setRefreshing(false);
        }
    };

    const handleSelectCandidate = (candidate) => {
        setSelectedCandidate(candidate);
        open();
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <Center h="100vh">
                <Stack align="center" gap="md">
                    <Loader size="lg" type="bars" color="blue" />
                    <Text fw={700} size="sm" tt="uppercase" lts={2} c="blue.4">Synchronizing Talent Cloud</Text>
                </Stack>
            </Center>
        );
    }

    if (error) {
        return (
            <Center h="100vh">
                <Stack align="center" className="glass" p="xl" radius="lg">
                    <Text c="red.4" fw={700} size="lg">{error}</Text>
                    <Button onClick={fetchData} variant="light" color="blue" radius="md">
                        Attempt Reconnection
                    </Button>
                </Stack>
            </Center>
        );
    }

    // Safety check for rankings
    const validatedRankings = Array.isArray(rankings) ? rankings : [];

    return (
        <Box
            component="main"
            pb={80}
            style={{
                minHeight: '100vh',
            }}
        >
            {/* Top Navigation / Header */}
            <Box px="xl" py="lg" mb={40} className="glass" style={{ borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0 }}>
                <Container size="xl">
                    <Group justify="space-between">
                        <Group gap="md">
                            <Box
                                w={40} h={40}
                                style={{
                                    background: 'linear-gradient(135deg, #339af0 0%, #6741d9 100%)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 12px rgba(51, 154, 240, 0.4)'
                                }}
                            >
                                <IconSearch color="white" size={24} />
                            </Box>
                            <div>
                                <Title order={4} fw={800} style={{ letterSpacing: '-0.5px' }}>CANDIDATE.AI</Title>
                                <Text size="10px" c="dimmed" fw={700} component="div" mt={-4}>VERIFIED TALENT PIPELINE</Text>
                            </div>
                        </Group>
                        <Group gap="lg">
                            <ActionIcon
                                variant="subtle"
                                color="gray"
                                size="lg"
                                radius="xl"
                                onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
                            >
                                {computedColorScheme === 'light' ? <IconMoon size={20} /> : <IconSun size={20} />}
                            </ActionIcon>
                            <ActionIcon variant="subtle" color="gray" size="lg" radius="xl">
                                <IconBell size={20} />
                            </ActionIcon>
                            <Button
                                leftSection={<IconRefresh size={16} />}
                                onClick={handleRefresh}
                                loading={refreshing}
                                variant="gradient"
                                gradient={{ from: 'blue.8', to: 'indigo.8' }}
                                radius="md"
                                size="sm"
                                fw={700}
                            >
                                Recalculate AI Rankings
                            </Button>
                        </Group>
                    </Group>
                </Container>
            </Box>

            <Container size="xl">
                <Stack gap={40}>
                    {/* Hero Section */}
                    <Box>
                        <Title order={1} size="36px" fw={900} mb={4} c={computedColorScheme === 'dark' ? 'white' : 'black'} style={{ letterSpacing: '-1px' }}>
                            Talent Acquisition <Text span c="blue.5" inherit>Insights</Text>
                        </Title>
                        <Text c="dimmed" size="sm" fw={500}>
                            System Version 2.4.0 — Recycling Production Line Manager Evaluation
                        </Text>
                    </Box>

                    {/* System Metrics */}
                    <div ref={metricsRef}>
                        <SystemMetrics metrics={metrics} onMetricClick={handleMetricClick} />
                    </div>

                    {/* Talent Acquisition Interface */}
                    <Box>
                        <Grid gutter={30}>
                            <Grid.Col span={{ base: 12, md: 7 }}>
                                <Paper p="xl" radius="lg" className="glass" h="100%">
                                    <Stack gap="md" h="100%" justify="center">
                                        <Title order={3}>
                                            <span className="title-underline">Pipeline Expansion</span>
                                        </Title>
                                        <Text size="sm" c="dimmed" lh={1.6}>
                                            Bulk import candidate data directly into the AI evaluation engine. Our system parses industrial competencies, years of experience, and specialized certifications from Excel rosters to generate real-time rankings.
                                        </Text>
                                        <Group gap="xs">
                                            <Button
                                                variant="light"
                                                color="blue"
                                                radius="md"
                                                size="xs"
                                                onClick={handleRefresh}
                                                loading={refreshing}
                                            >
                                                Sync & Recalculate AI Rankings
                                            </Button>
                                        </Group>
                                    </Stack>
                                </Paper>
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, md: 5 }}>
                                <TalentUpload onUploadSuccess={fetchData} />
                            </Grid.Col>
                        </Grid>
                    </Box>

                    {/* Main Content Grid */}
                    <Grid gutter={30} ref={leaderboardRef}>
                        {/* Leaderboard */}
                        <Grid.Col span={{ base: 12, lg: 8 }}>
                            <Leaderboard data={validatedRankings} onSelect={handleSelectCandidate} />
                        </Grid.Col>

                        {/* Top Performers Sidebar */}
                        <Grid.Col span={{ base: 12, lg: 4 }}>
                            <Stack gap="xl">
                                <Title order={4} style={{ display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.5px' }}>
                                    <IconTrophy size={20} color="var(--mantine-color-yellow-6)" />
                                    Elite Profiles
                                </Title>
                                {validatedRankings.length > 0 ? validatedRankings.slice(0, 2).map((candidate) => (
                                    <CandidateCard
                                        key={candidate.candidate_id || candidate.id}
                                        candidate={candidate}
                                        onSelect={handleSelectCandidate}
                                    />
                                )) : (
                                    <Text size="sm" c="dimmed">No elite profiles yet.</Text>
                                )}
                                <Button
                                    variant="subtle"
                                    fullWidth
                                    color="gray"
                                    size="xs"
                                    onClick={() => repositoryRef.current?.scrollIntoView({ behavior: 'smooth' })}
                                >
                                    View Full Elite Pipeline
                                </Button>
                            </Stack>
                        </Grid.Col>
                    </Grid>

                    {/* Skill Heatmap - Temporarily disabled for debugging */}
                    <div ref={analyticsRef}>
                        <SkillHeatmap data={validatedRankings} />
                    </div>


                    {/* Secondary Pipeline Grid */}
                    <Box ref={repositoryRef}>
                        <Group justify="space-between" mb="xl">
                            <Title order={3}>
                                <span className="title-underline">Candidate Repository</span>
                            </Title>
                            <Text size="sm" c="dimmed" fw={600}>SHOWING ALL PIPELINE PROFILES</Text>
                        </Group>
                        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="xl">
                            {validatedRankings.length > 0 ? validatedRankings.map((candidate) => (
                                <CandidateCard
                                    key={candidate.candidate_id || candidate.id}
                                    candidate={candidate}
                                    onSelect={handleSelectCandidate}
                                />
                            )) : (
                                <Text size="sm" c="dimmed">Waiting for additional data...</Text>
                            )}
                        </SimpleGrid>
                    </Box>
                </Stack>
            </Container>

            {/* Profile Detail Modal */}
            <Modal
                opened={opened}
                onClose={close}
                size="70%"
                radius="lg"
                padding="xl"
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 8,
                }}
                className="glass-modal"
                styles={{
                    content: { backgroundColor: 'rgba(26, 27, 30, 0.95)', border: '1px solid rgba(255,255,255,0.1)' },
                    header: { backgroundColor: 'transparent' }
                }}
            >
                <CandidateDetail candidate={selectedCandidate} />
            </Modal>
        </Box>
    );
}
