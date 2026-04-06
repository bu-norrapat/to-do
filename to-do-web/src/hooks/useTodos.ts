// src/hooks/useTodos.ts
import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import type { Todo, FilterOption, SortByOption, SortOrderOption } from '../types';

export const useTodos = () => {
  // TODO: Step 1 - ประกาศ state ต่างๆ
  // - todos: Todo[]           (default [])
  // - loading: boolean        (default true)
  // - filter: FilterOption    (default 'all')
  // - sortBy: SortByOption    (default 'createdAt')
  // - sortOrder: SortOrderOption (default 'desc')
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterOption>('all');
  const [sortBy, setSortBy] = useState<SortByOption>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrderOption>('desc');

  // TODO: Step 2 - useEffect เพื่อ fetch todos เมื่อ filter/sortBy/sortOrder เปลี่ยน
  // - setLoading(true) ก่อน fetch
  // - เรียก api.todos.get({ query: { filter, sortBy, sortOrder } })
  // - ถ้า data มีค่า ให้ setTodos(data)
  // - setLoading(false) หลัง fetch
  // - dependency array: [filter, sortBy, sortOrder]
  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      try {
        const { data } = await api.todos.get({ query: { filter, sortBy, sortOrder } });
        if (data) {
          setTodos(data);
        }
      } catch (error) {
        console.error('Failed to fetch todos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [filter, sortBy, sortOrder]);

  // TODO: Step 3 - addTodo(title: string)
  // - ใช้ useCallback
  // - เรียก api.todos.post({ title })
  // - ถ้า data มีค่า ให้ prepend ไว้ต้น array: setTodos(prev => [data, ...prev])
  const addTodo = useCallback(async (title: string) => {
    try {
      const { data } = await api.todos.post({ title });
      if (data) {
        setTodos(prev => [data, ...prev]);
      }
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  }, []);

  // TODO: Step 4 - deleteTodo(id: number)
  // - ใช้ useCallback
  // - เรียก api.todos({ id }).delete()
  // - setTodos(prev => prev.filter(todo => todo.id !== id))
  const deleteTodo = useCallback(async (id: number) => {
    try {
      await api.todos({ id }).delete();
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  }, []);

  // TODO: Step 5 - toggleTodo(id: number, completed: boolean)
  // - ใช้ useCallback
  // - เรียก api.todos({ id }).patch({ completed })
  // - ถ้า data มีค่า ให้ map และแทนที่ todo ที่ตรง id ด้วย data ใหม่
  const toggleTodo = useCallback(async (id: number, completed: boolean) => {
    try {
      const { data } = await api.todos({ id }).patch({ completed });
      if (data) {
        setTodos(prev => prev.map(todo => (todo.id === id ? data : todo)));
      }
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  }, []);

  return {
    // TODO: return todos, loading, addTodo, deleteTodo, toggleTodo,
    //        filter, setFilter, sortBy, setSortBy, sortOrder, setSortOrder
    todos,
    loading,
    addTodo,
    deleteTodo,
    toggleTodo,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
  };
};
