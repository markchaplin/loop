import React, { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';

import { Button, Typography } from '@mui/material';
import { Store } from '../store';

type FormValues = {
  email: string;
  password: string;
};

type AuthViewProps = {
  store: Store;
  existingUser: boolean;
  onBack: () => void;
  onLoggedIn: (token: string) => void;
};

const AuthView: React.FC<AuthViewProps> = ({ existingUser, onBack, onLoggedIn, store }) => {
  const { handleSubmit, control, formState } = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSignUp = useCallback(async (values: FormValues) => {
    const responseBody = await store.signup(values.email, values.password);
    onLoggedIn(responseBody.token);
  }, []);

  const onLogin = useCallback(async (values: FormValues) => {
    const responseBody = await store.login(values.email, values.password);
    onLoggedIn(responseBody.token);
  }, []);

  const onSubmit = useCallback(
    (values: FormValues) => (existingUser ? onLogin(values) : onSignUp(values)),
    [existingUser]
  );

  const buttonText = existingUser ? 'Log In' : 'Sign Up';

  return (
    <form className="flex flex-col justify-between items-center h-full w-full" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="email"
        control={control}
        rules={{ required: 'Email is required' }}
        render={({ field }) => (
          <TextField id="outlined-basic" label="Email" variant="outlined" type="email" {...field} />
        )}
      />
      <Typography color="error">{formState.errors.email?.message}</Typography>
      <Controller
        name="password"
        control={control}
        rules={{ required: 'Password is required' }}
        render={({ field }) => (
          <TextField id="outlined-basic" label="Password" variant="outlined" type="password" {...field} />
        )}
      />
      <Typography color="error">{formState.errors.password?.message}</Typography>
      <div className="flex flex-row w-full justify-between">
        <Button onClick={onBack}>Back</Button>
        <Button type="submit">{buttonText}</Button>
      </div>
    </form>
  );
};

export default AuthView;
