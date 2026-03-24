// src/store/hooks.ts
// Typed wrappers around the standard Redux hooks.
// Using these instead of raw useSelector/useDispatch gives us
// full TypeScript autocomplete on state shape and dispatch calls.
// This is the recommended pattern from the Redux Toolkit docs.

import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Use this instead of plain useDispatch() throughout the app
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Use this instead of plain useSelector() throughout the app
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector(selector);