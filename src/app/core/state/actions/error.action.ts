import { createAction, createActionGroup, props } from '@ngrx/store';

export const ErrorActions = createActionGroup({
  source: 'General',
  events: {
    addError: props<{ message: string; errorType: string }>(),
    clearError: props<{ id: string }>(),
  },
});

export const clearAllErrors = createAction('[Error] Clear All Errors');
