export interface EventItem {
  id: string;
  title: string;
  date: string;
  location: string;
  price: number;
  category: string;
  imageUrl: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'render' | 'action';
}