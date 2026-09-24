import React, { useState } from 'react';
import { Plus, CheckSquare, Clock, Trash2, LayoutGrid, List } from 'lucide-react';
import { Task, Subtask } from '../../types/lifeos';
import { api } from '../../services/api';

interface TasksViewProps {
  tasks: Task[];
  activeDate: string;
  onRefresh: () => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  activeDate,
  onRefresh,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [category, setCategory] = useState('Programming');
  const [estMinutes, setEstMinutes] = useState(60);
  const [subtasksInput, setSubtasksInput] = useState('');

  const filteredTasks = tasks.filter(t => {
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    return true;
  });

  const handleToggleTaskStatus = async (task: Task) => {
    let nextStatus: Task['status'] = 'todo';
    if (task.status === 'todo') nextStatus = 'in_progress';
    else if (task.status === 'in_progress') nextStatus = 'completed';
    else if (task.status === 'completed') nextStatus = 'todo';

    try {
      await api.updateTask(task.id, { status: nextStatus });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleSubtask = async (task: Task, subId: string) => {
    const nextSubtasks = task.subtasks.map(s => (s.id === subId ? { ...s, completed: !s.completed } : s));
    const allDone = nextSubtasks.length > 0 && nextSubtasks.every(s => s.completed);
    try {
      await api.updateTask(task.id, {
        subtasks: nextSubtasks,
        status: allDone ? 'completed' : task.status,
      });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await api.deleteTask(id);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const subtasksList: Subtask[] = subtasksInput
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)
      .map((text, i) => ({
        id: `sub_${Date.now()}_${i}`,
        title: text,
        completed: false,
      }));

    try {
      await api.addTask({
        title,
        description,
        priority,
        category,
        dueDate: activeDate,
        estimatedDurationMinutes: Number(estMinutes),
        subtasks: subtasksList,
      });

      setTitle('');
      setDescription('');
      setSubtasksInput('');
      setShowAddForm(false);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const todoTasks = filteredTasks.filter(t => t.status === 'todo');
  const inProgressTasks = filteredTasks.filter(t => t.status === 'in_progress');
  const completedTasks = filteredTasks.filter(t => t.status === 'completed');

  const priorityColor = (p: string) => {
    if (p === 'urgent') return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    if (p === 'high') return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    if (p === 'medium') return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30';
    return 'text-neutral-400 bg-neutral-800 border-neutral-700';
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
            <span>Execution Sprints</span>
            <span aria-hidden="true">·</span>
            <span>{tasks.length} total tasks</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-neutral-100 tracking-tight mt-1">
            Tasks & Subtasks
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Break down engineering initiatives into executable subtasks with time estimates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-md ${viewMode === 'kanban' ? 'bg-neutral-800 text-white' : 'text-neutral-400'}`}
              title="Kanban Board"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-neutral-800 text-white' : 'text-neutral-400'}`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <form onSubmit={handleCreateTask} className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-3">
          <div className="text-xs font-semibold text-neutral-200">Create Task with Subtasks</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <input
                type="text"
                required
                placeholder="Task title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-100"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as any)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-2 text-xs text-neutral-200"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
              <input
                type="number"
                value={estMinutes}
                onChange={e => setEstMinutes(Number(e.target.value))}
                placeholder="Est. min"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-2 text-xs font-mono text-neutral-200"
              />
            </div>
          </div>
          <div>
            <textarea
              rows={2}
              placeholder="Description or context..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-100 resize-none"
            />
          </div>
          <div>
            <label className="block text-[11px] text-neutral-400 mb-1">Subtasks (one per line):</label>
            <textarea
              rows={2}
              placeholder="Draft schema&#10;Write unit tests&#10;Deploy endpoint"
              value={subtasksInput}
              onChange={e => setSubtasksInput(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs font-mono text-neutral-200 resize-none"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowAddForm(false)} className="px-3 py-1 text-xs text-neutral-400">
              Cancel
            </button>
            <button type="submit" className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-lg">
              Save Task
            </button>
          </div>
        </form>
      )}

      {/* Priority Filters */}
      <div className="flex items-center gap-1.5">
        {['all', 'urgent', 'high', 'medium', 'low'].map(p => (
          <button
            key={p}
            onClick={() => setFilterPriority(p)}
            className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
              filterPriority === p
                ? 'bg-neutral-800 text-white font-semibold'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column: To Do */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2 text-xs font-semibold text-neutral-400">
              <span>TO DO ({todoTasks.length})</span>
            </div>
            <div className="space-y-3">
              {todoTasks.map(t => (
                <TaskCard
                  key={t.id}
                  task={t}
                  onToggleStatus={() => handleToggleTaskStatus(t)}
                  onToggleSubtask={subId => handleToggleSubtask(t, subId)}
                  onDelete={() => handleDeleteTask(t.id)}
                  priorityColor={priorityColor(t.priority)}
                />
              ))}
            </div>
          </div>

          {/* Column: In Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2 text-xs font-semibold text-amber-400">
              <span>IN PROGRESS ({inProgressTasks.length})</span>
            </div>
            <div className="space-y-3">
              {inProgressTasks.map(t => (
                <TaskCard
                  key={t.id}
                  task={t}
                  onToggleStatus={() => handleToggleTaskStatus(t)}
                  onToggleSubtask={subId => handleToggleSubtask(t, subId)}
                  onDelete={() => handleDeleteTask(t.id)}
                  priorityColor={priorityColor(t.priority)}
                />
              ))}
            </div>
          </div>

          {/* Column: Completed */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2 text-xs font-semibold text-emerald-400">
              <span>COMPLETED ({completedTasks.length})</span>
            </div>
            <div className="space-y-3">
              {completedTasks.map(t => (
                <TaskCard
                  key={t.id}
                  task={t}
                  onToggleStatus={() => handleToggleTaskStatus(t)}
                  onToggleSubtask={subId => handleToggleSubtask(t, subId)}
                  onDelete={() => handleDeleteTask(t.id)}
                  priorityColor={priorityColor(t.priority)}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="space-y-2">
          {filteredTasks.map(t => (
            <div
              key={t.id}
              className="flex items-start justify-between p-3 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-750"
            >
              <div className="flex items-start gap-3 min-w-0">
                <button
                  onClick={() => handleToggleTaskStatus(t)}
                  className={`mt-0.5 w-4 h-4 rounded-xs border flex items-center justify-center transition-colors ${
                    t.status === 'completed'
                      ? 'bg-emerald-500 border-emerald-500 text-neutral-950'
                      : 'border-neutral-600'
                  }`}
                >
                  {t.status === 'completed' && <CheckSquare className="w-3 h-3 stroke-[3]" />}
                </button>
                <div>
                  <div
                    className={`text-xs font-medium ${
                      t.status === 'completed' ? 'text-neutral-500 line-through' : 'text-neutral-100'
                    }`}
                  >
                    {t.title}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-mono mt-0.5">
                    <span className="capitalize">{t.priority}</span>
                    <span aria-hidden="true">·</span>
                    <span>{t.estimatedDurationMinutes}m est</span>
                    <span aria-hidden="true">·</span>
                    <span>Due: {t.dueDate}</span>
                  </div>
                </div>
              </div>

              <button onClick={() => handleDeleteTask(t.id)} className="text-neutral-600 hover:text-rose-400 p-1">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const TaskCard: React.FC<{
  task: Task;
  onToggleStatus: () => void;
  onToggleSubtask: (id: string) => void;
  onDelete: () => void;
  priorityColor: string;
}> = ({ task, onToggleStatus, onToggleSubtask, onDelete, priorityColor }) => {
  const completedSubs = task.subtasks.filter(s => s.completed).length;

  return (
    <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2.5 hover:border-neutral-700 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-xs border font-mono ${priorityColor}`}>
            {task.priority}
          </span>
          <span className="text-[11px] text-neutral-500 font-mono">
            {task.category}
          </span>
        </div>
        <button onClick={onDelete} className="text-neutral-600 hover:text-rose-400 p-0.5">
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      <div
        onClick={onToggleStatus}
        className={`text-xs font-medium cursor-pointer ${
          task.status === 'completed' ? 'text-neutral-500 line-through' : 'text-neutral-100'
        }`}
      >
        {task.title}
      </div>

      {task.description && (
        <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">{task.description}</p>
      )}

      {/* Subtasks checklist */}
      {task.subtasks.length > 0 && (
        <div className="pt-2 border-t border-neutral-850 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono">
            <span>Subtasks</span>
            <span>{completedSubs}/{task.subtasks.length}</span>
          </div>
          <div className="space-y-1">
            {task.subtasks.map(s => (
              <label
                key={s.id}
                className="flex items-center gap-2 text-[11px] text-neutral-300 cursor-pointer hover:text-neutral-100"
              >
                <input
                  type="checkbox"
                  checked={s.completed}
                  onChange={() => onToggleSubtask(s.id)}
                  className="rounded-xs border-neutral-700 bg-neutral-950 accent-indigo-500 w-3 h-3"
                />
                <span className={s.completed ? 'line-through text-neutral-500' : ''}>{s.title}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-[11px] text-neutral-500 font-mono pt-1">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{task.actualDurationMinutes}/{task.estimatedDurationMinutes}m</span>
        </div>
        <span>{task.dueDate}</span>
      </div>
    </div>
  );
};
