
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useEffect, useMemo, useState } from "react";

import {
  getTasks,
  createTask,
  updateTask as updateTaskAPI,
  deleteTask as deleteTaskAPI,
} from "./services/api";


import {
  LayoutDashboard,
  CheckSquare,
  CalendarDays,
  ChartNoAxesCombined,
  Settings,
  Search,
  Bell,
  Plus,
  ChevronDown,
  Clock3,
  CircleCheck,
  CircleDot,
  ListTodo,
  MoreHorizontal,
  ArrowUpRight,
  Menu,
  X,
  Command,
  Zap,
  Calendar,
  Filter,
  Trash2,
  Pencil,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
ChevronRight,
} from "lucide-react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const navigation = [
  {
    label: "Workspace",
    items: [
      { name: "Overview", icon: LayoutDashboard },
      { name: "My Tasks", icon: CheckSquare },
      { name: "Calendar", icon: CalendarDays },
      { name: "Analytics", icon: ChartNoAxesCombined },
    ],
  },
];


function Sidebar({ active, setActive, mobileOpen, setMobileOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const userName = user?.name || "User";
  const userEmail = user?.email || "Personal account";

  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <>
      {mobileOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon">
            <Zap size={21} fill="currentColor" />
          </div>

          <span>
            Task<span className="brand-highlight">Flow</span>
          </span>

          <button
            className="mobile-close"
            onClick={() => setMobileOpen(false)}
          >
            <X size={19} />
          </button>
        </div>

        <div className="workspace-switch">
          <div className="workspace-avatar">
            {initials[0]}
          </div>

          <div className="workspace-info">
            <strong>Personal Workspace</strong>
            <span>Free plan</span>
          </div>

          <ChevronDown size={16} />
        </div>

        {navigation.map((group) => (
          <div className="nav-group" key={group.label}>
            <p className="nav-heading">{group.label}</p>

            {group.items.map((item) => (
              <button
                key={item.name}
                className={`nav-item ${
                  active === item.name ? "active" : ""
                }`}
                onClick={() => {
                  setActive(item.name);
                  setMobileOpen(false);
                }}
              >
                <item.icon size={18} />
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        ))}

        <div className="nav-bottom">
          <button className="nav-item">
            <Settings size={18} />
            <span>Settings</span>
          </button>

          <div className="sidebar-profile">
            <div className="profile-avatar">
              {initials}
            </div>

            <div className="profile-details">
              <strong>{userName}</strong>
              <span>{userEmail}</span>
            </div>

            <button
              type="button"
              className="icon-button"
              title="Logout"
              aria-label="Logout"
              onClick={handleLogout}
            >
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}


function TaskCard({ task, onStatus, onDelete, onEdit, selected, onSelect, onToggleSubtask }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const statusClass = task.status.toLowerCase().replace(" ", "-");

  return (
    <article className="task-card">
      <div className="task-top">
        <label className="bulk-task-select" title="Select task">
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => onSelect(task.id, e.target.checked)}
            aria-label={`Select ${task.title}`}
          />
          <span>Select</span>
        </label>
        <span className={`priority priority-${task.priority.toLowerCase()}`}>
          <span /> {task.priority} priority
        </span>

        <div className="task-menu-wrap">
          <button
            className="icon-button"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <MoreHorizontal size={19} />
          </button>

          {menuOpen && (
            <div className="task-menu">
              <button
                onClick={() => {
                  onEdit(task);
                  setMenuOpen(false);
                }}
              >
                <Pencil size={14} /> Edit task
              </button>

              <button
                className="delete-option"
                onClick={() => onDelete(task.id)}
              >
                <Trash2 size={14} /> Delete task
              </button>
            </div>
          )}
        </div>
      </div>

      <h3>{task.title}</h3>
      <p className="task-description">{task.description}</p>

      <div className="task-meta">
        <span className="task-category">{task.category}</span>
        <span>
          <Calendar size={14} />{" "}
          {task.due || "No due date"}
        </span>
      </div>

      <div className="task-progress-block">
        <div className="task-progress-heading">
          <span>Completion</span>
          <strong>{Number(task.progress ?? (task.status === "Completed" ? 100 : task.status === "In Progress" ? 1 : 0))}%</strong>
        </div>
        <div
          className="task-progress-track"
          role="progressbar"
          aria-label={`${task.title} completion`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Number(task.progress ?? 0)}
        >
          <div
            className="task-progress-fill"
            style={{ width: `${Number(task.progress ?? (task.status === "Completed" ? 100 : task.status === "In Progress" ? 1 : 0))}%` }}
          />
        </div>
      </div>
      {task.subtasks?.length > 0 && (
  <div className="task-subtasks">
    <div className="task-subtasks-heading">
      <strong>Checklist</strong>
      <span>
        {task.subtasks.filter((item) => item.completed).length}/
        {task.subtasks.length} completed
      </span>
    </div>

    <div className="task-subtasks-track">
      <div
        className="task-subtasks-fill"
        style={{
          width: `${
            (task.subtasks.filter((item) => item.completed).length /
              task.subtasks.length) * 100
          }%`,
        }}
      />
    </div>

    {task.subtasks.map((item, index) => (
      <label className="task-subtask-item" key={index}>
        <input
          type="checkbox"
          checked={Boolean(item.completed)}
          onChange={(e) =>
            onToggleSubtask(task.id, index, e.target.checked)
          }
        />
        <span className={item.completed ? "subtask-completed" : ""}>
          {item.title}
        </span>
      </label>
    ))}
  </div>
)}

      <div className="task-footer">
        <span className={`status status-${statusClass}`}>
          {task.status === "Completed" ? (
            <CircleCheck size={14} />
          ) : task.status === "In Progress" ? (
            <CircleDot size={14} />
          ) : (
            <Clock3 size={14} />
          )}
          {task.status}
        </span>

        <select
          aria-label="Change task status"
          value={task.status}
          onChange={(e) => onStatus(task.id, e.target.value)}
        >
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
      </div>
    </article>
  );
}



function CalendarView({ tasks }) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return formatDateKey(today);
  });

  function formatDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const monthName = currentMonth.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const todayKey = formatDateKey(new Date());

  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const taskMap = tasks.reduce((map, task) => {
    if (task.due) {
      const key = task.due.slice(0, 10);

      if (!map[key]) map[key] = [];

      map[key].push(task);
    }

    return map;
  }, {});

  const selectedTasks = taskMap[selectedDate] || [];

  function changeMonth(direction) {
    setCurrentMonth(
      new Date(year, month + direction, 1)
    );
  }

  function selectDay(day) {
    const date = new Date(year, month, day);
    setSelectedDate(formatDateKey(date));
  }

  function goToToday() {
    const today = new Date();

    setCurrentMonth(
      new Date(today.getFullYear(), today.getMonth(), 1)
    );

    setSelectedDate(formatDateKey(today));
  }

  return (
    <div className="calendar-layout">
      <div className="calendar-main">
        <div className="calendar-header">
          <div>
            <h2>{monthName}</h2>
            <p>Select a date to view your tasks.</p>
          </div>

          <div className="calendar-controls">
            <button
              type="button"
              className="calendar-nav-button"
              onClick={() => changeMonth(-1)}
              aria-label="Previous month"
            >
              <ChevronLeft size={19} />
            </button>

            <button
              type="button"
              className="calendar-today-button"
              onClick={goToToday}
            >
              Today
            </button>

            <button
              type="button"
              className="calendar-nav-button"
              onClick={() => changeMonth(1)}
              aria-label="Next month"
            >
              <ChevronRight size={19} />
            </button>
          </div>
        </div>

        <div className="calendar-grid">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
            (day) => (
              <div className="calendar-weekday" key={day}>
                {day}
              </div>
            )
          )}

          {calendarDays.map((day, index) => {
            if (day === null) {
              return (
                <div
                  className="calendar-day empty-day"
                  key={`empty-${index}`}
                />
              );
            }

            const date = new Date(year, month, day);
            const dateKey = formatDateKey(date);
            const dayTasks = taskMap[dateKey] || [];

            const isToday = dateKey === todayKey;
            const isSelected = dateKey === selectedDate;

            return (
              <button
                type="button"
                key={dateKey}
                className={`calendar-day ${
                  isToday ? "today" : ""
                } ${isSelected ? "selected" : ""}`}
                onClick={() => selectDay(day)}
              >
                <span className="calendar-day-number">
                  {day}
                </span>

                {dayTasks.length > 0 && (
                  <div className="calendar-task-indicators">
                    {dayTasks.slice(0, 3).map((task, taskIndex) => (
                      <i
                        key={`${task.id}-${taskIndex}`}
                        className={`calendar-task-dot ${
                          task.status === "Completed"
                            ? "dot-completed"
                            : task.priority === "High"
                            ? "dot-high"
                            : "dot-default"
                        }`}
                      />
                    ))}
                  </div>
                )}

                {dayTasks.length > 0 && (
                  <span className="calendar-task-count">
                    {dayTasks.length} task
                    {dayTasks.length > 1 ? "s" : ""}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="calendar-legend">
          <span><i className="dot-default" /> Scheduled</span>
          <span><i className="dot-high" /> High priority</span>
          <span><i className="dot-completed" /> Completed</span>
        </div>
      </div>

      <div className="calendar-agenda">
        <div className="agenda-heading">
          <div>
            <span className="eyebrow">YOUR SCHEDULE</span>
            <h3>
              {new Date(
                `${selectedDate}T00:00:00`
              ).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
              })}
            </h3>
          </div>

          <span className="agenda-count">
            {selectedTasks.length}
          </span>
        </div>

        {selectedTasks.length > 0 ? (
          <div className="agenda-list">
            {selectedTasks.map((task) => (
              <div className="agenda-task" key={task.id}>
                <div className="agenda-task-top">
                  <span
                    className={`priority priority-${task.priority.toLowerCase()}`}
                  >
                    <span />
                    {task.priority}
                  </span>

                  <span className={`status status-${task.status
                    .toLowerCase()
                    .replace(" ", "-")}`}>
                    {task.status}
                  </span>
                </div>

                <h4>{task.title}</h4>

                <p>
                  {task.description || "No description added."}
                </p>

                <span className="task-category">
                  {task.category}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="agenda-empty">
            <CalendarDays size={28} />
            <h4>No tasks scheduled</h4>
            <p>
              There are no tasks assigned to this date.
              Select another date to explore your schedule.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}



function AnalyticsView({ tasks }) {
  const completed = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const inProgress = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const pending = tasks.filter(
    (task) => task.status === "Pending"
  ).length;

  const total = tasks.length;

  const completionRate = total
    ? Math.round((completed / total) * 100)
    : 0;

  const averageProgress = total
    ? Math.round(
        tasks.reduce((sum, task) => {
          const value = task.progress ?? (task.status === "Completed" ? 100 : task.status === "In Progress" ? 1 : 0);
          return sum + Math.max(0, Math.min(100, Number(value) || 0));
        }, 0) / total
      )
    : 0;

  const statusData = [
    { name: "Completed", value: completed, color: "#4ade80" },
    { name: "In Progress", value: inProgress, color: "#a78bfa" },
    { name: "Pending", value: pending, color: "#60a5fa" },
  ];

  const priorityData = ["High", "Medium", "Low"].map((priority) => ({
    name: priority,
    tasks: tasks.filter((task) => task.priority === priority).length,
  }));

  const chartTooltipStyle = {
    backgroundColor: "#191a2b",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "10px",
    color: "#ffffff",
    fontSize: "12px",
  };

  return (
    <div className="analytics-dashboard">

      {/* Summary cards */}
      <div className="analytics-summary">

        <div className="analytics-stat-card">
          <div className="analytics-stat-top">
            <span>Total Tasks</span>
            <ListTodo size={19} />
          </div>
          <h2>{total}</h2>
          <p>All your tasks</p>
        </div>

        <div className="analytics-stat-card">
          <div className="analytics-stat-top">
            <span>Completed</span>
            <CircleCheck size={19} />
          </div>
          <h2>{completed}</h2>
          <p>{completionRate}% completion rate</p>
        </div>

        <div className="analytics-stat-card">
          <div className="analytics-stat-top">
            <span>In Progress</span>
            <Clock3 size={19} />
          </div>
          <h2>{inProgress}</h2>
          <p>Currently being worked on</p>
        </div>

        <div className="analytics-stat-card">
          <div className="analytics-stat-top">
            <span>Pending</span>
            <AlertCircle size={19} />
          </div>
          <h2>{pending}</h2>
          <p>Waiting to be started</p>
        </div>

      </div>

      {/* Average task progress */}
      <div className="analytics-panel completion-panel">
        <div className="analytics-panel-heading">
          <div>
            <span className="eyebrow">OVERALL WORK PROGRESS</span>
            <h3>Average Task Completion</h3>
          </div>
          <strong>{averageProgress}%</strong>
        </div>
        <div className="completion-track">
          <div
            className="completion-fill"
            style={{ width: `${averageProgress}%` }}
          />
        </div>
        <p>Average completion across all {total} task{total === 1 ? "" : "s"}.</p>
      </div>

      {/* Completed task count */}
      <div className="analytics-panel completion-panel">
        <div className="analytics-panel-heading">
          <div>
            <span className="eyebrow">PRODUCTIVITY OVERVIEW</span>
            <h3>Task Completion</h3>
          </div>
          <strong>{completionRate}%</strong>
        </div>

        <div className="completion-track">
          <div
            className="completion-fill"
            style={{ width: `${completionRate}%` }}
          />
        </div>

        <p>
          You have completed {completed} out of {total} tasks.
        </p>
      </div>

      {/* Charts */}
      <div className="analytics-charts">

        <div className="analytics-panel">
          <div className="analytics-panel-heading">
            <div>
              <span className="eyebrow">TASK DISTRIBUTION</span>
              <h3>Status Breakdown</h3>
            </div>
          </div>

          {total > 0 ? (
            <div className="analytics-chart">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData.filter((item) => item.value > 0)}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={62}
                    outerRadius={95}
                    paddingAngle={4}
                    stroke="none"
                  >
                    {statusData
                      .filter((item) => item.value > 0)
                      .map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={entry.color}
                        />
                      ))}
                  </Pie>

                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Legend
                    verticalAlign="bottom"
                    formatter={(value) => (
                      <span style={{ color: "#c4c4d4", fontSize: 12 }}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="analytics-empty">
              <ListTodo size={28} />
              <p>Create tasks to view your status breakdown.</p>
            </div>
          )}
        </div>

        <div className="analytics-panel">
          <div className="analytics-panel-heading">
            <div>
              <span className="eyebrow">PRIORITY ANALYSIS</span>
              <h3>Priority Breakdown</h3>
            </div>
          </div>

          <div className="analytics-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={priorityData}
                margin={{ top: 15, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.08)"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  stroke="#9292a5"
                  tick={{ fill: "#b4b4c5", fontSize: 11 }}
                />

                <YAxis
                  allowDecimals={false}
                  stroke="#9292a5"
                  tick={{ fill: "#b4b4c5", fontSize: 11 }}
                />

                <Tooltip contentStyle={chartTooltipStyle} />

                <Bar
                  dataKey="tasks"
                  name="Tasks"
                  fill="#a78bfa"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Detailed status list */}
      <div className="analytics-panel">
        <div className="analytics-panel-heading">
          <div>
            <span className="eyebrow">DETAILED REPORT</span>
            <h3>Task Status Report</h3>
          </div>
        </div>

        <div className="analytics-report">

          {statusData.map((item) => {
            const percentage = total
              ? Math.round((item.value / total) * 100)
              : 0;

            return (
              <div className="analytics-report-row" key={item.name}>
                <div className="analytics-report-label">
                  <span
                    className="analytics-report-dot"
                    style={{ background: item.color }}
                  />
                  <span>{item.name}</span>
                </div>

                <div className="analytics-report-bar">
                  <div
                    style={{
                      width: `${percentage}%`,
                      background: item.color,
                    }}
                  />
                </div>

                <strong>{item.value}</strong>
                <span className="analytics-report-percent">
                  {percentage}%
                </span>
              </div>
            );
          })}

        </div>
      </div>

    </div>
  );
}


function ToastNotification({ toast, onClose }) {
  if (!toast) return null;

  const isError = toast.type === "error";

  return (
    <div
      className={`toast-notification ${
        isError ? "toast-error" : "toast-success"
      }`}
      role="alert"
    >
      <div className="toast-icon">
        {isError ? (
          <AlertCircle size={21} />
        ) : (
          <CircleCheck size={21} />
        )}
      </div>

      <div className="toast-content">
        <strong>{toast.title}</strong>
        <p>{toast.message}</p>
      </div>

      <button
        type="button"
        className="toast-close"
        onClick={onClose}
        aria-label="Close notification"
      >
        <X size={17} />
      </button>
    </div>
  );
}


function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  const [active, setActive] = useState("Overview");
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [toast, setToast] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const [bulkDeleteConfirmation, setBulkDeleteConfirmation] = useState(false);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

function showToast(title, message, type = "success") {
  setToast({ title, message, type });

  setTimeout(() => {
    setToast(null);
  }, 3500);
}

useEffect(() => {
  const timer = setInterval(() => {
    setCurrentDate(new Date());
  }, 60000);

  return () => clearInterval(timer);
}, []);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Development",
    priority: "Medium",
    status: "Pending",
    progress: 0,
    subtasks: [],
    due: "",
  });

  const [subtaskInput, setSubtaskInput] = useState("");

  // Load tasks belonging to the logged-in user
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setTasksLoading(true);
        setApiError("");

        const response = await getTasks();

        const formattedTasks = (response.data.tasks || []).map((task) => ({
          ...task,
          id: task._id,
          due: task.dueDate
            ? task.dueDate.slice(0, 10)
            : "",
        }));

        setTasks(formattedTasks);
      } catch (error) {
        setApiError(
          error.response?.data?.message || "Unable to load your tasks."
        );
      } finally {
        setTasksLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const completed = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const inProgress = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const pending = tasks.filter(
    (task) => task.status === "Pending"
  ).length;

  const visibleTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayKey = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ].join("-");

    const filteredTasks = tasks.filter((task) => {
      const isOverdue =
        Boolean(task.due) &&
        task.due.slice(0, 10) < todayKey &&
        task.status !== "Completed";

      const matchesFilter =
        filter === "All" ||
        (filter === "Overdue" ? isOverdue : task.status === filter);

      const matchesSearch = `${task.title || ""} ${task.description || ""} ${task.category || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchesFilter && matchesSearch;
    });

    const priorityRank = { High: 3, Medium: 2, Low: 1 };

    return [...filteredTasks].sort((a, b) => {
      if (sortBy === "due-asc" || sortBy === "due-desc") {
        const aDue = a.due || (sortBy === "due-asc" ? "9999-12-31" : "0000-01-01");
        const bDue = b.due || (sortBy === "due-asc" ? "9999-12-31" : "0000-01-01");
        return sortBy === "due-asc"
          ? aDue.localeCompare(bDue)
          : bDue.localeCompare(aDue);
      }

      if (sortBy === "priority") {
        return (priorityRank[b.priority] || 0) - (priorityRank[a.priority] || 0);
      }

      if (sortBy === "progress-asc" || sortBy === "progress-desc") {
        const getProgress = (task) =>
          Number.isFinite(Number(task.progress))
            ? Number(task.progress)
            : task.status === "Completed"
            ? 100
            : task.status === "In Progress"
            ? 1
            : 0;

        return sortBy === "progress-asc"
          ? getProgress(a) - getProgress(b)
          : getProgress(b) - getProgress(a);
      }

      const aCreated = new Date(a.createdAt || 0).getTime();
      const bCreated = new Date(b.createdAt || 0).getTime();
      return sortBy === "oldest"
        ? aCreated - bCreated
        : bCreated - aCreated;
    });
  }, [tasks, filter, search, sortBy]);

function addSubtask() {
  const title = subtaskInput.trim();
  if (!title) return;

  setForm((prev) => ({
    ...prev,
    subtasks: [...(prev.subtasks || []), { title, completed: false }],
  }));

  setSubtaskInput("");
}

function removeSubtask(index) {
  setForm((prev) => ({
    ...prev,
    subtasks: (prev.subtasks || []).filter((_, i) => i !== index),
  }));
}

  function openAdd() {
    setEditing(null);

    setForm({
      title: "",
      description: "",
      category: "Development",
      priority: "Medium",
      status: "Pending",
      progress: 0,
      subtasks: [],
      due: "",
    });

    setModal(true);
  }

  function openEdit(task) {
    setEditing(task);

    setForm({
      title: task.title || "",
      description: task.description || "",
      category: task.category || "General",
      priority: task.priority || "Medium",
      status: task.status || "Pending",
      progress: Number(task.progress ?? (task.status === "Completed" ? 100 : task.status === "In Progress" ? 1 : 0)),
      subtasks: task.subtasks || [],
      due: task.due || "",
    });

    setModal(true);
  }

  // Create a new task or update an existing task
  
async function saveTask(e) {
  e.preventDefault();

  if (!form.title.trim()) return;

  const taskData = {
    title: form.title.trim(),
    description: form.description,
    category: form.category,
    priority: form.priority,
    status: form.status,
    progress: Number(form.progress),
    dueDate: form.due || null,
    subtasks: form.subtasks || [],
  };

  try {
    setApiError("");

    if (editing) {
      const response = await updateTaskAPI(editing.id, taskData);

      const updatedTask = {
        ...response.data.task,
        id: response.data.task._id,
        due: response.data.task.dueDate
          ? response.data.task.dueDate.slice(0, 10)
          : "",
      };

      setTasks((prev) =>
        prev.map((task) =>
          task.id === editing.id ? updatedTask : task
        )
      );

      showToast(
        "Task updated!",
        "Your changes have been saved successfully."
      );
    } else {
      const response = await createTask(taskData);

      const newTask = {
        ...response.data.task,
        id: response.data.task._id,
        due: response.data.task.dueDate
          ? response.data.task.dueDate.slice(0, 10)
          : "",
      };

      setTasks((prev) => [newTask, ...prev]);

      showToast(
        "Task created!",
        "Your new task has been added successfully."
      );
    }

    setModal(false);
  } catch (error) {
    const message =
      error.response?.data?.message || "Unable to save task.";

    setApiError(message);
    showToast("Something went wrong", message, "error");
  }
}


  // Update task status in MongoDB
  
async function updateStatus(id, status) {
  try {
    setApiError("");

    const progress =
      status === "Pending"
        ? 0
        : status === "Completed"
        ? 100
        : (() => {
            const current = tasks.find((task) => task.id === id)?.progress ?? 0;
            return current > 0 && current < 100 ? current : 1;
          })();

    const response = await updateTaskAPI(id, { status, progress });

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              status: response.data.task.status,
              progress: response.data.task.progress,
            }
          : task
      )
    );

    showToast(
      "Status updated!",
      `Task moved to ${status}.`
    );
  } catch (error) {
    console.error("STATUS UPDATE ERROR:", error.response?.data || error);
    const message =
      error.response?.data?.message || "Unable to update task status.";

    setApiError(message);
    showToast("Update failed", message, "error");
  }
}

async function toggleSubtask(taskId, subtaskIndex, completed) {
  const task = tasks.find((item) => item.id === taskId);
  if (!task) return;

  const updatedSubtasks = (task.subtasks || []).map((item, index) =>
    index === subtaskIndex ? { ...item, completed } : item
  );

  try {
    const response = await updateTaskAPI(taskId, {
      subtasks: updatedSubtasks,
    });

    setTasks((prev) =>
      prev.map((item) =>
        item.id === taskId
          ? { ...item, subtasks: response.data.task.subtasks }
          : item
      )
    );

    showToast("Checklist updated!", "Subtask progress saved.");
  } catch (error) {
    const message =
      error.response?.data?.message || "Unable to update checklist.";

    showToast("Update failed", message, "error");
  }
}
  
  function toggleTaskSelection(id, checked) {
    setSelectedTaskIds((prev) =>
      checked ? [...new Set([...prev, id])] : prev.filter((taskId) => taskId !== id)
    );
  }

  const allVisibleSelected =
    visibleTasks.length > 0 &&
    visibleTasks.every((task) => selectedTaskIds.includes(task.id));

  function toggleSelectAllVisible(checked) {
    const visibleIds = visibleTasks.map((task) => task.id);
    setSelectedTaskIds((prev) =>
      checked
        ? [...new Set([...prev, ...visibleIds])]
        : prev.filter((id) => !visibleIds.includes(id))
    );
  }

  async function bulkUpdateStatus(status) {
    const selectedTasks = tasks.filter((task) => selectedTaskIds.includes(task.id));
    if (!selectedTasks.length) return;

    try {
      setBulkActionLoading(true);
      setApiError("");
      const updatedResults = await Promise.all(
        selectedTasks.map((task) => {
          const currentProgress = Number(task.progress ?? 0);
          const progress =
            status === "Completed" ? 100 :
            status === "Pending" ? 0 :
            currentProgress > 0 && currentProgress < 100 ? currentProgress : 1;
          return updateTaskAPI(task.id, { status, progress });
        })
      );

      const updatedById = new Map(
        updatedResults.map((response) => [response.data.task._id, response.data.task])
      );
      setTasks((prev) =>
        prev.map((task) => {
          const updated = updatedById.get(task.id);
          return updated
            ? { ...task, status: updated.status, progress: updated.progress }
            : task;
        })
      );
      setSelectedTaskIds([]);
      showToast("Tasks updated!", `${selectedTasks.length} task${selectedTasks.length === 1 ? "" : "s"} moved to ${status}.`);
    } catch (error) {
      const message = error.response?.data?.message || "Unable to update all selected tasks.";
      setApiError(message);
      showToast("Bulk update failed", message, "error");
    } finally {
      setBulkActionLoading(false);
    }
  }

  async function confirmBulkDelete() {
    const idsToDelete = [...selectedTaskIds];
    if (!idsToDelete.length) {
      setBulkDeleteConfirmation(false);
      return;
    }
    try {
      setBulkActionLoading(true);
      setApiError("");
      await Promise.all(idsToDelete.map((id) => deleteTaskAPI(id)));
      setTasks((prev) => prev.filter((task) => !idsToDelete.includes(task.id)));
      setSelectedTaskIds([]);
      setBulkDeleteConfirmation(false);
      showToast("Tasks deleted!", `${idsToDelete.length} task${idsToDelete.length === 1 ? "" : "s"} deleted successfully.`);
    } catch (error) {
      const message = error.response?.data?.message || "Unable to delete all selected tasks.";
      setApiError(message);
      setBulkDeleteConfirmation(false);
      showToast("Bulk delete failed", message, "error");
    } finally {
      setBulkActionLoading(false);
    }
  }

// Delete task from MongoDB
  
function deleteTask(id) {
  setDeleteConfirmation(id);
}

async function confirmDeleteTask() {
  if (!deleteConfirmation) return;

  try {
    setApiError("");

    await deleteTaskAPI(deleteConfirmation);

    setTasks((prev) =>
      prev.filter((task) => task.id !== deleteConfirmation)
    );

    setDeleteConfirmation(false);

    showToast(
      "Task deleted!",
      "The task has been removed successfully."
    );
  } catch (error) {
    const message =
      error.response?.data?.message || "Unable to delete task.";

    setApiError(message);
    setDeleteConfirmation(false);

    showToast("Delete failed", message, "error");
  }
}


  return (
    <div className="app-shell">

      <ToastNotification
      toast={toast}
      onClose={() => setToast(null)}
    />

{deleteConfirmation && (
  <div className="delete-confirm-overlay">
    <div className="delete-confirm-box">
      <div className="delete-confirm-icon">
        <Trash2 size={24} />
      </div>

      <h3>Delete this task?</h3>

      <p>
        This action cannot be undone. Are you sure you
        want to permanently delete this task?
      </p>

      <div className="delete-confirm-actions">
        <button
          type="button"
          className="delete-cancel-button"
          onClick={() => setDeleteConfirmation(false)}
        >
          Cancel
        </button>

        <button
          type="button"
          className="delete-confirm-button"
          onClick={confirmDeleteTask}
        >
          Delete task
        </button>
      </div>
    </div>
  </div>
)}

      {bulkDeleteConfirmation && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm-box">
            <div className="delete-confirm-icon"><Trash2 size={24} /></div>
            <h3>Delete {selectedTaskIds.length} selected tasks?</h3>
            <p>This action cannot be undone. The selected tasks will be permanently deleted.</p>
            <div className="delete-confirm-actions">
              <button
                type="button"
                className="delete-cancel-button"
                disabled={bulkActionLoading}
                onClick={() => setBulkDeleteConfirmation(false)}
              >Cancel</button>
              <button
                type="button"
                className="delete-confirm-button"
                disabled={bulkActionLoading}
                onClick={confirmBulkDelete}
              >{bulkActionLoading ? "Deleting..." : "Delete selected"}</button>
            </div>
          </div>
        </div>
      )}

      <Sidebar
        active={active}
        setActive={setActive}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu />
            </button>

            <div className="breadcrumb">
              Workspace <span>/</span> <strong>{active}</strong>
            </div>
          </div>

          <div className="topbar-right">
            
<div className="top-date">
  <CalendarDays size={15} />

  <span>
    {currentDate.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    })}
    {" · "}
    {currentDate.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    })}
  </span>
</div>

            <button className="notification-button">
              <Bell size={19} />
              <i />
            </button>

            <div className="top-avatar">NK</div>
          </div>
        </header>

        <div className="dashboard-content">
          <section className="welcome-row">
            <div>
              <div className="eyebrow">
                <span className="live-dot" /> YOUR PRODUCTIVITY SPACE
              </div>

              <h1>
                Make today <span>count.</span>
              </h1>

              <p>
                Stay focused, get things done, and keep moving forward.
              </p>
            </div>

            <button className="primary-button" onClick={openAdd}>
              <Plus size={18} /> Create task
            </button>
          </section>

          {apiError && (
            <div className="auth-error">
              {apiError}
            </div>
          )}
        {active === "Overview" && (
          <section className="stats-grid">
            <div className="stat-card stat-total">
              <div className="stat-heading">
                <span>Total tasks</span>
                <div className="stat-icon">
                  <ListTodo size={19} />
                </div>
              </div>

              <div className="stat-number">
                {tasks.length.toString().padStart(2, "0")}
              </div>

              <div className="stat-note">
                <ArrowUpRight size={14} /> Your entire task list
              </div>

              <div className="stat-decoration" />
            </div>

            <div className="stat-card stat-done">
              <div className="stat-heading">
                <span>Completed</span>
                <div className="stat-icon">
                  <CircleCheck size={19} />
                </div>
              </div>

              <div className="stat-number">
                {completed.toString().padStart(2, "0")}
              </div>

              <div className="stat-note">
                {tasks.length
                  ? Math.round((completed / tasks.length) * 100)
                  : 0}
                % of all tasks completed
              </div>

              <div className="stat-decoration" />
            </div>

            <div className="stat-card stat-progress">
              <div className="stat-heading">
                <span>In progress</span>
                <div className="stat-icon">
                  <Clock3 size={19} />
                </div>
              </div>

              <div className="stat-number">
                {inProgress.toString().padStart(2, "0")}
              </div>

              <div className="stat-note">
                Currently being worked on
              </div>

              <div className="stat-decoration" />
            </div>

            <div className="stat-card stat-pending">
              <div className="stat-heading">
                <span>Pending</span>
                <div className="stat-icon">
                  <Calendar size={19} />
                </div>
              </div>

              <div className="stat-number">
                {pending.toString().padStart(2, "0")}
              </div>

              <div className="stat-note">
                Waiting to get started
              </div>

              <div className="stat-decoration" />
            </div>
          </section>
          )}
        {active === "Overview" && (
          <section className="productivity-panel">
            <div className="productivity-copy">
              <div className="eyebrow purple-eyebrow">
                <Zap size={13} /> PRODUCTIVITY OVERVIEW
              </div>

              <h2>Your progress, at a glance.</h2>

              <p>
                Every completed task is a step forward. Keep up the momentum!
              </p>
            </div>

            <div
              className="progress-ring"
              style={{
                "--progress": `${
                  tasks.length ? (completed / tasks.length) * 100 : 0
                }%`,
              }}
            >
              <div>
                <strong>
                  {tasks.length
                    ? Math.round((completed / tasks.length) * 100)
                    : 0}
                  %
                </strong>
                <span>Completed</span>
              </div>
            </div>

            <div className="progress-details">
              <div>
                <i className="legend-green" /> Completed
                <strong>{completed}</strong>
              </div>

              <div>
                <i className="legend-blue" /> In progress
                <strong>{inProgress}</strong>
              </div>

              <div>
                <i className="legend-orange" /> Pending
                <strong>{pending}</strong>
              </div>
            </div>
          </section>
          )}

        {(active === "Overview" || active === "My Tasks") && (
          <section className="tasks-section">
            <div className="tasks-heading">
              <div>
                <div className="eyebrow">YOUR WORKSPACE</div>
                <h2>
                  {active === "Overview" ? "Recent tasks" : active}
                </h2>
              </div>

              <button
                className="text-button"
                onClick={() => {
                  setActive("My Tasks");
                  setFilter("All");
                }}
              >
                View all tasks <ArrowUpRight size={15} />
              </button>
            </div>

            <div className="task-toolbar">
              <div className="search-box">
                <Search size={17} />

                <input
                  placeholder="Search tasks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <kbd>
                  <Command size={11} /> K
                </kbd>
              </div>

              <div className="filter-control">
                <Filter size={15} />

                <select
                  aria-label="Filter tasks"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="All">All tasks</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>

              <div className="filter-control sort-control">
                <span className="sort-label">Sort:</span>
                <select
                  aria-label="Sort tasks"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Recently created</option>
                  <option value="oldest">Oldest created</option>
                  <option value="due-asc">Due date: earliest</option>
                  <option value="due-desc">Due date: latest</option>
                  <option value="priority">Priority: high to low</option>
                  <option value="progress-desc">Progress: high to low</option>
                  <option value="progress-asc">Progress: low to high</option>
                </select>
              </div>
            </div>

            {!tasksLoading && (
              <div className="bulk-actions-toolbar">
                <label className="bulk-select-all">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={(e) => toggleSelectAllVisible(e.target.checked)}
                    disabled={!visibleTasks.length || bulkActionLoading}
                  />
                  <span>Select all visible</span>
                </label>
                <span className="bulk-selection-count">{selectedTaskIds.length} selected</span>

                {selectedTaskIds.length > 0 && (
                  <div className="bulk-action-buttons">
                    <button
                      type="button"
                      className="bulk-complete-button"
                      disabled={bulkActionLoading}
                      onClick={() => bulkUpdateStatus("Completed")}
                    >
                      <CheckCircle2 size={15} />
                      {bulkActionLoading ? "Updating..." : "Mark completed"}
                    </button>
                    <select
                      aria-label="Set selected task status"
                      defaultValue=""
                      disabled={bulkActionLoading}
                      onChange={(e) => {
                        const nextStatus = e.target.value;
                        if (nextStatus) bulkUpdateStatus(nextStatus);
                        e.target.value = "";
                      }}
                    >
                      <option value="" disabled>Change status...</option>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                    <button
                      type="button"
                      className="bulk-delete-button"
                      disabled={bulkActionLoading}
                      onClick={() => setBulkDeleteConfirmation(true)}
                    >
                      <Trash2 size={15} /> Delete selected
                    </button>
                    <button
                      type="button"
                      className="bulk-clear-button"
                      disabled={bulkActionLoading}
                      onClick={() => setSelectedTaskIds([])}
                    >Clear</button>
                  </div>
                )}
              </div>
            )}

            <div className="task-grid">
              {tasksLoading ? (
                <div className="empty-state">
                  <h3>Loading your tasks...</h3>
                </div>
              ) : visibleTasks.length ? (
                visibleTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatus={updateStatus}
                    onDelete={deleteTask}
                    onEdit={openEdit}
                    selected={selectedTaskIds.includes(task.id)}
                    onSelect={toggleTaskSelection}
                    onToggleSubtask={toggleSubtask}
                  />
                ))
              ) : (
                <div className="empty-state">
                  <ListTodo size={30} />
                  <h3>No tasks found</h3>
                  <p>
                    Try another search or create a new task.
                  </p>
                  <button
                    className="primary-button"
                    onClick={openAdd}
                  >
                    <Plus size={16} /> Create task
                  </button>
                </div>
              )}
            </div>
          </section>
          )}


{active === "Calendar" && (
  <section className="tasks-section">
    <div className="tasks-heading">
      <div>
        <div className="eyebrow">YOUR SCHEDULE</div>
        <h2>Task Calendar</h2>
      </div>
    </div>

    <CalendarView tasks={tasks} />
  </section>
)}

{active === "Analytics" && (
  <section className="tasks-section">
    <div className="tasks-heading">
      <div>
        <div className="eyebrow">YOUR PERFORMANCE</div>
        <h2>Task Analytics</h2>
      </div>
    </div>

    <AnalyticsView tasks={tasks} />
  </section>
)}


          <footer className="dashboard-footer">
            <span>TaskFlow</span> · Stay organized. Stay focused.
            <span className="footer-version">Workspace v1.0</span>
          </footer>
        </div>
      </main>

      {modal && (
        <div
          className="modal-backdrop"
          onClick={() => setModal(false)}
        >
          <form
            className="task-modal"
            onSubmit={saveTask}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-heading">
              <div>
                <span className="eyebrow">TASK MANAGEMENT</span>
                <h2>
                  {editing ? "Edit task" : "Create a new task"}
                </h2>
              </div>

              <button
                type="button"
                className="icon-button"
                onClick={() => setModal(false)}
              >
                <X />
              </button>
            </div>

            <label>
              Task title
              <input
                required
                autoFocus
                placeholder="What needs to be done?"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />
            </label>

            <label>
              Description
              <textarea
                placeholder="Add some details..."
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </label>

            <div className="form-row">
              <label>
                Category
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  <option>Development</option>
                  <option>Design</option>
                  <option>Planning</option>
                  <option>Personal</option>
                </select>
              </label>

              <label>
                Priority
                <select
                  value={form.priority}
                  onChange={(e) =>
                    setForm({ ...form, priority: e.target.value })
                  }
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </label>
            </div>

            <div className="form-row">
              <label>
                Status
                <select
                  value={form.status}
                  onChange={(e) => {
                    const status = e.target.value;
                    setForm({
                      ...form,
                      status,
                      progress:
                        status === "Pending"
                          ? 0
                          : status === "Completed"
                          ? 100
                          : form.progress === 0 || form.progress === 100
                          ? 1
                          : form.progress,
                    });
                  }}
                >
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </label>

              <label>
                Due date
                <input
                  type="date"
                  value={form.due}
                  onChange={(e) =>
                    setForm({ ...form, due: e.target.value })
                  }
                />
              </label>
            </div>


<div className="subtask-form-group">
  <div className="subtask-form-heading">
    <label>Task checklist</label>
    <span>{form.subtasks?.length || 0} items</span>
  </div>

  <div className="subtask-input-row">
    <input
      type="text"
      placeholder="Enter a subtask..."
      value={subtaskInput}
      onChange={(e) => setSubtaskInput(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          addSubtask();
        }
      }}
    />
    <button type="button" className="secondary-button" onClick={addSubtask}>
      <Plus size={16} /> Add
    </button>
  </div>

  <div className="subtask-form-list">
    {(form.subtasks || []).map((item, index) => (
      <div className="subtask-form-item" key={index}>
        <label>
          <input
            type="checkbox"
            checked={Boolean(item.completed)}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                subtasks: prev.subtasks.map((subtask, i) =>
                  i === index
                    ? { ...subtask, completed: e.target.checked }
                    : subtask
                ),
              }))
            }
          />
          <span className={item.completed ? "subtask-completed" : ""}>
            {item.title}
          </span>
        </label>

        <button
          type="button"
          className="icon-button"
          onClick={() => removeSubtask(index)}
          aria-label="Remove subtask"
        >
          <X size={15} />
        </button>
      </div>
    ))}
  </div>
</div>


            <div className="progress-form-group">
                <div className="progress-form-heading">
                  <label htmlFor="task-progress">Task completion</label>
                  <strong>{form.progress}%</strong>
                </div>
                <input
                  id="task-progress"
                  className="task-progress-slider"
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={form.progress}
                  onChange={(e) => {
                    const progress = Number(e.target.value);
                    setForm({
                      ...form,
                      progress,
                      status:
                        progress === 0
                          ? "Pending"
                          : progress === 100
                          ? "Completed"
                          : "In Progress",
                    });
                  }}
                />
                <div className="progress-form-labels">
                  <span>0% — Not started</span>
                  <span>100% — Completed</span>
                </div>
              </div>

            <div className="modal-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setModal(false)}
              >
                Cancel
              </button>

              <button className="primary-button" type="submit">
                <Plus size={16} />
                {editing ? "Save changes" : "Create task"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();

  return user ? children : <Navigate to="/login" replace />;
}

function GuestRoute({ children }) {
  const { user } = useAuth();

  return user ? <Navigate to="/" replace /> : children;
}

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />

      <Route
        path="/register"
        element={
          <GuestRoute>
            <Register />
          </GuestRoute>
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;
