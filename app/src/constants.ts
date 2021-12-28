export const TOKEN_HEADER_NAME =
  process.env.NODE_ENV === 'development'
    ? 'auth180'
    : process.env.TOKEN_HEADER_NAME as string;
