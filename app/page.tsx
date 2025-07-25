/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Input,
  Fade,
  LinearProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import Papa from "papaparse";
import axios from "axios";

export default function Home() {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<any[][]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reportUrl, setReportUrl] = useState<string | null>(null);
  const [showMain, setShowMain] = useState(false);
  const [progress, setProgress] = useState(0);

  const progressMessages = [
    "Working on your data...",
    "Crunching numbers and finding insights...",
    "Making sense of your dataset...",
    "Almost there, generating magic...",
    "Turning data into knowledge...",
    "Hang tight, your report is on its way!",
    "Finding hidden patterns...",
    "Polishing your report...",
    "Uncovering trends and outliers...",
    "Just a moment, making it beautiful...",
    "Almost done, adding the finishing touches...",
    "Your data is in good hands...",
    "Summarizing the results...",
    "Optimizing your insights...",
    "Finalizing the analysis...",
  ];
  const [messageIndex, setMessageIndex] = useState(0);

  // Handle CSV upload and preview
  const handleCsvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setCsvFile(file || null);
    setReportUrl(null);
    setError("");
    if (file) {
      Papa.parse(file, {
        complete: (results) => {
          const data = results.data as any[][];
          setCsvPreview([data[0], ...data.slice(1, 11)]);
        },
        skipEmptyLines: true,
      });
    } else {
      setCsvPreview([]);
    }
  };

  // Handle report generation
  const handleGenerate = async () => {
    if (!csvFile) {
      setError("Please upload a CSV dataset.");
      return;
    }
    setLoading(true);
    setError("");
    setReportUrl(null);
    try {
      const formData = new FormData();
      formData.append("dataset", csvFile);
      const response = await axios.post(
        "https://dice-backend-z4bv.onrender.com/generate-report",
        formData,
        { responseType: "blob" }
      );
      // Create a download URL for the HTML file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setReportUrl(url);
    } catch (err: any) {
      setError(
        err?.response?.data?.error || "Failed to generate report. Is the backend running?"
      );
    } finally {
      setLoading(false);
    }
  };

  // Progress bar animation effect
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    let msgTimer: NodeJS.Timeout;
    if (loading) {
      setProgress(0);
      setMessageIndex(0);
      timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress >= 98) {
            return 98;
          }
          const diff = 0.4 + Math.random() * 0.2; // 0.4-0.6% increment
          return Math.min(oldProgress + diff, 98);
        });
      }, 250); // keep interval, smaller increment
      msgTimer = setInterval(() => {
        setMessageIndex((idx) => (idx + 1) % progressMessages.length);
      }, 3500);
    } else if (!loading && progress !== 0) {
      setProgress(100);
      setTimeout(() => setProgress(0), 400);
      setTimeout(() => setMessageIndex(0), 400);
    }
    return () => {
      if (timer) clearInterval(timer);
      if (msgTimer) clearInterval(msgTimer);
    };
  }, [loading]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#000",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', 'Roboto', 'Arial', sans-serif",
      }}
    >
      {!showMain && (
        <Fade in={!showMain} timeout={800}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
              width: "100vw",
              position: "absolute",
              top: 0,
              left: 0,
              bgcolor: "#000",
              zIndex: 10,
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                letterSpacing: 2,
                mb: 2,
                textAlign: "center",
                fontSize: { xs: 36, sm: 56 },
              }}
            >
              Welcome to <span style={{ color: "#00e676" }}>Dice</span>
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 5,
                color: "#bbb",
                textAlign: "center",
                fontWeight: 400,
                fontSize: { xs: 18, sm: 28 },
              }}
            >
              Your effortless EDA report generator
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: "#00e676",
                color: "#000",
                fontWeight: 700,
                fontSize: 20,
                borderRadius: 3,
                px: 5,
                py: 1.5,
                boxShadow: 3,
                textTransform: "none",
                '&:hover': { bgcolor: "#00c853" },
              }}
              onClick={() => setShowMain(true)}
            >
              Get Started
            </Button>
          </Box>
        </Fade>
      )}
      <Fade in={showMain} timeout={800}>
        <Box sx={{ width: "100%", display: showMain ? "flex" : "none", justifyContent: "center", alignItems: "center", minHeight: "100vh", bgcolor: "rgba(0,0,0,0.85)" }}>
          <Paper
            elevation={8}
            sx={{
              p: { xs: 2, sm: 5 },
              mt: 6,
              mb: 6, // Extra margin at the bottom
              borderRadius: 6,
              minWidth: { xs: '90vw', sm: 500 },
              maxWidth: 700,
              background: 'rgba(30, 30, 30, 0.7)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
              backdropFilter: 'blur(12px)',
              border: '1.5px solid rgba(0,230,118,0.18)',
              color: '#fff',
              transition: 'all 0.4s cubic-bezier(.4,0,.2,1)',
            }}
          >
            <Box display="flex" flexDirection="column" gap={3} pb={2}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <CloudUploadIcon sx={{ color: "#00e676", fontSize: 32 }} />
                <Typography variant="h4" fontWeight={700} letterSpacing={1}>
                  Dice
                </Typography>
              </Box>
              <Typography align="center" color="#bbb" fontSize={18} mb={2}>
                Upload your CSV dataset and (optionally) a custom HTML template. Generate and download a comprehensive data analysis report.
              </Typography>
              <Button
                variant="contained"
                component="label"
                startIcon={<CloudUploadIcon />}
                sx={{
                  bgcolor: "#00e676",
                  color: "#000",
                  fontWeight: 700,
                  fontSize: 18,
                  borderRadius: 2,
                  boxShadow: 2,
                  '&:hover': { bgcolor: "#00c853" },
                  transition: 'all 0.2s',
                }}
              >
                Upload CSV Dataset
                <Input
                  type="file"
                  inputProps={{ accept: ".csv" }}
                  onChange={handleCsvChange}
                  sx={{ display: "none" }}
                />
              </Button>
              {csvFile && (
                <Typography variant="body2" color="#00e676" fontWeight={500}>
                  Selected: {csvFile.name}
                </Typography>
              )}
              {csvPreview.length > 0 && (
                <>
                  <Box>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <DownloadIcon sx={{ color: "#00e676" }} />
                      <Typography variant="h6" fontWeight={600} color="#fff">
                        Data Preview (first 10 rows)
                      </Typography>
                    </Box>
                    <TableContainer
                      component={Paper}
                      sx={{
                        maxHeight: 300,
                        background: 'rgba(30,30,30,0.95)',
                        mb: 3, // Add margin below table
                      }}
                    >
                      <Table size="small" stickyHeader>
                        <TableHead>
                          <TableRow>
                            {csvPreview[0]?.map((cell: any, idx: number) => (
                              <TableCell
                                key={idx}
                                sx={{
                                  color: "#00e676",
                                  fontWeight: 700,
                                  background: 'rgba(20,20,20,0.95)',
                                }}
                              >
                                {cell}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {csvPreview.slice(1).map((row: any[], i: number) => (
                            <TableRow key={i}>
                              {row.map((cell, j) => (
                                <TableCell
                                  key={j}
                                  sx={{
                                    color: "#fff",
                                    background: 'rgba(30,30,30,0.85)',
                                  }}
                                >
                                  {cell}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                  <Box mt={4} mb={3} display="flex" flexDirection="column" alignItems="center" sx={{ background: 'rgba(20,20,20,0.95)', borderRadius: 2, minHeight: 110, justifyContent: 'center' }}>
                    {loading && (
                      <>
                        <Box width="100%" mb={1} display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle1" color="#00e676" fontWeight={600}>
                            {progressMessages[messageIndex]}
                          </Typography>
                          <Typography variant="subtitle1" color="#fff" fontWeight={600} sx={{ minWidth: 48, textAlign: 'right' }}>
                            {Math.round(progress)}%
                          </Typography>
                        </Box>
                        <Box width="100%" mb={2}>
                          <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 5, bgcolor: '#222', '& .MuiLinearProgress-bar': { bgcolor: '#00e676' } }} />
                        </Box>
                      </>
                    )}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleGenerate}
                      disabled={loading || !csvFile}
                      startIcon={loading ? <CircularProgress size={20} sx={{ color: "#000" }} /> : <DownloadIcon />}
                      sx={{
                        bgcolor: "#00e676",
                        color: "#000",
                        fontWeight: 700,
                        fontSize: 20,
                        borderRadius: 2,
                        boxShadow: 2,
                        minWidth: 220,
                        minHeight: 56,
                        '&:hover': { bgcolor: "#00c853" },
                        transition: 'all 0.2s',
                        zIndex: 2,
                      }}
                    >
                      {loading ? "Generating..." : "Generate Report"}
                    </Button>
                  </Box>
                  {error && <Alert severity="error" sx={{ bgcolor: "#222", color: "#ff5252" }}>{error}</Alert>}
                  {reportUrl && (
                    <Button
                      variant="outlined"
                      color="success"
                      href={reportUrl}
                      download="data_insight_report.html"
                      startIcon={<DownloadIcon />}
                      sx={{
                        mt: 2,
                        borderColor: "#00e676",
                        color: "#00e676",
                        fontWeight: 700,
                        fontSize: 18,
                        borderRadius: 2,
                        boxShadow: 1,
                        '&:hover': { borderColor: "#00c853", color: "#00c853" },
                        transition: 'all 0.2s',
                      }}
                    >
                      Download Report
                    </Button>
                  )}
                </>
              )}
            </Box>
          </Paper>
        </Box>
      </Fade>
    </Box>
  );
}
