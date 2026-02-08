import { useState } from 'react';
import { Paper, Title, Text, Group, Button, FileButton, ActionIcon, Stack, Box, Progress } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconUpload, IconFileSpreadsheet, IconCheck, IconX, IconAlertCircle } from '@tabler/icons-react';
import axios from 'axios';

export default function TalentUpload({ onUploadSuccess }) {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleUpload = async (file) => {
        if (!file) return;

        // Check file extension
        const ext = file.name.split('.').pop().toLowerCase();
        if (ext !== 'xlsx') {
            notifications.show({
                title: 'Invalid File',
                message: 'Please upload only .xlsx Excel files.',
                color: 'red',
                icon: <IconX size={16} />,
            });
            return;
        }

        setFile(file);
        setUploading(true);
        setProgress(20);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:5000/api/candidates/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percentCompleted);
                },
            });

            notifications.show({
                title: 'Import Successful',
                message: response.data.message || 'Candidates imported successfully.',
                color: 'green',
                icon: <IconCheck size={16} />,
            });

            if (onUploadSuccess) {
                onUploadSuccess();
            }
            setFile(null);
            setProgress(0);
        } catch (error) {
            console.error('Upload failed:', error);
            notifications.show({
                title: 'Import Failed',
                message: error.response?.data?.error || 'Failed to process Excel file. Please check the format.',
                color: 'red',
                icon: <IconAlertCircle size={16} />,
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <Paper p="xl" radius="lg" className="glass" style={{ border: '2px dashed rgba(51, 154, 240, 0.2)' }}>
            <Stack align="center" gap="md">
                <Box
                    p="lg"
                    style={{
                        background: 'rgba(51, 154, 240, 0.1)',
                        borderRadius: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <IconFileSpreadsheet size={40} color="var(--mantine-color-blue-5)" />
                </Box>

                <Stack gap={4} align="center">
                    <Title order={4} mb={0}>Bulk Import Talent</Title>
                    <Text size="sm" c="dimmed" ta="center">
                        Upload your candidate roster to trigger AI evaluation. <br />
                        <Text span fw={700} c="blue.4">Only .xlsx format accepted.</Text>
                    </Text>
                </Stack>

                {uploading ? (
                    <Stack w="100%" gap="xs">
                        <Text size="xs" ta="center" fw={700} tt="uppercase" lts={1}>Processing Pipeline...</Text>
                        <Progress value={progress} size="sm" radius="xl" animated color="blue" />
                    </Stack>
                ) : (
                    <Group justify="center" w="100%">
                        <FileButton onChange={handleUpload} accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
                            {(props) => (
                                <Button
                                    {...props}
                                    variant="gradient"
                                    gradient={{ from: 'blue.6', to: 'cyan.6' }}
                                    leftSection={<IconUpload size={18} />}
                                    radius="md"
                                    size="md"
                                    px={30}
                                    style={{ boxShadow: '0 8px 16px rgba(51, 154, 240, 0.2)' }}
                                >
                                    Select Excel File
                                </Button>
                            )}
                        </FileButton>
                    </Group>
                )}

                <Text size="xs" c="dimmed" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <IconAlertCircle size={12} />
                    Expected columns: Name, Experience, Skills
                </Text>
            </Stack>
        </Paper>
    );
}
