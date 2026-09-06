/**
 * SkillBridge AI - Skill Radar & Analytics Visualization
 * Integrates with Chart.js to render real-time skill gaps, employability gauges & TPO analytics.
 */

window.SkillCharts = {
  radarChartInstance: null,
  gaugeChartInstance: null,
  tpoChartInstance: null,

  renderSkillRadar: function(canvasId, labels, studentScores, benchmarkScores, targetRole = "Full Stack AI Developer") {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    if (this.radarChartInstance) {
      this.radarChartInstance.destroy();
    }

    this.radarChartInstance = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Your Current Proficiency',
            data: studentScores,
            backgroundColor: 'rgba(79, 70, 229, 0.25)',
            borderColor: '#4f46e5',
            pointBackgroundColor: '#4f46e5',
            pointBorderColor: '#ffffff',
            pointHoverBackgroundColor: '#ffffff',
            pointHoverBorderColor: '#4f46e5',
            borderWidth: 2.5,
            pointRadius: 4
          },
          {
            label: `Industry Benchmark (${targetRole})`,
            data: benchmarkScores,
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            borderColor: '#10b981',
            pointBackgroundColor: '#10b981',
            pointBorderColor: '#ffffff',
            pointHoverBackgroundColor: '#ffffff',
            pointHoverBorderColor: '#10b981',
            borderWidth: 2,
            borderDash: [4, 4],
            pointRadius: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: {
              color: 'rgba(226, 232, 240, 0.8)'
            },
            grid: {
              color: 'rgba(226, 232, 240, 0.8)'
            },
            pointLabels: {
              font: {
                size: 11,
                weight: '600',
                family: 'Inter, sans-serif'
              },
              color: '#334155'
            },
            suggestedMin: 0,
            suggestedMax: 100,
            ticks: {
              stepSize: 20,
              backdropColor: 'transparent',
              font: {
                size: 9
              },
              color: '#94a3b8'
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: {
                family: 'Inter, sans-serif',
                size: 12,
                weight: '500'
              },
              usePointStyle: true,
              boxWidth: 8
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return ` ${context.dataset.label}: ${context.raw}%`;
              }
            }
          }
        }
      }
    });
  },

  renderEmployabilityGauge: function(canvasId, score) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    if (this.gaugeChartInstance) {
      this.gaugeChartInstance.destroy();
    }

    const remaining = 100 - score;
    let scoreColor = '#10b981'; // green
    if (score < 60) scoreColor = '#ef4444'; // red
    else if (score < 75) scoreColor = '#f59e0b'; // amber

    this.gaugeChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Readiness', 'Gap to Target'],
        datasets: [{
          data: [score, remaining],
          backgroundColor: [scoreColor, '#e2e8f0'],
          borderWidth: 0,
          cutout: '78%'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        }
      }
    });
  },

  renderTpoReadinessChart: function(canvasId, departments) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    if (this.tpoChartInstance) {
      this.tpoChartInstance.destroy();
    }

    const labels = departments.map(d => d.department.replace(' & ', '\n& '));
    const readinessData = departments.map(d => d.readiness_index);
    const placementData = departments.map(d => d.placed_pct);

    this.tpoChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Industry Readiness Index (%)',
            data: readinessData,
            backgroundColor: '#4f46e5',
            borderRadius: 6
          },
          {
            label: 'Current Placement Rate (%)',
            data: placementData,
            backgroundColor: '#10b981',
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: val => val + '%'
            },
            grid: {
              color: 'rgba(226, 232, 240, 0.6)'
            }
          },
          x: {
            grid: { display: false }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              font: { family: 'Inter, sans-serif', size: 11 }
            }
          }
        }
      }
    });
  }
};
