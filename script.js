export class AchievementManager {
  constructor() {
    this.achievements = [];
  }

  async loadAchievements() {
    // In a real app, this would load from an API/database
    this.achievements = [
      {
        id: '1',
        title: 'Early Bird',
        description: 'Complete 5 tasks before 9 AM',
        icon: '🌅',
        unlocked: false
      },
      {
        id: '2',
        title: 'Task Master',
        description: 'Complete 50 tasks',
        icon: '👑',
        unlocked: false
      },
      {
        id: '3',
        title: 'Perfect Week',
        description: 'Complete all tasks for 7 days straight',
        icon: '🌟',
        unlocked: false
      }
    ];
  }

  getAchievements() {
    return this.achievements;
  }

  checkAchievements(stats) {
    // Check for achievement unlocks based on stats
    // This would be more complex in a real application
  }
}









export class AIManager {
  constructor() {
    this.endpoint = '/api/ai_completion';
    this.messageTypes = ['long', 'short'];
    this.currentMessageType = 'long';
    this.usedMessages = new Set(); // Track used messages to avoid repetition
  }

  async getTaskSuggestions(taskData) {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Analyze this task and provide optimization suggestions:
          
          interface Suggestion {
            timeOfDay: string;
            restBreaks: string[];
            productivity: string;
          }
          
          {
            "timeOfDay": "Morning (8-10 AM) would be optimal for this task",
            "restBreaks": ["Take a 5-min break every 25 mins", "15-min break after 2 hours"],
            "productivity": "This task aligns well with your high-energy morning pattern"
          }
          `,
          data: taskData
        })
      });

      return await response.json();
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      return null;
    }
  }

  async getTaskPrediction(taskData) {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Analyze this task and predict success rate:
          
          interface Prediction {
            successRate: number;
            confidence: number;
            factors: string[];
            recommendations: string[];
          }
          
          {
            "successRate": 85,
            "confidence": 90,
            "factors": [
              "Similar tasks completed successfully",
              "Optimal time scheduling",
              "Matches user productivity pattern"
            ],
            "recommendations": [
              "Schedule during morning hours",
              "Break into smaller subtasks",
              "Set reminder 30 minutes before"
            ]
          }
          `,
          data: taskData
        })
      });

      return await response.json();
    } catch (error) {
      console.error('Error getting task prediction:', error);
      return null;
    }
  }

  async analyzePatternsAndSuggestRest(taskHistory) {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Analyze work patterns and suggest optimal rest periods:
          
          interface RestSuggestion {
            suggestedBreaks: string[];
            restDuration: string;
            reasoning: string;
          }
          
          {
            "suggestedBreaks": ["2:30 PM - 3:00 PM", "5:00 PM - 5:15 PM"],
            "restDuration": "30 minutes for main break, 15 minutes for short break",
            "reasoning": "Based on your pattern of decreased productivity in mid-afternoon"
          }
          `,
          data: taskHistory
        })
      });

      return await response.json();
    } catch (error) {
      console.error('Error analyzing patterns:', error);
      return null;
    }
  }

  async getMotivationalMessage() {
    try {
      // Alternate between long and short messages
      this.currentMessageType = this.currentMessageType === 'long' ? 'short' : 'long';
      
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Generate a unique ${this.currentMessageType === 'long' ? 'detailed, story-like' : 'concise but powerful'} motivational message that hasn't been used before. 
          Current message count: ${this.usedMessages.size}
          Previously used messages: ${Array.from(this.usedMessages).slice(-5)}
          
          Generate a completely unique message following these themes:
          - Personal growth and transformation
          - Overcoming challenges
          - Building resilience
          - Finding strength
          - Achievement and success
          - Positive mindset
          - Goal setting
          - Self-improvement
          - Leadership
          - Innovation
          - Creativity
          - Persistence
          - Determination
          - Courage
          - Wisdom
          - Balance
          - Focus
          - Excellence
          - Progress
          - Growth mindset
          
          interface MotivationalMessage {
            message: string;
            theme: 'success' | 'encouragement' | 'challenge';
            icon: string;
            uniqueId: string;
          }
          
          For long messages, include:
          - Rich metaphors and vivid imagery
          - Mini-stories or scenarios
          - Specific examples
          - Actionable insights
          - Multiple paragraphs
          - Emotional resonance
          
          For short messages, include:
          - Powerful, concise language
          - Memorable phrases
          - Impactful metaphors
          - Emotional punch
          - Clear call to action
          
          Response should be unique and not repeat previous messages.`,
          data: {
            usedMessageCount: this.usedMessages.size,
            messageType: this.currentMessageType
          }
        })
      });

      const result = await response.json();
      
      // Add message to used set to prevent repetition
      this.usedMessages.add(result.message);
      
      // If we've used too many messages, clear some old ones
      if (this.usedMessages.size > 10000) {
        const oldestMessages = Array.from(this.usedMessages).slice(0, 1000);
        oldestMessages.forEach(msg => this.usedMessages.delete(msg));
      }

      return {
        message: result.message + " " + result.icon,
        theme: result.theme
      };
    } catch (error) {
      console.error('Error getting motivational message:', error);
      
      // Enhanced fallback system with massive message variety
      const getRandomElement = arr => arr[Math.floor(Math.random() * arr.length)];
      
      // Message components for generating unique combinations
      const components = {
        starters: [
          "Like a", "Just as the", "Similar to a", "Picture yourself as a", 
          "Imagine being a", "You are the", "Think of yourself as a",
          "With the spirit of a", "Channeling the energy of a", "As powerful as a"
        ],
        subjects: [
          "mountain climber", "sculptor", "painter", "writer", "athlete", 
          "explorer", "inventor", "gardener", "architect", "phoenix",
          "rising sun", "flowing river", "mighty oak", "soaring eagle",
          "persistent wave", "determined warrior", "skilled craftsperson",
          "wise sage", "creative artist", "fearless pioneer"
        ],
        actions: [
          "reaching new heights", "creating masterpieces", "breaking barriers",
          "pushing boundaries", "discovering potential", "achieving dreams",
          "transforming challenges", "building futures", "inspiring others",
          "leading change", "making history", "defying limits", 
          "embracing growth", "navigating paths", "conquering fears",
          "forging ahead", "blazing trails", "shattering expectations",
          "orchestrating success", "manifesting destiny"
        ],
        metaphors: [
          "each step is a victory", "every moment shapes your legacy",
          "success builds like layers of paint", "progress flows like a river",
          "growth rings tell your story", "your light guides others",
          "wisdom blooms like flowers", "strength builds like a foundation",
          "courage rises like the sun", "determination burns like a flame"
        ],
        closings: [
          "Keep reaching higher!", "Your journey continues!", 
          "Embrace your potential!", "Let your light shine!",
          "The world awaits your greatness!", "Your story is still unfolding!",
          "Tomorrow brings new opportunities!", "Your legacy awaits!",
          "The best is yet to come!", "Your impact knows no bounds!"
        ],
        emojis: ["✨", "🌟", "💫", "⭐", "🌠", "💪", "🚀", "🌅", "🌲", "🦅", "🌊", "🔥", "💎", "🎨", "🎯", "⚡", "", "🗺️", "🧭", "🌱"]
      };

      // Generate a unique message based on the current type
      let message;
      if (this.currentMessageType === 'long') {
        message = `${getRandomElement(components.starters)} ${getRandomElement(components.subjects)} ${getRandomElement(components.actions)}, ${getRandomElement(components.metaphors)}. 
        
        Your journey of ${getRandomElement(components.actions).toLowerCase()} is unique and powerful. ${getRandomElement(components.metaphors)}. 
        
        ${getRandomElement(components.closings)} ${getRandomElement(components.emojis)}`;
      } else {
        message = `${getRandomElement(components.starters)} ${getRandomElement(components.subjects)}, ${getRandomElement(components.metaphors)}! ${getRandomElement(components.emojis)}`;
      }

      // Add to used messages set
      this.usedMessages.add(message);

      return {
        message,
        theme: getRandomElement(['success', 'encouragement', 'challenge'])
      };
    }
  }
}







export class ChartManager {
  constructor() {
    this.weeklyChart = null;
    this.progressChart = null;
    this.lastWeeklyData = null;
    this.historicalChart = null;
    this.historicalData = JSON.parse(localStorage.getItem('historicalData') || '[]');
  }

  initializeCharts() {
    this.initializeWeeklyChart();
    this.initializeProgressChart();
    this.initializeHistoricalChart();
  }

  initializeWeeklyChart() {
    const ctx = document.getElementById('weeklyChart').getContext('2d');
    
    this.weeklyChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [
          {
            label: 'Completed',
            backgroundColor: '#2ecc71',
            data: [0, 0, 0, 0, 0, 0, 0]
          },
          {
            label: 'Failed',
            backgroundColor: '#e74c3c',
            data: [0, 0, 0, 0, 0, 0, 0]
          },
          {
            label: 'Break',
            backgroundColor: '#95a5a6',
            data: [0, 0, 0, 0, 0, 0, 0]
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            stacked: true
          },
          x: {
            stacked: true
          }
        }
      }
    });
  }

  initializeProgressChart() {
    const ctx = document.getElementById('progressChart').getContext('2d');
    
    this.progressChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Completed Tasks',
            borderColor: '#2ecc71',
            data: [],
            tension: 0.4
          },
          {
            label: 'Failed Tasks',
            borderColor: '#e74c3c',
            data: [],
            tension: 0.4
          },
          {
            label: 'Break Time',
            borderColor: '#95a5a6',
            data: [],
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  initializeHistoricalChart() {
    const ctx = document.getElementById('historicalChart').getContext('2d');
    
    this.historicalChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.historicalData.map(week => week.label),
        datasets: [
          {
            label: 'Completed Tasks',
            borderColor: '#2ecc71',
            data: this.historicalData.map(week => week.completed),
            tension: 0.4
          },
          {
            label: 'Failed Tasks',
            borderColor: '#e74c3c',
            data: this.historicalData.map(week => week.failed),
            tension: 0.4
          },
          {
            label: 'Break Time',
            borderColor: '#95a5a6',
            data: this.historicalData.map(week => week.break),
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          },
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: '#e4e6eb'
            }
          }
        }
      }
    });
  }

  updateCharts(stats) {
    // Optimize chart updates by only updating changed data
    const weeklyData = {
      completed: stats.weekly.map(day => day.completed),
      failed: stats.weekly.map(day => day.failed),
      break: stats.weekly.map(day => day.break)
    };

    // Update weekly chart efficiently
    const weeklyChanged = !this.lastWeeklyData || 
      JSON.stringify(weeklyData) !== JSON.stringify(this.lastWeeklyData);
    
    if (weeklyChanged) {
      this.weeklyChart.data.datasets[0].data = weeklyData.completed;
      this.weeklyChart.data.datasets[1].data = weeklyData.failed;
      this.weeklyChart.data.datasets[2].data = weeklyData.break;
      this.weeklyChart.update('none'); // Disable animations for faster updates
      this.lastWeeklyData = weeklyData;
    }

    // Calculate cumulative values efficiently
    const cumulative = stats.weekly.reduce((acc, day) => {
      const last = acc[acc.length - 1] || { completed: 0, failed: 0, break: 0 };
      acc.push({
        completed: last.completed + day.completed,
        failed: last.failed + day.failed,
        break: last.break + day.break
      });
      return acc;
    }, []);

    // Update progress chart efficiently
    const labels = stats.weekly.map((_, i) => `Day ${i + 1}`);
    this.progressChart.data.labels = labels;
    this.progressChart.data.datasets[0].data = cumulative.map(d => d.completed);
    this.progressChart.data.datasets[1].data = cumulative.map(d => d.failed);
    this.progressChart.data.datasets[2].data = cumulative.map(d => d.break);
    this.progressChart.update('none'); // Disable animations for faster updates
  }

  addWeekToHistory(stats) {
    const weekNumber = this.historicalData.length + 1;
    const newWeekData = {
      label: `Week ${weekNumber}`,
      completed: stats.total.completed,
      failed: stats.total.failed,
      break: stats.total.break
    };

    this.historicalData.push(newWeekData);
    localStorage.setItem('historicalData', JSON.stringify(this.historicalData));

    if (this.historicalChart) {
      this.historicalChart.data.labels.push(newWeekData.label);
      this.historicalChart.data.datasets[0].data.push(newWeekData.completed);
      this.historicalChart.data.datasets[1].data.push(newWeekData.failed);
      this.historicalChart.data.datasets[2].data.push(newWeekData.break);
      this.historicalChart.update();
    }
  }
}










export class TaskManager {
  constructor() {
    this.tasks = [];
    this.level = 0;
    this.points = 0;
    this.saveTimeout = null;
    this.statsCache = null;
    this.statsCacheTime = null;
    this.reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
    this._reminderTimers = [];
    this.initializeReminders();
  }

  async loadTasks() {
    const savedData = JSON.parse(localStorage.getItem('taskData') || '{}');
    this.tasks = savedData.tasks || [];
    this.level = savedData.level || 0;
    this.points = savedData.points || 0;
  }

  getTasks() {
    return this.tasks;
  }

  getLevel() {
    return {
      level: this.level,
      points: this.points
    };
  }

  async addTask(taskData) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Set to last Saturday

    const weeklyStatus = Array(7).fill().map((_, i) => ({
      date: new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000).toISOString(),
      status: null, // Initially no status selected
      enabled: true // All days enabled by default
    }));

    const task = {
      id: Date.now().toString(),
      ...taskData,
      weeklyStatus,
      createdAt: new Date().toISOString()
    };

    this.tasks.push(task);
    await this.saveTasks();
    return task;
  }

  async updateDayStatus(taskId, dayIndex, status) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    // Store previous status for point calculation
    const previousStatus = task.weeklyStatus[dayIndex].status;
    
    // If same status is selected, clear it
    if (task.weeklyStatus[dayIndex].status === status) {
      task.weeklyStatus[dayIndex].status = null;
    } else {
      task.weeklyStatus[dayIndex].status = status;
    }
    
    // Immediately deduct points for previous status if it exists
    if (previousStatus) {
      switch(previousStatus) {
        case 'complete': 
          this.addPoints(-10); 
          this.adjustLevel(-1); // Reduce level for unchecking completion
          break;
        case 'failed': 
          this.addPoints(5); // Add back the points that were deducted
          this.adjustLevel(1); // Add level back for unchecking failure
          break;
        case 'break': 
          this.addPoints(-2);
          break;
      }
    }

    // Immediately add points for new status
    if (status) {
      switch(status) {
        case 'complete': 
          this.addPoints(10);
          this.adjustLevel(1); // Add level for completion
          this.showPointAnimation(dayIndex, '+10', true);
          break;
        case 'failed': 
          this.addPoints(-5);
          this.adjustLevel(-1); // Reduce level for failure
          this.showPointAnimation(dayIndex, '-5', true);
          break;
        case 'break': 
          this.addPoints(2);
          this.showPointAnimation(dayIndex, '+2');
          break;
      }
    }

    // Update UI immediately
    document.querySelector('.level').textContent = `Level ${this.level}`;
    document.querySelector('.points').textContent = `${this.points} pts`;

    this.requestSave();
  }

  adjustLevel(change) {
    this.level = Math.max(0, this.level + change);
  }

  showPointAnimation(dayIndex, points, showLevel = false) {
    const cells = document.querySelectorAll('.day-cell');
    const cell = cells[dayIndex];
    if (!cell) return;

    // Points animation
    const animation = document.createElement('div');
    animation.className = 'points-animation';
    animation.textContent = points;
    animation.style.color = points.includes('+') ? '#2ecc71' : '#e74c3c';
    
    cell.appendChild(animation);

    // Trigger animation
    requestAnimationFrame(() => {
      animation.style.transform = 'translateY(-20px)';
      animation.style.opacity = '0';
    });

    // Remove after animation
    setTimeout(() => animation.remove(), 500);

    // Level animation if needed
    if (showLevel) {
      const levelAnimation = document.createElement('div');
      levelAnimation.className = 'points-animation level-change';
      levelAnimation.textContent = points.includes('+') ? '+1 Level' : '-1 Level';
      levelAnimation.style.color = points.includes('+') ? '#2ecc71' : '#e74c3c';
      levelAnimation.style.top = '70%';
      
      cell.appendChild(levelAnimation);

      requestAnimationFrame(() => {
        levelAnimation.style.transform = 'translateY(-20px)';
        levelAnimation.style.opacity = '0';
      });

      setTimeout(() => levelAnimation.remove(), 500);
    }
  }

  addPoints(points) {
    this.points += points;
    if (this.points < 0) this.points = 0;
  }

  requestSave() {
    if (this.saveTimeout) clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => this.saveTasks(), 300);
  }

  async saveTasks() {
    localStorage.setItem('taskData', JSON.stringify({
      tasks: this.tasks,
      level: this.level,
      points: this.points
    }));
  }

  async completeTask(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = true;
      task.completedAt = new Date().toISOString();
      await this.saveTasks();
    }
  }

  async deleteTask(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      // Calculate points to deduct based on completed tasks in the task's weekly status
      const pointsToDeduct = task.weeklyStatus.reduce((total, status) => {
        switch(status.status) {
          case 'complete': return total - 10;
          case 'failed': return total + 5; // Add back the negative points
          case 'break': return total - 2;
          default: return total;
        }
      }, 0);

      // Update points
      this.points = Math.max(0, this.points + pointsToDeduct);
      
      // Recalculate level
      this.level = Math.floor(this.points / 100);
    }

    // Remove task
    this.tasks = this.tasks.filter(t => t.id !== taskId);
    await this.saveTasks();
    
    // Clear stats cache to force recalculation
    this.statsCache = null;
    this.statsCacheTime = null;
  }

  async updateTask(taskId, updates) {
    const taskIndex = this.tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      this.tasks[taskIndex] = {
        ...this.tasks[taskIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      await this.saveTasks();
      return this.tasks[taskIndex];
    }
    return null;
  }

  async markTaskFailed(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.failed = true;
      task.completed = false;
      task.failedAt = new Date().toISOString();
      await this.saveTasks();
    }
  }

  async markTaskBreak(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.onBreak = !task.onBreak;
      task.breakStartedAt = task.onBreak ? new Date().toISOString() : null;
      await this.saveTasks();
    }
  }

  async startNewWeek() {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Set to current Saturday
    
    this.tasks = this.tasks.map(task => {
      // Reset weekly status with new dates
      const weeklyStatus = Array(7).fill().map((_, i) => ({
        date: new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000).toISOString(),
        status: null,
        enabled: true
      }));
      
      return {
        ...task,
        weeklyStatus
      };
    });

    // Clear stats cache
    this.statsCache = null;
    this.statsCacheTime = null;
    
    // Save changes
    await this.saveTasks();
    return this.tasks;
  }

  getTaskStats() {
    // Cache results for better performance
    if (this.statsCache && Date.now() - this.statsCacheTime < 1000) {
      return this.statsCache;
    }

    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    
    // Pre-calculate date objects for comparison
    const dates = Array(7).fill().map((_, i) => {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      return date;
    });

    // Use reduce instead of multiple array operations
    const weeklyStats = this.tasks.reduce((stats, task) => {
      task.weeklyStatus.forEach((status, i) => {
        if (!stats[i]) {
          stats[i] = { date: dates[i], completed: 0, failed: 0, break: 0 };
        }
        if (status.status === 'complete') stats[i].completed++;
        else if (status.status === 'failed') stats[i].failed++;
        else if (status.status === 'break') stats[i].break++;
      });
      return stats;
    }, []);

    // Cache results
    this.statsCache = {
      weekly: weeklyStats,
      total: weeklyStats.reduce((total, day) => ({
        completed: total.completed + day.completed,
        failed: total.failed + day.failed,
        break: total.break + day.break
      }), { completed: 0, failed: 0, break: 0 })
    };
    
    this.statsCacheTime = Date.now();
    return this.statsCache;
  }

  async getPredictionStats() {
    const stats = this.getTaskStats();
    const totalTasks = this.tasks.length;
    
    if (totalTasks === 0) return null;

    const completedTasks = stats.total.completed;
    const failedTasks = stats.total.failed;
    const successRate = (completedTasks / (completedTasks + failedTasks)) * 100 || 0;
    
    const levelFactor = Math.min((this.level * 5), 25); // Level influence up to 25%
    const consistencyBonus = this.calculateConsistencyBonus();
    
    return {
      overallSuccessRate: Math.round(successRate),
      levelBonus: levelFactor,
      consistencyBonus,
      adjustedSuccessRate: Math.round(Math.min(successRate + levelFactor + consistencyBonus, 100))
    };
  }

  calculateConsistencyBonus() {
    const recentTasks = this.tasks
      .flatMap(task => task.weeklyStatus)
      .filter(status => status.status)
      .slice(-10);

    if (recentTasks.length === 0) return 0;

    const successfulTasks = recentTasks.filter(status => status.status === 'complete').length;
    const consistencyRate = (successfulTasks / recentTasks.length) * 100;
    
    return Math.round(Math.min(consistencyRate * 0.15, 15)); // Up to 15% bonus
  }

  initializeReminders() {
    // Clear any existing reminder timers
    if (this._reminderTimers) {
      this._reminderTimers.forEach(timer => clearTimeout(timer));
    }
    this._reminderTimers = [];
    
    // Set up reminders
    this.reminders.forEach(reminder => {
      if (new Date(reminder.time) > new Date()) {
        this.scheduleReminder(reminder);
      }
    });
  }

  scheduleReminder(reminder) {
    const now = new Date().getTime();
    const reminderTime = new Date(reminder.time).getTime();
    const delay = reminderTime - now;
    
    if (delay > 0) {
      const timer = setTimeout(() => {
        this.showReminderNotification(reminder);
      }, delay);
      
      this._reminderTimers.push({ id: reminder.id, timer });
    }
  }

  showReminderNotification(reminder) {
    const popup = document.createElement('div');
    popup.className = 'reminder-popup';
    popup.innerHTML = `
      <button class="close-btn" onclick="app.hideReminderMessage(this)">×</button>
      <h4>Task Reminder</h4>
      <p>${reminder.message}</p>
      <p class="reminder-task">Task: ${reminder.taskTitle}</p>
    `;
    
    document.body.appendChild(popup);
    
    // Auto-hide after 30 seconds
    setTimeout(() => {
      if (document.body.contains(popup)) {
        app.hideReminderMessage(popup.querySelector('.close-btn'));
      }
    }, 30000);
  }

  async addReminder(taskId, reminderTime, message) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;

    const reminder = {
      id: Date.now().toString(),
      taskId,
      taskTitle: task.title,
      time: reminderTime,
      message
    };

    this.reminders.push(reminder);
    await this.saveReminders();
    this.scheduleReminder(reminder);
    return reminder;
  }

  async deleteReminder(reminderId) {
    // Find and remove the reminder timer
    const reminderIndex = this._reminderTimers.findIndex(timer => timer.id === reminderId);
    if (reminderIndex !== -1) {
      clearTimeout(this._reminderTimers[reminderIndex].timer);
      this._reminderTimers.splice(reminderIndex, 1);
    }

    // Remove the reminder from storage
    this.reminders = this.reminders.filter(r => r.id !== reminderId);
    await this.saveReminders();
  }

  async saveReminders() {
    localStorage.setItem('reminders', JSON.stringify(this.reminders));
  }

  getReminders(taskId = null) {
    return taskId 
      ? this.reminders.filter(r => r.taskId === taskId)
      : this.reminders;
  }

  cleanup() {
    if (this._reminderTimers) {
      this._reminderTimers.forEach(timer => clearTimeout(timer.timer));
    }
  }
}













export class App {
  constructor() {
    this.taskManager = new TaskManager();
    this.chartManager = new ChartManager();
    this.achievementManager = new AchievementManager();
    this.aiManager = new AIManager();
    
    this.initializeApp();
    this.editingTaskId = null;
    this.motivationalTimer = null;
    this.startMotivationalMessages();
    this.initializeReminders();
    this.setupHistoricalChart();
  }

  initializeApp() {
    this.setupEventListeners();
    this.loadInitialData();
    this.updateUI();
    this.initializeGoalTracker();
  }

  setupEventListeners() {
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskForm = document.getElementById('taskForm');
    const newWeekBtn = document.getElementById('newWeekBtn');
    const reminderForm = document.getElementById('reminderForm');
    
    addTaskBtn.addEventListener('click', () => this.showModal());
    taskForm.addEventListener('submit', (e) => this.handleTaskSubmit(e));
    newWeekBtn.addEventListener('click', () => this.handleNewWeek());
    reminderForm.addEventListener('submit', (e) => this.handleReminderSubmit(e, reminderForm.dataset.taskId));
  }

  async loadInitialData() {
    await Promise.all([
      this.taskManager.loadTasks(),
      this.achievementManager.loadAchievements()
    ]);
    
    this.chartManager.initializeCharts();
    this.updateUI();
  }

  showModal(type = 'task') {
    const modal = document.getElementById(type === 'reminder' ? 'reminderModal' : 'taskModal');
    modal.style.display = 'block';
  }

  showEditModal(taskId) {
    const task = this.taskManager.getTasks().find(t => t.id === taskId);
    if (!task) return;

    this.editingTaskId = taskId;
    const modal = document.getElementById('taskModal');
    const form = document.getElementById('taskForm');
    const modalTitle = modal.querySelector('h3');
    const submitBtn = modal.querySelector('button[type="submit"]');

    modalTitle.textContent = 'Edit Task';
    submitBtn.textContent = 'Update Task';

    // Fill form with task data
    form.elements.title.value = task.title;
    form.elements.type.value = task.type;
    form.elements.priority.value = task.priority;
    form.elements.dueDate.value = task.dueDate.slice(0, 16); // Format datetime-local

    modal.style.display = 'block';
  }

  closeModal(type = 'task') {
    const modalId = type === 'prediction' ? 'predictionModal' : 
                   type === 'reminder' ? 'reminderModal' : 
                   'taskModal';
    const modal = document.getElementById(modalId);
    const form = type === 'reminder' ? document.getElementById('reminderForm') : 
                type === 'task' ? document.getElementById('taskForm') : 
                null;
    
    if (form) {
      const modalTitle = modal.querySelector('h3');
      const submitBtn = modal.querySelector('button[type="submit"]');

      if (type === 'task') {
        modalTitle.textContent = 'Add New Task';
        submitBtn.textContent = 'Add Task';
        this.editingTaskId = null;
      }
      form.reset();
    }
    
    modal.style.display = 'none';
  }

  async handleTaskSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const taskData = {
      title: formData.get('title'),
      type: formData.get('type'),
      priority: formData.get('priority'),
      dueDate: formData.get('dueDate'),
    };

    if (this.editingTaskId) {
      await this.taskManager.updateTask(this.editingTaskId, taskData);
    } else {
      await this.taskManager.addTask(taskData);
      // Get AI suggestions only for new tasks
      const suggestions = await this.aiManager.getTaskSuggestions(taskData);
    }
    
    this.updateUI();
    this.closeModal();
    e.target.reset();
  }

  async handleNewWeek() {
    if (confirm('Are you sure you want to start a new week? This will reset all task statuses.')) {
      // Get current week's stats before resetting
      const currentStats = this.taskManager.getTaskStats();
      
      // Add current week to historical data
      this.chartManager.addWeekToHistory(currentStats);
      
      // Start new week
      await this.taskManager.startNewWeek();
      this.updateUI();
      
      // Show confirmation message
      const message = {
        message: "New week started! Ready for new achievements! ",
        theme: "success"
      };
      
      const popup = document.createElement('div');
      popup.className = `motivational-popup ${message.theme}`;
      popup.innerHTML = `
        <button class="close-btn" onclick="app.hideMotivationalMessage(this)">×</button>
        <p>${message.message}</p>
      `;
      
      document.body.appendChild(popup);
      
      setTimeout(() => {
        if (document.body.contains(popup)) {
          this.hideMotivationalMessage(popup.querySelector('.close-btn'));
        }
      }, 5000);
    }
  }

  updateUI() {
    requestAnimationFrame(() => {
      this.renderTasks();
      this.renderAchievements();
      this.chartManager.updateCharts(this.taskManager.getTaskStats());
    });
  }

  renderTasks() {
    const taskList = document.getElementById('taskList');
    const tasks = this.taskManager.getTasks();
    const days = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    
    requestAnimationFrame(() => {
      taskList.innerHTML = tasks.map(task => `
        <div class="task-item" data-id="${task.id}">
          <div class="task-info">
            <h4>${task.title}</h4>
            <p>${task.type} - ${task.priority}</p>
            <p class="due-date">Due: ${new Date(task.dueDate).toLocaleString()}</p>
            
            <div class="weekly-task-grid">
              ${days.map((day, index) => {
                const status = task.weeklyStatus[index].status;
                
                return `
                  <div class="day-cell">
                    <div>${day}</div>
                    <div class="button-group">
                      <button 
                        onclick="app.handleDayStatus(event, '${task.id}', ${index}, 'complete')"
                        class="status-btn ${status === 'complete' ? 'active success' : ''}"
                        title="Complete">✓</button>
                      <button 
                        onclick="app.handleDayStatus(event, '${task.id}', ${index}, 'failed')"
                        class="status-btn ${status === 'failed' ? 'active fail' : ''}"
                        title="Failed">✗</button>
                      <button 
                        onclick="app.handleDayStatus(event, '${task.id}', ${index}, 'break')"
                        class="status-btn ${status === 'break' ? 'active break' : ''}"
                        title="Break">⏸</button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <div class="reminder-list">
              ${this.taskManager.getReminders(task.id).map(reminder => `
                <div class="reminder-item">
                  <div class="reminder-info">
                    <div>${reminder.message}</div>
                    <div class="reminder-time">${new Date(reminder.time).toLocaleString()}</div>
                  </div>
                  <button onclick="app.handleTaskAction('${reminder.id}', 'deleteReminder')" 
                          class="action-btn delete" title="Delete Reminder">
                    <span>🗑</span>
                  </button>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="task-actions">
            <button onclick="app.showReminderModal('${task.id}')" class="action-btn" title="Add Reminder">
              <span>🔔</span>
            </button>
            <button onclick="app.handleTaskAction('${task.id}', 'edit')" class="action-btn edit" title="Edit Task">
              <span>✎</span>
            </button>
            <button onclick="app.handleTaskAction('${task.id}', 'delete')" class="action-btn delete" title="Delete Task">
              <span>🗑</span>
            </button>
          </div>
        </div>
      `).join('');
    });
  }

  async handleDayStatus(event, taskId, dayIndex, status) {
    event.preventDefault();
    event.stopPropagation();

    const buttonGroup = event.target.closest('.button-group');
    const buttons = buttonGroup.querySelectorAll('.status-btn');
    
    // Remove active class from all buttons in the group
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Toggle status
    const task = this.taskManager.getTasks().find(t => t.id === taskId);
    const currentStatus = task.weeklyStatus[dayIndex].status;
    
    if (currentStatus === status) {
      // If clicking the same status, remove it
      event.target.classList.remove('active');
      await this.taskManager.updateDayStatus(taskId, dayIndex, null);
    } else {
      // Add active class to clicked button
      event.target.classList.add('active');
      await this.taskManager.updateDayStatus(taskId, dayIndex, status);
    }
    
    this.updateUI();
  }

  async handleBulkDayStatus(taskId, status) {
    const task = this.taskManager.getTasks().find(t => t.id === taskId);
    if (!task) return;

    // Update all days with the same status
    const updatePromises = task.weeklyStatus.map((_, dayIndex) => 
      this.taskManager.updateDayStatus(taskId, dayIndex, status)
    );

    await Promise.all(updatePromises);
    this.updateUI();
  }

  renderAchievements() {
    const achievementsContainer = document.getElementById('achievements');
    const achievements = this.achievementManager.getAchievements();
    
    achievementsContainer.innerHTML = achievements.map(achievement => `
      <div class="achievement-item ${achievement.unlocked ? 'unlocked' : ''}">
        <div class="achievement-icon">${achievement.icon}</div>
        <h4>${achievement.title}</h4>
        <p>${achievement.description}</p>
      </div>
    `).join('');
  }

  async handleTaskAction(id, action) {
    switch (action) {
      case 'edit':
        this.showEditModal(id);
        break;
      case 'delete':
        if (confirm('Are you sure you want to delete this task?')) {
          await this.taskManager.deleteTask(id);
          this.updateUI();
        }
        break;
      case 'deleteReminder':
        if (confirm('Are you sure you want to delete this reminder?')) {
          await this.taskManager.deleteReminder(id);
          this.updateUI();
        }
        break;
    }
  }

  initializeReminders() {
    // Request notification permission
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }

  async handleReminderSubmit(e, taskId) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const reminder = await this.taskManager.addReminder(
      taskId,
      formData.get('reminderTime'),
      formData.get('message')
    );

    this.closeModal('reminder');
    e.target.reset();
    
    // Show confirmation message
    const popup = document.createElement('div');
    popup.className = 'motivational-popup success';
    popup.innerHTML = `
      <button class="close-btn" onclick="app.hideMotivationalMessage(this)">×</button>
      <p>Reminder set successfully!</p>
    `;
    
    document.body.appendChild(popup);
    setTimeout(() => {
      if (document.body.contains(popup)) {
        this.hideMotivationalMessage(popup.querySelector('.close-btn'));
      }
    }, 3000);
  }

  showReminderModal(taskId) {
    const modal = document.getElementById('reminderModal');
    const form = document.getElementById('reminderForm');
    form.dataset.taskId = taskId;
    
    // Ensure the close button is properly set up
    const closeBtn = modal.querySelector('.close-btn');
    if (!closeBtn) {
      const newCloseBtn = document.createElement('button');
      newCloseBtn.className = 'close-btn';
      newCloseBtn.innerHTML = '×';
      newCloseBtn.onclick = () => this.closeModal('reminder');
      modal.querySelector('.modal-content').insertBefore(
        newCloseBtn,
        modal.querySelector('.modal-content').firstChild
      );
    }
    
    modal.style.display = 'block';
  }

  startMotivationalMessages() {
    // Show first message immediately
    this.showMotivationalMessage();
    
    // Set up periodic messages every minute
    this.motivationalTimer = setInterval(async () => {
      // Remove any existing popup before showing new one
      const existingPopup = document.querySelector('.motivational-popup');
      if (existingPopup) {
        this.hideMotivationalMessage(existingPopup.querySelector('.close-btn'));
        // Wait for hide animation to complete
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      this.showMotivationalMessage();
    }, 60000); // Every minute
  }

  async showMotivationalMessage() {
    const message = await this.aiManager.getMotivationalMessage();
    
    // Create new popup with enhanced animation and styling
    const popup = document.createElement('div');
    popup.className = `motivational-popup ${message.theme}`;
    popup.innerHTML = `
      <button class="close-btn" onclick="app.hideMotivationalMessage(this)">×</button>
      <p class="message-text">${message.message}</p>
    `;
    
    // Add to document
    document.body.appendChild(popup);
    
    // Auto-hide after 10 seconds if not closed manually
    setTimeout(() => {
      if (document.body.contains(popup)) {
        this.hideMotivationalMessage(popup.querySelector('.close-btn'));
      }
    }, 10000);
  }

  hideMotivationalMessage(closeBtn) {
    const popup = closeBtn.closest('.motivational-popup');
    popup.classList.add('hiding');
    setTimeout(() => {
      if (document.body.contains(popup)) {
        popup.remove();
      }
    }, 300);
  }

  hideReminderMessage(closeBtn) {
    const popup = closeBtn.closest('.reminder-popup');
    popup.classList.add('hiding');
    setTimeout(() => {
      if (document.body.contains(popup)) {
        popup.remove();
      }
    }, 300);
  }

  async showPredictionModal(taskId = null) {
    const modal = document.getElementById('predictionModal');
    modal.style.display = 'block';
    
    // Show loading state immediately
    const content = modal.querySelector('.prediction-content');
    content.innerHTML = `
      <div class="loading-spinner">
        <svg viewBox="0 0 50 50" class="spinner">
          <circle cx="25" cy="25" r="20" fill="none" stroke="#4a90e2" stroke-width="5"></circle>
        </svg>
      </div>
    `;

    // Setup touch handling
    this.setupPredictionSwipe(modal);

    // Fetch data asynchronously
    requestAnimationFrame(async () => {
      const stats = await this.taskManager.getPredictionStats();
      
      if (!stats) {
        content.innerHTML = '<p>Not enough data for predictions yet. Complete some tasks first!</p>';
        return;
      }

      let prediction = null;
      if (taskId) {
        const task = this.taskManager.getTasks().find(t => t.id === taskId);
        if (task) {
          prediction = await this.aiManager.getTaskPrediction(task);
        }
      }

      // Enhanced percentage display with clear visuals
      content.innerHTML = `
        <div class="prediction-container">
          <div class="prediction-stats animate-in">
            <div class="prediction-meter">
              <svg viewBox="0 0 100 50" class="gauge">
                <path d="M10,45 A 35 35 0 1 1 90,45" fill="none" stroke="#ddd" stroke-width="10"/>
                <path class="gauge-progress" d="M10,45 A 35 35 0 1 1 90,45" fill="none" stroke="#4a90e2" 
                      stroke-width="10" stroke-dasharray="0, 100"/>
                <text x="50" y="45" text-anchor="middle" class="percentage">0%</text>
              </svg>
            </div>
            
            <div class="prediction-details">
              <h4>Success Rate Analysis</h4>
              <div class="stat-item animate-fade percentage-bar">
                <span>Base Success Rate:</span>
                <div class="bar-container">
                  <div class="bar" style="width: ${stats.overallSuccessRate}%"></div>
                  <span class="bar-label">${stats.overallSuccessRate}%</span>
                </div>
              </div>
              <div class="stat-item animate-fade percentage-bar" style="animation-delay: 0.1s">
                <span>Level Bonus:</span>
                <div class="bar-container">
                  <div class="bar bonus" style="width: ${stats.levelBonus}%"></div>
                  <span class="bar-label">+${stats.levelBonus}%</span>
                </div>
              </div>
              <div class="stat-item animate-fade percentage-bar" style="animation-delay: 0.2s">
                <span>Consistency Bonus:</span>
                <div class="bar-container">
                  <div class="bar bonus" style="width: ${stats.consistencyBonus}%"></div>
                  <span class="bar-label">+${stats.consistencyBonus}%</span>
                </div>
              </div>
              <div class="stat-item total animate-fade percentage-bar" style="animation-delay: 0.3s">
                <span>Adjusted Success Rate:</span>
                <div class="bar-container">
                  <div class="bar total" style="width: ${stats.adjustedSuccessRate}%"></div>
                  <span class="bar-label">${stats.adjustedSuccessRate}%</span>
                </div>
              </div>
            </div>
          </div>
          
          ${prediction ? `
            <div class="task-prediction animate-in" style="animation-delay: 0.4s">
              <h4>Specific Task Analysis</h4>
              <div class="prediction-breakdown">
                <div class="stat-item percentage-bar">
                  <span>Predicted Success Rate:</span>
                  <div class="bar-container">
                    <div class="bar" style="width: ${prediction.successRate}%"></div>
                    <span class="bar-label">${prediction.successRate}%</span>
                  </div>
                </div>
                <div class="stat-item percentage-bar">
                  <span>Confidence Level:</span>
                  <div class="bar-container">
                    <div class="bar confidence" style="width: ${prediction.confidence}%"></div>
                    <span class="bar-label">${prediction.confidence}%</span>
                  </div>
                </div>
              </div>
              
              <div class="factors">
                <h5>Key Factors:</h5>
                <ul>
                  ${prediction.factors.map((factor, i) => 
                    `<li style="animation-delay: ${0.5 + i * 0.1}s" class="animate-fade">${factor}</li>`
                  ).join('')}
                </ul>
              </div>
              
              <div class="recommendations">
                <h5>Recommendations:</h5>
                <ul>
                  ${prediction.recommendations.map((rec, i) => 
                    `<li style="animation-delay: ${0.7 + i * 0.1}s" class="animate-fade">${rec}</li>`
                  ).join('')}
                </ul>
              </div>
            </div>
          ` : ''}
        </div>

        <div class="swipe-indicator">
          <div class="swipe-dot active"></div>
          ${prediction ? '<div class="swipe-dot"></div>' : ''}
        </div>

        <div class="swipe-arrow prev" style="display: none;">←</div>
        <div class="swipe-arrow next" ${prediction ? '' : 'style="display: none;"'}>→</div>
      `;

      // Animate gauge after content is added
      requestAnimationFrame(() => {
        const gauge = content.querySelector('.gauge-progress');
        const percentage = content.querySelector('.percentage');
        if (gauge && percentage) {
          gauge.style.strokeDasharray = `${stats.adjustedSuccessRate}, 100`;
          percentage.textContent = `${stats.adjustedSuccessRate}%`;
        }
      });
    });
  }

  setupPredictionSwipe(modal) {
    const content = modal.querySelector('.prediction-content');
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let currentPage = 0;

    const handleStart = (e) => {
      isDragging = true;
      startX = e.type === 'mousedown' ? e.pageX : e.touches[0].pageX;
      currentX = startX;
      
      content.style.transition = 'none';
      content.style.cursor = 'grabbing';
    };

    const handleMove = (e) => {
      if (!isDragging) return;
      
      e.preventDefault();
      currentX = e.type === 'mousemove' ? e.pageX : e.touches[0].pageX;
      const diff = currentX - startX;
      
      // Only allow swipe if there's a second page
      if (content.querySelector('.task-prediction')) {
        content.style.transform = `translateX(${-currentPage * 100 + (diff / content.offsetWidth) * 100}%)`;
      }
    };

    const handleEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      
      const diff = currentX - startX;
      const threshold = content.offsetWidth * 0.2; // 20% threshold
      
      content.style.transition = 'transform 0.3s ease-out';
      content.style.cursor = '';
      
      if (Math.abs(diff) > threshold) {
        if (diff > 0 && currentPage > 0) {
          currentPage--;
        } else if (diff < 0 && currentPage === 0 && content.querySelector('.task-prediction')) {
          currentPage++;
        }
      }
      
      content.style.transform = `translateX(${-currentPage * 100}%)`;
      
      // Update indicators
      const dots = modal.querySelectorAll('.swipe-dot');
      dots.forEach((dot, i) => dot.classList.toggle('active', i === currentPage));
      
      // Update arrows
      const prevArrow = modal.querySelector('.swipe-arrow.prev');
      const nextArrow = modal.querySelector('.swipe-arrow.next');
      if (prevArrow && nextArrow) {
        prevArrow.style.display = currentPage === 0 ? 'none' : '';
        nextArrow.style.display = currentPage === 1 || !content.querySelector('.task-prediction') ? 'none' : '';
      }
    };

    // Touch events
    content.addEventListener('touchstart', handleStart, { passive: true });
    content.addEventListener('touchmove', handleMove, { passive: false });
    content.addEventListener('touchend', handleEnd);

    // Mouse events for desktop testing
    content.addEventListener('mousedown', handleStart);
    content.addEventListener('mousemove', handleMove);
    content.addEventListener('mouseup', handleEnd);
    content.addEventListener('mouseleave', handleEnd);

    // Arrow click handlers
    modal.querySelector('.swipe-arrow.prev')?.addEventListener('click', () => {
      if (currentPage > 0) {
        currentPage--;
        content.style.transition = 'transform 0.3s ease-out';
        content.style.transform = `translateX(${-currentPage * 100}%)`;
        
        // Update indicators
        const dots = modal.querySelectorAll('.swipe-dot');
        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentPage));
        
        // Update arrows
        modal.querySelector('.swipe-arrow.prev').style.display = currentPage === 0 ? 'none' : '';
        modal.querySelector('.swipe-arrow.next').style.display = '';
      }
    });

    modal.querySelector('.swipe-arrow.next')?.addEventListener('click', () => {
      if (content.querySelector('.task-prediction') && currentPage === 0) {
        currentPage++;
        content.style.transition = 'transform 0.3s ease-out';
        content.style.transform = `translateX(${-currentPage * 100}%)`;
        
        // Update indicators
        const dots = modal.querySelectorAll('.swipe-dot');
        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentPage));
        
        // Update arrows
        modal.querySelector('.swipe-arrow.prev').style.display = '';
        modal.querySelector('.swipe-arrow.next').style.display = 'none';
      }
    });
  }

  setupHistoricalChart() {
    const historicalChartBtn = document.getElementById('historicalChartBtn');
    historicalChartBtn.addEventListener('click', () => {
      const modal = document.getElementById('historicalChartModal');
      modal.style.display = 'block';
      // Force chart resize after displaying
      setTimeout(() => {
        this.chartManager.historicalChart.resize();
      }, 100);
    });
  }

  closeHistoricalChart() {
    const modal = document.getElementById('historicalChartModal');
    modal.style.display = 'none';
  }

  initializeGoalTracker() {
    const goalDate = localStorage.getItem('goalDate');
    if (goalDate) {
      this.updateGoalCountdown(new Date(goalDate));
    }
    
    // Update clock every second
    setInterval(() => {
      const savedDate = localStorage.getItem('goalDate');
      if (savedDate) {
        this.updateGoalCountdown(new Date(savedDate));
      }
    }, 1000);
  }

  showGoalModal() {
    const modal = document.getElementById('goalTrackerModal');
    modal.style.display = 'block';
    
    // Pre-fill existing goal date if any
    const existingDate = localStorage.getItem('goalDate');
    if (existingDate) {
      const input = document.getElementById('goalDate');
      input.value = new Date(existingDate).toISOString().split('T')[0];
    }
  }

  closeGoalModal() {
    const modal = document.getElementById('goalTrackerModal');
    modal.style.display = 'none';
  }

  handleGoalSubmit(e) {
    e.preventDefault();
    const goalDate = new Date(document.getElementById('goalDate').value);
    
    if (goalDate) {
      localStorage.setItem('goalDate', goalDate.toISOString());
      this.updateGoalCountdown(goalDate);
      this.closeGoalModal();
    }
  }

  resetGoalDate() {
    localStorage.removeItem('goalDate');
    const countdownElement = document.getElementById('goalCountdown');
    countdownElement.innerHTML = `
      <p>No goal date set</p>
      <button class="primary-btn" onclick="app.showGoalModal()">Set Goal Date</button>
    `;
  }

  updateGoalCountdown(goalDate) {
    const now = new Date();
    const diffTime = goalDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const countdownElement = document.getElementById('goalCountdown');
    
    // Format time components
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;
    
    if (diffTime < 0) {
      const exceededDays = Math.abs(diffDays);
      countdownElement.innerHTML = `
        <div class="goal-status overdue">
          <h4>Goal Deadline Status</h4>
          <div class="goal-clock" onclick="app.toggleClockDetails()">
            <span class="time">${timeString}</span>
            <div class="clock-details hidden">
              <p>Current Time Zone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}</p>
              <p>Week Day: ${now.toLocaleDateString('en-US', { weekday: 'long' })}</p>
              <p>Date: ${now.toLocaleDateString()}</p>
            </div>
          </div>
          <p>Goal deadline has passed by ${exceededDays} ${exceededDays === 1 ? 'day' : 'days'}!</p>
          <div class="goal-actions">
            <button class="secondary-btn" onclick="app.showGoalModal()">Update Goal</button>
            <button class="danger-btn" onclick="app.resetGoalDate()">Reset</button>
          </div>
        </div>
      `;
    } else {
      countdownElement.innerHTML = `
        <div class="goal-status">
          <h4>Goal Deadline Status</h4>
          <div class="goal-clock" onclick="app.toggleClockDetails()">
            <span class="time">${timeString}</span>
            <div class="clock-details hidden">
              <p>Current Time Zone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}</p>
              <p>Week Day: ${now.toLocaleDateString('en-US', { weekday: 'long' })}</p>
              <p>Date: ${now.toLocaleDateString()}</p>
            </div>
          </div>
          <p>${diffDays} ${diffDays === 1 ? 'day' : 'days'} remaining until goal deadline</p>
          <div class="progress-bar">
            <div class="progress" style="width: ${Math.min(100, (diffTime / (goalDate - new Date(localStorage.getItem('goalStartDate') || now))) * 100)}%"></div>
          </div>
          <div class="goal-actions">
            <button class="secondary-btn" onclick="app.showGoalModal()">Update Goal</button>
            <button class="danger-btn" onclick="app.resetGoalDate()">Reset</button>
          </div>
        </div>
      `;
    }

    // Add animation class to show update
    const goalStatus = countdownElement.querySelector('.goal-status');
    goalStatus.classList.add('updating');
    setTimeout(() => {
      goalStatus.classList.remove('updating');
    }, 500);
  }

  toggleClockDetails() {
    const clockDetails = document.querySelector('.clock-details');
    clockDetails.classList.toggle('hidden');
    
    // Add bouncing animation to clock when showing details
    const clock = document.querySelector('.goal-clock');
    clock.classList.add('bounce');
    setTimeout(() => clock.classList.remove('bounce'), 500);
  }

  async updateDayStatus(taskId, dayIndex, status) {
    const task = this.taskManager.getTasks().find(t => t.id === taskId);
    if (!task) return;
    
    // Store previous status for point calculation
    const previousStatus = task.weeklyStatus[dayIndex].status;
    
    // If same status is selected, clear it
    if (task.weeklyStatus[dayIndex].status === status) {
      task.weeklyStatus[dayIndex].status = null;
      
      // Revert the goal date change if we're clearing a previous status
      if (previousStatus === 'complete') {
        this.adjustGoalDate(1); // Add a day back
      } else if (previousStatus === 'failed') {
        this.adjustGoalDate(-1); // Remove the extra day
      }
    } else {
      task.weeklyStatus[dayIndex].status = status;
      
      // Update goal date based on new status
      if (status === 'complete') {
        this.adjustGoalDate(-1); // Reduce by one day
      } else if (status === 'failed') {
        this.adjustGoalDate(1); // Add one day
      }
      // No change for 'break' status
    }
    
    // ... rest of the existing updateDayStatus code ...
  }

  adjustGoalDate(days) {
    const goalDate = localStorage.getItem('goalDate');
    if (goalDate) {
      const newDate = new Date(goalDate);
      newDate.setDate(newDate.getDate() + days);
      localStorage.setItem('goalDate', newDate.toISOString());
      this.updateGoalCountdown(newDate);
    }
  }

  cleanup() {
    if (this.motivationalTimer) {
      clearInterval(this.motivationalTimer);
    }
    this.taskManager.cleanup();
  }
}

// Initialize the app
const app = new App();

// Export for global access
window.app = app;
window.closeModal = () => app.closeModal();

// Add cleanup on page unload
window.addEventListener('unload', () => {
  if (window.app) {
    window.app.cleanup();
  }
});