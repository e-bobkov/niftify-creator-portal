
export interface BaseComponentProps {
  className?: string;
}

export interface LoadingProps {
  isLoading: boolean;
}

export interface ErrorProps {
  error?: Error | null;
}
