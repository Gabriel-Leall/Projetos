export interface SubTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  subTasks: SubTask[];
  dueDate?: string;
  categoryId: string;
  points: number; // Vamos começar com 0 e adicionar depois
}

export interface Folder {
  id: string;
  name: string;
}

export interface GamificationState {
  totalPoints: number;
  level: number;
}

export interface AppState {
  folders: Folder[];
  tasks: Task[];
  gamification: GamificationState;
}